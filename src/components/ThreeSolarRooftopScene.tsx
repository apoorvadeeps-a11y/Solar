import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SolarAssessmentInput, AssessmentResult } from '../types/solar';
import { 
  Sun, 
  Rotate3d, 
  Eye, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Clock, 
  Compass, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ThreeSolarRooftopSceneProps {
  input: SolarAssessmentInput;
  result: AssessmentResult;
}

export const ThreeSolarRooftopScene: React.FC<ThreeSolarRooftopSceneProps> = ({ input, result }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI State for Collapsible Bottom Dock (<=15% viewport, zero-occlusion contract)
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [timeOfDayHours, setTimeOfDayHours] = useState<number>(12); // 6 to 18 (6 AM to 6 PM)
  const [cameraPreset, setCameraPreset] = useState<'isometric' | 'noon' | 'eye_level' | 'structure'>('isometric');
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Mutable refs for Three.js animation and controls loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const sunSphereRef = useRef<THREE.Mesh | null>(null);
  const explodedGroupRef = useRef<THREE.Group | null>(null);
  const roofArrayGroupRef = useRef<THREE.Group | null>(null);
  const targetCameraPos = useRef<THREE.Vector3>(new THREE.Vector3(12, 11, 14));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 3, 0));
  const currentExplodedY = useRef<number>(0);
  const targetExplodedY = useRef<number>(0);

  // Procedural Busbar Solar Cell Texture Generator
  const createSolarCellTexture = useCallback((): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Monocrystalline deep dark-blue wafer base
    ctx.fillStyle = '#0a1d37';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle cell grid wafer lines (60 / 72 cells)
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 3;
    for (let x = 0; x <= 512; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y <= 512; y += 85) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // High-conductivity silver busbars (5 BB modern module)
    ctx.strokeStyle = '#c0d6e8';
    ctx.lineWidth = 4;
    [64, 160, 256, 352, 448].forEach(x => {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    });

    // Micro fingers (hundreds of thin horizontal lines)
    ctx.strokeStyle = 'rgba(160, 195, 230, 0.25)';
    ctx.lineWidth = 1;
    for (let y = 4; y < 512; y += 8) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  // Procedural Concrete Texture for Terrace Slab
  const createConcreteTexture = useCallback((): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#b0b5be';
    ctx.fillRect(0, 0, 256, 256);

    // Speckles and aggregate
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const gray = Math.floor(130 + Math.random() * 60);
      ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 520;

    // 1. Scene & Background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9);
    scene.fog = new THREE.Fog(0xf1f5f9, 20, 50);
    sceneRef.current = scene;

    // 2. Camera with strict clipping & Damping
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(12, 11, 14);
    cameraRef.current = camera;

    // 3. Renderer with ACESFilmicToneMapping & PCFSoftShadowMap
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera dipping below ground
    controls.minDistance = 4;
    controls.maxDistance = 35;
    controls.target.set(0, 3, 0);
    controlsRef.current = controls;

    // 6. Studio Lighting Rig (Key Sunlight + Cool Hemisphere Fill)
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x94a3b8, 0.65);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 45;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Sun Visual Sphere Indicator
    const sunGeom = new THREE.SphereGeometry(0.5, 16, 16);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const sunSphere = new THREE.Mesh(sunGeom, sunMat);
    scene.add(sunSphere);
    sunSphereRef.current = sunSphere;

    // 7. Ground Plane with Soft Contact Shadow
    const groundGeom = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Soft Radial Contact Shadow under Building
    const contactCanvas = document.createElement('canvas');
    contactCanvas.width = 128;
    contactCanvas.height = 128;
    const cCtx = contactCanvas.getContext('2d')!;
    const grad = cCtx.createRadialGradient(64, 64, 10, 64, 64, 64);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
    grad.addColorStop(0.6, 'rgba(15, 23, 42, 0.2)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    cCtx.fillStyle = grad;
    cCtx.fillRect(0, 0, 128, 128);
    const contactTex = new THREE.CanvasTexture(contactCanvas);

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 12),
      new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.02;
    scene.add(shadowPlane);

    // ==========================================
    // 8. PROCEDURAL 3D ROOFTOP ASSEMBLY (3–12 Part Composite Model)
    // ==========================================
    const rootModelGroup = new THREE.Group();
    scene.add(rootModelGroup);

    // Part 1: Main Building Core Block (Ground to 1st Floor Terrace)
    const buildingGeom = new THREE.BoxGeometry(9.0, 3.8, 7.5);
    const concreteTex = createConcreteTexture();
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.85,
      metalness: 0.05,
      map: concreteTex
    });
    const buildingMesh = new THREE.Mesh(buildingGeom, buildingMat);
    buildingMesh.position.set(0, 1.9, 0);
    buildingMesh.castShadow = true;
    buildingMesh.receiveShadow = true;
    rootModelGroup.add(buildingMesh);

    // Part 2: Parapet Wall Border Enclosure (Surrounding terrace slab)
    const parapetHeight = 0.5;
    const parapetThick = 0.25;
    const parapetMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.7,
      metalness: 0.1
    });

    // North Parapet
    const northP = new THREE.Mesh(new THREE.BoxGeometry(9.0, parapetHeight, parapetThick), parapetMat);
    northP.position.set(0, 3.8 + parapetHeight / 2, -3.75 + parapetThick / 2);
    northP.castShadow = true;
    northP.receiveShadow = true;
    rootModelGroup.add(northP);

    // South Parapet
    const southP = new THREE.Mesh(new THREE.BoxGeometry(9.0, parapetHeight, parapetThick), parapetMat);
    southP.position.set(0, 3.8 + parapetHeight / 2, 3.75 - parapetThick / 2);
    southP.castShadow = true;
    southP.receiveShadow = true;
    rootModelGroup.add(southP);

    // East Parapet
    const eastP = new THREE.Mesh(new THREE.BoxGeometry(parapetThick, parapetHeight, 7.5), parapetMat);
    eastP.position.set(4.5 - parapetThick / 2, 3.8 + parapetHeight / 2, 0);
    eastP.castShadow = true;
    eastP.receiveShadow = true;
    rootModelGroup.add(eastP);

    // West Parapet
    const westP = new THREE.Mesh(new THREE.BoxGeometry(parapetThick, parapetHeight, 7.5), parapetMat);
    westP.position.set(-4.5 + parapetThick / 2, 3.8 + parapetHeight / 2, 0);
    westP.castShadow = true;
    westP.receiveShadow = true;
    rootModelGroup.add(westP);

    // Part 3: Mumty / Staircase Headroom Cabin (North-West Corner)
    const mumtyGeom = new THREE.BoxGeometry(2.4, 2.3, 2.4);
    const mumtyMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.8,
      metalness: 0.1
    });
    const mumty = new THREE.Mesh(mumtyGeom, mumtyMat);
    mumty.position.set(-2.8, 3.8 + 1.15, -2.1);
    mumty.castShadow = true;
    mumty.receiveShadow = true;
    rootModelGroup.add(mumty);

    // Mumty Door (Steel security door)
    const doorGeom = new THREE.PlaneGeometry(0.8, 1.8);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 });
    const door = new THREE.Mesh(doorGeom, doorMat);
    door.position.set(-2.8, 3.8 + 0.9, -0.89);
    door.castShadow = true;
    rootModelGroup.add(door);

    // Part 4: Overhead Sintex Cylindrical Water Storage Tank on Concrete Pillars
    const tankPillars = new THREE.Group();
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 });
    const pillarGeom = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
    [[-0.4, -0.4], [0.4, -0.4], [-0.4, 0.4], [0.4, 0.4]].forEach(([px, pz]) => {
      const p = new THREE.Mesh(pillarGeom, pillarMat);
      p.position.set(px, 0.6, pz);
      p.castShadow = true;
      tankPillars.add(p);
    });
    // Pillar Staging Slab
    const slabMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 1.2), pillarMat);
    slabMesh.position.set(0, 1.25, 0);
    slabMesh.castShadow = true;
    tankPillars.add(slabMesh);

    // The Water Tank (Classic White/Black Sintex Polyethylene cylinder with ribs)
    const tankGeom = new THREE.CylinderGeometry(0.55, 0.55, 1.2, 24);
    const tankMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.05
    });
    const tankBody = new THREE.Mesh(tankGeom, tankMat);
    tankBody.position.set(0, 1.25 + 0.65, 0);
    tankBody.castShadow = true;
    tankBody.receiveShadow = true;
    tankPillars.add(tankBody);

    // Tank Lid / Rim
    const tankLid = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.58, 0.15, 24), tankMat);
    tankLid.position.set(0, 1.25 + 1.25, 0);
    tankLid.castShadow = true;
    tankPillars.add(tankLid);

    // Position Tank Assembly on Top of Mumty
    tankPillars.position.set(-2.8, 3.8 + 2.3, -2.1);
    rootModelGroup.add(tankPillars);

    // Part 5: Wall-Mounted String Inverter & AC Isolator Box
    const inverterGeom = new THREE.BoxGeometry(0.65, 0.9, 0.22);
    const inverterMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.2
    });
    const inverter = new THREE.Mesh(inverterGeom, inverterMat);
    inverter.position.set(-1.45, 3.8 + 1.2, -2.1);
    inverter.castShadow = true;
    rootModelGroup.add(inverter);

    // Inverter status LED display strip
    const ledGeom = new THREE.PlaneGeometry(0.35, 0.12);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const led = new THREE.Mesh(ledGeom, ledMat);
    led.position.set(-1.45, 3.8 + 1.45, -1.98);
    rootModelGroup.add(led);

    // ==========================================
    // Part 6 & 7: SOLAR ARRAY & ELEVATED GI SUPERSTRUCTURE
    // (Exploded view target group)
    // ==========================================
    const explodedGroup = new THREE.Group();
    explodedGroupRef.current = explodedGroup;
    rootModelGroup.add(explodedGroup);

    // Galvanized Iron (GI) Framing Structure (Tubular legs & C-Channels)
    const giMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.25
    });

    const structureGroup = new THREE.Group();
    // 4 Main Elevated Stanchions (Pillars)
    const stanchionGeom = new THREE.BoxGeometry(0.08, 1.1, 0.08);
    const stanchionCoords = [
      [0.6, 0.55, -1.4],
      [3.8, 0.55, -1.4],
      [0.6, 0.35, 2.0],
      [3.8, 0.35, 2.0]
    ];
    stanchionCoords.forEach(([sx, sy, sz]) => {
      const leg = new THREE.Mesh(stanchionGeom, giMat);
      leg.position.set(sx, sy, sz);
      leg.castShadow = true;
      structureGroup.add(leg);
    });

    // Purlin Rails (South Tilt 18° for optimal Indian insolation)
    const railGeom = new THREE.BoxGeometry(0.06, 0.06, 3.7);
    const rail1 = new THREE.Mesh(railGeom, giMat);
    rail1.position.set(1.2, 0.85, 0.3);
    rail1.rotation.x = THREE.MathUtils.degToRad(-15);
    rail1.castShadow = true;
    structureGroup.add(rail1);

    const rail2 = new THREE.Mesh(railGeom, giMat);
    rail2.position.set(3.2, 0.85, 0.3);
    rail2.rotation.x = THREE.MathUtils.degToRad(-15);
    rail2.castShadow = true;
    structureGroup.add(rail2);

    structureGroup.position.set(0, 3.8, 0);
    explodedGroup.add(structureGroup);

    // Part 8: Solar Photovoltaic Module Array
    const roofArrayGroup = new THREE.Group();
    roofArrayGroupRef.current = roofArrayGroup;

    const solarTex = createSolarCellTexture();
    const panelFaceMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: solarTex,
      roughness: 0.15,
      metalness: 0.85
    });
    const panelFrameMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.95,
      roughness: 0.2
    });

    // Create a 2-Row x 3-Column Array (6 High-Efficiency Monocrystalline Panels ~3.3 kWp)
    const panelWidth = 1.1;
    const panelLength = 1.8;
    const panelThickness = 0.04;

    const singlePanelGeom = new THREE.BoxGeometry(panelWidth, panelThickness, panelLength);

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const panelGroup = new THREE.Group();

        // Aluminum frame
        const frameMesh = new THREE.Mesh(singlePanelGeom, panelFrameMat);
        frameMesh.castShadow = true;
        frameMesh.receiveShadow = true;
        panelGroup.add(frameMesh);

        // Glass Photovoltaic Top Surface
        const pvFace = new THREE.Mesh(
          new THREE.PlaneGeometry(panelWidth - 0.04, panelLength - 0.04),
          panelFaceMat
        );
        pvFace.rotation.x = -Math.PI / 2;
        pvFace.position.y = panelThickness / 2 + 0.002;
        pvFace.receiveShadow = true;
        panelGroup.add(pvFace);

        // Layout positioning (Row/Col)
        const posX = 1.1 + col * 1.15;
        const posZ = -0.55 + row * 1.85;
        panelGroup.position.set(posX, 0.95, posZ);
        panelGroup.rotation.x = THREE.MathUtils.degToRad(-15); // True South tilt angle

        roofArrayGroup.add(panelGroup);
      }
    }

    roofArrayGroup.position.set(0, 3.8, 0);
    explodedGroup.add(roofArrayGroup);

    // Pre-warm WebGL shader pipeline
    renderer.compile(scene, camera);

    // ==========================================
    // 9. ANIMATION & RENDER LOOP (60fps, Damped, Zero GC)
    // ==========================================
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth Camera Preset Interpolation
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCameraPos.current.x, 3.5, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCameraPos.current.y, 3.5, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCameraPos.current.z, 3.5, dt);

      controls.target.x = THREE.MathUtils.damp(controls.target.x, targetLookAt.current.x, 4.0, dt);
      controls.target.y = THREE.MathUtils.damp(controls.target.y, targetLookAt.current.y, 4.0, dt);
      controls.target.z = THREE.MathUtils.damp(controls.target.z, targetLookAt.current.z, 4.0, dt);
      controls.update();

      // Smooth Exploded-View Kinematics
      currentExplodedY.current = THREE.MathUtils.damp(currentExplodedY.current, targetExplodedY.current, 5.0, dt);
      if (explodedGroupRef.current) {
        explodedGroupRef.current.position.y = currentExplodedY.current;
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 520;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [createConcreteTexture, createSolarCellTexture]);

  // Update Sunlight Position according to Time of Day (6 AM to 6 PM Sun Trajectory)
  useEffect(() => {
    if (!sunLightRef.current || !sunSphereRef.current) return;

    // Angle: 6 AM = 0 rad, 12 PM = PI/2 (Noon directly above/south), 6 PM = PI
    const t = (timeOfDayHours - 6) / 12; // 0 to 1
    const sunAngle = Math.PI * (1 - t);

    const radius = 22;
    // East to West trajectory arc
    const x = Math.cos(sunAngle) * radius;
    const y = Math.max(0.5, Math.sin(sunAngle) * radius * 0.95);
    // In India (Northern Hemisphere), sun is inclined toward the South
    const z = 7 + Math.sin(sunAngle) * 5;

    sunLightRef.current.position.set(x, y, z);
    sunSphereRef.current.position.set(x, y, z);

    // Warm morning/evening vs cool bright noon
    if (timeOfDayHours < 8 || timeOfDayHours > 16) {
      sunLightRef.current.color.setHex(0xfdba74); // Warm amber
      sunLightRef.current.intensity = 1.3;
    } else if (timeOfDayHours >= 11 && timeOfDayHours <= 13) {
      sunLightRef.current.color.setHex(0xfffbeb); // Peak bright white-gold
      sunLightRef.current.intensity = 2.4;
    } else {
      sunLightRef.current.color.setHex(0xfef3c7);
      sunLightRef.current.intensity = 2.0;
    }
  }, [timeOfDayHours]);

  // Handle Camera Presets
  const setCameraView = (view: 'isometric' | 'noon' | 'eye_level' | 'structure') => {
    setCameraPreset(view);
    switch (view) {
      case 'isometric':
        targetCameraPos.current.set(12, 11, 14);
        targetLookAt.current.set(0, 3.5, 0);
        break;
      case 'noon':
        targetCameraPos.current.set(0.1, 18, 0.1);
        targetLookAt.current.set(0, 3.8, 0);
        break;
      case 'eye_level':
        targetCameraPos.current.set(1.5, 4.4, 6.5);
        targetLookAt.current.set(1.8, 4.3, 0);
        break;
      case 'structure':
        targetCameraPos.current.set(5.5, 5.0, 3.5);
        targetLookAt.current.set(2.0, 4.2, 0.5);
        break;
    }
  };

  // Toggle Exploded Architectural View
  const toggleExploded = () => {
    setIsExploded(!isExploded);
    targetExplodedY.current = !isExploded ? 1.8 : 0;
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-300 shadow-xl bg-slate-900 ${
      isFullScreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'h-[580px]'
    }`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Telemetry & Specification Badge (Minimal, Top-Left) */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="bg-slate-950/85 text-white p-3 rounded-xl border border-slate-700/80 shadow-md backdrop-blur-xs font-mono text-xs space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Rotate3d className="w-4 h-4" />
            <span>3D ROOFTOP DIGITAL TWIN</span>
          </div>
          <div className="text-[11px] text-slate-300">
            Array: <strong className="text-white">{result.recommendedCapacityKw} kWp</strong> · Tilt: <strong className="text-amber-300">18° True South</strong>
          </div>
          <div className="text-[11px] text-slate-400">
            Sun: <span className="text-amber-400">{timeOfDayHours}:00 hrs</span> · Shadow Analysis Active
          </div>
        </div>
      </div>

      {/* Top-Right Quick Action: Fullscreen Toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700 transition-colors shadow-md"
          title={isFullScreen ? 'Exit Full Screen' : 'Full Screen View'}
        >
          {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Center 3D Viewport is 100% UNOBSTRUCTED */}

      {/* Collapsible Bottom Control Dock (<=15% Viewport footprint) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-3xl px-4 pointer-events-auto">
        <div className="relative bg-slate-950/90 text-white rounded-2xl border border-slate-700 shadow-2xl p-3.5 transition-all">
          {/* Collapse / Expand Toggle Tab */}
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1 rounded-t-lg border-t border-x border-slate-700 text-[11px] font-mono flex items-center gap-1 transition-colors"
          >
            {isDockCollapsed ? (
              <><span>Show Controls</span> <ChevronUp className="w-3 h-3" /></>
            ) : (
              <><span>Hide Dock</span> <ChevronDown className="w-3 h-3" /></>
            )}
          </button>

          {!isDockCollapsed && (
            <div className="space-y-3">
              {/* Row 1: Time of Day Scrubber (Sun Trajectory Simulator) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 shrink-0">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>SUN POSITION: <strong>{timeOfDayHours}:00 {timeOfDayHours < 12 ? 'AM' : 'PM'}</strong></span>
                  {timeOfDayHours >= 9 && timeOfDayHours <= 16 ? (
                    <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                      Prime Window
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      Off-Peak
                    </span>
                  )}
                </div>

                <div className="flex-1 flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-400">06:00</span>
                  <input
                    type="range"
                    min="6"
                    max="18"
                    step="1"
                    value={timeOfDayHours}
                    onChange={(e) => setTimeOfDayHours(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-slate-400">18:00</span>
                </div>
              </div>

              {/* Row 2: Camera Presets & Exploded View Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                {/* Camera View Switcher */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-[11px] font-mono text-slate-400 mr-1 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>Views:</span>
                  </span>
                  <button
                    onClick={() => setCameraView('isometric')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      cameraPreset === 'isometric' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Isometric
                  </button>
                  <button
                    onClick={() => setCameraView('noon')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      cameraPreset === 'noon' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Top-Down (Noon)
                  </button>
                  <button
                    onClick={() => setCameraView('eye_level')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      cameraPreset === 'eye_level' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Terrace Walkway
                  </button>
                  <button
                    onClick={() => setCameraView('structure')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      cameraPreset === 'structure' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    GI Framing Detail
                  </button>
                </div>

                {/* Exploded View Action */}
                <button
                  onClick={toggleExploded}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    isExploded 
                      ? 'bg-blue-600 text-white ring-1 ring-blue-400' 
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isExploded ? 'Reassemble View' : 'Explode Structure (CAD)'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
