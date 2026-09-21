"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PulseOrb } from "@/components/PulseOrb";

export function DraftingTableVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeView, setActiveView] = useState<"iso" | "front" | "top" | "section">("iso");
  const [isOrbiting, setIsOrbiting] = useState<boolean>(false);

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const solidGroupRef = useRef<THREE.Group | null>(null);
  const clipPlaneRef = useRef<THREE.Plane | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Initialize Three.js Scene for the 3D Solid Model
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(125, 90, 135);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));
    renderer.localClippingEnabled = true;
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxDistance = 350;
    controls.minDistance = 60;
    controls.enablePan = false;
    controlsRef.current = controls;

    // Studio CAD Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.3);
    dirLight1.position.set(160, 220, 120);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x778da9, 0.75);
    dirLight2.position.set(-160, -100, -100);
    scene.add(dirLight2);

    const rimLight = new THREE.DirectionalLight(0xf0a868, 0.5);
    rimLight.position.set(0, 160, -160);
    scene.add(rimLight);

    // Section Clipping Plane
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 100);
    clipPlaneRef.current = clipPlane;

    // Solid Group (Flanged Housing B-Rep Model)
    const solidGroup = new THREE.Group();
    solidGroupRef.current = solidGroup;
    scene.add(solidGroup);

    // Premium machined bead-blasted aluminum material
    const cadMaterial = new THREE.MeshStandardMaterial({
      color: 0xc4cdd8,
      metalness: 0.35,
      roughness: 0.28,
      clippingPlanes: [clipPlane],
      clipShadows: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x0d1b2a,
      linewidth: 1.5,
    });

    // 1. Outer Flange Rotor Disc
    const flangeGeo = new THREE.CylinderGeometry(50, 50, 11, 64);
    const flangeMesh = new THREE.Mesh(flangeGeo, cadMaterial);
    flangeMesh.position.set(0, -5.5, 0);
    solidGroup.add(flangeMesh);
    flangeMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(flangeGeo, 24), edgeMaterial));

    // 2. Raised Center Hub Boss
    const hubGeo = new THREE.CylinderGeometry(29, 29, 28, 64);
    const hubMesh = new THREE.Mesh(hubGeo, cadMaterial);
    hubMesh.position.set(0, 14, 0);
    solidGroup.add(hubMesh);
    hubMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(hubGeo, 24), edgeMaterial));

    // 3. Center Through-Bore Cutout
    const boreGeo = new THREE.CylinderGeometry(15, 15, 45, 48);
    const boreMat = new THREE.MeshStandardMaterial({
      color: 0x1b263b,
      roughness: 0.5,
      clippingPlanes: [clipPlane],
    });
    const boreMesh = new THREE.Mesh(boreGeo, boreMat);
    boreMesh.position.set(0, 8, 0);
    solidGroup.add(boreMesh);
    boreMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(boreGeo, 24), edgeMaterial));

    // 4. Circular Bolt Holes (8x along Pitch Circle)
    const holeGeo = new THREE.CylinderGeometry(3.75, 3.75, 13, 24);
    const holeMat = new THREE.MeshStandardMaterial({
      color: 0x14202e,
      roughness: 0.6,
      clippingPlanes: [clipPlane],
    });

    const pcdRadius = 40;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const hole = new THREE.Mesh(holeGeo, holeMat);
      hole.position.set(Math.cos(angle) * pcdRadius, -5.5, Math.sin(angle) * pcdRadius);
      solidGroup.add(hole);
      hole.add(new THREE.LineSegments(new THREE.EdgesGeometry(holeGeo, 20), edgeMaterial));
    }

    // Coordinate plane grid floor
    const grid = new THREE.GridHelper(140, 14, 0x415a77, 0x1b263b);
    grid.position.y = -12;
    if (!Array.isArray(grid.material)) {
      grid.material.opacity = 0.3;
      grid.material.transparent = true;
    }
    scene.add(grid);

    // Subtle idle rotation
    let idleAngle = 0;
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;

      if (!isOrbiting && activeView === "iso") {
        idleAngle += 0.0025;
        solidGroup.rotation.y = Math.sin(idleAngle) * 0.24;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);

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

  const setPresetView = (view: "iso" | "front" | "top" | "section") => {
    setActiveView(view);
    if (!cameraRef.current || !controlsRef.current || !solidGroupRef.current) return;

    solidGroupRef.current.rotation.set(0, 0, 0);

    if (view === "iso") {
      cameraRef.current.position.set(125, 90, 135);
      controlsRef.current.target.set(0, 4, 0);
      if (clipPlaneRef.current) clipPlaneRef.current.constant = 100;
    } else if (view === "front") {
      cameraRef.current.position.set(0, 8, 175);
      controlsRef.current.target.set(0, 4, 0);
      if (clipPlaneRef.current) clipPlaneRef.current.constant = 100;
    } else if (view === "top") {
      cameraRef.current.position.set(0, 175, 0);
      controlsRef.current.target.set(0, 0, 0);
      if (clipPlaneRef.current) clipPlaneRef.current.constant = 100;
    } else if (view === "section") {
      cameraRef.current.position.set(105, 32, 55);
      controlsRef.current.target.set(0, 4, 0);
      if (clipPlaneRef.current) clipPlaneRef.current.constant = 0; // centerline cut
    }
    controlsRef.current.update();
  };

  return (
    <div className="relative my-10 overflow-hidden rounded-lg border border-vx-400/80 bg-vx-100 p-4 shadow-xl sm:p-6 lg:p-8">
      {/* Top Telemetry Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-vx-400/40 pb-3">
        <div className="flex items-center gap-2.5">
          <PulseOrb size="sm" />
          <span className="mono text-micro font-medium uppercase tracking-wider text-vx-900">
            HERO VISUAL · 2D DRAFTING TABLE ⇄ 3D B-REP MODEL
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="mono text-micro text-vx-600">
            DRG-4120 FLANGE
          </span>
          <span className="rounded-xs bg-emerald-950/20 border border-emerald-600/40 px-2 py-0.5 mono text-micro font-bold text-emerald-800">
            BIT-IDENTICAL
          </span>
        </div>
      </div>

      {/* Main Hero Split Grid */}
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-4">
        {/* Left: 3D CAD Solid Viewport */}
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-md border border-vx-600 bg-vx-900 shadow-2xl">
            {/* Viewport Header */}
            <div className="flex items-center justify-between border-b border-vx-600/70 bg-vx-900/95 px-3.5 py-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="mono text-micro font-semibold text-vx-100">
                  3D CAD SOLID · PARAMETRIC
                </span>
              </div>
              <span className="mono text-micro text-dim">
                B-REP STEP
              </span>
            </div>

            {/* Three.js Canvas */}
            <div
              ref={containerRef}
              className="relative h-[320px] w-full cursor-grab active:cursor-grabbing sm:h-[380px]"
              onMouseDown={() => setIsOrbiting(true)}
              onMouseUp={() => setIsOrbiting(false)}
              onTouchStart={() => setIsOrbiting(true)}
              onTouchEnd={() => setIsOrbiting(false)}
            >
              <canvas ref={canvasRef} className="h-full w-full outline-hidden" />

              {/* Viewport Technical Annotations */}
              <div className="pointer-events-none absolute top-3 left-3 mono text-micro text-vx-400/85 select-none leading-relaxed">
                <div>Ø160.0 × 39.0 mm FLANGE</div>
                <div>8× Ø11.0 THRU ON PCD Ø130.0</div>
                <div>CONSTRAINED FEATURE TREE</div>
              </div>

              <div className="pointer-events-none absolute bottom-3 right-3 mono text-micro text-vx-400/60 select-none">
                CLICK &amp; DRAG TO ORBIT
              </div>
            </div>

            {/* View Presets Bar */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 border-t border-vx-600/70 bg-vx-800/90 px-3 py-2">
              <span className="mono text-micro text-vx-400">View Angle:</span>
              <div className="flex gap-1">
                {(["iso", "front", "top", "section"] as const).map((view) => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => setPresetView(view)}
                    className={`rounded-xs px-2.5 py-0.5 mono text-micro font-medium transition-colors ${
                      activeView === view
                        ? "border border-dim bg-dim/20 text-dim"
                        : "border border-vx-600 bg-vx-900/60 text-vx-400 hover:text-vx-100"
                    }`}
                  >
                    {view.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center: 2D ⇄ 3D Flow Connector */}
        <div className="flex flex-col items-center justify-center lg:col-span-2 py-2">
          {/* Desktop horizontal flow */}
          <div className="hidden lg:flex flex-col items-center gap-2.5">
            <span className="mono text-micro font-bold text-vx-900 tracking-wider">
              2D ⇄ 3D
            </span>
            <div className="relative flex items-center justify-center w-32">
              <div className="h-[2px] w-full bg-gradient-to-r from-vx-600 via-dim to-vx-600" />
              <div className="absolute -left-1 text-dim font-bold text-sm">◀</div>
              <div className="absolute -right-1 text-dim font-bold text-sm">▶</div>
              <div className="absolute h-3 w-3 rounded-full bg-dim animate-ping opacity-70" />
            </div>
            <span className="mono text-micro text-dim-deep font-semibold">
              Reconstructed in seconds
            </span>
            <span className="mono text-[10px] text-vx-600 text-center leading-tight">
              Exact B-rep geometry
            </span>
          </div>

          {/* Mobile vertical flow */}
          <div className="flex lg:hidden items-center justify-center gap-3 py-2">
            <div className="h-[1px] w-12 bg-vx-400" />
            <span className="mono text-micro font-semibold text-vx-900">
              ▲ 3D SOLID ⇄ 2D DRAWING ▼
            </span>
            <div className="h-[1px] w-12 bg-vx-400" />
          </div>
        </div>

        {/* Right: Architectural Drafting Table with 2D Engineering Sheet & Moving T-Square */}
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-md border border-vx-600 bg-vx-900 p-2 shadow-2xl">
            {/* Viewport Header */}
            <div className="mb-2 flex items-center justify-between border-b border-vx-600/70 px-2 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-dim" />
                <span className="mono text-micro font-semibold text-vx-100">
                  DRAFTING TABLE · 2D PRINT
                </span>
              </div>
              <span className="mono text-micro text-vx-400">
                DRG-4120 · SHEET 1
              </span>
            </div>

            {/* Drafting Table Illustration Container */}
            <div className="relative h-[320px] w-full overflow-hidden rounded-xs bg-[#0b1624] sm:h-[380px] select-none">
              {/* Detailed Technical Blueprint Drafting Table SVG */}
              <svg
                viewBox="0 0 580 440"
                className="pointer-events-none absolute inset-0 h-full w-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Blueprint Background Grid */}
                <defs>
                  <pattern id="table-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#132438" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="580" height="440" fill="url(#table-grid)" />

                {/* ── Drafting Workbench Stand Underneath ── */}
                {/* Floor Shadow */}
                <ellipse cx="290" cy="425" rx="230" ry="8" fill="#040a12" opacity="0.8" />

                {/* Heavy Cast-Iron Base Feet & Levelers */}
                <path d="M70 415 L140 415 L125 390 L85 390 Z" fill="#1b263b" stroke="#415a77" strokeWidth="1.5" />
                <path d="M440 415 L510 415 L495 390 L455 390 Z" fill="#1b263b" stroke="#415a77" strokeWidth="1.5" />
                <rect x="90" y="415" width="30" height="6" rx="1" fill="#778da9" />
                <rect x="460" y="415" width="30" height="6" rx="1" fill="#778da9" />

                {/* Slotted Telescoping Elevation Uprights */}
                <path d="M105 390 L135 270" stroke="#415a77" strokeWidth="8" strokeLinecap="round" />
                <path d="M475 390 L445 270" stroke="#415a77" strokeWidth="8" strokeLinecap="round" />
                {/* Height calibration ticks on uprights */}
                <line x1="112" y1="360" x2="120" y2="360" stroke="#778da9" strokeWidth="1.5" />
                <line x1="117" y1="340" x2="125" y2="340" stroke="#778da9" strokeWidth="1.5" />
                <line x1="122" y1="320" x2="130" y2="320" stroke="#778da9" strokeWidth="1.5" />
                <line x1="468" y1="360" x2="460" y2="360" stroke="#778da9" strokeWidth="1.5" />
                <line x1="463" y1="340" x2="455" y2="340" stroke="#778da9" strokeWidth="1.5" />
                <line x1="458" y1="320" x2="450" y2="320" stroke="#778da9" strokeWidth="1.5" />

                {/* Lower Cross Stretcher & Foot Pedal Bar */}
                <rect x="110" y="375" width="360" height="8" rx="2" fill="#1b263b" stroke="#415a77" strokeWidth="1" />
                <rect x="190" y="380" width="200" height="4" rx="1" fill="#778da9" />

                {/* Draughtsman Tool Shelf */}
                <rect x="145" y="295" width="290" height="18" rx="2" fill="#142132" stroke="#415a77" strokeWidth="1.5" />
                {/* Drafting Pencil */}
                <line x1="165" y1="304" x2="225" y2="304" stroke="#f0a868" strokeWidth="3" strokeLinecap="round" />
                <polygon points="160,304 165,302 165,306" fill="#e0e1dd" />
                {/* Compass / Divider */}
                <path d="M245 310 L260 298 L275 310" stroke="#778da9" strokeWidth="1.5" fill="none" />
                <circle cx="260" cy="298" r="2.5" fill="#f0a868" />
                {/* 45° Acrylic Set-Square Triangle */}
                <polygon points="295,310 335,310 335,295" fill="rgba(224, 225, 221, 0.2)" stroke="#778da9" strokeWidth="1" />
                <polygon points="305,308 328,308 328,299" fill="#0b1624" />
                {/* Eraser */}
                <rect x="350" y="300" width="26" height="10" rx="1" fill="#e0e1dd" stroke="#415a77" strokeWidth="1" />

                {/* Board Tilt Mechanism & Large Adjustment Handwheel on Right */}
                <circle cx="530" cy="180" r="16" fill="#1b263b" stroke="#778da9" strokeWidth="2" />
                <circle cx="530" cy="180" r="6" fill="#778da9" />
                {/* Handwheel Crank Handle */}
                <path d="M530 180 L545 155" stroke="#778da9" strokeWidth="3" strokeLinecap="round" />
                <circle cx="545" cy="155" r="4" fill="#f0a868" />

                {/* Dual Locking Knobs on Left & Right */}
                <circle cx="45" cy="180" r="10" fill="#243447" stroke="#778da9" strokeWidth="1.5" />
                <circle cx="45" cy="180" r="4" fill="#778da9" />
                <circle cx="525" cy="180" r="10" fill="#243447" stroke="#778da9" strokeWidth="1.5" />

                {/* ── Main Tilted Drafting Board Surface ── */}
                <rect x="42" y="20" width="485" height="280" rx="6" fill="#142132" stroke="#415a77" strokeWidth="2" />
                {/* Board Left Guide Edge (Precision Track for T-square) */}
                <line x1="45" y1="22" x2="45" y2="298" stroke="#778da9" strokeWidth="2.5" />
                {/* Board Inner Recess */}
                <rect x="50" y="26" width="470" height="268" rx="4" fill="#0d1b2a" stroke="#22364c" strokeWidth="1" />

                {/* Parallel Motion Wire Guide Pulleys in Top Corners */}
                <circle cx="58" cy="34" r="5" fill="#415a77" stroke="#778da9" strokeWidth="1" />
                <circle cx="512" cy="34" r="5" fill="#415a77" stroke="#778da9" strokeWidth="1" />
                <line x1="58" y1="34" x2="512" y2="34" stroke="#415a77" strokeWidth="0.75" strokeDasharray="3 2" />

                {/* ── The 2D Engineering Drawing Sheet (DRG-4120) ── */}
                <g id="engineering-sheet">
                  {/* Sheet Canvas with Blue Material */}
                  <rect x="68" y="40" width="434" height="240" rx="2" fill="#172436" stroke="#415a77" strokeWidth="1.5" />
                  
                  {/* Drafting Tape Corners */}
                  <polygon points="68,52 80,40 68,40" fill="#778da9" opacity="0.7" />
                  <polygon points="490,40 502,52 502,40" fill="#778da9" opacity="0.7" />
                  <polygon points="68,268 80,280 68,280" fill="#778da9" opacity="0.7" />
                  <polygon points="490,280 502,268 502,280" fill="#778da9" opacity="0.7" />

                  {/* Standard Drawing Frame & Zone Grids */}
                  <rect x="75" y="46" width="420" height="228" fill="none" stroke="#e0e1dd" strokeWidth="1.2" />
                  <rect x="79" y="50" width="412" height="220" fill="none" stroke="#415a77" strokeWidth="0.75" />

                  {/* ── View 1: Top / Plan View (Flange & Bolt Circles) ── */}
                  <g transform="translate(175, 142)">
                    {/* Centrelines */}
                    <line x1="-62" y1="0" x2="62" y2="0" stroke="#778da9" strokeWidth="0.75" strokeDasharray="16 3 3 3" />
                    <line x1="0" y1="-62" x2="0" y2="62" stroke="#778da9" strokeWidth="0.75" strokeDasharray="16 3 3 3" />

                    {/* Outer Flange Circle Ø160 */}
                    <circle cx="0" cy="0" r="52" stroke="#e0e1dd" strokeWidth="1.5" />
                    {/* PCD Circle Ø130 */}
                    <circle cx="0" cy="0" r="40" stroke="#f0a868" strokeWidth="0.8" strokeDasharray="4 3" />
                    {/* Hub Circle Ø70 */}
                    <circle cx="0" cy="0" r="29" stroke="#e0e1dd" strokeWidth="1.2" />
                    {/* Center Bore Ø40 */}
                    <circle cx="0" cy="0" r="15" stroke="#e0e1dd" strokeWidth="1.2" />

                    {/* 8 Bolt Holes */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                      const rad = (deg * Math.PI) / 180;
                      const bx = Math.cos(rad) * 40;
                      const by = Math.sin(rad) * 40;
                      return <circle key={deg} cx={bx} cy={by} r="3.75" stroke="#e0e1dd" strokeWidth="1" fill="#172436" />;
                    })}

                    <text x="-52" y="-44" fill="#f0a868" fontSize="8.5" fontFamily="var(--font-mono)" fontWeight="600">
                      PCD Ø130.0
                    </text>
                    <text x="0" y="58" fill="#778da9" fontSize="7.5" fontFamily="var(--font-mono)" textAnchor="middle">
                      TOP VIEW (PLAN)
                    </text>
                  </g>

                  {/* ── View 2: Section A-A (Elevation & Hatching) ── */}
                  <g transform="translate(365, 142)">
                    {/* Centerline */}
                    <line x1="0" y1="-60" x2="0" y2="60" stroke="#778da9" strokeWidth="0.75" strokeDasharray="16 3 3 3" />

                    {/* Flange Body Base */}
                    <rect x="-52" y="-12" width="104" height="24" stroke="#e0e1dd" strokeWidth="1.5" fill="none" />
                    {/* Raised Hub */}
                    <rect x="-29" y="-40" width="58" height="28" stroke="#e0e1dd" strokeWidth="1.2" fill="none" />
                    {/* Bore Cutout Through-Hole */}
                    <rect x="-15" y="-40" width="30" height="52" stroke="#778da9" strokeWidth="1" strokeDasharray="3 2" fill="none" />

                    {/* Section Hatching Lines */}
                    <line x1="-48" y1="12" x2="-36" y2="-12" stroke="#e0e1dd" strokeWidth="0.75" opacity="0.6" />
                    <line x1="-40" y1="12" x2="-28" y2="-12" stroke="#e0e1dd" strokeWidth="0.75" opacity="0.6" />
                    <line x1="28" y1="12" x2="40" y2="-12" stroke="#e0e1dd" strokeWidth="0.75" opacity="0.6" />
                    <line x1="36" y1="12" x2="48" y2="-12" stroke="#e0e1dd" strokeWidth="0.75" opacity="0.6" />

                    {/* Dimension Line Ø160 */}
                    <line x1="-52" y1="20" x2="52" y2="20" stroke="#f0a868" strokeWidth="0.8" />
                    <text x="0" y="29" fill="#f0a868" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle">
                      Ø160.0 mm
                    </text>
                    <text x="0" y="58" fill="#778da9" fontSize="7.5" fontFamily="var(--font-mono)" textAnchor="middle">
                      SECTION A-A
                    </text>
                  </g>

                  {/* ── Anonymised Title Block ── */}
                  <g transform="translate(325, 218)">
                    <rect x="0" y="0" width="162" height="48" fill="#101a26" stroke="#e0e1dd" strokeWidth="1" />
                    <line x1="0" y1="16" x2="162" y2="16" stroke="#415a77" strokeWidth="0.75" />
                    <line x1="0" y1="32" x2="162" y2="32" stroke="#415a77" strokeWidth="0.75" />
                    <line x1="90" y1="0" x2="90" y2="32" stroke="#415a77" strokeWidth="0.75" />

                    {/* Redaction Bars */}
                    <rect x="8" y="5" width="72" height="7" fill="#415a77" rx="1" />
                    <rect x="8" y="21" width="58" height="6" fill="#415a77" rx="1" />
                    
                    <text x="96" y="12" fill="#e0e1dd" fontSize="7.5" fontFamily="var(--font-mono)">
                      REV 04 · PASS
                    </text>
                    <text x="96" y="26" fill="#778da9" fontSize="7" fontFamily="var(--font-mono)">
                      TOL ±0.05 mm
                    </text>
                    <text x="8" y="42" fill="#e0e1dd" fontSize="8.5" fontFamily="var(--font-mono)" fontWeight="700">
                      DRG-4120 FLANGE
                    </text>
                  </g>
                </g>
              </svg>

              {/* ── The Animated Moving T-Square ── */}
              <div
                className="pointer-events-none absolute left-0 w-full animate-t-square"
                style={{
                  top: "0px",
                }}
              >
                <div className="relative flex items-center">
                  {/* T-Square Head (Sliding vertically against the left edge of the board) */}
                  <div
                    className="relative z-20 flex h-28 w-7 flex-col items-center justify-between rounded-xs border border-vx-900 bg-[#283748] py-2.5 shadow-2xl"
                    style={{
                      boxShadow: "3px 0 8px rgba(0,0,0,0.7)",
                    }}
                  >
                    {/* Brass Rivet Fasteners */}
                    <div className="h-1.5 w-1.5 rounded-full bg-[#f0a868] border border-black/50" />
                    <div className="h-1.5 w-1.5 rounded-full bg-[#f0a868] border border-black/50" />
                    <div className="h-1.5 w-1.5 rounded-full bg-[#f0a868] border border-black/50" />
                  </div>

                  {/* T-Square Blade (Precision transparent acrylic ruler across the drawing) */}
                  <div
                    className="relative z-10 -ml-1 h-9 w-[495px] rounded-r-xs border-y border-r border-[#778da9]/80 bg-gradient-to-b from-white/30 via-white/15 to-white/5 backdrop-blur-[2px]"
                    style={{
                      boxShadow: "0 6px 12px rgba(0,0,0,0.5)",
                    }}
                  >
                    {/* Millimeter Graduation Marks along top edge */}
                    <div className="flex h-3.5 w-full items-end justify-between px-2.5 opacity-90">
                      {Array.from({ length: 42 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="bg-vx-900"
                          style={{
                            width: "1px",
                            height: idx % 5 === 0 ? "9px" : "4.5px",
                          }}
                        />
                      ))}
                    </div>

                    {/* Scale Nomenclature */}
                    <div className="flex items-center justify-between px-3 pt-0.5">
                      <span className="mono text-[8.5px] font-bold text-vx-900 opacity-95 tracking-widest select-none">
                        DRAUGHTSMAN T-SQUARE · 600mm
                      </span>
                      <span className="mono text-[8px] font-mono font-semibold text-vx-900 opacity-80">
                        VERTEX CAD SYSTEM
                      </span>
                    </div>

                    {/* Bevelled Acrylic Guide Edge */}
                    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#f0a868]/90" />
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Footer Note */}
            <div className="mt-2 flex items-center justify-between px-1 text-micro text-vx-400">
              <span>ANONYMISED TITLE BLOCK</span>
              <span className="text-dim">AUTOMATIC T-SQUARE TRACE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded CSS for the moving T-square animation */}
      <style>{`
        @keyframes tSquareGlide {
          0% {
            transform: translateY(24px);
          }
          30% {
            transform: translateY(180px);
          }
          50% {
            transform: translateY(225px);
          }
          75% {
            transform: translateY(90px);
          }
          100% {
            transform: translateY(24px);
          }
        }
        .animate-t-square {
          animation: tSquareGlide 9s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
