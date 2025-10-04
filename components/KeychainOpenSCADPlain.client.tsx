'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// @ts-ignore
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

/* ---------- debounce ---------- */
function useDebouncedValue<T>(value: T, delay = 300) {
    const [v, setV] = useState(value);
    useEffect(() => { const id = setTimeout(() => setV(value), delay); return () => clearTimeout(id); }, [value, delay]);
    return v;
}

/* ---------- types ---------- */
type Defines = {
    linea1: string; linea2: string; fuente: string;
    tamanio_texto: number; altura_texto: number; espaciado_lineas: number;
    grosor_borde: number; altura_borde: number; mostrar_anilla: boolean;
    diametro_exterior: number; diametro_interior: number; ajuste_x: number; ajuste_y: number;
    dos_colores: boolean; color_unico: string; color_base: string; color_texto: string;
    mode?: 'base' | 'text' | 'all';
};

/* ---------- colors ---------- */
function colorHex(name: string) {
    const map: Record<string, string> = {
        'Rojo / Red': '#ff0000', 'Rojo Oscuro / Dark Red': '#990000',
        'Verde / Green': '#00ff00', 'Verde Oscuro / Dark Green': '#009900',
        'Azul / Blue': '#0000ff', 'Azul Oscuro / Dark Blue': '#000099',
        'Amarillo / Yellow': '#ffff00', 'Naranja / Orange': '#ff8000',
        'Morado / Purple': '#800080', 'Rosa / Pink': '#ff66b2',
        'Blanco / White': '#ffffff', 'Negro / Black': '#000000',
        'Gris Claro / Light Gray': '#CCCCCC', 'Gris Oscuro / Dark Gray': '#4D4D4D',
        'Turquesa / Turquoise': '#00cccc'
    };
    return map[name] ?? '#999999';
}

/* ---------- env flags ---------- */
const ANDROID  = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
const IOS      = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
const MOBILE   = ANDROID || IOS;

/* ---------- fluid canvas size ---------- */
function calcDims(container: HTMLElement) {
    const width = container.clientWidth || 320;
    // 3:2 aspect gives more vertical room; clamp height for stability.
    const height = Math.max(300, Math.min(520, Math.round(width * 0.66)));
    return { width, height };
}

/* ---------- normalize + center object (no camera work here) ---------- */
function normalizeAndCenterXZ(group: THREE.Object3D) {
    // Normalize footprint to ~1.6 world units (so systems stay stable across devices)
    const box = new THREE.Box3().setFromObject(group);
    const size = box.getSize(new THREE.Vector3());
    const footprint = Math.max(size.x, size.z) || 1e-6;
    const target = 1.6; // world units for max(X,Z)
    const scale = target / footprint;
    group.scale.setScalar(scale);

    // Recenter on X/Z and ground on Y
    const box2 = new THREE.Box3().setFromObject(group);
    const c = box2.getCenter(new THREE.Vector3());
    group.position.x -= c.x;
    group.position.z -= c.z;
    group.position.y -= box2.min.y;
    group.position.y += 0.001;
}

/* ---------- fit for PERSPECTIVE camera ---------- */
function fitPerspective(
    group: THREE.Object3D,
    camera: THREE.PerspectiveCamera,
    container: HTMLElement,
    angled: boolean
) {
    const { width, height } = calcDims(container);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Bounding sphere after normalization
    const b = new THREE.Box3().setFromObject(group);
    const sphere = new THREE.Sphere();
    b.getBoundingSphere(sphere);

    // Use both vertical and horizontal FOV (tangent, not sine)
    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);

    const distV = sphere.radius / Math.tan(vFov / 2);
    const distH = sphere.radius / Math.tan(hFov / 2);
    const dist  = Math.max(distV, distH) * 1.15; // margin

    if (angled) {
        camera.position.set(dist * 0.95, dist * 1.1, dist * 0.95);
    } else {
        camera.position.set(0, dist * 1.2, 0.0001); // top-down
    }

    camera.near = Math.max(0.01, dist * 0.01);
    camera.far  = dist * 10;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
}

/* ---------- fit for ORTHOGRAPHIC camera (perfect top view) ---------- */
function fitOrthographic(
    group: THREE.Object3D,
    camera: THREE.OrthographicCamera,
    container: HTMLElement
) {
    const { width, height } = calcDims(container);
    const aspect = width / height;

    // Set ortho frustum to unit box, then use zoom to fit
    camera.left = -aspect;
    camera.right = aspect;
    camera.top = 1;
    camera.bottom = -1;
    camera.near = 0.01;
    camera.far = 1000;
    camera.updateProjectionMatrix();

    // Measure footprint after normalization
    const box = new THREE.Box3().setFromObject(group);
    const w = Math.max(1e-6, box.max.x - box.min.x);
    const d = Math.max(1e-6, box.max.z - box.min.z);

    const viewW = (camera.right - camera.left); // = 2*aspect
    const viewH = (camera.top - camera.bottom); // = 2

    // choose zoom so both dimensions fit (with margin)
    const margin = 1.15;
    const zoomX = viewW / (w * margin);
    const zoomZ = viewH / (d * margin);
    camera.zoom = Math.min(zoomX, zoomZ);
    camera.updateProjectionMatrix();

    // Put camera above and look down
    const hObj = Math.max(0.2, box.max.y - box.min.y);
    camera.position.set(0, Math.max(2.5, hObj * 5), 0.001);
    camera.up.set(0, 0, -1); // keep +Z up visually (optional)
    camera.lookAt(0, 0, 0);
}

/* ================================================================ */

export default function KeychainOpenSCADPlain() {
    /* -------- fonts -------- */
    const [fontList, setFontList] = useState<string[]>([]);
    const [fuente, setFuente] = useState<string>('DejaVu Sans:style=Regular');

    useEffect(() => {
        (async () => {
            try {
                const mod: any = await import(/* webpackIgnore: true */ '/openscad/openscad.fonts.js');
                const arr: string[] = Array.isArray(mod?.AVAILABLE_FONTS) ? mod.AVAILABLE_FONTS : [];
                const sane = arr.length
                    ? arr
                    : ['DejaVu Sans:style=Regular','DejaVu Sans:style=Book','Noto Sans:style=Regular','Archivo Black','Bebas Neue','Pacifico:style=Regular','HarmonyOs:style=Black'];
                setFontList(sane);
                if (!sane.includes(fuente)) setFuente(sane[0]);
            } catch {
                const fallback = ['DejaVu Sans:style=Regular','DejaVu Sans:style=Book','Noto Sans:style=Regular','Archivo Black','Bebas Neue','Pacifico:style=Regular'];
                setFontList(fallback);
                if (!fallback.includes(fuente)) setFuente(fallback[0]);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* -------- UI state -------- */
    const [linea1, setLinea1] = useState('Sina');
    const [linea2, setLinea2] = useState('Esfahani');
    const [tamanio, setTamanio] = useState(12);
    const [altura, setAltura] = useState(1.5);
    const [alturaBorde, setAlturaBorde] = useState(3);
    const [grosorBorde, setGrosorBorde] = useState(3);
    const [espaciado, setEspaciado] = useState(1.2);
    const [mostrarAnilla, setMostrarAnilla] = useState(true);
    const [dosColores, setDosColores] = useState(true);
    const [colorBaseName, setColorBaseName] = useState('Morado / Purple');
    const [colorTextoName, setColorTextoName] = useState('Verde / Green');
    const [colorUnicoName, setColorUnicoName] = useState('Gris Oscuro / Dark Gray');
    const [ajusteX, setAjusteX] = useState(0);
    const [ajusteY, setAjusteY] = useState(0);
    const [dExt, setDExt] = useState(15);
    const [dInt, setDInt] = useState(4);

    // Interaction toggle
    const [freeView, setFreeView] = useState(false); // desktop rotates; mobile stays solid by default

    /* -------- debounced defines -------- */
    const dLinea1 = useDebouncedValue(linea1, MOBILE ? 450 : 300);
    const dLinea2 = useDebouncedValue(linea2, MOBILE ? 450 : 300);
    const dTamanio = useDebouncedValue(tamanio, MOBILE ? 200 : 120);
    const dAltura  = useDebouncedValue(altura,  MOBILE ? 200 : 120);
    const dAlturaBorde = useDebouncedValue(alturaBorde, 120);
    const dGrosorBorde = useDebouncedValue(grosorBorde, 120);
    const dEspaciado   = useDebouncedValue(espaciado, 120);
    const dAjusteX = useDebouncedValue(ajusteX, 120);
    const dAjusteY = useDebouncedValue(ajusteY, 120);
    const dDExt    = useDebouncedValue(dExt, 120);
    const dDInt    = useDebouncedValue(dInt, 120);

    const defines: Defines = useMemo(() => ({
        linea1: dLinea1,
        linea2: dLinea2,
        fuente,
        tamanio_texto: dTamanio,
        altura_texto: dAltura,
        espaciado_lineas: dEspaciado,
        grosor_borde: dGrosorBorde,
        altura_borde: dAlturaBorde,
        mostrar_anilla: mostrarAnilla,
        diametro_exterior: dDExt,
        diametro_interior: dDInt,
        ajuste_x: dAjusteX,
        ajuste_y: dAjusteY,
        dos_colores: dosColores,
        color_unico: colorUnicoName,
        color_base: colorBaseName,
        color_texto: colorTextoName,
    }), [
        dLinea1, dLinea2, fuente, dTamanio, dAltura,
        dEspaciado, dGrosorBorde, dAlturaBorde,
        dDExt, dDInt, dAjusteX, dAjusteY, mostrarAnilla,
        dosColores, colorUnicoName, colorBaseName, colorTextoName
    ]);

    /* -------- three.js setup -------- */
    const mountRef = useRef<HTMLDivElement | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);

    // Two cameras + active reference
    const perspCamRef = useRef<THREE.PerspectiveCamera | null>(null);
    const orthoCamRef = useRef<THREE.OrthographicCamera | null>(null);
    const cameraRef   = useRef<THREE.Camera | null>(null);

    const controlsRef = useRef<OrbitControls | null>(null);
    const groupRef = useRef<THREE.Object3D | null>(null);

    const renderOnce = () => {
        const r = rendererRef.current, s = sceneRef.current, c = cameraRef.current;
        if (r && s && c) r.render(s, c);
    };

    // helper to switch active camera & controls
    function useCamera(kind: 'ortho' | 'persp') {
        cameraRef.current = (kind === 'ortho') ? orthoCamRef.current! : perspCamRef.current!;
        // Rebind controls to whatever camera is active
        if (controlsRef.current) {
            controlsRef.current.object = cameraRef.current as any;
            controlsRef.current.enabled = (kind === 'persp') && !MOBILE && freeView;
            controlsRef.current.enableRotate = (kind === 'persp') && !MOBILE && freeView;
            controlsRef.current.enableZoom   = (kind === 'persp') && !MOBILE && freeView;
            controlsRef.current.enablePan    = false;
            controlsRef.current.enableDamping= (kind === 'persp') && !MOBILE && freeView;
            controlsRef.current.update();
        }
    }

    useEffect(() => {
        if (!mountRef.current) return;
        const container = mountRef.current;
        const { width, height } = calcDims(container);

        const renderer = new THREE.WebGLRenderer({ antialias: !ANDROID, alpha: true });
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(MOBILE ? 1 : Math.min(window.devicePixelRatio, 2));
        (renderer.domElement as any).tabIndex = -1;
        renderer.domElement.style.webkitTapHighlightColor = 'transparent';
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const scene = new THREE.Scene();
        scene.background = null;
        sceneRef.current = scene;

        // Cameras
        const persp = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        perspCamRef.current = persp;

        const aspect = width / height;
        const ortho = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.01, 1000);
        orthoCamRef.current = ortho;

        // Controls (will be enabled only for perspective + desktop + freeView)
        const controls = new OrbitControls(persp, renderer.domElement);
        controls.enableRotate = false;
        controls.enableZoom = false;
        controls.enablePan = false;
        controlsRef.current = controls;

        // Lights + helper
        scene.add(new THREE.AmbientLight(0xffffff, 0.9));
        const dir = new THREE.DirectionalLight(0xffffff, 0.9);
        dir.position.set(5, 6, 3);
        scene.add(dir);

        const grid = new THREE.GridHelper(3, 6);
        (grid as any).position.y = 0;
        scene.add(grid);

        // Default to ORTHO on mobile, PERSPECTIVE on desktop (until Free Rotate toggled)
        useCamera(MOBILE ? 'ortho' : (freeView ? 'persp' : 'ortho'));

        // ResizeObserver
        const ro = new ResizeObserver(() => {
            const dims = calcDims(container);
            renderer.setSize(dims.width, dims.height, false);

            // update camera frustum/aspect
            if (orthoCamRef.current) {
                orthoCamRef.current.left = -dims.width / dims.height;
                orthoCamRef.current.right =  dims.width / dims.height;
                orthoCamRef.current.top = 1;
                orthoCamRef.current.bottom = -1;
                orthoCamRef.current.updateProjectionMatrix();
            }
            if (perspCamRef.current) {
                perspCamRef.current.aspect = dims.width / dims.height;
                perspCamRef.current.updateProjectionMatrix();
            }

            // re-fit current camera to model
            if (groupRef.current) {
                if (cameraRef.current === orthoCamRef.current) {
                    fitOrthographic(groupRef.current, orthoCamRef.current!, container);
                } else if (cameraRef.current === perspCamRef.current) {
                    fitPerspective(groupRef.current, perspCamRef.current!, container, true);
                }
            }
            if (MOBILE) renderOnce();
        });
        ro.observe(container);

        let raf = 0;
        const tick = () => {
            controls.update();
            renderer.render(scene, cameraRef.current || persp);
            raf = requestAnimationFrame(tick);
        };
        if (!MOBILE) tick(); else renderOnce();

        return () => {
            if (!MOBILE) cancelAnimationFrame(raf);
            ro.disconnect();
            controls.dispose();
            renderer.dispose();
            container.removeChild(renderer.domElement);
            scene.clear();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* -------- OpenSCAD worker compile -------- */
    function compilePart(mode: 'base' | 'text'): Promise<ArrayBuffer> {
        return new Promise((resolve) => {
            const w = new Worker(new URL('./openscad.worker.ts', import.meta.url), { type: 'module' });
            w.onmessage = (e: MessageEvent<any>) => {
                if (!e.data?.ok) {
                    console.error('OpenSCAD error:', e.data?.error, e.data?.logs);
                    w.terminate(); resolve(new ArrayBuffer(0)); return;
                }
                const buf: ArrayBuffer = e.data.stl instanceof ArrayBuffer ? e.data.stl : (e.data.stl as Uint8Array).buffer;
                w.terminate(); resolve(buf);
            };
            w.postMessage({ scadPath: '/test.scad', outName: `${mode}.stl`, defines: { ...defines, mode } });
        });
    }

    /* -------- build & display -------- */
    useEffect(() => {
        if (!sceneRef.current || !mountRef.current || !perspCamRef.current || !orthoCamRef.current) return;
        let cancelled = false;
        const scene = sceneRef.current;
        const container = mountRef.current;

        (async () => {
            const [baseBuf, textBuf] = MOBILE
                ? [await compilePart('base'), await compilePart('text')]
                : await Promise.all([compilePart('base'), compilePart('text')]);
            if (cancelled) return;

            // remove previous
            if (groupRef.current) {
                scene.remove(groupRef.current);
                groupRef.current.traverse?.((o: any) => { o.geometry?.dispose?.(); o.material?.dispose?.(); });
                groupRef.current = null;
            }

            const loader = new STLLoader();
            const baseGeom = baseBuf.byteLength ? loader.parse(baseBuf) : null;
            const textGeom = textBuf.byteLength ? loader.parse(textBuf) : null;
            if (!baseGeom && !textGeom) return;

            const prep = (g: THREE.BufferGeometry | null) => { if (!g) return; g.rotateX(-Math.PI / 2); g.computeVertexNormals(); };
            prep(baseGeom); prep(textGeom);

            const baseMat = new THREE.MeshStandardMaterial({
                color: dosColores ? colorHex(colorBaseName) : colorHex(colorUnicoName),
                metalness: MOBILE ? 0.0 : 0.1, roughness: 0.8
            });
            const textMat = new THREE.MeshStandardMaterial({
                color: dosColores ? colorHex(colorTextoName) : colorHex(colorUnicoName),
                metalness: MOBILE ? 0.0 : 0.1, roughness: 0.8,
                depthWrite: false, depthTest: true,
                polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
            });

            const group = new THREE.Group();
            if (baseGeom) group.add(new THREE.Mesh(baseGeom, baseMat));
            if (textGeom) { const m = new THREE.Mesh(textGeom, textMat); m.renderOrder = 1; m.position.z += 0.02; group.add(m); }

            // normalize & center
            normalizeAndCenterXZ(group);

            scene.add(group);
            groupRef.current = group;

            // choose camera (mobile locked top = ORTHO; desktop: ORTHO unless freeView)
            const wantPersp = !MOBILE && freeView;
            useCamera(wantPersp ? 'persp' : 'ortho');

            if (wantPersp) {
                fitPerspective(group, perspCamRef.current!, container, true);
            } else {
                fitOrthographic(group, orthoCamRef.current!, container);
            }

            if (MOBILE) renderOnce();
        })();

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defines, dosColores, colorBaseName, colorTextoName, colorUnicoName, freeView]);

    /* -------- UI -------- */
    return (
        <section className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Keychain Builder</h2>
                <button
                    onClick={() => {
                        setFreeView(v => !v);
                        // switch camera immediately so user sees the change without recompile
                        const wantPersp = !MOBILE && !freeView;
                        useCamera(wantPersp ? 'persp' : 'ortho');
                        if (groupRef.current && mountRef.current) {
                            if (wantPersp) fitPerspective(groupRef.current, perspCamRef.current!, mountRef.current, true);
                            else           fitOrthographic(groupRef.current, orthoCamRef.current!, mountRef.current);
                            if (MOBILE) renderOnce();
                        }
                    }}
                    className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
                    title={freeView ? 'Lock top view' : 'Enable rotate/zoom'}
                >
                    {freeView ? 'Lock Top View' : 'Free Rotate'}
                </button>
            </div>

            {/* Font */}
            <div className="grid sm:grid-cols-3 gap-4 items-end">
                <label className="flex flex-col gap-1 sm:col-span-3">
                    <span className="text-sm">Font</span>
                    <select className="border rounded px-3 py-2" value={fuente} onChange={(e)=>setFuente(e.target.value)} disabled={!fontList.length}>
                        {fontList.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </label>
            </div>

            {/* Text */}
            <div className="grid sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-sm">First line</span>
                    <input className="border rounded px-3 py-2" value={linea1} onChange={(e)=>setLinea1(e.target.value)} maxLength={24}/>
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Second line (optional)</span>
                    <input className="border rounded px-3 py-2" value={linea2} onChange={(e)=>setLinea2(e.target.value)} maxLength={24}/>
                </label>
            </div>

            {/* Sizes */}
            <div className="grid sm:grid-cols-3 gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Text size</span>
                    <input type="number" className="border rounded px-3 py-2" min={6} max={32} value={tamanio} onChange={(e)=>setTamanio(Number(e.target.value)||12)}/>
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Text height (emboss + / engrave −)</span>
                    <input type="number" className="border rounded px-3 py-2" min={-3} max={5} step={0.1} value={altura} onChange={(e)=>setAltura(Number(e.target.value)||0)}/>
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Base thickness</span>
                    <input type="number" className="border rounded px-3 py-2" min={1} max={8} step={0.1} value={alturaBorde} onChange={(e)=>setAlturaBorde(Number(e.target.value)||3)}/>
                </label>
            </div>

            {/* Spacing / toggles */}
            <div className="grid sm:grid-cols-3 gap-4 items-end">
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Line spacing (× text size)</span>
                    <input type="number" className="border rounded px-3 py-2" min={0.8} max={2.0} step={0.05} value={espaciado} onChange={(e)=>setEspaciado(Number(e.target.value)||1.2)}/>
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Outline thickness</span>
                    <input type="number" className="border rounded px-3 py-2" min={1} max={8} step={0.1} value={grosorBorde} onChange={(e)=>setGrosorBorde(Number(e.target.value)||3)}/>
                </label>
                <div className="flex gap-6 items-center">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={mostrarAnilla} onChange={(e)=>setMostrarAnilla(e.target.checked)} />
                        <span className="text-sm">Show ring</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={dosColores} onChange={(e)=>setDosColores(e.target.checked)} />
                        <span className="text-sm">Two colors</span>
                    </label>
                </div>
            </div>

            {/* Colors */}
            <div className="grid sm:grid-cols-3 gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-sm">{dosColores ? 'Base color' : 'Single color'}</span>
                    <select className="border rounded px-3 py-2" value={dosColores ? colorBaseName : colorUnicoName}
                            onChange={(e)=> dosColores ? setColorBaseName(e.target.value) : setColorUnicoName(e.target.value)}>
                        {['Negro / Black','Gris Oscuro / Dark Gray','Gris Claro / Light Gray','Blanco / White','Rojo / Red','Naranja / Orange','Amarillo / Yellow','Verde / Green','Azul / Blue','Morado / Purple','Rosa / Pink','Turquesa / Turquoise'].map(c=>(<option key={c}>{c}</option>))}
                    </select>
                </label>
                {dosColores && (
                    <label className="flex flex-col gap-1">
                        <span className="text-sm">Text color</span>
                        <select className="border rounded px-3 py-2" value={colorTextoName} onChange={(e)=>setColorTextoName(e.target.value)}>
                            {['Verde / Green','Negro / Black','Blanco / White','Rojo / Red','Naranja / Orange','Amarillo / Yellow','Azul / Blue','Morado / Purple','Rosa / Pink','Turquesa / Turquoise','Gris Oscuro / Dark Gray','Gris Claro / Light Gray'].map(c=>(<option key={c}>{c}</option>))}
                        </select>
                    </label>
                )}
            </div>

            {/* Ring controls */}
            <div className="grid sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Ring X offset (mm)</span>
                    <input type="range" min={-20} max={40} step={0.5} value={ajusteX} onChange={e=>setAjusteX(parseFloat(e.target.value))}/>
                    <input type="number" className="border rounded px-3 py-2 mt-1" value={ajusteX} step={0.5} onChange={e=>setAjusteX(parseFloat(e.target.value)||0)} />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Ring Y offset (mm)</span>
                    <input type="range" min={-20} max={20} step={0.5} value={ajusteY} onChange={e=>setAjusteY(parseFloat(e.target.value))}/>
                    <input type="number" className="border rounded px-3 py-2 mt-1" value={ajusteY} step={0.5} onChange={e=>setAjusteY(parseFloat(e.target.value)||0)} />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Ring outer diameter (mm)</span>
                    <input type="range" min={6} max={24} step={0.5} value={dExt} onChange={e=>setDExt(parseFloat(e.target.value))}/>
                    <input type="number" className="border rounded px-3 py-2 mt-1" value={dExt} step={0.5} onChange={e=>setDExt(parseFloat(e.target.value)||15)} />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Ring inner diameter (mm)</span>
                    <input type="range" min={2} max={12} step={0.5} value={dInt} onChange={e=>setDInt(parseFloat(e.target.value))}/>
                    <input type="number" className="border rounded px-3 py-2 mt-1" value={dInt} step={0.5} onChange={e=>setDInt(parseFloat(e.target.value)||4)} />
                </label>
            </div>

            {/* Canvas mount — solid on phones by default; opt-in via Free Rotate */}
            <div
                ref={mountRef}
                className={`w-full rounded-xl border relative overflow-hidden
          ${freeView ? 'pointer-events-auto' : 'pointer-events-none sm:pointer-events-auto'}
           sm:min-h-[320px] md:min-h-[480px] lg:min-h-[520px]`}
                style={{
                    contentVisibility: 'auto' as any,
                    containIntrinsicSize: '600px 320px' as any,
                    contain: 'layout paint size',
                    touchAction: 'pan-y',

                }}
            />
        </section>
    );
}
