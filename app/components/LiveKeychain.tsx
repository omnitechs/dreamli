"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { CSG } from "three-csg-ts";

type Params = {
    linea1: string; linea2?: string;
    fuente: "DynaPuff" | "Noto Sans (World)" | "Bebas Neue" | "Poppins Black";
    tamanio_texto: number; altura_texto: number; espaciado_lineas: number;
    grosor_borde: number; altura_borde: number; mostrar_anilla: boolean;
    diametro_exterior: number; diametro_interior: number;
};

const FONT_MAP: Record<Params["fuente"], string> = {
    "DynaPuff": "/fonts/DynaPuff_Regular.typeface.json",
    "Noto Sans (World)": "/fonts/NotoSans_Regular.typeface.json",
    "Bebas Neue": "/fonts/BebasNeue_Regular.typeface.json",
    "Poppins Black": "/fonts/Poppins_Black.typeface.json",
};

function roundedRectShape(width: number, height: number, radius: number) {
    const r = Math.min(radius, width/2, height/2);
    const s = new THREE.Shape();
    s.moveTo(-width/2 + r, -height/2);
    s.lineTo(width/2 - r, -height/2);
    s.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + r);
    s.lineTo(width/2, height/2 - r);
    s.quadraticCurveTo(width/2, height/2, width/2 - r, height/2);
    s.lineTo(-width/2 + r, height/2);
    s.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - r);
    s.lineTo(-width/2, -height/2 + r);
    s.quadraticCurveTo(-width/2, -height/2, -width/2 + r, -height/2);
    return s;
}

function buildText(font: THREE.Font, p: Params) {
    const mat = new THREE.MeshStandardMaterial({ metalness: 0.1, roughness: 0.6 });
    const opts = { font, size: p.tamanio_texto, height: Math.abs(p.altura_texto), curveSegments: 8, bevelEnabled: false };

    const g1 = new TextGeometry(p.linea1 || "", opts);
    const m1 = new THREE.Mesh(g1, mat);
    m1.position.y = p.linea2 ? p.tamanio_texto * p.espaciado_lineas * 0.5 : 0;

    let m2: THREE.Mesh | null = null;
    if (p.linea2) {
        const g2 = new TextGeometry(p.linea2, opts);
        m2 = new THREE.Mesh(g2, mat);
        m2.position.y = -p.tamanio_texto * p.espaciado_lineas * 0.5;
    }

    // center lines
    [m1, m2].forEach(m => {
        if (!m) return;
        m.geometry.computeBoundingBox();
        const bb = m.geometry.boundingBox!;
        m.position.x -= (bb.max.x + bb.min.x) / 2;
    });

    const group = new THREE.Group();
    group.add(m1);
    if (m2) group.add(m2);

    const bbox = new THREE.Box3().setFromObject(group);
    return { group, width: bbox.max.x - bbox.min.x, height: bbox.max.y - bbox.min.y, m1, m2 };
}

function KeychainModel({ p }: { p: Params }) {
    const [font, setFont] = useState<THREE.Font | null>(null);
    const [obj, setObj] = useState<THREE.Object3D | null>(null);

    useEffect(() => {
        new FontLoader().load(FONT_MAP[p.fuente], f => setFont(f));
    }, [p.fuente]);

    useEffect(() => {
        if (!font) return;

        // text
        const { group: textGroup, width: textW, height: textH, m1, m2 } = buildText(font, p);

        // base
        const pad = p.grosor_borde * 2;
        const baseW = textW + pad * 2;
        const baseH = textH + pad * 1.6;
        const baseShape = roundedRectShape(baseW, baseH, p.grosor_borde);
        const baseGeom = new THREE.ExtrudeGeometry(baseShape, { depth: p.altura_borde, bevelEnabled: false });
        const baseMat = new THREE.MeshStandardMaterial({ metalness: 0.05, roughness: 0.9 });
        const baseMesh = new THREE.Mesh(baseGeom, baseMat);

        // hole + ring
        let baseAfter: THREE.Object3D = baseMesh;
        const holeGeom = new THREE.CylinderGeometry(p.diametro_interior/2, p.diametro_interior/2, p.altura_borde+0.6, 48);
        const holeMesh = new THREE.Mesh(holeGeom, baseMat);
        holeMesh.rotation.x = Math.PI / 2;
        holeMesh.position.set(-baseW/2 + p.diametro_exterior/2 + p.grosor_borde*0.6, p.linea2 ? (p.tamanio_texto*p.espaciado_lineas*0.5) : 0, p.altura_borde/2);

        const carved = CSG.fromMesh(baseMesh).subtract(CSG.fromMesh(holeMesh));
        const carvedMesh = CSG.toMesh(carved, baseMesh.matrix, baseMat);
        carvedMesh.geometry.computeVertexNormals();
        baseAfter = carvedMesh;

        if (p.mostrar_anilla) {
            const ringGeom = new THREE.CylinderGeometry(p.diametro_exterior/2, p.diametro_exterior/2, p.altura_borde, 64);
            const ringMesh = new THREE.Mesh(ringGeom, baseMat);
            ringMesh.rotation.x = Math.PI / 2;
            ringMesh.position.copy(holeMesh.position);
            const g = new THREE.Group(); g.add(carvedMesh); g.add(ringMesh); baseAfter = g;
        }

        // text placement (emboss / engrave)
        const zText = p.altura_texto >= 0 ? p.altura_borde : p.altura_borde - Math.abs(p.altura_texto);
        m1.position.z = zText; if (m2) m2.position.z = zText;

        let out: THREE.Object3D = baseAfter;
        if (p.altura_texto < 0) {
            let c = CSG.fromMesh(baseAfter as unknown as THREE.Mesh).subtract(CSG.fromMesh(m1));
            if (m2) c = c.subtract(CSG.fromMesh(m2));
            const res = CSG.toMesh(c, new THREE.Matrix4(), (baseAfter as any).material || baseMat);
            res.geometry.computeVertexNormals();
            out = res;
        } else {
            const g = new THREE.Group(); g.add(baseAfter); g.add(m1); if (m2) g.add(m2); out = g;
        }

        // fit
        const box = new THREE.Box3().setFromObject(out);
        const size = box.getSize(new THREE.Vector3()).length() || 1;
        out.scale.setScalar(1.6 / size);

        setObj(out);

        return () => {
            out.traverse(o => (o as any).geometry?.dispose?.());
        };
    }, [font, p]);

    return obj ? <primitive object={obj} /> : null;
}

export default function LiveKeychainImpl() {
    const [linea1, setLinea1] = useState("Alberto");
    const [linea2, setLinea2] = useState("Nicás");
    const [fuente, setFuente] = useState<Params["fuente"]>("DynaPuff");
    const [tamanio_texto, setTamanio] = useState(12);
    const [altura_texto, setAltura] = useState(1.5);

    const params: Params = {
        linea1, linea2, fuente, tamanio_texto, altura_texto,
        espaciado_lineas: 1.2, grosor_borde: 3, altura_borde: 3,
        mostrar_anilla: true, diametro_exterior: 11, diametro_interior: 4,
    };

    return (
        <section className="max-w-4xl mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-semibold">Live Keychain Preview</h2>

            <div className="grid sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-sm">First line</span>
                    <input className="border rounded px-3 py-2" value={linea1} onChange={e=>setLinea1(e.target.value)} maxLength={24}/>
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Second line (optional)</span>
                    <input className="border rounded px-3 py-2" value={linea2} onChange={e=>setLinea2(e.target.value)} maxLength={24}/>
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Font</span>
                    <select className="border rounded px-3 py-2" value={fuente} onChange={e=>setFuente(e.target.value as any)}>
                        <option>DynaPuff</option><option>Noto Sans (World)</option>
                        <option>Bebas Neue</option><option>Poppins Black</option>
                    </select>
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Text size</span>
                    <input type="number" className="border rounded px-3 py-2" min={6} max={32} value={tamanio_texto} onChange={e=>setTamanio(Number(e.target.value))}/>
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm">Text height (emboss + / engrave −)</span>
                    <input type="number" className="border rounded px-3 py-2" min={-3} max={5} step={0.1} value={altura_texto} onChange={e=>setAltura(Number(e.target.value))}/>
                </label>
            </div>

            <div className="h-[480px] w-full rounded-xl border">
                <Canvas camera={{ position: [2, 2, 2], fov: 45 }}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 6, 3]} />
                    <Stage intensity={0.9} adjustCamera environment="city">
                        <KeychainModel p={params} />
                    </Stage>
                    <OrbitControls enableZoom enablePan enableRotate />
                </Canvas>
            </div>
        </section>
    );
}
