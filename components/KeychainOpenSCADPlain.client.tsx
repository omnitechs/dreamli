"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// @ts-ignore
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

function useDebounced<T>(value: T, delay = 250) {
    const [v, setV] = useState(value);
    useEffect(() => { const id = setTimeout(() => setV(value), delay); return () => clearTimeout(id); }, [value, delay]);
    return v;
}

type Defines = {
    linea1: string; linea2: string; fuente: string;
    tamanio_texto: number; altura_texto: number; espaciado_lineas: number;
    grosor_borde: number; altura_borde: number; mostrar_anilla: boolean;
    diametro_exterior: number; diametro_interior: number; ajuste_x: number; ajuste_y: number;
    dos_colores: boolean; color_unico: string; color_base: string; color_texto: string;
};

function colorHex(name: string) {
    // match your SCAD palette names → hex for viewer
    const map: Record<string, string> = {
        "Rojo / Red": "#ff0000",
        "Rojo Oscuro / Dark Red": "#990000",
        "Verde / Green": "#00ff00",
        "Verde Oscuro / Dark Green": "#009900",
        "Azul / Blue": "#0000ff",
        "Azul Oscuro / Dark Blue": "#000099",
        "Amarillo / Yellow": "#ffff00",
        "Naranja / Orange": "#ff8000",
        "Morado / Purple": "#800080",
        "Rosa / Pink": "#ff66b2",
        "Blanco / White": "#ffffff",
        "Negro / Black": "#000000",
        "Gris Claro / Light Gray": "#CCCCCC",
        "Gris Oscuro / Dark Gray": "#4D4D4D",
        "Turquesa / Turquoise": "#00cccc"
    };
    return map[name] ?? "#999999";
}

export default function KeychainOpenSCADPlain() {
    // UI
    const [linea1, setLinea1] = useState("Alberto");
    const [linea2, setLinea2] = useState("Nic");
    const [fuente, setFuente] = useState("DejaVu Sans:style=Book"); // must be registered in WASM
    const [tamanio, setTamanio] = useState(12);
    const [altura, setAltura] = useState(1.5);

    // optional viewer colors (use your SCAD color choices)
    const [dosColores, setDosColores] = useState(true);
    const [colorBaseName, setColorBaseName] = useState("Negro / Black");
    const [colorTextoName, setColorTextoName] = useState("Verde / Green");
    const [colorUnicoName, setColorUnicoName] = useState("Gris Oscuro / Dark Gray");

    const defines: Defines = useMemo(() => ({
        linea1, linea2, fuente,
        tamanio_texto: tamanio,
        altura_texto: altura,
        espaciado_lineas: 1.2,
        grosor_borde: 3,
        altura_borde: 3,
        mostrar_anilla: true,
        diametro_exterior: 11,
        diametro_interior: 4,
        ajuste_x: 0,
        ajuste_y: 0,
        dos_colores: dosColores,
        color_unico: colorUnicoName,
        color_base: colorBaseName,
        color_texto: colorTextoName,
    }), [linea1, linea2, fuente, tamanio, altura, dosColores, colorBaseName, colorTextoName, colorUnicoName]);

    const deb = useDebounced(defines, 250);

    // 3D refs
    const mountRef = useRef<HTMLDivElement | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const groupRef = useRef<THREE.Object3D | null>(null);

    // Init Three once
    useEffect(() => {
        if (!mountRef.current) return;

        const width = mountRef.current.clientWidth;
        const height = 480;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const scene = new THREE.Scene();
        scene.background = null;
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(2, 2, 2);
        cameraRef.current = camera;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controlsRef.current = controls;

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const dir = new THREE.DirectionalLight(0xffffff, 0.9);
        dir.position.set(5, 6, 3);
        scene.add(dir);

        // Helpers
        const axes = new THREE.AxesHelper(0.5);
        const grid = new THREE.GridHelper(4, 8);
        (grid as any).position.y = -0.001;
        scene.add(axes, grid);

        let raf = 0;
        const tick = () => { controls.update(); renderer.render(scene, camera); raf = requestAnimationFrame(tick); };
        tick();

        const onResize = () => {
            if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
            const w = mountRef.current.clientWidth; const h = 480;
            cameraRef.current.aspect = w / h; cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
            controls.dispose();
            renderer.dispose();
            mountRef.current?.removeChild(renderer.domElement);
            scene.clear();
        };
    }, []);

    // Compile on change (two-pass: base + text) and color in viewer
    useEffect(() => {
        if (!sceneRef.current) return;

        function compilePart(mode: "base" | "text"): Promise<ArrayBuffer> {
            return new Promise((resolve) => {
                const w = new Worker(new URL("./openscad.worker.ts", import.meta.url), { type: "module" });

                w.onmessage = (e: MessageEvent<any>) => {
                    if (!e.data?.ok) {
                        console.error("OpenSCAD error:", e.data?.error, e.data?.logs);
                        w.terminate(); resolve(new ArrayBuffer(0)); return;
                    }
                    const buf: ArrayBuffer =
                        e.data.stl instanceof ArrayBuffer ? e.data.stl : (e.data.stl as Uint8Array).buffer;
                    w.terminate(); resolve(buf);
                };

                w.postMessage({
                    scadPath: "/first.scad",      // ensure /public/first.scad exists (with `mode` switch)
                    outName: `${mode}.stl`,       // STL → color in viewer
                    defines: { ...deb, mode },    // tell SCAD which solid to emit
                });
            });
        }

        let cancelled = false;

        (async () => {
            const [baseBuf, textBuf] = await Promise.all([compilePart("base"), compilePart("text")]);
            if (cancelled) return;

            // remove previous model
            if (groupRef.current) {
                sceneRef.current!.remove(groupRef.current);
                groupRef.current.traverse?.((obj: any) => {
                    obj.geometry?.dispose?.();
                    obj.material?.dispose?.();
                });
                groupRef.current = null;
            }

            const loader = new STLLoader();
            const baseGeom = baseBuf.byteLength ? loader.parse(baseBuf) : null;
            const textGeom = textBuf.byteLength ? loader.parse(textBuf) : null;
            if (!baseGeom && !textGeom) { console.warn("Both STL parts are empty."); return; }

            const prep = (g: THREE.BufferGeometry | null) => {
                if (!g) return; g.rotateX(-Math.PI / 2); g.computeVertexNormals(); g.center();
            };
            prep(baseGeom); prep(textGeom);

            // choose viewer colors from UI/SCAD selections
            const baseColor = dosColores ? colorHex(colorBaseName) : colorHex(colorUnicoName);
            const textColor = dosColores ? colorHex(colorTextoName) : colorHex(colorUnicoName);

            const baseMesh = baseGeom
                ? new THREE.Mesh(baseGeom, new THREE.MeshStandardMaterial({ color: baseColor, metalness: 0.1, roughness: 0.6 }))
                : null;

            const textMesh = textGeom
                ? new THREE.Mesh(textGeom, new THREE.MeshStandardMaterial({ color: textColor, metalness: 0.1, roughness: 0.6 }))
                : null;

            const group = new THREE.Group();
            if (baseMesh) group.add(baseMesh);
            if (textMesh) group.add(textMesh);

            // frame & scale
            const refGeom = baseGeom || textGeom!;
            refGeom.computeBoundingSphere();
            const r = Math.max(refGeom.boundingSphere?.radius || 1, 1e-6);
            const target = 0.8; const s = target / r;
            group.scale.setScalar(s);

            sceneRef.current!.add(group);
            groupRef.current = group;

            // center / camera
            if (cameraRef.current && controlsRef.current && rendererRef.current) {
                const camera = cameraRef.current; const controls = controlsRef.current;
                const center = refGeom.boundingSphere!.center.clone().multiplyScalar(s);
                controls.target.copy(center);
                const fov = (camera.fov * Math.PI) / 180;
                const dist = target / Math.sin(fov / 2);
                const dir = new THREE.Vector3(1, 1, 1).normalize();
                camera.position.copy(center).addScaledVector(dir, dist * 1.2);
                camera.near = Math.max(0.01, dist * 0.01);
                camera.far  = dist * 10;
                camera.updateProjectionMatrix();
                controls.update();
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        })();

        return () => { cancelled = true; };
    }, [deb, dosColores, colorBaseName, colorTextoName, colorUnicoName]);

    return (
        <section className="max-w-4xl mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-semibold">Live Keychain (OpenSCAD WASM, Two-Color STL)</h2>

            <div className="grid sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-sm">First line</span>
                    <input className="border rounded px-3 py-2" value={linea1} onChange={(e)=>setLinea1(e.target.value)} maxLength={24}/>
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Second line (optional)</span>
                    <input className="border rounded px-3 py-2" value={linea2} onChange={(e)=>setLinea2(e.target.value)} maxLength={24}/>
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Font (registered)</span>
                    <select className="border rounded px-3 py-2" value={fuente} onChange={(e)=>setFuente(e.target.value)}>
                        <option>DejaVu Sans:style=Book</option>
                        <option>DejaVu Sans:style=Regular</option>
                    </select>
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Text size</span>
                    <input type="number" className="border rounded px-3 py-2" min={6} max={32} value={tamanio} onChange={(e)=>setTamanio(Number(e.target.value))}/>
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Text height (emboss + / engrave −)</span>
                    <input type="number" className="border rounded px-3 py-2" min={-3} max={5} step={0.1} value={altura} onChange={(e)=>setAltura(Number(e.target.value))}/>
                </label>

                <div className="col-span-full grid sm:grid-cols-3 gap-4 items-end">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={dosColores} onChange={(e)=>setDosColores(e.target.checked)} />
                        <span className="text-sm">Two colors</span>
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm">{dosColores ? "Base color" : "Single color"}</span>
                        <select className="border rounded px-3 py-2" value={dosColores ? colorBaseName : colorUnicoName}
                                onChange={(e)=> dosColores ? setColorBaseName(e.target.value) : setColorUnicoName(e.target.value)}>
                            {["Negro / Black","Gris Oscuro / Dark Gray","Gris Claro / Light Gray","Blanco / White","Rojo / Red","Naranja / Orange","Amarillo / Yellow","Verde / Green","Azul / Blue","Morado / Purple","Rosa / Pink","Turquesa / Turquoise"].map(c=>(
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </label>

                    {dosColores && (
                        <label className="flex flex-col gap-1">
                            <span className="text-sm">Text color</span>
                            <select className="border rounded px-3 py-2" value={colorTextoName} onChange={(e)=>setColorTextoName(e.target.value)}>
                                {["Verde / Green","Negro / Black","Blanco / White","Rojo / Red","Naranja / Orange","Amarillo / Yellow","Azul / Blue","Morado / Purple","Rosa / Pink","Turquesa / Turquoise","Gris Oscuro / Dark Gray","Gris Claro / Light Gray"].map(c=>(
                                    <option key={c}>{c}</option>
                                ))}
                            </select>
                        </label>
                    )}
                </div>
            </div>

            <div ref={mountRef} className="h-[480px] w-full rounded-xl border relative overflow-hidden" />
        </section>
    );
}
