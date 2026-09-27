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

    // Calibrated Aerospace Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf4f7fb, 2.6);
    keyLight.position.set(5, 7, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x5a83b5, 1.0);
    fillLight.position.set(-5, 2, -3);
    scene.add(fillLight);

    // Warm Pastel Amber rim lights to catch precision chamfers
    const rimLight = new THREE.DirectionalLight(0xefc07b, 2.0);
    rimLight.position.set(-2, -4, -5);
    scene.add(rimLight);

    const topRimLight = new THREE.DirectionalLight(0xefc07b, 1.0);
    topRimLight.position.set(0, 8, -2);
    scene.add(topRimLight);

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

        // Apply bead-blasted anodized titanium aerospace finish & subtle laser wireframe
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              const stdMat = mesh.material as THREE.MeshStandardMaterial;
              stdMat.color = new THREE.Color(0x1e2736); // Machined aerospace titanium gunmetal
              stdMat.metalness = 0.85; // High metallic reflection
              stdMat.roughness = 0.25; // Precision satin bead-blasted sheen
            }

            // Add subtle precision laser wireframe edges
            try {
              const edgesGeom = new THREE.EdgesGeometry(mesh.geometry, 25);
              const edgesMat = new THREE.LineBasicMaterial({
                color: 0x4a7aab, // Prussian steel inspection line
                transparent: true,
                opacity: 0.35,
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
      <div className="pointer-events-none absolute inset-0 opacity-15 bg-[radial-gradient(rgba(45,78,120,0.3)_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Canvas */}
      <canvas ref={canvasRef} className="h-full w-full cursor-grab active:cursor-grabbing block" />

      {/* Loading state indicator */}
      {loading && inView && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#080C14]/70 backdrop-blur-xs">
          <div className="flex items-center gap-2 rounded-xs border border-[rgba(45,78,120,0.5)] bg-[#0F1726]/95 px-3 py-1.5 mono text-micro text-[#EFC07B] shadow-lg">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EFC07B] animate-ping" />
            <span>MOUNTING SOLID...</span>
          </div>
        </div>
      )}
    </div>
  );
}
