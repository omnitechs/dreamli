
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  stlUrl?: string;
  width?: number;
  height?: number;
}

export default function ThreeScene({ stlUrl, width = 800, height = 600 }: ThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const controls = {
      mouseDown: false,
      mouseX: 0,
      mouseY: 0,
      rotationX: 0,
      rotationY: 0
    };

    const handleMouseDown = (event: MouseEvent) => {
      controls.mouseDown = true;
      controls.mouseX = event.clientX;
      controls.mouseY = event.clientY;
    };

    const handleMouseUp = () => {
      controls.mouseDown = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!controls.mouseDown || !meshRef.current) return;

      const deltaX = event.clientX - controls.mouseX;
      const deltaY = event.clientY - controls.mouseY;

      controls.rotationY += deltaX * 0.01;
      controls.rotationX += deltaY * 0.01;

      meshRef.current.rotation.y = controls.rotationY;
      meshRef.current.rotation.x = controls.rotationX;

      controls.mouseX = event.clientX;
      controls.mouseY = event.clientY;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const scale = event.deltaY > 0 ? 0.9 : 1.1;
      camera.position.multiplyScalar(scale);
      camera.position.clampLength(1, 50);
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('wheel', handleWheel);

    if (stlUrl) {
      loadSTLFile(stlUrl, scene);
    } else {
      createDefaultGeometry(scene);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [width, height]);

  useEffect(() => {
    if (stlUrl && sceneRef.current) {
      if (meshRef.current) {
        sceneRef.current.remove(meshRef.current);
      }
      loadSTLFile(stlUrl, sceneRef.current);
    }
  }, [stlUrl]);

  const loadSTLFile = async (url: string, scene: THREE.Scene) => {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const geometry = parseSTL(arrayBuffer);
      
      geometry.computeVertexNormals();
      geometry.center();

      const material = new THREE.MeshLambertMaterial({ 
        color: 0x3b82f6,
        side: THREE.DoubleSide 
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const box = new THREE.Box3().setFromObject(mesh);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      mesh.scale.setScalar(scale);

      meshRef.current = mesh;
      scene.add(mesh);
    } catch (error) {
      console.error('Error loading STL file:', error);
      createDefaultGeometry(scene);
    }
  };

  const parseSTL = (buffer: ArrayBuffer): THREE.BufferGeometry => {
    const dataView = new DataView(buffer);
    const triangles = dataView.getUint32(80, true);
    
    const vertices: number[] = [];
    let offset = 84;

    for (let i = 0; i < triangles; i++) {
      offset += 12;
      
      for (let j = 0; j < 3; j++) {
        const x = dataView.getFloat32(offset, true);
        const y = dataView.getFloat32(offset + 4, true);
        const z = dataView.getFloat32(offset + 8, true);
        
        vertices.push(x, y, z);
        offset += 12;
      }
      
      offset += 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    return geometry;
  };

  const createDefaultGeometry = (scene: THREE.Scene) => {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshLambertMaterial({ color: 0x3b82f6 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    meshRef.current = mesh;
    scene.add(mesh);
  };

  return <div ref={mountRef} className="border rounded-lg overflow-hidden" />;
}
