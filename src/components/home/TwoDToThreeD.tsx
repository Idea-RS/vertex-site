"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PulseOrb } from "@/components/PulseOrb";

export default function TwoDToThreeD() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeView, setActiveView] = useState<"iso" | "front" | "top" | "section">("iso");
  const [slicePos, setSlicePos] = useState<number>(0); // 0 = no cut, 0.1 - 1.0 = slice along Z
  const [isOrbiting, setIsOrbiting] = useState<boolean>(false);
  const [clipEnabled, setClipEnabled] = useState<boolean>(false);

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const solidGroupRef = useRef<THREE.Group | null>(null);
  const clipPlaneRef = useRef<THREE.Plane | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(130, 95, 140);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.localClippingEnabled = true;
    renderer.shadowMap.enabled = false;
    rendererRef.current = renderer;

    // Orbit Controls
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxDistance = 350;
    controls.minDistance = 60;
    controls.enablePan = true;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

    // Lighting (Studio CAD setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(150, 200, 100);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x778da9, 0.6);
    dirLight2.position.set(-150, -100, -100);
    scene.add(dirLight2);

    const rimLight = new THREE.DirectionalLight(0xf0a868, 0.4);
    rimLight.position.set(0, 150, -150);
    scene.add(rimLight);

    // Build the Die-Cast HT Clamp B-Rep Solid Model
    const solidGroup = new THREE.Group();
    solidGroupRef.current = solidGroup;
    scene.add(solidGroup);

    // Section Clipping Plane (along Z axis)
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 100);
    clipPlaneRef.current = clipPlane;

    // Material: Machined bead-blasted aluminum
    const cadMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8d1dc,
      metalness: 0.25,
      roughness: 0.35,
      clippingPlanes: [clipPlane],
      clipShadows: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    // Material for cut cap interior (dimension amber tint)
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x1b263b,
      linewidth: 1.5,
    });

    // --- Clamp Geometry Construction ---
    // 1. Base Mounting Saddle
    const baseGeo = new THREE.BoxGeometry(84, 18, 56, 4, 2, 4);
    const baseMesh = new THREE.Mesh(baseGeo, cadMaterial);
    baseMesh.position.set(0, -9, 0);
    solidGroup.add(baseMesh);

    const baseEdges = new THREE.LineSegments(new THREE.EdgesGeometry(baseGeo, 24), edgeMaterial);
    baseMesh.add(baseEdges);

    // 2. Center Conductor Half-Round Seat (Cylinder cutout arch)
    const seatArchGeo = new THREE.CylinderGeometry(24, 24, 56, 36, 1, false, Math.PI, Math.PI);
    const seatArchMesh = new THREE.Mesh(seatArchGeo, cadMaterial);
    seatArchMesh.rotation.z = Math.PI;
    seatArchMesh.position.set(0, 0, 0);
    solidGroup.add(seatArchMesh);

    const seatEdges = new THREE.LineSegments(new THREE.EdgesGeometry(seatArchGeo, 18), edgeMaterial);
    seatArchMesh.add(seatEdges);

    // 3. Upright Flanged Ears (Left and Right clamping towers)
    const earGeo = new THREE.BoxGeometry(18, 38, 56, 2, 4, 4);

    const leftEar = new THREE.Mesh(earGeo, cadMaterial);
    leftEar.position.set(-33, 10, 0);
    solidGroup.add(leftEar);
    leftEar.add(new THREE.LineSegments(new THREE.EdgesGeometry(earGeo, 24), edgeMaterial));

    const rightEar = new THREE.Mesh(earGeo, cadMaterial);
    rightEar.position.set(33, 10, 0);
    solidGroup.add(rightEar);
    rightEar.add(new THREE.LineSegments(new THREE.EdgesGeometry(earGeo, 24), edgeMaterial));

    // 4. Mounting Bolt Hole Bosses & Holes
    const boltHoleGeo = new THREE.CylinderGeometry(6, 6, 42, 24);
    const holeMat = new THREE.MeshStandardMaterial({
      color: 0x415a77,
      roughness: 0.6,
      clippingPlanes: [clipPlane],
    });

    const leftHole = new THREE.Mesh(boltHoleGeo, holeMat);
    leftHole.position.set(-33, 10, 0);
    solidGroup.add(leftHole);

    const rightHole = new THREE.Mesh(boltHoleGeo, holeMat);
    rightHole.position.set(33, 10, 0);
    solidGroup.add(rightHole);

    // 5. Hexagonal Bolt Recess Boss (Top)
    const hexGeo = new THREE.CylinderGeometry(11, 11, 8, 6);
    const hexMesh = new THREE.Mesh(hexGeo, cadMaterial);
    hexMesh.position.set(-33, 27, 0);
    solidGroup.add(hexMesh);
    hexMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(hexGeo, 20), edgeMaterial));

    const hexMeshR = new THREE.Mesh(hexGeo, cadMaterial);
    hexMeshR.position.set(33, 27, 0);
    solidGroup.add(hexMeshR);
    hexMeshR.add(new THREE.LineSegments(new THREE.EdgesGeometry(hexGeo, 20), edgeMaterial));

    // Subtle coordinate plane grid floor
    const grid = new THREE.GridHelper(160, 16, 0x415a77, 0x1b263b);
    grid.position.y = -22;
    if (!Array.isArray(grid.material)) {
      grid.material.opacity = 0.25;
      grid.material.transparent = true;
    }
    scene.add(grid);

    // Animation Render Loop
    let idleAngle = 0;
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      if (!isOrbiting && activeView === "iso") {
        idleAngle += 0.003;
        solidGroup.rotation.y = Math.sin(idleAngle) * 0.25;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Intersection Observer to stop rendering loop when scrolled offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
    };
  }, [isOrbiting, activeView]);

  // Handle Section Plane Cut Slider
  const handleSliceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSlicePos(val);

    if (!clipPlaneRef.current) return;

    if (val <= 0) {
      setClipEnabled(false);
      clipPlaneRef.current.constant = 100; // no cut
    } else {
      setClipEnabled(true);
      // Clamp depth is 56mm (-28 to +28)
      // Map 0 -> 1 to 28 -> -28
      const planeZ = 28 - val * 56;
      clipPlaneRef.current.constant = planeZ;
    }
  }, []);

  // Preset Camera Position Transitions
  const setPresetView = (view: "iso" | "front" | "top" | "section") => {
    setActiveView(view);
    if (!cameraRef.current || !controlsRef.current || !solidGroupRef.current) return;

    solidGroupRef.current.rotation.set(0, 0, 0);

    if (view === "iso") {
      cameraRef.current.position.set(130, 95, 140);
      controlsRef.current.target.set(0, 0, 0);
      setClipEnabled(false);
      if (clipPlaneRef.current) clipPlaneRef.current.constant = 100;
      setSlicePos(0);
    } else if (view === "front") {
      cameraRef.current.position.set(0, 10, 180);
      controlsRef.current.target.set(0, 5, 0);
      setClipEnabled(false);
      if (clipPlaneRef.current) clipPlaneRef.current.constant = 100;
      setSlicePos(0);
    } else if (view === "top") {
      cameraRef.current.position.set(0, 190, 0);
      controlsRef.current.target.set(0, 0, 0);
      setClipEnabled(false);
      if (clipPlaneRef.current) clipPlaneRef.current.constant = 100;
      setSlicePos(0);
    } else if (view === "section") {
      cameraRef.current.position.set(110, 40, 60);
      controlsRef.current.target.set(0, 5, 0);
      setClipEnabled(true);
      if (clipPlaneRef.current) clipPlaneRef.current.constant = 0; // exact centerline slice
      setSlicePos(0.5);
    }
    controlsRef.current.update();
  };

  return (
    <section
      id="reconstruct"
      className="relative my-16 overflow-hidden rounded-lg border border-vx-400/80 bg-surface-inset cad-dot-grid p-8 text-vx-900 shadow-xl lg:p-14"
      aria-label="Industrial 2D to 3D Solid Reconstruction"
    >
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Left column: Technical Positioning & Verification Gates */}
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2.5 rounded-xs border border-vx-400 bg-white/90 px-2.5 py-1">
            <PulseOrb size="sm" />
            <span className="mono text-micro text-vx-900 font-medium uppercase tracking-wider">
              04 · INDUSTRIAL-GRADE 2D TO 3D SOLIDS
            </span>
          </div>

          <h2 className="mt-4 text-h2 text-vx-900 tracking-[-0.015em]">
            Industrial-grade 2D to 3D. Verified B-rep solids, not AI meshes.
          </h2>

          <p className="mt-4 text-body text-vx-600 leading-relaxed">
            Vertex reconstructs production-ready 3D solids from 2D engineering drawings and family
            templates using the OpenCASCADE kernel. Every solid is evaluated through two mathematical
            gates: stated dimension bounds and projected silhouette linework.
          </p>

          {/* Dual Verification Gates Card */}
          <div className="mt-6 space-y-3 rounded-md border border-vx-400/70 bg-white p-5 shadow-xs">
            {/* Size Gate */}
            <div className="border-b border-vx-400/30 pb-3">
              <div className="flex items-center justify-between">
                <span className="mono text-micro font-semibold text-vx-900 uppercase">
                  Gate 01 · Size Gate (Dimensions)
                </span>
                <span className="mono rounded-xs border border-emerald-600/30 bg-emerald-50 px-2 py-0.5 text-micro font-medium text-emerald-800">
                  PASS · 17/17 Stated
                </span>
              </div>
              <p className="mt-1 text-micro text-vx-600">
                Measures solid bounding box and feature distances against sheet callouts (e.g. 84.0mm width, Ø24mm seat).
              </p>
            </div>

            {/* Form Gate */}
            <div>
              <div className="flex items-center justify-between">
                <span className="mono text-micro font-semibold text-vx-900 uppercase">
                  Gate 02 · Form Gate (Silhouette IoU)
                </span>
                <span className="mono rounded-xs border border-emerald-600/30 bg-emerald-50 px-2 py-0.5 text-micro font-medium text-emerald-800">
                  PASS · IoU &gt; 0.97
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-micro">
                <div className="rounded-xs border border-vx-400/40 bg-surface-inset p-2">
                  <div className="text-vx-600">TOP Silhouette:</div>
                  <div className="mono font-semibold text-vx-900">0.991 IoU · ±0.2mm</div>
                </div>
                <div className="rounded-xs border border-vx-400/40 bg-surface-inset p-2">
                  <div className="text-vx-600">FRONT Silhouette:</div>
                  <div className="mono font-semibold text-vx-900">0.971 IoU · ±0.4mm</div>
                </div>
              </div>
              <p className="mt-1.5 text-micro text-dim-deep font-medium">
                Refusal Threshold: Engine automatically declines to release models below 0.93 IoU.
              </p>
            </div>
          </div>

          {/* Drawing <-> Model Divergence Card (Feature 8b) */}
          <div className="mt-4 rounded-md border border-vx-400/70 bg-white p-4 text-micro shadow-xs">
            <div className="flex items-center gap-2 font-semibold text-vx-900">
              <PulseOrb size="sm" />
              <span>DRAWING ↔ 3D MODEL DIVERGENCE DETECTION</span>
            </div>
            <p className="mt-1.5 text-vx-600">
              When toolmakers already hold 3D die models, Vertex projects the solid against the 2D print to catch silent drift.
              On Exalt part <code className="mono font-semibold text-vx-900">EAFCSL3601</code>, Vertex detected the reference model belly was
              <strong className="text-vx-900"> ~8mm shallower</strong> than the released print before re-tooling.
            </p>
          </div>

          {/* Core Principles & Exports */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mono rounded-xs border border-vx-400/80 bg-vx-100 px-2.5 py-1 text-micro font-medium text-vx-900">
              FORMATS: .STEP · .IGES · FREECAD TREE
            </span>
            <span className="mono rounded-xs border border-dim/50 bg-dim/10 px-2.5 py-1 text-micro font-medium text-dim-deep">
              B-REP SOLIDS ONLY · NO AI MESHES
            </span>
          </div>
        </div>

        {/* Right column: Interactive 3D CAD WebGL Viewport */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-lg border border-vx-600 bg-vx-900 shadow-2xl">
            {/* Viewport Header Bar */}
            <div className="flex items-center justify-between border-b border-vx-600/70 bg-vx-900/90 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <PulseOrb size="sm" />
                <span className="mono text-micro text-vx-100 font-medium">
                  CAD SOLID VIEWER · B-REP solid_eei3057_r2.step
                </span>
              </div>
              <div className="mono text-micro text-dim">
                OPENCASCADE KERNEL
              </div>
            </div>

            {/* WebGL Canvas Container */}
            <div
              ref={containerRef}
              className="relative h-[380px] w-full cursor-grab active:cursor-grabbing sm:h-[440px]"
              onMouseDown={() => setIsOrbiting(true)}
              onMouseUp={() => setIsOrbiting(false)}
              onTouchStart={() => setIsOrbiting(true)}
              onTouchEnd={() => setIsOrbiting(false)}
            >
              <canvas ref={canvasRef} className="h-full w-full outline-hidden" />

              {/* Viewport Corner CAD Annotations */}
              <div className="pointer-events-none absolute top-3 left-3 mono text-micro text-vx-400/80 select-none">
                <div>BOUNDS: 84.0 × 56.0 × 44.0 mm</div>
                <div>MATERIAL: AlSi10Mg Die-Cast</div>
                <div>SURFACE: 51,178 mm³ (Bit-Identical)</div>
              </div>

              {/* Interactive Help Watermark */}
              <div className="pointer-events-none absolute bottom-3 right-3 mono text-micro text-vx-400/70 select-none">
                CLICK &amp; DRAG TO ORBIT · SCROLL TO ZOOM
              </div>
            </div>

            {/* Interactive Control Deck */}
            <div className="border-t border-vx-600/70 bg-vx-800/90 p-4">
              <div className="grid gap-4 sm:grid-cols-12 sm:items-center">
                {/* View Angle Presets */}
                <div className="sm:col-span-6 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPresetView("iso")}
                    className={`rounded-xs px-2.5 py-1 mono text-micro font-medium transition-colors ${
                      activeView === "iso"
                        ? "border border-dim bg-dim/20 text-dim"
                        : "border border-vx-600 bg-vx-900/60 text-vx-400 hover:text-vx-100"
                    }`}
                  >
                    Isometric
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetView("front")}
                    className={`rounded-xs px-2.5 py-1 mono text-micro font-medium transition-colors ${
                      activeView === "front"
                        ? "border border-dim bg-dim/20 text-dim"
                        : "border border-vx-600 bg-vx-900/60 text-vx-400 hover:text-vx-100"
                    }`}
                  >
                    Front (0.971 IoU)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetView("top")}
                    className={`rounded-xs px-2.5 py-1 mono text-micro font-medium transition-colors ${
                      activeView === "top"
                        ? "border border-dim bg-dim/20 text-dim"
                        : "border border-vx-600 bg-vx-900/60 text-vx-400 hover:text-vx-100"
                    }`}
                  >
                    Top (0.991 IoU)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetView("section")}
                    className={`rounded-xs px-2.5 py-1 mono text-micro font-medium transition-colors ${
                      activeView === "section"
                        ? "border border-dim bg-dim/20 text-dim"
                        : "border border-vx-600 bg-vx-900/60 text-vx-400 hover:text-vx-100"
                    }`}
                  >
                    Section A-A
                  </button>
                </div>

                {/* Section Plane Cut Slider */}
                <div className="sm:col-span-6 flex items-center gap-3">
                  <span className="mono text-micro text-vx-400 whitespace-nowrap">
                    Section Plane:
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={slicePos}
                    onChange={handleSliceChange}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-vx-900 accent-dim"
                    aria-label="Section Plane Cut Slider"
                  />
                  <span className="mono text-micro font-semibold text-dim w-10 text-right">
                    {clipEnabled ? `${Math.round(slicePos * 100)}%` : "OFF"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
