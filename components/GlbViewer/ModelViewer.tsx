'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

type Props = {
    modelUrl?: string;          // e.g. "/models/example.stl" (public/) or remote URL
    className?: string;
    forceType?: 'glb' | 'stl';  // optional override
};

export default function ModelViewer({ modelUrl, className = "", forceType }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene>();
    const rendererRef = useRef<THREE.WebGLRenderer>();
    const controlsRef = useRef<OrbitControls>();
    const animationIdRef = useRef<number>();

    useEffect(() => {
        if (!containerRef.current || !modelUrl) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight || 400;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5f5);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(22, width / height, 0.1, 1000);
        camera.position.set(2, 2, 2);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2;
        controlsRef.current = controls;

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));

        const dir = new THREE.DirectionalLight(0xffffff, 0.8);
        dir.position.set(5, 5, 5);
        dir.castShadow = true;
        dir.shadow.mapSize.set(2048, 2048);
        scene.add(dir);

        scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.4));

        // -------- LOAD MODEL (GLB/GLTF or STL) --------
        const ext = (forceType ?? modelUrl.split('?')[0].split('#')[0].split('.').pop()?.toLowerCase()) || '';

        const loadGLB = (url: string) => {
            const loader = new GLTFLoader();
            loader.load(
                url,
                (gltf) => {
                    const model = gltf.scene;
                    model.traverse((child: any) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    addToScene(model);
                },
                undefined,
                (e) => console.error('GLB load error:', e)
            );
        };

        const loadSTL = (url: string) => {
            const loader = new STLLoader();
            loader.load(
                url,
                (geometry) => {
                    geometry.computeVertexNormals();
                    const material = new THREE.MeshStandardMaterial({
                        color: 0x3b82f6,
                        metalness: 0.1,
                        roughness: 0.6,
                        side: THREE.DoubleSide,
                    });
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    addToScene(mesh);
                },
                undefined,
                (e) => console.error('STL load error:', e)
            );
        };

        // Meshy proxy logic preserved (optional)
        const finalUrl =
            modelUrl.includes('assets.meshy.ai')
                ? `/api/proxy-glb?url=${encodeURIComponent(modelUrl)}`
                : modelUrl;

        if (ext === 'glb' || ext === 'gltf' || forceType === 'glb') {
            loadGLB(finalUrl);
        } else if (ext === 'stl' || forceType === 'stl') {
            loadSTL(finalUrl);
        } else {
            console.warn('Unknown model type, defaulting to GLB loader.');
            loadGLB(finalUrl);
        }

        // Center + scale + fit camera
        function addToScene(object: THREE.Object3D) {
            // Center
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            object.position.sub(center);

            // Scale to fit ~2 units
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const scale = 2 / maxDim;
            object.scale.setScalar(scale);

            scene.add(object);

            // Camera distance
            const dist = maxDim * scale * 2;
            camera.position.set(dist, dist, dist);
            controls.target.set(0, 0, 0);
            controls.update();
        }

        // Animate
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Mount
        container.appendChild(renderer.domElement);

        // Resize
        const onResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight || 400;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', onResize);
            if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
            controls.dispose();
            renderer.dispose();
            if (renderer.domElement.parentElement) renderer.domElement.parentElement.removeChild(renderer.domElement);
            scene.clear();
        };
    }, [modelUrl, forceType]);

    return (
        <div ref={containerRef} className={`w-full h-80 bg-gray-50 rounded-lg relative ${className}`}>
            {!modelUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <i className="ri-3d-box-line text-4xl text-gray-400 mb-2" />
                        <p className="text-gray-500">No 3D model loaded</p>
                    </div>
                </div>
            )}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                <p>🖱️ Drag to rotate • 🔍 Scroll to zoom • 🤏 Right drag to pan</p>
            </div>
        </div>
    );
}
