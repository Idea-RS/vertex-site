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

    // Premium machined bead-blasted aluminum material (rich slate-steel for light canvas contrast)
    const cadMaterial = new THREE.MeshStandardMaterial({
      color: 0x5a6d85,
      metalness: 0.35,
      roughness: 0.3,
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
      color: 0x1b2838,
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
    const grid = new THREE.GridHelper(140, 14, 0x778da9, 0xa3b8cc);
    grid.position.y = -12;
    if (!Array.isArray(grid.material)) {
      grid.material.opacity = 0.35;
      grid.material.transparent = true;
    }
    scene.add(grid);

    // Subtle ambient dust float animation
    let tick = 0;
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;

      tick += 0.01;
      if (solidGroupRef.current) {
        // Very gentle idle sway
        solidGroupRef.current.position.y = Math.sin(tick) * 0.75;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // IntersectionObserver to pause rendering when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
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
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
    };
  }, []);

  // Preset Views Handler
  const setPresetView = (view: "iso" | "front" | "top" | "section") => {
    setActiveView(view);
    if (!cameraRef.current || !controlsRef.current) return;

    if (view === "iso") {
      cameraRef.current.position.set(130, 95, 140);
      controlsRef.current.target.set(0, 4, 0);
      if (clipPlaneRef.current) clipPlaneRef.current.constant = 100;
    } else if (view === "front") {
      cameraRef.current.position.set(0, 10, 190);
      controlsRef.current.target.set(0, 4, 0);
      if (clipPlaneRef.current) clipPlaneRef.current.constant = 100;
    } else if (view === "top") {
      cameraRef.current.position.set(0, 190, 0.1);
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
    <div className="my-10 lg:my-14">
      {/* Main Hero Split Grid - Free-standing directly on page canvas without containers */}
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
        {/* Left: 3D CAD Solid - Free-standing on page */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative">
            {/* Canvas Container */}
            <div
              ref={containerRef}
              className="relative h-[360px] w-full cursor-grab active:cursor-grabbing sm:h-[430px] select-none"
              onMouseDown={() => setIsOrbiting(true)}
              onMouseUp={() => setIsOrbiting(false)}
              onTouchStart={() => setIsOrbiting(true)}
              onTouchEnd={() => setIsOrbiting(false)}
            >
              {/* Soft Ground Contact Shadow */}
              <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-8 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(13,27,42,0.18)_0%,_transparent_75%)] blur-sm" />

              <canvas ref={canvasRef} className="h-full w-full outline-hidden" />

              {/* Viewport Technical Annotations floating freely */}
              <div className="pointer-events-none absolute top-1 left-1 mono text-micro text-vx-800 select-none leading-relaxed">
                <div className="flex items-center gap-1.5 font-semibold text-vx-900">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>3D CAD SOLID · PARAMETRIC</span>
                </div>
                <div className="text-[11px] text-vx-600">Ø160.0 × 39.0 mm FLANGE</div>
                <div className="text-[11px] text-vx-600">8× Ø11.0 THRU ON PCD Ø130.0</div>
              </div>

              <div className="pointer-events-none absolute bottom-1 right-1 mono text-[10px] text-vx-600/80 select-none">
                CLICK &amp; DRAG TO ORBIT · SCROLL TO ZOOM
              </div>
            </div>

            {/* Minimalist Floating View Presets Pills */}
            <div className="mt-2 flex items-center justify-between px-1">
              <div className="flex items-center gap-1 mono text-micro text-vx-600">
                <span className="mr-1">VIEW:</span>
                {(["iso", "front", "top", "section"] as const).map((view) => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => setPresetView(view)}
                    className={`rounded-xs px-2.5 py-0.5 mono text-micro font-medium transition-colors ${
                      activeView === view
                        ? "bg-vx-900 text-vx-100 shadow-xs"
                        : "bg-white/80 hover:bg-white text-vx-700 border border-vx-400/50"
                    }`}
                  >
                    {view.toUpperCase()}
                  </button>
                ))}
              </div>
              <span className="mono text-micro text-dim-deep font-semibold">
                B-REP STEP
              </span>
            </div>
          </div>
          {/* 3D Model Footer Note */}
          <div className="mt-2 flex items-center justify-between px-1 text-micro text-vx-600 mono">
            <span>OPEN CASCADE B-REP SOLID</span>
            <span className="text-dim-deep font-medium">BIT-IDENTICAL CAD MODEL</span>
          </div>
        </div>

        {/* Center: 2D ⇄ 3D Flow Connector */}
        <div className="flex flex-col items-center justify-center lg:col-span-2 py-4">
          {/* Desktop horizontal flow */}
          <div className="hidden lg:flex flex-col items-center gap-2.5">
            <span className="mono text-micro font-bold text-vx-900 tracking-wider">
              2D ⇄ 3D
            </span>
            <div className="relative flex items-center justify-center w-32">
              <div className="h-[2px] w-full bg-gradient-to-r from-vx-400 via-dim-deep to-vx-400" />
              <div className="absolute -left-1 text-dim-deep font-bold text-sm">◀</div>
              <div className="absolute -right-1 text-dim-deep font-bold text-sm">▶</div>
              <div className="absolute h-3 w-3 rounded-full bg-dim animate-ping opacity-60" />
            </div>
            <span className="mono text-micro text-dim-deep font-semibold">
              Reconstructed in seconds
            </span>
            <span className="mono text-[10px] text-vx-600 text-center leading-tight">
              Exact B-rep geometry
            </span>
          </div>

          {/* Mobile vertical flow */}
          <div className="flex lg:hidden items-center justify-center gap-3 py-3">
            <div className="h-[1px] w-12 bg-vx-400" />
            <span className="mono text-micro font-semibold text-vx-900">
              ▲ 3D SOLID ⇄ 2D DRAWING ▼
            </span>
            <div className="h-[1px] w-12 bg-vx-400" />
          </div>
        </div>

        {/* Right: Full Top-Down Architectural Drafting Board with Taped Blueprint & Moving T-Square - Free-standing on page */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative">
            {/* Full Top-Down Drafting Table Board Surface */}
            <div className="relative h-[360px] w-full overflow-hidden sm:h-[430px] select-none">
              {/* Top-Down Drafting Table SVG */}
              <svg
                viewBox="0 0 760 520"
                className="pointer-events-none absolute inset-0 h-full w-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Subtle 20mm drafting grid */}
                  <pattern id="board-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#132438" strokeWidth="0.6" />
                  </pattern>

                  {/* 45° Section Hatching pattern */}
                  <pattern id="section-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#e0e1dd" strokeWidth="0.8" opacity="0.65" />
                  </pattern>

                  {/* Sheet realistic drop shadow */}
                  <filter id="sheet-drop-shadow" x="-5%" y="-5%" width="115%" height="115%">
                    <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0d1b2a" floodOpacity="0.25" />
                  </filter>

                  {/* Masking tape texture filter */}
                  <filter id="tape-shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#0d1b2a" floodOpacity="0.3" />
                  </filter>

                  {/* T-Square blade drop shadow */}
                  <filter id="blade-shadow" x="-5%" y="-20%" width="110%" height="200%">
                    <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#000000" floodOpacity="0.6" />
                  </filter>
                </defs>

                {/* ── 0. Physical Drafting Board Vinyl Mat Surface ── */}
                <rect x="0" y="0" width="760" height="520" rx="4" fill="#0d1b2a" stroke="#415a77" strokeWidth="1" />
                <rect x="44" y="24" width="716" height="472" fill="url(#board-grid)" />

                {/* ── 1. Top Precision Aluminum Metric Ruler Bar ── */}
                <rect x="54" y="6" width="670" height="20" rx="1" fill="#142232" stroke="#415a77" strokeWidth="1" />
                {Array.from({ length: 34 }).map((_, i) => (
                  <g key={`top-tick-${i}`}>
                    <line
                      x1={64 + i * 19.5}
                      y1={26}
                      x2={64 + i * 19.5}
                      y2={i % 5 === 0 ? 14 : 20}
                      stroke="#778da9"
                      strokeWidth={i % 5 === 0 ? 1.2 : 0.75}
                    />
                    {i % 5 === 0 && (
                      <text
                        x={64 + i * 19.5}
                        y={12}
                        fill="#778da9"
                        fontSize="6.5"
                        fontFamily="var(--font-mono)"
                        textAnchor="middle"
                      >
                        {i * 10}
                      </text>
                    )}
                  </g>
                ))}

                {/* ── 3. Left Board Edge with Steel Guide Rail (for T-Square) ── */}
                <rect x="0" y="0" width="44" height="520" fill="#182330" stroke="#415a77" strokeWidth="1" />
                {/* Precision Polished Steel Guide Rod */}
                <line x1="22" y1="4" x2="22" y2="516" stroke="#778da9" strokeWidth="3" strokeLinecap="round" />
                <line x1="21" y1="4" x2="21" y2="516" stroke="#e0e1dd" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                {/* Brass End Stop Bumpers */}
                <circle cx="22" cy="12" r="5" fill="#f0a868" stroke="#0d1b2a" strokeWidth="1" />
                <circle cx="22" cy="508" r="5" fill="#f0a868" stroke="#0d1b2a" strokeWidth="1" />
                {/* Vertical Ruler Graduations along edge */}
                {Array.from({ length: 26 }).map((_, i) => (
                  <line
                    key={`vert-tick-${i}`}
                    x1={44}
                    y1={24 + i * 19}
                    x2={i % 5 === 0 ? 34 : 39}
                    stroke="#778da9"
                    strokeWidth={i % 5 === 0 ? 1.2 : 0.75}
                  />
                ))}

                {/* Parallel Motion Wire Cable in Top & Bottom corners */}
                <circle cx="54" cy="34" r="4" fill="#f0a868" stroke="#415a77" strokeWidth="1" />
                <circle cx="746" cy="34" r="4" fill="#f0a868" stroke="#415a77" strokeWidth="1" />
                <line x1="54" y1="34" x2="746" y2="34" stroke="#415a77" strokeWidth="0.75" strokeDasharray="3 2" />

                {/* ── 4. The 2D Engineering Blueprint Sheet (DRG-4120) ── */}
                <g id="blueprint-drawing-sheet" filter="url(#tape-shadow)">
                  {/* Blueprint Sheet Background */}
                  <rect x="74" y="44" width="650" height="434" rx="2" fill="#142134" stroke="#415a77" strokeWidth="1.5" />
                  
                  {/* Inner Border Frame */}
                  <rect x="84" y="52" width="630" height="418" fill="none" stroke="#e0e1dd" strokeWidth="1.4" />
                  <rect x="88" y="56" width="622" height="410" fill="none" stroke="#415a77" strokeWidth="0.75" />

                  {/* Coordinate Zones (A, B, C, D and 1..6) */}
                  <g fill="#778da9" fontSize="7" fontFamily="var(--font-mono)">
                    <text x="180" y="50" textAnchor="middle">1</text>
                    <text x="290" y="50" textAnchor="middle">2</text>
                    <text x="400" y="50" textAnchor="middle">3</text>
                    <text x="510" y="50" textAnchor="middle">4</text>
                    <text x="620" y="50" textAnchor="middle">5</text>

                    <text x="80" y="140">A</text>
                    <text x="80" y="240">B</text>
                    <text x="80" y="340">C</text>
                    <text x="80" y="420">D</text>
                  </g>

                  {/* Sheet Header Linework */}
                  <text x="96" y="68" fill="#778da9" fontSize="7.5" fontFamily="var(--font-mono)" letterSpacing="0.08em">
                    VERTEX FLIP ENGINE · B-REP KERNEL RECONSTRUCTION · ASME Y14.5
                  </text>
                  <line x1="88" y1="72" x2="710" y2="72" stroke="#415a77" strokeWidth="0.75" />

                  {/* Third-Angle Projection Symbol in Upper Right */}
                  <g transform="translate(680, 64)">
                    <circle cx="-32" cy="0" r="4.5" stroke="#778da9" strokeWidth="0.75" fill="none" />
                    <circle cx="-32" cy="0" r="2" stroke="#778da9" strokeWidth="0.75" fill="none" />
                    <line x1="-40" y1="0" x2="-24" y2="0" stroke="#778da9" strokeWidth="0.5" strokeDasharray="3 1" />
                    <polygon points="-16,-4 -4,-2 -4,2 -16,4" stroke="#778da9" strokeWidth="0.75" fill="none" />
                    <line x1="-20" y1="0" x2="0" y2="0" stroke="#778da9" strokeWidth="0.5" strokeDasharray="3 1" />
                  </g>

                  {/* ── VIEW 1: Section A-A (Elevation & Hatching) ── */}
                  <g transform="translate(235, 220)">
                    {/* View Centerlines */}
                    <line x1="0" y1="-95" x2="0" y2="95" stroke="#778da9" strokeWidth="0.75" strokeDasharray="18 3 3 3" />

                    {/* Outer Flange Base (solid outline) */}
                    <rect x="-85" y="-14" width="170" height="28" stroke="#e0e1dd" strokeWidth="1.6" fill="none" />
                    
                    {/* Section Hatching in Flange Wings */}
                    <rect x="-85" y="-14" width="46" height="28" fill="url(#section-hatch)" stroke="#e0e1dd" strokeWidth="1.4" />
                    <rect x="39" y="-14" width="46" height="28" fill="url(#section-hatch)" stroke="#e0e1dd" strokeWidth="1.4" />

                    {/* Center Raised Hub Boss */}
                    <rect x="-39" y="-56" width="78" height="42" stroke="#e0e1dd" strokeWidth="1.6" fill="none" />
                    <rect x="-39" y="-56" width="18" height="42" fill="url(#section-hatch)" stroke="#e0e1dd" strokeWidth="1.4" />
                    <rect x="21" y="-56" width="18" height="42" fill="url(#section-hatch)" stroke="#e0e1dd" strokeWidth="1.4" />

                    {/* Center Bore Hole (dashed through line) */}
                    <rect x="-21" y="-56" width="42" height="70" stroke="#778da9" strokeWidth="1" strokeDasharray="4 2" fill="#0e1b2a" opacity="0.8" />

                    {/* Drilled Bolt Holes in Section */}
                    <rect x="-72" y="-14" width="12" height="28" stroke="#778da9" strokeWidth="0.9" strokeDasharray="3 2" fill="#0e1b2a" opacity="0.8" />
                    <rect x="60" y="-14" width="12" height="28" stroke="#778da9" strokeWidth="0.9" strokeDasharray="3 2" fill="#0e1b2a" opacity="0.8" />

                    {/* Dimension: Total Height 39.0mm */}
                    <line x1="98" y1="-56" x2="98" y2="14" stroke="#f0a868" strokeWidth="0.9" />
                    <line x1="92" y1="-56" x2="104" y2="-56" stroke="#f0a868" strokeWidth="0.9" />
                    <line x1="92" y1="14" x2="104" y2="14" stroke="#f0a868" strokeWidth="0.9" />
                    <polygon points="98,-56 96,-48 100,-48" fill="#f0a868" />
                    <polygon points="98,14 96,6 100,6" fill="#f0a868" />
                    <text x="110" y="-18" fill="#f0a868" fontSize="9" fontFamily="var(--font-mono)" fontWeight="600">
                      39.0 mm
                    </text>

                    {/* Dimension: Flange Thickness 11.0mm */}
                    <line x1="-98" y1="-14" x2="-98" y2="14" stroke="#f0a868" strokeWidth="0.9" />
                    <line x1="-104" y1="-14" x2="-92" y2="-14" stroke="#f0a868" strokeWidth="0.9" />
                    <line x1="-104" y1="14" x2="-92" y2="14" stroke="#f0a868" strokeWidth="0.9" />
                    <text x="-128" y="3" fill="#f0a868" fontSize="8" fontFamily="var(--font-mono)">
                      11.0
                    </text>

                    {/* Dimension: Hub Diameter Ø70.0mm */}
                    <line x1="-39" y1="-68" x2="39" y2="-68" stroke="#f0a868" strokeWidth="0.9" />
                    <line x1="-39" y1="-62" x2="-39" y2="-74" stroke="#f0a868" strokeWidth="0.9" />
                    <line x1="39" y1="-62" x2="39" y2="-74" stroke="#f0a868" strokeWidth="0.9" />
                    <polygon points="-39,-68 -31,-70 -31,-66" fill="#f0a868" />
                    <polygon points="39,-68 31,-70 31,-66" fill="#f0a868" />
                    <text x="0" y="-74" fill="#f0a868" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle">
                      Ø70.0 mm
                    </text>

                    {/* Dimension: Flange Diameter Ø160.0mm */}
                    <line x1="-85" y1="30" x2="85" y2="30" stroke="#f0a868" strokeWidth="0.9" />
                    <line x1="-85" y1="24" x2="-85" y2="36" stroke="#f0a868" strokeWidth="0.9" />
                    <line x1="85" y1="24" x2="85" y2="36" stroke="#f0a868" strokeWidth="0.9" />
                    <polygon points="-85,30 -77,28 -77,32" fill="#f0a868" />
                    <polygon points="85,30 77,28 77,32" fill="#f0a868" />
                    <text x="0" y="42" fill="#f0a868" fontSize="9.5" fontFamily="var(--font-mono)" fontWeight="600" textAnchor="middle">
                      Ø160.00 ±0.05
                    </text>

                    {/* View Caption */}
                    <text x="0" y="70" fill="#e0e1dd" fontSize="9" fontFamily="var(--font-mono)" fontWeight="600" textAnchor="middle">
                      SECTION A-A
                    </text>
                    <text x="0" y="82" fill="#778da9" fontSize="7.5" fontFamily="var(--font-mono)" textAnchor="middle">
                      SCALE 1:1 · FULL PENETRATION
                    </text>
                  </g>

                  {/* ── VIEW 2: Top / Plan View (Bolt Circle & PCD) ── */}
                  <g transform="translate(525, 215)">
                    {/* View Centerlines */}
                    <line x1="-95" y1="0" x2="95" y2="0" stroke="#778da9" strokeWidth="0.75" strokeDasharray="18 3 3 3" />
                    <line x1="0" y1="-95" x2="0" y2="95" stroke="#778da9" strokeWidth="0.75" strokeDasharray="18 3 3 3" />

                    {/* Outer Flange Diameter Ø160.0 */}
                    <circle cx="0" cy="0" r="72" stroke="#e0e1dd" strokeWidth="1.8" fill="none" />

                    {/* Pitch Circle Diameter Ø130.0 (Dashed Amber) */}
                    <circle cx="0" cy="0" r="56" stroke="#f0a868" strokeWidth="1" strokeDasharray="5 3" fill="none" />

                    {/* Raised Hub Outline Ø70.0 */}
                    <circle cx="0" cy="0" r="34" stroke="#e0e1dd" strokeWidth="1.4" fill="none" />

                    {/* Center Bore Cutout Ø40.0 */}
                    <circle cx="0" cy="0" r="18" stroke="#e0e1dd" strokeWidth="1.4" fill="#0d1b2a" />

                    {/* 8× Drilled Through-Holes on PCD */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                      const rad = (deg * Math.PI) / 180;
                      const hx = Math.cos(rad) * 56;
                      const hy = Math.sin(rad) * 56;
                      return (
                        <g key={`hole-${deg}`}>
                          <circle cx={hx} cy={hy} r="5" stroke="#e0e1dd" strokeWidth="1.1" fill="#142134" />
                          <line x1={hx - 7} y1={hy} x2={hx + 7} y2={hy} stroke="#778da9" strokeWidth="0.5" />
                          <line x1={hx} y1={hy - 7} x2={hx} y2={hy + 7} stroke="#778da9" strokeWidth="0.5" />
                        </g>
                      );
                    })}

                    {/* Callout Leader for PCD & 8 Holes */}
                    <path d="M40 -40 L75 -70 L130 -70" stroke="#f0a868" strokeWidth="1" fill="none" />
                    <circle cx="40" cy="-40" r="2" fill="#f0a868" />
                    <text x="80" y="-76" fill="#f0a868" fontSize="8.5" fontFamily="var(--font-mono)" fontWeight="600">
                      8× Ø11.0 THRU
                    </text>
                    <text x="80" y="-63" fill="#f0a868" fontSize="7.5" fontFamily="var(--font-mono)">
                      ON PCD Ø130.0 EQ SP
                    </text>

                    {/* Center Bore Callout */}
                    <text x="-70" y="-55" fill="#778da9" fontSize="8" fontFamily="var(--font-mono)">
                      Ø40.0 H7 BORE
                    </text>

                    {/* View Caption */}
                    <text x="0" y="86" fill="#e0e1dd" fontSize="9" fontFamily="var(--font-mono)" fontWeight="600" textAnchor="middle">
                      PLAN VIEW (TOP)
                    </text>
                  </g>

                  {/* ── Anonymised Title Block (Bottom Right) ── */}
                  <g transform="translate(420, 362)">
                    <rect x="0" y="0" width="286" height="98" fill="#101c2a" stroke="#e0e1dd" strokeWidth="1.4" />
                    
                    {/* Title Block Horizontal Dividers */}
                    <line x1="0" y1="24" x2="286" y2="24" stroke="#415a77" strokeWidth="0.9" />
                    <line x1="0" y1="50" x2="286" y2="50" stroke="#415a77" strokeWidth="0.9" />
                    <line x1="0" y1="74" x2="286" y2="74" stroke="#415a77" strokeWidth="0.9" />

                    {/* Vertical Dividers */}
                    <line x1="145" y1="0" x2="145" y2="50" stroke="#415a77" strokeWidth="0.9" />
                    <line x1="215" y1="24" x2="215" y2="50" stroke="#415a77" strokeWidth="0.9" />
                    <line x1="100" y1="50" x2="100" y2="74" stroke="#415a77" strokeWidth="0.9" />
                    <line x1="190" y1="50" x2="190" y2="74" stroke="#415a77" strokeWidth="0.9" />

                    {/* Confidential Redaction Bars */}
                    <rect x="10" y="8" width="80" height="9" fill="#415a77" rx="1.5" />
                    <rect x="10" y="32" width="60" height="8" fill="#415a77" rx="1.5" />
                    
                    {/* Drawing Metadata */}
                    <text x="152" y="16" fill="#e0e1dd" fontSize="8" fontFamily="var(--font-mono)" fontWeight="600">
                      DRG NO: DRG-4120
                    </text>
                    <text x="152" y="38" fill="#778da9" fontSize="7.5" fontFamily="var(--font-mono)">
                      REV: 04 (LATEST)
                    </text>
                    <text x="222" y="38" fill="#778da9" fontSize="7.5" fontFamily="var(--font-mono)">
                      SHEET: 1/1
                    </text>

                    <text x="10" y="64" fill="#778da9" fontSize="7" fontFamily="var(--font-mono)">
                      SCALE: 1:1
                    </text>
                    <text x="108" y="64" fill="#778da9" fontSize="7" fontFamily="var(--font-mono)">
                      MATL: AlSi10Mg
                    </text>
                    <text x="198" y="64" fill="#778da9" fontSize="7" fontFamily="var(--font-mono)">
                      TOL: ISO 2768-m
                    </text>

                    {/* Verification & Part Title */}
                    <text x="10" y="88" fill="#e0e1dd" fontSize="9" fontFamily="var(--font-mono)" fontWeight="700">
                      FLANGE HOUSING · 3D RECONSTRUCTION
                    </text>
                    <text x="235" y="88" fill="#10b981" fontSize="7.5" fontFamily="var(--font-mono)" fontWeight="600">
                      ✓ PASS
                    </text>
                  </g>

                  {/* ── 4 Drafting Masking Tape Strips (at 45° across 4 corners) ── */}
                  {/* Top-Left Corner Tape */}
                  <polygon
                    points="60,86 86,60 118,92 92,118"
                    fill="#ede4cf"
                    opacity="0.82"
                    stroke="#d4c7a8"
                    strokeWidth="0.75"
                    filter="url(#tape-shadow)"
                  />
                  {/* Top-Right Corner Tape */}
                  <polygon
                    points="696,60 722,86 690,118 664,92"
                    fill="#ede4cf"
                    opacity="0.82"
                    stroke="#d4c7a8"
                    strokeWidth="0.75"
                    filter="url(#tape-shadow)"
                  />
                  {/* Bottom-Left Corner Tape */}
                  <polygon
                    points="60,436 92,404 118,430 86,462"
                    fill="#ede4cf"
                    opacity="0.82"
                    stroke="#d4c7a8"
                    strokeWidth="0.75"
                    filter="url(#tape-shadow)"
                  />
                  {/* Bottom-Right Corner Tape */}
                  <polygon
                    points="664,430 690,404 722,436 696,462"
                    fill="#ede4cf"
                    opacity="0.82"
                    stroke="#d4c7a8"
                    strokeWidth="0.75"
                    filter="url(#tape-shadow)"
                  />
                </g>

                {/* ── 5. Draughtsman Instruments on the Board ── */}
                {/* 45° Transparent Acrylic Drafting Set-Square Triangle in Upper Right */}
                <g transform="translate(620, 80) rotate(15)" opacity="0.85">
                  <polygon
                    points="0,0 80,0 80,80"
                    fill="rgba(224, 225, 221, 0.16)"
                    stroke="#778da9"
                    strokeWidth="1.2"
                  />
                  <polygon
                    points="20,16 65,16 65,60"
                    fill="#0d1b2a"
                    stroke="#415a77"
                    strokeWidth="0.9"
                  />
                  {/* Graduation ticks along edge */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <line
                      key={`sq-tick-${i}`}
                      x1={i * 10}
                      y1={0}
                      x2={i * 10}
                      y2={4}
                      stroke="#e0e1dd"
                      strokeWidth="0.7"
                    />
                  ))}
                  <circle cx="48" cy="36" r="6" stroke="#778da9" strokeWidth="0.8" fill="none" />
                </g>

                {/* ── 6. Bottom Edge Tray with Drafting Pencil and Eraser ── */}
                <rect x="44" y="496" width="716" height="24" fill="#121e2c" stroke="#415a77" strokeWidth="1" />
                
                {/* Precision Mechanical Clutch Pencil */}
                <g transform="translate(220, 506)">
                  {/* Hexagonal Gold/Amber Barrel */}
                  <rect x="0" y="0" width="140" height="6" rx="1.5" fill="#f0a868" stroke="#8f4a14" strokeWidth="0.8" />
                  {/* Knurled Metal Grip */}
                  <rect x="140" y="0" width="28" height="6" fill="#778da9" stroke="#415a77" strokeWidth="0.8" />
                  {/* Steel Cone & 0.5mm Graphite Lead */}
                  <polygon points="168,0 178,3 168,6" fill="#415a77" />
                  <line x1="178" y1="3" x2="184" y2="3" stroke="#e0e1dd" strokeWidth="1" strokeLinecap="round" />
                  {/* Metal Pocket Clip */}
                  <rect x="18" y="-1.5" width="24" height="2" fill="#e0e1dd" />
                </g>

                {/* Vinyl Technical Eraser Block */}
                <g transform="translate(420, 501)">
                  <rect x="0" y="0" width="46" height="14" rx="1.5" fill="#e0e1dd" stroke="#415a77" strokeWidth="0.8" />
                  {/* Blue Cardboard Sleeve */}
                  <rect x="0" y="0" width="26" height="14" rx="1" fill="#1b263b" stroke="#415a77" strokeWidth="0.8" />
                  <text x="4" y="10" fill="#e0e1dd" fontSize="6.5" fontFamily="var(--font-mono)" fontWeight="600">
                    2B
                  </text>
                </g>
              </svg>

              {/* ── 7. The Animated Moving Precision T-Square ── */}
              <div
                className="pointer-events-none absolute left-0 w-full animate-t-square"
                style={{
                  top: "0px",
                }}
              >
                <div className="relative flex items-center">
                  {/* T-Square Head (rides vertically flush against the left steel guide rail) */}
                  <div
                    className="relative z-30 flex h-36 w-11 flex-col items-center justify-between rounded-xs border-y border-r border-[#415a77] bg-[#1a2838] py-3.5 shadow-2xl"
                    style={{
                      boxShadow: "4px 0 14px rgba(0,0,0,0.85)",
                    }}
                  >
                    {/* Brass Rivet Fasteners on Head */}
                    <div className="h-2 w-2 rounded-full bg-[#f0a868] border border-black/60 shadow-xs" />
                    <div className="h-2 w-2 rounded-full bg-[#f0a868] border border-black/60 shadow-xs" />
                    <div className="h-2 w-2 rounded-full bg-[#f0a868] border border-black/60 shadow-xs" />
                    <div className="h-2 w-2 rounded-full bg-[#f0a868] border border-black/60 shadow-xs" />
                  </div>

                  {/* T-Square Blade (Full-width transparent acrylic ruler across the blueprint) */}
                  <div
                    className="relative z-20 -ml-1 h-11 w-[calc(100%-40px)] rounded-r-xs border-y border-r border-[#778da9]/90 bg-gradient-to-b from-white/35 via-white/18 to-white/5 backdrop-blur-[2.5px]"
                    style={{
                      boxShadow: "0 8px 18px rgba(0,0,0,0.65)",
                    }}
                  >
                    {/* Millimeter Graduation Marks along top beveled edge */}
                    <div className="flex h-4 w-full items-end justify-between px-3 opacity-95">
                      {Array.from({ length: 58 }).map((_, idx) => (
                        <div
                          key={`blade-tick-${idx}`}
                          className="bg-vx-900"
                          style={{
                            width: "1px",
                            height: idx % 5 === 0 ? "11px" : "5px",
                          }}
                        />
                      ))}
                    </div>

                    {/* Blade Scale Nomenclature */}
                    <div className="flex items-center justify-between px-4 pt-0.5">
                      <span className="mono text-[9px] font-bold text-vx-900 opacity-95 tracking-widest select-none">
                        PRECISION DRAUGHTSMAN T-SQUARE · 700mm
                      </span>
                      <span className="mono text-[8.5px] font-mono font-bold text-vx-900 opacity-85">
                        VERTEX FLIP · BIT-IDENTICAL TRACE
                      </span>
                    </div>

                    {/* Bevelled Acrylic Amber Guide Edge */}
                    <div className="absolute bottom-0 left-0 h-[2.5px] w-full bg-[#f0a868]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Footer Note */}
          <div className="mt-2.5 flex items-center justify-between px-1 text-micro text-vx-600 mono">
            <span>TOP-DOWN DRAFTING BOARD · DRG-4120</span>
            <span className="text-dim-deep font-medium">AUTOMATIC T-SQUARE TRACE</span>
          </div>
        </div>
      </div>

      {/* Embedded CSS for the moving T-square animation */}
      <style>{`
        @keyframes tSquareGlide {
          0% {
            transform: translateY(28px);
          }
          28% {
            transform: translateY(160px);
          }
          52% {
            transform: translateY(285px);
          }
          76% {
            transform: translateY(95px);
          }
          100% {
            transform: translateY(28px);
          }
        }
        .animate-t-square {
          animation: tSquareGlide 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

