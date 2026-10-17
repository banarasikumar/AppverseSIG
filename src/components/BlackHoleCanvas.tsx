'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  blackHoleFragmentShader,
  blackHoleVertexShader,
  latticeFragmentShader,
  latticeVertexShader,
  starfieldFragmentShader,
  starfieldVertexShader,
} from '@/shaders/blackHoleShaders';
import { computeQualityProfile } from '@/lib/qualityProfile';
import { evaluateScrollSceneState } from '@/lib/scrollCamera';
import type { ChapterId, QualityProfile } from '@/types/scene';

interface BlackHoleCanvasProps {
  paused: boolean;
  forceReducedMotion: boolean;
  onChapterChange?: (chapter: ChapterId, themeColor: string) => void;
  progressBarRef?: React.RefObject<HTMLDivElement>;
}

function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function BlackHoleCanvas({
  paused,
  forceReducedMotion,
  onChapterChange,
  progressBarRef,
}: BlackHoleCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webglAvailable, setWebglAvailable] = useState<boolean>(true);
  const [qualityTierLabel, setQualityTierLabel] = useState<string>('high');

  const pausedRef = useRef<boolean>(paused);
  pausedRef.current = paused;

  const onChapterChangeRef = useRef(onChapterChange);
  onChapterChangeRef.current = onChapterChange;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const profile: QualityProfile = computeQualityProfile(forceReducedMotion);
    setWebglAvailable(profile.webglSupported);
    setQualityTierLabel(profile.tier);

    if (!profile.webglSupported) {
      return;
    }

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      });
    } catch {
      setWebglAvailable(false);
      return;
    }

    let currentDpr = profile.dpr;
    renderer.setPixelRatio(currentDpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);

    // 1. Background Full-Viewport Ray-Deflected Singularity & Accretion Core
    const bgScene = new THREE.Scene();
    const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const initialScrollState = evaluateScrollSceneState(0, profile.prefersReducedMotion);

    const blackHoleUniforms = {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(
          window.innerWidth * currentDpr,
          window.innerHeight * currentDpr
        ),
      },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uHorizonOffset: {
        value: new THREE.Vector2(
          initialScrollState.horizonOffset[0],
          initialScrollState.horizonOffset[1]
        ),
      },
      uBlackHoleScale: { value: initialScrollState.blackHoleScale },
      uDiskTilt: { value: initialScrollState.diskTilt },
      uCameraRoll: { value: initialScrollState.roll },
      uLensingStrength: { value: initialScrollState.lensingStrength },
      uDopplerAsymmetry: { value: initialScrollState.dopplerAsymmetry },
      uNebulaIntensity: { value: initialScrollState.nebulaIntensity },
      uScrollProgress: { value: 0 },
      uOctaves: { value: profile.diskOctaves },
    };

    const bgGeometry = new THREE.PlaneGeometry(2, 2);
    const bgMaterial = new THREE.ShaderMaterial({
      vertexShader: blackHoleVertexShader,
      fragmentShader: blackHoleFragmentShader,
      uniforms: blackHoleUniforms,
      depthWrite: false,
      depthTest: false,
    });
    const bgQuad = new THREE.Mesh(bgGeometry, bgMaterial);
    bgScene.add(bgQuad);

    // 2. Foreground 3D Universe: Logarithmic Spiral Galaxy + Connected Intelligence Lattice
    const spatialScene = new THREE.Scene();
    const spatialCamera = new THREE.PerspectiveCamera(
      initialScrollState.fov,
      window.innerWidth / Math.max(window.innerHeight, 1),
      0.1,
      65
    );
    spatialCamera.position.set(...initialScrollState.position);
    spatialCamera.lookAt(...initialScrollState.target);

    const rand = seededRandom(104729);
    const starCount = profile.galaxyStarCount;
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const scales = new Float32Array(starCount);
    const temperatures = new Float32Array(starCount);
    const phases = new Float32Array(starCount);
    const armMixes = new Float32Array(starCount);

    const armCount = 3;
    for (let i = 0; i < starCount; i++) {
      const isSpiralArm = i < starCount * 0.68;
      if (isSpiralArm) {
        const armIndex = i % armCount;
        const radialDist = 1.9 + Math.pow(rand(), 0.78) * 14.5;
        const spinAngle = radialDist * 0.62 + (armIndex * Math.PI * 2) / armCount;
        const scatter = (rand() - 0.5) * (0.42 + radialDist * 0.08);
        const angle = spinAngle + scatter;
        const verticalSpread = (rand() - 0.5) * (0.35 + radialDist * 0.11);

        positions[i * 3] = Math.cos(angle) * radialDist;
        positions[i * 3 + 1] = verticalSpread;
        positions[i * 3 + 2] = Math.sin(angle) * radialDist;
        armMixes[i] = 1.0;
      } else {
        const radius = 2.5 + Math.pow(rand(), 0.7) * 20.0;
        const theta = rand() * Math.PI * 2;
        const z = (rand() - 0.5) * 30.0;
        positions[i * 3] = Math.cos(theta) * radius;
        positions[i * 3 + 1] = Math.sin(theta) * radius * 0.72;
        positions[i * 3 + 2] = z;
        armMixes[i] = 0.0;
      }

      scales[i] = 0.55 + Math.pow(rand(), 2.1) * 2.25;
      temperatures[i] = rand();
      phases[i] = rand();
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    starGeometry.setAttribute('aTemperature', new THREE.BufferAttribute(temperatures, 1));
    starGeometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    starGeometry.setAttribute('aArmMix', new THREE.BufferAttribute(armMixes, 1));

    const starUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: currentDpr },
      uSizeMultiplier: { value: profile.prefersReducedMotion ? 0.85 : 1.0 },
    };

    const starMaterial = new THREE.ShaderMaterial({
      vertexShader: starfieldVertexShader,
      fragmentShader: starfieldFragmentShader,
      uniforms: starUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const starPoints = new THREE.Points(starGeometry, starMaterial);
    spatialScene.add(starPoints);

    // 3. 3D Connected Intelligence Constellation Filaments (Super-App Ecosystem Lattice)
    const nodeCount = profile.constellationNodeCount;
    const nodes: Array<[number, number, number]> = [];
    for (let i = 0; i < nodeCount; i++) {
      const r = 2.6 + rand() * 8.2;
      const a = (i / Math.max(nodeCount, 1)) * Math.PI * 2 + (rand() - 0.5) * 0.45;
      const y = (rand() - 0.5) * 3.2;
      nodes.push([Math.cos(a) * r, y, Math.sin(a) * r]);
    }

    const segmentPositions: number[] = [];
    const segmentPulses: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      let connections = 0;
      for (let j = i + 1; j < nodeCount; j++) {
        if (connections >= 2) break;
        const dx = nodes[i][0] - nodes[j][0];
        const dy = nodes[i][1] - nodes[j][1];
        const dz = nodes[i][2] - nodes[j][2];
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < 14.5) {
          segmentPositions.push(
            nodes[i][0],
            nodes[i][1],
            nodes[i][2],
            nodes[j][0],
            nodes[j][1],
            nodes[j][2]
          );
          const pulseSeed = rand();
          segmentPulses.push(pulseSeed, pulseSeed + 0.35);
          connections++;
        }
      }
    }

    const latticeGeometry = new THREE.BufferGeometry();
    latticeGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(segmentPositions), 3)
    );
    latticeGeometry.setAttribute(
      'aPulseOffset',
      new THREE.BufferAttribute(new Float32Array(segmentPulses), 1)
    );

    const latticeUniforms = {
      uTime: { value: 0 },
      uLatticeIntensity: { value: initialScrollState.latticeIntensity },
    };

    const latticeMaterial = new THREE.ShaderMaterial({
      vertexShader: latticeVertexShader,
      fragmentShader: latticeFragmentShader,
      uniforms: latticeUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const latticeLines = new THREE.LineSegments(latticeGeometry, latticeMaterial);
    spatialScene.add(latticeLines);

    // High-refresh 120Hz+ animation loop state (zero per-frame React state updates)
    let targetScrollProgress = 0;
    let smoothedScrollProgress = 0;
    const targetPointer = { x: 0, y: 0 };
    const smoothedPointer = { x: 0, y: 0 };
    let lastReportedChapter: ChapterId | null = null;

    // Dynamic frame-pacing monitor to sustain smooth frame delivery
    let slowFrameStreak = 0;
    let hasSteppedDownDpr = false;

    const readScrollProgress = () => {
      const docElement = document.documentElement;
      const maxScroll = Math.max(docElement.scrollHeight - window.innerHeight, 1);
      targetScrollProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    };

    readScrollProgress();
    smoothedScrollProgress = targetScrollProgress;

    const handleScroll = () => {
      readScrollProgress();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (profile.prefersReducedMotion || pausedRef.current) return;
      const nx = (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      const ny = -((event.clientY / Math.max(window.innerHeight, 1)) * 2 - 1);
      targetPointer.x = Math.max(-1, Math.min(1, nx));
      targetPointer.y = Math.max(-1, Math.min(1, ny));
    };

    const handleResize = () => {
      const w = window.innerWidth;
      const h = Math.max(window.innerHeight, 1);
      renderer.setSize(w, h);
      blackHoleUniforms.uResolution.value.set(w * currentDpr, h * currentDpr);
      spatialCamera.aspect = w / h;
      spatialCamera.updateProjectionMatrix();
      readScrollProgress();
    };

    let isTabVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        lastFrameTime = performance.now();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let animationFrameId = 0;
    let lastFrameTime = performance.now();
    let elapsedTime = 0;

    const renderLoop = (now: number) => {
      animationFrameId = window.requestAnimationFrame(renderLoop);

      if (!isTabVisible) {
        return;
      }

      const rawDt = (now - lastFrameTime) / 1000;
      lastFrameTime = now;

      // Guard against tab-suspension time jumps while keeping native 60/90/120/144Hz delta precision
      const dt = Math.min(Math.max(rawDt, 0.001), 0.05);

      // Adaptive resolution step-down if sustained frame time exceeds ~24ms (<42 FPS)
      if (!hasSteppedDownDpr && currentDpr > 1.0 && rawDt > 0.024 && rawDt < 0.2) {
        slowFrameStreak++;
        if (slowFrameStreak > 28) {
          hasSteppedDownDpr = true;
          currentDpr = Math.max(1.0, currentDpr * 0.78);
          renderer.setPixelRatio(currentDpr);
          blackHoleUniforms.uResolution.value.set(
            window.innerWidth * currentDpr,
            window.innerHeight * currentDpr
          );
          starUniforms.uPixelRatio.value = currentDpr;
        }
      } else {
        slowFrameStreak = Math.max(0, slowFrameStreak - 1);
      }

      if (!pausedRef.current) {
        elapsedTime += profile.prefersReducedMotion ? dt * 0.1 : dt;
      }

      // Frame-rate-independent exponential smoothing (identical feel at 60Hz and 120Hz)
      const scrollDamping = profile.prefersReducedMotion ? 1.0 : 1.0 - Math.exp(-dt * 9.0);
      const pointerDamping = 1.0 - Math.exp(-dt * 5.0);

      smoothedScrollProgress += (targetScrollProgress - smoothedScrollProgress) * scrollDamping;
      smoothedPointer.x += (targetPointer.x - smoothedPointer.x) * pointerDamping;
      smoothedPointer.y += (targetPointer.y - smoothedPointer.y) * pointerDamping;

      // Update scroll progress bar directly via DOM ref (zero React re-renders)
      if (progressBarRef?.current) {
        progressBarRef.current.style.transform = `scaleX(${Math.max(
          0.01,
          smoothedScrollProgress
        ).toFixed(4)})`;
      }

      const sceneState = evaluateScrollSceneState(
        smoothedScrollProgress,
        profile.prefersReducedMotion
      );

      if (sceneState.activeChapter !== lastReportedChapter) {
        lastReportedChapter = sceneState.activeChapter;
        onChapterChangeRef.current?.(sceneState.activeChapter, sceneState.themeColor);
      }

      blackHoleUniforms.uTime.value = elapsedTime;
      blackHoleUniforms.uPointer.value.set(smoothedPointer.x, smoothedPointer.y);
      blackHoleUniforms.uHorizonOffset.value.set(
        sceneState.horizonOffset[0],
        sceneState.horizonOffset[1]
      );
      blackHoleUniforms.uBlackHoleScale.value = sceneState.blackHoleScale;
      blackHoleUniforms.uDiskTilt.value = sceneState.diskTilt;
      blackHoleUniforms.uCameraRoll.value = sceneState.roll;
      blackHoleUniforms.uLensingStrength.value = sceneState.lensingStrength;
      blackHoleUniforms.uDopplerAsymmetry.value = sceneState.dopplerAsymmetry;
      blackHoleUniforms.uNebulaIntensity.value = sceneState.nebulaIntensity;
      blackHoleUniforms.uScrollProgress.value = smoothedScrollProgress;

      starUniforms.uTime.value = elapsedTime;
      latticeUniforms.uTime.value = elapsedTime;
      latticeUniforms.uLatticeIntensity.value = sceneState.latticeIntensity;

      const px = smoothedPointer.x * 0.42;
      const py = smoothedPointer.y * 0.30;

      spatialCamera.position.set(
        sceneState.position[0] + px,
        sceneState.position[1] + py,
        sceneState.position[2]
      );
      spatialCamera.lookAt(
        sceneState.target[0] - px * 0.35,
        sceneState.target[1] - py * 0.35,
        sceneState.target[2]
      );
      spatialCamera.rotation.z += sceneState.roll;

      if (Math.abs(spatialCamera.fov - sceneState.fov) > 0.05) {
        spatialCamera.fov = sceneState.fov;
        spatialCamera.updateProjectionMatrix();
      }

      renderer.clear();
      renderer.render(bgScene, bgCamera);
      renderer.clearDepth();
      renderer.render(spatialScene, spatialCamera);
    };

    animationFrameId = window.requestAnimationFrame(renderLoop);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      bgGeometry.dispose();
      bgMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      latticeGeometry.dispose();
      latticeMaterial.dispose();
      renderer.dispose();

      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [forceReducedMotion, progressBarRef]);

  return (
    <div
      className="universe-canvas-wrapper"
      aria-hidden="true"
      data-quality-tier={qualityTierLabel}
    >
      <div ref={containerRef} className="universe-canvas-mount" />
      {!webglAvailable && (
        <div className="universe-static-fallback" role="presentation">
          <div className="fallback-galaxy-glow" />
          <div className="fallback-accretion-halo" />
          <div className="fallback-photon-ring" />
          <div className="fallback-event-horizon" />
        </div>
      )}
    </div>
  );
}
