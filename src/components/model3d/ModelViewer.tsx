"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ModelViewerProps {
  modelUrl: string;
  autoRotate?: boolean;
  interactive?: boolean;
  className?: string;
  cameraPosition?: [number, number, number];
}

export function ModelViewer({
  modelUrl,
  autoRotate = true,
  interactive = true,
  className = "",
  cameraPosition = [1.8, 1.4, 2.2],
}: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inView, setInView] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lazy-mount only when within or near viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(...cameraPosition);

    // Controls
    let controls: OrbitControls | null = null;
    if (interactive) {
      controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enableZoom = false; // keep page scroll smooth unless explicitly requested
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 1.2;
      controls.maxPolarAngle = Math.PI / 2 + 0.2;
      controls.minPolarAngle = Math.PI / 6;
    }

    // Soft Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.0);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbe7f5, 1.2);
    fillLight.position.set(-4, 2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xefc07b, 0.9); // Pastel Amber accent rim
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);

    // Model root group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Loader
    const loader = new GLTFLoader();
    let disposed = false;

    loader.load(
      modelUrl,
      (gltf) => {
        if (disposed) return;

        const model = gltf.scene;

        // Apply clean engineering CAD material & subtle wireframe edges
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              const stdMat = mesh.material as THREE.MeshStandardMaterial;
              stdMat.color = new THREE.Color(0x223a5e); // Deep Prussian Blue CAD steel
              stdMat.metalness = 0.4;
              stdMat.roughness = 0.4;
            }

            // Add subtle wireframe edges
            try {
              const edgesGeom = new THREE.EdgesGeometry(mesh.geometry, 25);
              const edgesMat = new THREE.LineBasicMaterial({
                color: 0x0f3460, // Prussian Blue structural wireframe
                transparent: true,
                opacity: 0.8,
              });
              const line = new THREE.LineSegments(edgesGeom, edgesMat);
              mesh.add(line);
            } catch {
              // Non-fatal if edges geometry fails on complex topology
            }
          }
        });

        // Center and scale model to fit viewport nicely
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 1.6 / maxDim;

        model.position.sub(center);
        modelGroup.scale.set(scale, scale, scale);
        modelGroup.add(model);

        setLoading(false);
      },
      undefined,
      (err) => {
        console.error("Error loading GLB:", err);
        setLoading(false);
      }
    );

    // Resize handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Render loop
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (controls) {
        controls.update();
      } else if (autoRotate) {
        modelGroup.rotation.y += 0.006;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (controls) controls.dispose();
      renderer.dispose();
    };
  }, [inView, modelUrl, autoRotate, interactive, cameraPosition]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden select-none ${className}`}
      aria-label="Interactive 3D model viewport"
    >
      {/* Subtle CAD grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(#0f3460_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Canvas */}
      <canvas ref={canvasRef} className="h-full w-full cursor-grab active:cursor-grabbing block" />

      {/* Loading state indicator */}
      {loading && inView && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#1A1A2E]/60 backdrop-blur-2xs">
          <div className="flex items-center gap-2 rounded-xs border border-[#0F3460] bg-[#16213E]/95 px-3 py-1.5 mono text-micro text-[#EFC07B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EFC07B] animate-ping" />
            <span>MOUNTING SOLID...</span>
          </div>
        </div>
      )}
    </div>
  );
}
