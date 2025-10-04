// app/components/keychain/useKeychainThree.ts
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// @ts-ignore
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { calcDims, fitOrthographic, fitPerspective, normalizeAndCenterXZ } from './threeFit';
import { colorHex } from './colors';
import type { Defines } from './types';

import { compilePart } from './openscadClient';

export function useKeychainThree(params: {
    containerRef: React.RefObject<HTMLDivElement | null>;
    defines: Defines;
    scadPath: string; // e.g. '/test.scad'
    freeView: boolean;
    MOBILE: boolean;
    colorNames: { base: string; text: string; unico: string };
}) {
    const { containerRef, defines, scadPath, freeView, MOBILE, colorNames } = params;

    // three refs
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const perspCamRef = useRef<THREE.PerspectiveCamera | null>(null);
    const orthoCamRef = useRef<THREE.OrthographicCamera | null>(null);
    const activeCamRef = useRef<THREE.Camera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const groupRef = useRef<THREE.Object3D | null>(null);

    const switchCamera = (kind: 'ortho' | 'persp') => {
        activeCamRef.current = kind === 'ortho' ? orthoCamRef.current! : perspCamRef.current!;
        if (controlsRef.current) {
            const enable = kind === 'persp' && !MOBILE && freeView;
            controlsRef.current.object = activeCamRef.current as any;
            controlsRef.current.enabled = enable;
            controlsRef.current.enableRotate = enable;
            controlsRef.current.enableZoom = enable;
            controlsRef.current.enablePan = false;
            controlsRef.current.enableDamping = enable;
            controlsRef.current.update();
        }
    };

    const renderOnce = () => {
        const r = rendererRef.current,
            s = sceneRef.current,
            c = activeCamRef.current;
        if (r && s && c) r.render(s, c);
    };

    // bootstrap three
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const { width, height } = calcDims(container);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(MOBILE ? 1 : Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // cameras
        const persp = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        perspCamRef.current = persp;

        const aspect = width / height;
        const ortho = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.01, 1000);
        orthoCamRef.current = ortho;

        // controls (bound to persp by default; switched on demand)
        const controls = new OrbitControls(persp, renderer.domElement);
        controls.enableRotate = false;
        controls.enableZoom = false;
        controls.enablePan = false;
        controlsRef.current = controls;

        // lights + ground helper (optional)
        scene.add(new THREE.AmbientLight(0xffffff, 0.9));
        const dir = new THREE.DirectionalLight(0xffffff, 0.9);
        dir.position.set(5, 6, 3);
        scene.add(dir);

        const grid = new THREE.GridHelper(3, 6);
        (grid as any).position.y = 0;
        scene.add(grid);

        // initial camera
        switchCamera(MOBILE ? 'ortho' : freeView ? 'persp' : 'ortho');

        // resize
        const ro = new ResizeObserver(() => {
            const dims = calcDims(container);
            renderer.setSize(dims.width, dims.height, false);
            if (orthoCamRef.current) {
                orthoCamRef.current.left = -dims.width / dims.height;
                orthoCamRef.current.right = dims.width / dims.height;
                orthoCamRef.current.top = 1;
                orthoCamRef.current.bottom = -1;
                orthoCamRef.current.updateProjectionMatrix();
            }
            if (perspCamRef.current) {
                perspCamRef.current.aspect = dims.width / dims.height;
                perspCamRef.current.updateProjectionMatrix();
            }

            if (groupRef.current) {
                if (activeCamRef.current === orthoCamRef.current) {
                    fitOrthographic(groupRef.current, orthoCamRef.current!, container);
                } else if (activeCamRef.current === perspCamRef.current) {
                    fitPerspective(groupRef.current, perspCamRef.current!, container, true);
                }
            }
            if (MOBILE) renderOnce();
        });
        ro.observe(container);

        // loop
        let raf = 0;
        const tick = () => {
            controls.update();
            renderer.render(scene, activeCamRef.current || persp);
            raf = requestAnimationFrame(tick);
        };
        if (!MOBILE) tick();
        else renderOnce();

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

    // recompile + rebuild when defines/colors/freeView change
    useEffect(() => {
        const scene = sceneRef.current;
        const container = containerRef.current;
        if (!scene || !container || !perspCamRef.current || !orthoCamRef.current) return;

        let cancelled = false;

        (async () => {
            // compile base + text (serialize on mobile)
            const baseBuf = await compilePart(scadPath, defines, 'base');
            if (cancelled) return;
            const textBuf = await compilePart(scadPath, defines, 'text');
            if (cancelled) return;

            // remove previous
            if (groupRef.current) {
                scene.remove(groupRef.current);
                groupRef.current.traverse?.((o: any) => {
                    o.geometry?.dispose?.();
                    o.material?.dispose?.();
                });
                groupRef.current = null;
            }

            // parse STL
            const loader = new STLLoader();
            const baseGeom = baseBuf.byteLength ? loader.parse(baseBuf) : null;
            const textGeom = textBuf.byteLength ? loader.parse(textBuf) : null;
            if (!baseGeom && !textGeom) return;

            const prep = (g: THREE.BufferGeometry | null) => {
                if (!g) return;
                g.rotateX(-Math.PI / 2);
                g.computeVertexNormals();
            };
            prep(baseGeom);
            prep(textGeom);

            const baseMat = new THREE.MeshStandardMaterial({
                color: defines.dos_colores ? colorHex(colorNames.base) : colorHex(colorNames.unico),
                metalness: MOBILE ? 0.0 : 0.1,
                roughness: 0.8,
            });
            const textMat = new THREE.MeshStandardMaterial({
                color: defines.dos_colores ? colorHex(colorNames.text) : colorHex(colorNames.unico),
                metalness: MOBILE ? 0.0 : 0.1,
                roughness: 0.8,
                depthWrite: false,
                depthTest: true,
                polygonOffset: true,
                polygonOffsetFactor: -2,
                polygonOffsetUnits: -2,
            });

            const group = new THREE.Group();
            if (baseGeom) group.add(new THREE.Mesh(baseGeom, baseMat));
            if (textGeom) {
                const m = new THREE.Mesh(textGeom, textMat);
                m.renderOrder = 1;
                m.position.z += 0.02;
                group.add(m);
            }

            normalizeAndCenterXZ(group);
            scene.add(group);
            groupRef.current = group;

            const wantPersp = !MOBILE && freeView;
            switchCamera(wantPersp ? 'persp' : 'ortho');

            if (wantPersp) {
                fitPerspective(group, perspCamRef.current!, container, true);
            } else {
                fitOrthographic(group, orthoCamRef.current!, container);
            }

            if (MOBILE) renderOnce();
        })();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defines), freeView, colorNames.base, colorNames.text, colorNames.unico]);

    // expose a few helpers to the component
    return {
        switchTo: (kind: 'ortho' | 'persp') => {
            const container = containerRef.current;
            const group = groupRef.current;
            if (!container || !group) return;
            switchCamera(kind);
            if (kind === 'persp') fitPerspective(group, perspCamRef.current!, container, true);
            else fitOrthographic(group, orthoCamRef.current!, container);
            if (MOBILE) renderOnce();
        },
    };
}
