'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useTranslations } from 'next-intl';

type Props = {
    modelUrl?: string;
    className?: string;
    forceType?: 'glb' | 'stl';
    /** when false, stop RAF + minimal work */
    active?: boolean;
};

export default function ModelViewer({ modelUrl, className = '', forceType, active = true }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const frameRef = useRef<number | null>(null);
    const mountedRef = useRef(false);
    const isTouchRef = useRef(false);
    const t = useTranslations('home.ai.viewer');
    console.log("url",modelUrl);
    useEffect(() => {
        if (!containerRef.current || !modelUrl) return;
        mountedRef.current = true;


        // detect touch/coarse pointer
        if (typeof window !== 'undefined') {
            isTouchRef.current = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
        }

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width || container.clientWidth || 1));
        const height = Math.max(1, Math.floor(rect.height || container.clientHeight || 1));

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5f5);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(22, width / height, 0.1, 1000);
        camera.position.set(2, 2, 2);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: 'low-power',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.shadowMap.enabled = false;
        rendererRef.current = renderer;

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.enableRotate = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2;
        controlsRef.current = controls;

        // === Mobile behavior: auto-rotate ON, user gestures OFF ===
        if (isTouchRef.current) {
            // Keep controls.enabled = true so autoRotate works
            controls.enableZoom = false;
            controls.enablePan = false;
            controls.enableRotate = false;
            controls.autoRotate = true;

            // Let page scrolling work; block all pointer interaction with the canvas
            renderer.domElement.style.pointerEvents = 'none';
            renderer.domElement.tabIndex = -1;
        }

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        // Sky/ground tint
        scene.add(new THREE.HemisphereLight(0xffffff, 0x333344, 0.7));

// Key light
        const dir = new THREE.DirectionalLight(0xffffff, 1.4);
        dir.position.set(3, 5, 4);
        scene.add(dir);
        const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
        scene.add(hemi);

        // -------- LOAD MODEL --------
        const ext = (forceType ?? modelUrl.split('?')[0].split('#')[0].split('.').pop()?.toLowerCase()) || '';

        const addToScene = (object: THREE.Object3D) => {
            const box = new THREE.Box3().setFromObject(object);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            object.position.sub(center);

            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const scale = 2 / maxDim;
            object.scale.setScalar(scale);

            scene.add(object);

            const dist = maxDim * scale * 2.5;
            camera.position.set(dist, dist, dist);
            controls.target.set(0, 0, 0);
            controls.update();
        };

        const loadGLB = (url: string) => {
            const loader = new GLTFLoader();
            // help with CORS when server allows it
            try { (loader as any).setCrossOrigin?.('anonymous'); } catch {}
            loader.load(
                url,
                (gltf) => {
                    gltf.scene.traverse((child: any) => {
                        if (child.isMesh) {
                            child.castShadow = false;
                            child.receiveShadow = false;
                        }
                    });
                    addToScene(gltf.scene);
                    // If inactive (offscreen), render one frame so the model appears without needing a tab visibility change
                    if (!active) {
                        try { renderer.render(scene, camera); } catch {}
                    }
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
                        metalness: 0.05,
                        roughness: 0.85,
                        side: THREE.DoubleSide,
                    });
                    const mesh = new THREE.Mesh(geometry, material);
                    addToScene(mesh);
                    // If inactive (offscreen), render one frame so the model appears without needing a tab visibility change
                    if (!active) {
                        try { renderer.render(scene, camera); } catch {}
                    }
                },
                undefined,
                (e) => console.error('STL load error:', e)
            );
        };

        const finalUrl =
            modelUrl.includes('assets.meshy.ai') ? `/api/proxy-glb?url=${encodeURIComponent(modelUrl)}` : modelUrl;

        if (ext === 'glb' || ext === 'gltf' || forceType === 'glb') loadGLB(finalUrl);
        else if (ext === 'stl' || forceType === 'stl') loadSTL(finalUrl);
        else {
            console.warn('Unknown model type, defaulting to GLB loader.');
            loadGLB(finalUrl);
        }

        // Mount
        container.appendChild(renderer.domElement);
        try {
            // Ensure canvas fills the container
            renderer.domElement.style.width = '100%';
            renderer.domElement.style.height = '100%';
            renderer.domElement.style.display = 'block';
        } catch {}

        // Resize
        const onResize = () => {
            if (!rendererRef.current || !cameraRef.current || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const w = Math.max(1, Math.floor(rect.width || containerRef.current.clientWidth || 1));
            const h = Math.max(1, Math.floor(rect.height || containerRef.current.clientHeight || 1));
            rendererRef.current.setSize(w, h);
            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(onResize);
        ro.observe(container);

        // Tab visibility: auto-pause when hidden
        const onVis = () => {
            if (document.hidden) stopLoop();
            else if (active) startLoop();
        };
        document.addEventListener('visibilitychange', onVis);

        // Start immediately, otherwise it may wait until a tab visibility change
        if (active) startLoop();
        else {
            // Render a single frame so the viewer isn't blank when paused
            try { renderer.render(scene, camera); } catch {}
        }

        // Cleanup
        return () => {
            document.removeEventListener('visibilitychange', onVis);
            ro.disconnect();
            stopLoop();
            controls.dispose();
            if (renderer.domElement.parentElement)
                renderer.domElement.parentElement.removeChild(renderer.domElement);
            disposeScene(scene);
            renderer.dispose();
            try { renderer.forceContextLoss(); } catch {}
            sceneRef.current = null;
            rendererRef.current = null;
            controlsRef.current = null;
            cameraRef.current = null;
            mountedRef.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modelUrl, forceType]); // re-init only when model changes

    // start/stop loop on `active`
    useEffect(() => {
        if (!mountedRef.current) return;
        if (active) startLoop();
        else stopLoop();

        // keep auto-rotate ON for all devices when active
        if (controlsRef.current) controlsRef.current.autoRotate = !!active;
    }, [active]);

    function startLoop() {
        if (frameRef.current != null) return;
        const renderer = rendererRef.current;
        const scene = sceneRef.current;
        const camera = cameraRef.current;
        if (!renderer || !scene || !camera) return;
        const loop = () => {
            controlsRef.current?.update();
            renderer.render(scene, camera);
            frameRef.current = requestAnimationFrame(loop);
        };
        frameRef.current = requestAnimationFrame(loop);
    }

    function stopLoop() {
        if (frameRef.current != null) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
        }
        rendererRef.current?.setAnimationLoop(null as any);
    }

    function disposeScene(scene: THREE.Scene) {
        scene.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.geometry?.dispose?.();
                disposeMaterial(obj.material);
            } else if (obj.isLight && obj.dispose) {
                obj.dispose();
            }
        });
    }

    function disposeMaterial(mat: any) {
        if (Array.isArray(mat)) mat.forEach(disposeMaterial);
        else if (mat) {
            Object.keys(mat).forEach((k) => {
                const v = (mat as any)[k];
                if (v && v.isTexture) v.dispose?.();
            });
            mat.dispose?.();
        }
    }

    return (
        <div ref={containerRef} className={`w-full h-full bg-gray-50 rounded-lg relative ${className}`}>
            {!modelUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <i className="ri-3d-box-line text-4xl text-gray-400 mb-2" />
                        <p className="text-gray-500">No 3D model loaded</p>
                    </div>
                </div>
            )}
            {/* Helper hidden on mobile to avoid showing pan/zoom tips */}
            <div className="hidden md:block absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                <p>🖱️ {t('rotate')} • 🔍 {t('zoom')} • 🤏 {t('pan')}</p>
            </div>
        </div>
    );
}
