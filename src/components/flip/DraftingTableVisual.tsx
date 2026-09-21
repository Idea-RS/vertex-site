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

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(130, 95, 140);
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

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.25);
    dirLight1.position.set(150, 200, 100);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x778da9, 0.7);
    dirLight2.position.set(-150, -100, -100);
    scene.add(dirLight2);

    const rimLight = new THREE.DirectionalLight(0xf0a868, 0.45);
    rimLight.position.set(0, 150, -150);
    scene.add(rimLight);

    // Section Clipping Plane
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 100);
    clipPlaneRef.current = clipPlane;

    // Solid Group (Flanged Housing B-Rep Model)
    const solidGroup = new THREE.Group();
    solidGroupRef.current = solidGroup;
    scene.add(solidGroup);

    const cadMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8d1dc,
      metalness: 0.28,
      roughness: 0.32,
      clippingPlanes: [clipPlane],
      clipShadows: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x1b263b,
      linewidth: 1.5,
    });

    // 1. Base Flange Disc
    const flangeGeo = new THREE.CylinderGeometry(48, 48, 12, 48);
    const flangeMesh = new THREE.Mesh(flangeGeo, cadMaterial);
    flangeMesh.position.set(0, -6, 0);
    solidGroup.add(flangeMesh);
    flangeMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(flangeGeo, 24), edgeMaterial));

    // 2. Raised Center Hub
    const hubGeo = new THREE.CylinderGeometry(28, 28, 26, 48);
    const hubMesh = new THREE.Mesh(hubGeo, cadMaterial);
    hubMesh.position.set(0, 13, 0);
    solidGroup.add(hubMesh);
    hubMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(hubGeo, 24), edgeMaterial));

    // 3. Center Through-Bore Cutout
    const boreGeo = new THREE.CylinderGeometry(14, 14, 42, 36);
    const boreMat = new THREE.MeshStandardMaterial({
      color: 0x243447,
      roughness: 0.5,
      clippingPlanes: [clipPlane],
    });
    const boreMesh = new THREE.Mesh(boreGeo, boreMat);
    boreMesh.position.set(0, 7, 0);
    solidGroup.add(boreMesh);
    boreMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(boreGeo, 24), edgeMaterial));

    // 4. Circular Bolt Holes (8x along Pitch Circle)
    const holeGeo = new THREE.CylinderGeometry(3.5, 3.5, 14, 16);
    const holeMat = new THREE.MeshStandardMaterial({
      color: 0x1b263b,
      roughness: 0.6,
      clippingPlanes: [clipPlane],
    });

    const pcdRadius = 38;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const hole = new THREE.Mesh(holeGeo, holeMat);
      hole.position.set(Math.cos(angle) * pcdRadius, -6, Math.sin(angle) * pcdRadius);
      solidGroup.add(hole);
      hole.add(new THREE.LineSegments(new THREE.EdgesGeometry(holeGeo, 20), edgeMaterial));
    }

    // Subtle coordinate plane grid floor
    const grid = new THREE.GridHelper(140, 14, 0x415a77, 0x1b263b);
    grid.position.y = -13;
    if (!Array.isArray(grid.material)) {
      grid.material.opacity = 0.28;
      grid.material.transparent = true;
    }
    scene.add(grid);

    // Render loop with subtle idle rotation
    let idleAngle = 0;
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;

      if (!isOrbiting && activeView === "iso") {
        idleAngle += 0.003;
        solidGroup.rotation.y = Math.sin(idleAngle) * 0.22;
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
      cameraRef.current.position.set(130, 95, 140);
      controlsRef.current.target.set(0, 5, 0);
      if (clipPlaneRef.current) clipPlaneRef.current.constant = 100;
    } else if (view === "front") {
      cameraRef.current.position.set(0, 10, 180);
      controlsRef.current.target.set(0, 5, 0);
      if (clipPlaneRef.current) clipPlaneRef.current.constant = 100;
    } else if (view === "top") {
      cameraRef.current.position.set(0, 180, 0);
      controlsRef.current.target.set(0, 0, 0);
      if (clipPlaneRef.current) clipPlaneRef.current.constant = 100;
    } else if (view === "section") {
      cameraRef.current.position.set(110, 35, 60);
      controlsRef.current.target.set(0, 5, 0);
      if (clipPlaneRef.current) clipPlaneRef.current.constant = 0; // centerline cut
    }
    controlsRef.current.update();
  };

  return (
    <div className="relative my-10 overflow-hidden rounded-lg border border-vx-400/80 bg-vx-100 p-4 shadow-xl sm:p-6 lg:p-8">
      {/* Viewport Top Label */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-vx-400/40 pb-3">
        <div className="flex items-center gap-2.5">
          <PulseOrb size="sm" />
          <span className="mono text-micro font-medium uppercase tracking-wider text-vx-900">
            HERO VISUAL · 2D DRAFTING TABLE ⇄ 3D B-REP MODEL
          </span>
        </div>
        <span className="mono text-micro text-vx-600">
          EXACT B-REP GEOMETRY · OPENCASCADE KERNEL
        </span>
      </div>

      {/* Main Grid: 3D Render (Left) ⇄ Connector (Center) ⇄ Drafting Table (Right) */}
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-4">
        {/* Left: 3D CAD Viewport */}
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-md border border-vx-600 bg-vx-900 shadow-2xl">
            {/* Viewport Header */}
            <div className="flex items-center justify-between border-b border-vx-600/70 bg-vx-900/95 px-3.5 py-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="mono text-micro font-medium text-vx-100">
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
              className="relative h-[290px] w-full cursor-grab active:cursor-grabbing sm:h-[340px]"
              onMouseDown={() => setIsOrbiting(true)}
              onMouseUp={() => setIsOrbiting(false)}
              onTouchStart={() => setIsOrbiting(true)}
              onTouchEnd={() => setIsOrbiting(false)}
            >
              <canvas ref={canvasRef} className="h-full w-full outline-hidden" />

              {/* Viewport Technical Annotations */}
              <div className="pointer-events-none absolute top-2.5 left-3 mono text-micro text-vx-400/80 select-none">
                <div>Ø160.0 × 38.0 mm FLANGE</div>
                <div>8× Ø11.0 THRU ON PCD Ø130.0</div>
                <div>BIT-IDENTICAL B-REP</div>
              </div>

              <div className="pointer-events-none absolute bottom-2.5 right-3 mono text-micro text-vx-400/60 select-none">
                CLICK &amp; DRAG TO ORBIT
              </div>
            </div>

            {/* View Presets Bar */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 border-t border-vx-600/70 bg-vx-800/90 px-3 py-2">
              <span className="mono text-micro text-vx-400">View:</span>
              <div className="flex gap-1">
                {(["iso", "front", "top", "section"] as const).map((view) => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => setPresetView(view)}
                    className={`rounded-xs px-2 py-0.5 mono text-micro font-medium transition-colors ${
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

        {/* Center: 2D ⇄ 3D Connector */}
        <div className="flex flex-col items-center justify-center lg:col-span-2 py-2">
          {/* Desktop horizontal flow */}
          <div className="hidden lg:flex flex-col items-center gap-2">
            <span className="mono text-micro font-medium text-vx-900 tracking-wider">
              2D ⇄ 3D
            </span>
            <div className="relative flex items-center justify-center w-28">
              <div className="h-[1.5px] w-full bg-gradient-to-r from-vx-600 via-dim to-vx-600" />
              <div className="absolute -left-1 text-dim font-bold text-xs">◀</div>
              <div className="absolute -right-1 text-dim font-bold text-xs">▶</div>
              <div className="absolute h-2.5 w-2.5 rounded-full bg-dim animate-ping opacity-60" />
            </div>
            <span className="mono text-micro text-dim-deep font-semibold">
              Verified
            </span>
            <span className="mono text-[10px] text-vx-600 text-center leading-tight">
              Bidirectional sync
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

        {/* Right: Drafting Table with 2D Engineering Sheet & Moving T-Square */}
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-md border border-vx-600 bg-vx-900 p-2 shadow-2xl">
            {/* Viewport Header */}
            <div className="mb-2 flex items-center justify-between border-b border-vx-600/70 px-2 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-dim" />
                <span className="mono text-micro font-medium text-vx-100">
                  DRAFTING TABLE · 2D PRINT
                </span>
              </div>
              <span className="mono text-micro text-vx-400">
                DRG-4120 · SHEET 1
              </span>
            </div>

            {/* Drafting Table Illustration Container */}
            <div className="relative h-[290px] w-full overflow-hidden rounded-xs bg-[#142132] sm:h-[340px] select-none">
              {/* Drafting Table Stand & Board SVG */}
              <svg
                viewBox="0 0 540 420"
                className="pointer-events-none absolute inset-0 h-full w-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* ── Drafting Table Hardware & Stand ── */}
                {/* Floor shadow */}
                <ellipse cx="270" cy="405" rx="200" ry="10" fill="#09111c" opacity="0.6" />

                {/* Left & Right Legs */}
                <path d="M120 280 L90 395" stroke="#415a77" strokeWidth="6" strokeLinecap="round" />
                <path d="M420 280 L450 395" stroke="#415a77" strokeWidth="6" strokeLinecap="round" />
                
                {/* Base Leveling Feet */}
                <rect x="75" y="395" width="30" height="8" rx="2" fill="#778da9" stroke="#1b263b" strokeWidth="1" />
                <rect x="435" y="395" width="30" height="8" rx="2" fill="#778da9" stroke="#1b263b" strokeWidth="1" />

                {/* Cross Stretcher Bar / Footrest */}
                <path d="M102 360 L438 360" stroke="#2b3d52" strokeWidth="4" strokeLinecap="round" />

                {/* Tool Shelf & Draughtsman Instruments */}
                <rect x="135" y="300" width="270" height="16" rx="2" fill="#1b263b" stroke="#415a77" strokeWidth="1.5" />
                {/* Pencil on shelf */}
                <line x1="155" y1="307" x2="200" y2="307" stroke="#f0a868" strokeWidth="3" strokeLinecap="round" />
                <polygon points="150,307 155,305 155,309" fill="#e0e1dd" />
                {/* Triangle set-square on shelf */}
                <polygon points="220,312 250,312 250,298" fill="rgba(224, 225, 221, 0.25)" stroke="#778da9" strokeWidth="1" />
                {/* Eraser on shelf */}
                <rect x="265" y="303" width="22" height="9" rx="1" fill="#e0e1dd" stroke="#415a77" strokeWidth="1" />

                {/* Main Drafting Board Frame (Tilted drawing board) */}
                <rect x="45" y="25" width="450" height="265" rx="6" fill="#1b263b" stroke="#415a77" strokeWidth="2.5" />
                {/* Board Left Guide Rail (where T-square head slides) */}
                <line x1="48" y1="26" x2="48" y2="288" stroke="#778da9" strokeWidth="2" />
                {/* Board Inner Border */}
                <rect x="52" y="31" width="436" height="252" rx="3" fill="#0d1b2a" stroke="#2a3c50" strokeWidth="1" />

                {/* Tilt Adjustment Knobs (left and right) */}
                <circle cx="45" cy="158" r="8" fill="#778da9" stroke="#1b263b" strokeWidth="2" />
                <circle cx="45" cy="158" r="3" fill="#1b263b" />
                <circle cx="495" cy="158" r="8" fill="#778da9" stroke="#1b263b" strokeWidth="2" />
                <circle cx="495" cy="158" r="3" fill="#1b263b" />

                {/* ── Engineering Drawing Sheet on the Board ── */}
                <g id="drawing-sheet">
                  {/* Paper Background */}
                  <rect x="68" y="44" width="404" height="226" rx="2" fill="#172436" stroke="#415a77" strokeWidth="1.5" />
                  
                  {/* Sheet Corner Mounting Clips / Tape */}
                  <polygon points="68,54 78,44 68,44" fill="#778da9" opacity="0.6" />
                  <polygon points="462,44 472,54 472,44" fill="#778da9" opacity="0.6" />
                  <polygon points="68,260 78,270 68,270" fill="#778da9" opacity="0.6" />
                  <polygon points="462,270 472,260 472,270" fill="#778da9" opacity="0.6" />

                  {/* Sheet Border & Zone Grid */}
                  <rect x="74" y="50" width="392" height="214" fill="none" stroke="#e0e1dd" strokeWidth="1" />
                  <rect x="78" y="54" width="384" height="206" fill="none" stroke="#415a77" strokeWidth="0.75" />

                  {/* ── View 1: Top / Front View (Concentric Flange & Bolt Holes) ── */}
                  <g transform="translate(170, 140)">
                    {/* Centrelines */}
                    <line x1="-58" y1="0" x2="58" y2="0" stroke="#778da9" strokeWidth="0.75" strokeDasharray="14 3 3 3" />
                    <line x1="0" y1="-58" x2="0" y2="58" stroke="#778da9" strokeWidth="0.75" strokeDasharray="14 3 3 3" />
                    
                    {/* Outer Flange Ø160 */}
                    <circle cx="0" cy="0" r="50" stroke="#e0e1dd" strokeWidth="1.5" />
                    {/* Pitch Circle Diameter Ø130 */}
                    <circle cx="0" cy="0" r="39" stroke="#f0a868" strokeWidth="0.8" strokeDasharray="4 3" />
                    {/* Hub Outline Ø70 */}
                    <circle cx="0" cy="0" r="28" stroke="#e0e1dd" strokeWidth="1.25" />
                    {/* Bore Cutout Ø30 */}
                    <circle cx="0" cy="0" r="14" stroke="#e0e1dd" strokeWidth="1.25" />

                    {/* 8 Bolt Holes */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                      const rad = (deg * Math.PI) / 180;
                      const bx = Math.cos(rad) * 39;
                      const by = Math.sin(rad) * 39;
                      return <circle key={deg} cx={bx} cy={by} r="3.5" stroke="#e0e1dd" strokeWidth="1" fill="#172436" />;
                    })}

                    {/* Dimension Callout PCD */}
                    <text x="-48" y="-42" fill="#f0a868" fontSize="8" fontFamily="var(--font-mono)">
                      PCD Ø130.0
                    </text>
                  </g>

                  {/* ── View 2: Section A-A (Orthographic Elevation & Cross-Section) ── */}
                  <g transform="translate(340, 140)">
                    {/* Section Centerline */}
                    <line x1="0" y1="-56" x2="0" y2="56" stroke="#778da9" strokeWidth="0.75" strokeDasharray="14 3 3 3" />
                    
                    {/* Flange Body */}
                    <rect x="-50" y="-12" width="100" height="24" stroke="#e0e1dd" strokeWidth="1.5" fill="none" />
                    {/* Raised Hub */}
                    <rect x="-28" y="-38" width="56" height="26" stroke="#e0e1dd" strokeWidth="1.25" fill="none" />
                    {/* Bore Through Hole */}
                    <rect x="-14" y="-38" width="28" height="50" stroke="#778da9" strokeWidth="1" strokeDasharray="3 2" fill="none" />

                    {/* Hatching in Cross-Section walls */}
                    <line x1="-46" y1="12" x2="-34" y2="-12" stroke="#e0e1dd" strokeWidth="0.75" opacity="0.6" />
                    <line x1="-38" y1="12" x2="-26" y2="-12" stroke="#e0e1dd" strokeWidth="0.75" opacity="0.6" />
                    <line x1="26" y1="12" x2="38" y2="-12" stroke="#e0e1dd" strokeWidth="0.75" opacity="0.6" />
                    <line x1="34" y1="12" x2="46" y2="-12" stroke="#e0e1dd" strokeWidth="0.75" opacity="0.6" />

                    {/* Dimension Chain */}
                    <line x1="-50" y1="20" x2="50" y2="20" stroke="#f0a868" strokeWidth="0.8" />
                    <text x="0" y="29" fill="#f0a868" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">
                      Ø160.0 mm
                    </text>
                  </g>

                  {/* ── Anonymised Title Block with Redaction Bars ── */}
                  <g transform="translate(305, 212)">
                    <rect x="0" y="0" width="155" height="46" fill="#121d2b" stroke="#e0e1dd" strokeWidth="1" />
                    <line x1="0" y1="15" x2="155" y2="15" stroke="#415a77" strokeWidth="0.75" />
                    <line x1="0" y1="30" x2="155" y2="30" stroke="#415a77" strokeWidth="0.75" />
                    <line x1="85" y1="0" x2="85" y2="30" stroke="#415a77" strokeWidth="0.75" />

                    {/* Redaction Bars replacing sensitive customer names */}
                    <rect x="8" y="5" width="68" height="6" fill="#415a77" rx="1" />
                    <rect x="8" y="20" width="54" height="5" fill="#415a77" rx="1" />
                    
                    {/* Neutral Reference & Status */}
                    <text x="92" y="11" fill="#e0e1dd" fontSize="7" fontFamily="var(--font-mono)">
                      REV 04 · PASS
                    </text>
                    <text x="92" y="24" fill="#778da9" fontSize="6.5" fontFamily="var(--font-mono)">
                      TOL ±0.05mm
                    </text>
                    <text x="8" y="40" fill="#e0e1dd" fontSize="8" fontFamily="var(--font-mono)" fontWeight="600">
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
                  {/* T-Square Head (rides on left board edge) */}
                  <div
                    className="relative z-20 flex h-24 w-6 flex-col items-center justify-between rounded-xs border border-vx-900 bg-[#2b3a4a] py-2 shadow-lg"
                    style={{
                      boxShadow: "2px 0 6px rgba(0,0,0,0.6)",
                    }}
                  >
                    {/* Brass Mounting Rivets */}
                    <div className="h-1.5 w-1.5 rounded-full bg-[#f0a868] border border-black/40" />
                    <div className="h-1.5 w-1.5 rounded-full bg-[#f0a868] border border-black/40" />
                    <div className="h-1.5 w-1.5 rounded-full bg-[#f0a868] border border-black/40" />
                  </div>

                  {/* T-Square Blade (horizontal ruler spanning across the drawing sheet) */}
                  <div
                    className="relative z-10 -ml-1 h-8 w-[460px] rounded-r-xs border-y border-r border-[#778da9]/70 bg-gradient-to-b from-white/35 via-white/20 to-white/10 backdrop-blur-[1px]"
                    style={{
                      boxShadow: "0 4px 8px rgba(0,0,0,0.45)",
                    }}
                  >
                    {/* Precision Millimeter Ticks along top edge */}
                    <div className="flex h-3 w-full items-end justify-between px-2 opacity-85">
                      {Array.from({ length: 38 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="bg-vx-900"
                          style={{
                            width: "1px",
                            height: idx % 5 === 0 ? "8px" : "4px",
                          }}
                        />
                      ))}
                    </div>

                    {/* Ruler Label */}
                    <div className="flex items-center justify-between px-3 pt-0.5">
                      <span className="mono text-[8px] font-semibold text-vx-900 opacity-90 tracking-widest select-none">
                        DRAUGHTSMAN T-SQUARE · 600mm
                      </span>
                      <span className="mono text-[8px] font-mono text-vx-900 opacity-75">
                        VERTEX CAD
                      </span>
                    </div>

                    {/* Bottom Bevelled Drafting Edge */}
                    <div className="absolute bottom-0 left-0 h-[1.5px] w-full bg-[#f0a868]/80" />
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
            transform: translateY(28px);
          }
          32% {
            transform: translateY(165px);
          }
          50% {
            transform: translateY(205px);
          }
          75% {
            transform: translateY(85px);
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
