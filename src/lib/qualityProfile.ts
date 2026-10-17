import type { QualityProfile, QualityTier } from '@/types/scene';

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

/**
 * Verifies whether WebGL1 or WebGL2 can be initialized in the current browser.
 */
export function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return true;
  }
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Selects an initial hardware-aware rendering profile designed to sustain
 * 60–120 FPS on capable displays while degrading smoothly on mobile GPUs.
 */
export function computeQualityProfile(forceReducedMotion?: boolean): QualityProfile {
  if (typeof window === 'undefined') {
    return {
      tier: 'high',
      dpr: 1.5,
      galaxyStarCount: 2400,
      constellationNodeCount: 44,
      diskOctaves: 5,
      prefersReducedMotion: false,
      webglSupported: true,
    };
  }

  const webglSupported = detectWebGLSupport();
  const mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersReducedMotion = Boolean(forceReducedMotion ?? mediaReduced);

  const nav = window.navigator as NavigatorWithMemory;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const width = window.innerWidth;
  const isMobile = width < 768;
  const rawDpr = window.devicePixelRatio || 1;

  if (!webglSupported) {
    return {
      tier: 'minimal',
      dpr: 1,
      galaxyStarCount: 0,
      constellationNodeCount: 0,
      diskOctaves: 2,
      prefersReducedMotion,
      webglSupported: false,
    };
  }

  let tier: QualityTier = 'high';

  if (prefersReducedMotion) {
    tier = 'low';
  } else if (cores <= 2 || memory <= 2) {
    tier = 'low';
  } else if (isMobile) {
    tier = cores >= 6 && memory >= 4 ? 'medium' : 'low';
  } else if (cores >= 8 && memory >= 8) {
    tier = 'ultra';
  }

  switch (tier) {
    case 'ultra':
      return {
        tier,
        // Cap DPR at 1.65 so 120Hz ProMotion displays sustain high frame rates
        dpr: Math.min(rawDpr, 1.65),
        galaxyStarCount: 3000,
        constellationNodeCount: 56,
        diskOctaves: 5,
        prefersReducedMotion,
        webglSupported: true,
      };
    case 'high':
      return {
        tier,
        dpr: Math.min(rawDpr, 1.5),
        galaxyStarCount: 2200,
        constellationNodeCount: 44,
        diskOctaves: 4,
        prefersReducedMotion,
        webglSupported: true,
      };
    case 'medium':
      return {
        tier,
        dpr: Math.min(rawDpr, 1.25),
        galaxyStarCount: 1300,
        constellationNodeCount: 28,
        diskOctaves: 3,
        prefersReducedMotion,
        webglSupported: true,
      };
    case 'low':
    case 'minimal':
    default:
      return {
        tier,
        dpr: 1.0,
        galaxyStarCount: 700,
        constellationNodeCount: 18,
        diskOctaves: 3,
        prefersReducedMotion,
        webglSupported: true,
      };
  }
}
