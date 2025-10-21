import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { FileLoader } from 'three';

// Node adaptation for file reading (since GLTFLoader uses fetch)
class NodeGLTFLoader extends GLTFLoader {
    async loadAsync(url: string) {
        const fileLoader = new FileLoader();
        const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
            fileLoader.setResponseType('arraybuffer');
            fileLoader.load(
                url,
                (data) => resolve(data as ArrayBuffer),
                undefined,
                (err) => reject(err)
            );
        });
        return super.parseAsync(arrayBuffer, '');
    }
}

// ---------- MAIN FUNCTION ----------
async function analyzeGLB(filePath: string) {
    const loader = new NodeGLTFLoader();

    console.log(`\nAnalyzing ${filePath} ...`);

    const gltf = await loader.loadAsync(filePath);
    const scene = gltf.scene || gltf.scenes[0];
    scene.updateMatrixWorld(true);

    // Collect geometries
    const geometries: THREE.BufferGeometry[] = [];
    scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh;
            const geom = mesh.geometry.clone();
            geom.applyMatrix4(mesh.matrixWorld);
            geometries.push(geom);
        }
    });

    if (geometries.length === 0) {
        console.error('❌ No meshes found in model.');
        return;
    }

    // Merge all into one geometry
    const merged = BufferGeometryUtils.mergeGeometries(geometries, false);
    if (!merged) throw new Error('Geometry merge failed');

    // ---------- Bounding Box ----------
    const pos = merged.getAttribute('position');
    const positions = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
        positions[i * 3] = pos.getX(i);
        positions[i * 3 + 1] = pos.getY(i);
        positions[i * 3 + 2] = pos.getZ(i);
    }
    const box = new THREE.Box3().setFromArray(positions);
    const size = box.getSize(new THREE.Vector3());
    console.log('📦 Bounding box (mm):', size.toArray().map((v) => v.toFixed(2)));

    // ---------- Volume ----------
    const volume = computeVolume(merged);
    console.log(`📐 Volume: ${volume.toFixed(2)} mm³`);

    // ---------- Surface Area ----------
    const area = computeSurfaceArea(merged);
    console.log(`🧩 Surface area: ${area.toFixed(2)} mm²`);

    // ---------- Material Estimation ----------
    const densityPLA = 1.24e-3; // g/mm³ (PLA)
    const infill = 0.2; // 20%
    const weight = volume * infill * densityPLA;
    console.log(`⚖️  Estimated filament weight: ${weight.toFixed(2)} g`);

    const filamentDiameter = 1.75; // mm
    const crossSection = Math.PI * Math.pow(filamentDiameter / 2, 2);
    const filamentLength = (volume * infill) / crossSection / 1000;
    console.log(`🧵 Estimated filament length: ${filamentLength.toFixed(2)} m\n`);
}

// ---------- HELPERS ----------
function computeVolume(geometry: THREE.BufferGeometry): number {
    const pos = geometry.getAttribute('position');
    let volume = 0;
    const p1 = new THREE.Vector3(),
        p2 = new THREE.Vector3(),
        p3 = new THREE.Vector3();

    for (let i = 0; i < pos.count; i += 3) {
        p1.fromBufferAttribute(pos, i);
        p2.fromBufferAttribute(pos, i + 1);
        p3.fromBufferAttribute(pos, i + 2);
        volume += signedVolumeOfTriangle(p1, p2, p3);
    }

    return Math.abs(volume);
}

function signedVolumeOfTriangle(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): number {
    return p1.dot(p2.cross(p3)) / 6.0;
}

function computeSurfaceArea(geometry: THREE.BufferGeometry): number {
    const pos = geometry.getAttribute('position');
    let area = 0;
    const p1 = new THREE.Vector3(),
        p2 = new THREE.Vector3(),
        p3 = new THREE.Vector3();

    for (let i = 0; i < pos.count; i += 3) {
        p1.fromBufferAttribute(pos, i);
        p2.fromBufferAttribute(pos, i + 1);
        p3.fromBufferAttribute(pos, i + 2);
        area += triangleArea(p1, p2, p3);
    }

    return area;
}

function triangleArea(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): number {
    const ab = new THREE.Vector3().subVectors(b, a);
    const ac = new THREE.Vector3().subVectors(c, a);
    const cross = new THREE.Vector3().crossVectors(ab, ac);
    return 0.5 * cross.length();
}

// ---------- RUN ----------
const inputFile = process.argv[2];
if (!inputFile) {
    console.error('Usage: ts-node analyze-glb.ts <file.glb>');
    process.exit(1);
}
analyzeGLB(inputFile).catch(console.error);
