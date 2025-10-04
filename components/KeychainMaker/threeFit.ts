// app/components/keychain/threeFit.ts
import * as THREE from 'three';

export function calcDims(container: HTMLElement) {
    const width = container.clientWidth || 320;
    // 3:2 aspect, gently clamped for stability
    const height = Math.max(300, Math.min(520, Math.round(width * 0.66)));
    return { width, height };
}

export function normalizeAndCenterXZ(group: THREE.Object3D) {
    const box = new THREE.Box3().setFromObject(group);
    const size = box.getSize(new THREE.Vector3());
    const footprint = Math.max(size.x, size.z) || 1e-6;
    const target = 1.6; // world units
    const scale = target / footprint;
    group.scale.setScalar(scale);

    const box2 = new THREE.Box3().setFromObject(group);
    const c = box2.getCenter(new THREE.Vector3());
    group.position.x -= c.x;
    group.position.z -= c.z;
    group.position.y -= box2.min.y;
    group.position.y += 0.001; // prevent z-fighting
}

export function fitPerspective(
    group: THREE.Object3D,
    camera: THREE.PerspectiveCamera,
    container: HTMLElement,
    angled: boolean
) {
    const { width, height } = calcDims(container);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const b = new THREE.Box3().setFromObject(group);
    const sphere = new THREE.Sphere();
    b.getBoundingSphere(sphere);

    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);

    const distV = sphere.radius / Math.tan(vFov / 2);
    const distH = sphere.radius / Math.tan(hFov / 2);
    const dist = Math.max(distV, distH) * 1.15;

    if (angled) {
        camera.position.set(dist * 0.95, dist * 1.1, dist * 0.95);
    } else {
        camera.position.set(0, dist * 1.2, 0.0001);
    }

    camera.near = Math.max(0.01, dist * 0.01);
    camera.far = dist * 10;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
}

export function fitOrthographic(
    group: THREE.Object3D,
    camera: THREE.OrthographicCamera,
    container: HTMLElement
) {
    const { width, height } = calcDims(container);
    const aspect = width / height;

    camera.left = -aspect;
    camera.right = aspect;
    camera.top = 1;
    camera.bottom = -1;
    camera.near = 0.01;
    camera.far = 1000;
    camera.updateProjectionMatrix();

    const box = new THREE.Box3().setFromObject(group);
    const w = Math.max(1e-6, box.max.x - box.min.x);
    const d = Math.max(1e-6, box.max.z - box.min.z);

    const viewW = camera.right - camera.left; // 2*aspect
    const viewH = camera.top - camera.bottom; // 2

    const margin = 1.15;
    const zoomX = viewW / (w * margin);
    const zoomZ = viewH / (d * margin);
    camera.zoom = Math.min(zoomX, zoomZ);
    camera.updateProjectionMatrix();

    const hObj = Math.max(0.2, box.max.y - box.min.y);
    camera.position.set(0, Math.max(2.5, hObj * 5), 0.001);
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);
}
