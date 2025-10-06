// app/components/keychain/useKeychainThree.ts
'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// @ts-ignore
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

import {
    calcDims,
    fitOrthographic,
    fitPerspective,
    normalizeAndCenterXZ,
} from './threeFit';
import { colorHex } from './colors';
import type { Defines } from './types';

type PartName = 'base' | 'text' | 'hole';

export function useKeychainThree(params: {
    containerRef: React.RefObject<HTMLDivElement | null>;
    defines: Defines;
    scadPath: string; // compile happens outside; kept for parity
    freeView: boolean;
    MOBILE: boolean;
    colorNames: { base: string; text: string; unico: string };
}) {
    const { containerRef, freeView, MOBILE, colorNames } = params;

    // three refs
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);

    const perspCamRef = useRef<THREE.PerspectiveCamera | null>(null);
    const orthoCamRef = useRef<THREE.OrthographicCamera | null>(null);
    const activeCamRef = useRef<THREE.Camera | null>(null);

    const controlsRef = useRef<OrbitControls | null>(null);
    const groupRef = useRef<THREE.Group | null>(null);

    // meshes + materials
    const baseMeshRef = useRef<THREE.Mesh | null>(null);
    const textMeshRef = useRef<THREE.Mesh | null>(null);
    const holeMeshRef = useRef<THREE.Mesh | null>(null);

    const baseMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
    const textMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
    const holeMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

    const loaderRef = useRef<STLLoader | null>(null);

    // track initial fit (important for mobile single render)
    const initialFitDoneRef = useRef(false);

    const renderOnce = useCallback(() => {
        const r = rendererRef.current;
        const s = sceneRef.current;
        const c = activeCamRef.current;
        if (r && s && c) r.render(s, c);
    }, []);

    const switchCamera = useCallback(
        (kind: 'ortho' | 'persp') => {
            activeCamRef.current = kind === 'ortho' ? orthoCamRef.current! : perspCamRef.current!;

            if (controlsRef.current) {
                // NOTE: we don't rely on freeView here anymore; a separate effect handles enabling.
                const enable = kind === 'persp' && !MOBILE && freeView;
                controlsRef.current.object = activeCamRef.current as any;
                controlsRef.current.enabled = enable;
                controlsRef.current.enableRotate = enable;
                controlsRef.current.enableZoom = enable;
                controlsRef.current.enablePan = false;
                controlsRef.current.enableDamping = enable;
                controlsRef.current.update();
            }
        },
        [MOBILE, freeView],
    );

    // bootstrap three — restore your original view behavior
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

        // cameras (same setup)
        const persp = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        perspCamRef.current = persp;

        const aspect = width / height;
        const ortho = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.01, 1000);
        orthoCamRef.current = ortho;

        // controls bound to persp; toggled by freeView
        const controls = new OrbitControls(persp, renderer.domElement);
        controls.enableRotate = false;
        controls.enableZoom = false;
        controls.enablePan = false;
        controlsRef.current = controls;

        // lights + grid (as in your file)
        scene.add(new THREE.AmbientLight(0xffffff, 0.9));
        const dir = new THREE.DirectionalLight(0xffffff, 0.9);
        dir.position.set(5, 6, 3);
        scene.add(dir);

        const grid = new THREE.GridHelper(3, 6);
        (grid as any).position.y = 0;
        scene.add(grid);

        // materials (created once; HOLE follows BASE color)
        const baseMat = new THREE.MeshStandardMaterial({
            color: colorHex(colorNames.base),
            metalness: MOBILE ? 0.0 : 0.1,
            roughness: 0.8,
        });

        const textMat = new THREE.MeshStandardMaterial({
            color: colorHex(colorNames.text),
            metalness: MOBILE ? 0.0 : 0.1,
            roughness: 0.8,
            depthWrite: false,
            depthTest: true,
            polygonOffset: true,
            polygonOffsetFactor: -2,
            polygonOffsetUnits: -2,
        });

        const holeMat = new THREE.MeshStandardMaterial({
            color: colorHex(colorNames.base), // hole = base color
            metalness: MOBILE ? 0.0 : 0.1,
            roughness: 0.85,
        });

        baseMatRef.current = baseMat;
        textMatRef.current = textMat;
        holeMatRef.current = holeMat;

        // meshes with empty geometry initially
        const baseMesh = new THREE.Mesh(new THREE.BufferGeometry(), baseMat);
        baseMesh.name = 'base';

        const textMesh = new THREE.Mesh(new THREE.BufferGeometry(), textMat);
        textMesh.name = 'text';

        const holeMesh = new THREE.Mesh(new THREE.BufferGeometry(), holeMat);
        holeMesh.name = 'hole';

        baseMeshRef.current = baseMesh;
        textMeshRef.current = textMesh;
        holeMeshRef.current = holeMesh;

        const group = new THREE.Group();
        group.add(baseMesh, textMesh, holeMesh);
        groupRef.current = group;
        scene.add(group);

        // initial camera mode — EXACTLY like your component
        switchCamera(MOBILE ? 'ortho' : freeView ? 'persp' : 'ortho');

        // resize — same recalculation & re-fit logic
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

        // loop — animate on desktop, single render on mobile
        let raf = 0;
        const tick = () => {
            controls.update();
            renderer.render(scene, activeCamRef.current || persp);
            raf = requestAnimationFrame(tick);
        };

        if (!MOBILE) tick();
        else renderOnce();

        loaderRef.current = new STLLoader();

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

    // when freeView/MOBILE change, (re)enable controls accordingly.
    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls) return;

        const enable =
            !MOBILE &&
            freeView &&
            activeCamRef.current === perspCamRef.current;

        controls.enabled = enable;
        controls.enableRotate = enable;
        controls.enableZoom = enable;
        controls.enablePan = false;
        controls.enableDamping = enable;
        controls.update();

        if (MOBILE) renderOnce();
    }, [freeView, MOBILE, renderOnce]);

    // public: switch camera & refit — same as your file
    const switchTo = useCallback(
        (kind: 'ortho' | 'persp') => {
            const container = containerRef.current;
            const group = groupRef.current;
            if (!container || !group) return;

            switchCamera(kind);

            if (kind === 'persp') {
                fitPerspective(group, perspCamRef.current!, container, true);
            } else {
                fitOrthographic(group, orthoCamRef.current!, container);
            }

            if (MOBILE) renderOnce();
        },
        [MOBILE, renderOnce, switchCamera, containerRef],
    );

    // helper: (re)center + fit (used only when BASE/TEXT change)
    const recenterAndFit = useCallback(() => {
        const container = containerRef.current;
        const group = groupRef.current;
        if (!container || !group) return;

        normalizeAndCenterXZ(group);

        if (activeCamRef.current === orthoCamRef.current && orthoCamRef.current) {
            fitOrthographic(group, orthoCamRef.current, container);
        } else if (activeCamRef.current === perspCamRef.current && perspCamRef.current) {
            fitPerspective(group, perspCamRef.current, container, true);
        }
    }, [containerRef]);

    // public: set geometry per part
    const setPartGeometry = useCallback(
        (part: PartName, buf: ArrayBuffer) => {
            const loader = loaderRef.current;
            if (!loader) return;

            const mesh =
                part === 'base'
                    ? baseMeshRef.current
                    : part === 'text'
                        ? textMeshRef.current
                        : part === 'hole'
                            ? holeMeshRef.current
                            : null;

            if (!mesh) return;

            // dispose old geometry
            mesh.geometry.dispose();

            // parse & orient (Z-up)
            if (!buf || !buf.byteLength) {
                mesh.geometry = new THREE.BufferGeometry();
            } else {
                const geom = loader.parse(buf);
                geom.rotateX(-Math.PI / 2);
                geom.computeVertexNormals();
                mesh.geometry = geom;
            }

            // Don't recenter/refit on ANY part change, only on initial load
            if (!initialFitDoneRef.current) {
                initialFitDoneRef.current = true;
                recenterAndFit();
            }

            if (MOBILE) renderOnce();
        },
        [MOBILE, renderOnce, recenterAndFit],
    );

    // public: recolor without recompile (hole follows base)
    const setColors = useCallback(
        (opts: { base: string; text: string; unico: string; twoColors: boolean }) => {
            const baseMat = baseMatRef.current;
            const textMat = textMatRef.current;
            const holeMat = holeMatRef.current;
            if (!baseMat || !textMat || !holeMat) return;

            const baseColorName = opts.twoColors ? opts.base : opts.unico;
            const textColorName = opts.twoColors ? opts.text : opts.unico;

            baseMat.color.set(colorHex(baseColorName));
            textMat.color.set(colorHex(textColorName));
            holeMat.color.set(colorHex(baseColorName)); // hole = base

            if (MOBILE) renderOnce();
        },
        [MOBILE, renderOnce],
    );

    return { switchTo, setPartGeometry, setColors };
}
