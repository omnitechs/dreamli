import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export type ModelMetrics = {
  sizeMm: { x: number; y: number; z: number };
  volumeMm3: number;
  surfaceAreaMm2: number;
  weightG: number; // estimated at 20% infill PLA
  finalUrl: string; // url actually used to load
};

const densityPLA_g_per_mm3 = 1.24e-3; // g/mm^3
const defaultInfill = 0.2; // 20%

export function proxyIfNeeded(url: string): string {
  try {
    if (!url) return url;
    // Mirror logic used in GlbViewer to keep behavior consistent
    return url.includes('assets.meshy.ai') ? `/api/proxy-glb?url=${encodeURIComponent(url)}` : url;
  } catch {
    return url;
  }
}

export async function analyzeModelUrl(modelUrl: string): Promise<ModelMetrics> {
  const finalUrl = proxyIfNeeded(modelUrl);

  // Only GLB/GLTF supported for now, which matches the issue requirement "analyze-glb"
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(finalUrl);
  const scene = gltf.scene || gltf.scenes?.[0];
  if (!scene) throw new Error('No scene in GLB');

  scene.updateMatrixWorld(true);

  // Collect all world-space geometries
  const geoms: THREE.BufferGeometry[] = [];
  scene.traverse((obj) => {
    // @ts-expect-error Three.js runtime type guard on traversed object; `isMesh` exists at runtime but not in TS typing here.
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      const geom = mesh.geometry.clone();
      geom.applyMatrix4(mesh.matrixWorld);
      geoms.push(geom);
    }
  });
  if (geoms.length === 0) throw new Error('No meshes found in model');

  const merged = BufferGeometryUtils.mergeGeometries(geoms, false);
  if (!merged) throw new Error('Failed to merge geometries');

  // Bounding box
  const pos = merged.getAttribute('position');
  const arr = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    arr[i * 3] = pos.getX(i);
    arr[i * 3 + 1] = pos.getY(i);
    arr[i * 3 + 2] = pos.getZ(i);
  }
  const box = new THREE.Box3().setFromArray(arr);
  const size = box.getSize(new THREE.Vector3());

  // Volume + Surface area
  const volume = computeVolume(merged);
  const area = computeSurfaceArea(merged);

  const weight = volume * defaultInfill * densityPLA_g_per_mm3; // grams

  // Dispose temp geometries to avoid leaks
  merged.dispose();
  geoms.forEach((g) => g.dispose());

  return {
    sizeMm: { x: size.x, y: size.y, z: size.z },
    volumeMm3: Math.abs(volume),
    surfaceAreaMm2: area,
    weightG: weight,
    finalUrl,
  };
}

function computeVolume(geometry: THREE.BufferGeometry): number {
  const pos = geometry.getAttribute('position');
  let volume = 0;
  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const p3 = new THREE.Vector3();

  for (let i = 0; i < pos.count; i += 3) {
    p1.fromBufferAttribute(pos, i);
    p2.fromBufferAttribute(pos, i + 1);
    p3.fromBufferAttribute(pos, i + 2);
    volume += signedVolumeOfTriangle(p1, p2, p3);
  }
  return Math.abs(volume);
}

function signedVolumeOfTriangle(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): number {
  return p1.dot(p2.clone().cross(p3)) / 6.0;
}

function computeSurfaceArea(geometry: THREE.BufferGeometry): number {
  const pos = geometry.getAttribute('position');
  let area = 0;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();

  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i);
    b.fromBufferAttribute(pos, i + 1);
    c.fromBufferAttribute(pos, i + 2);
    area += triangleArea(a, b, c);
  }
  return area;
}

function triangleArea(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): number {
  const ab = new THREE.Vector3().subVectors(b, a);
  const ac = new THREE.Vector3().subVectors(c, a);
  const cross = new THREE.Vector3().crossVectors(ab, ac);
  return 0.5 * cross.length();
}
