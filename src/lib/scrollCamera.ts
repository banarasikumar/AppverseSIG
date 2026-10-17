import type {
  CameraKeyframe,
  ChapterId,
  InterpolatedSceneState,
} from '@/types/scene';

/**
 * 6 spatial keyframes guiding the 3D camera and singularity shader parameters
 * continuously from the Arrival Hero (#top) through Our Apps (#apps),
 * Our Thinking (#vision), The Frontier (#frontier), Studio (#studio),
 * and Business Enquiries (#inquiry).
 */
export const CAMERA_KEYFRAMES: readonly CameraKeyframe[] = [
  {
    progress: 0.0,
    chapterId: 'top',
    position: [0.0, 0.55, 11.8],
    target: [-0.32, 0.04, 0.0],
    roll: -0.05,
    fov: 42,
    horizonOffset: [0.19, 0.03],
    blackHoleScale: 0.96,
    diskTilt: 0.25,
    lensingStrength: 1.05,
    dopplerAsymmetry: 0.72,
    nebulaIntensity: 0.62,
    latticeIntensity: 0.35,
    themeColor: '#030408',
  },
  {
    progress: 0.2,
    chapterId: 'apps',
    position: [2.1, 1.15, 8.2],
    target: [0.15, -0.05, 0.0],
    roll: -0.12,
    fov: 45,
    horizonOffset: [-0.18, 0.02],
    blackHoleScale: 1.18,
    diskTilt: 0.34,
    lensingStrength: 1.2,
    dopplerAsymmetry: 0.78,
    nebulaIntensity: 0.74,
    latticeIntensity: 0.88,
    themeColor: '#050710',
  },
  {
    progress: 0.42,
    chapterId: 'vision',
    position: [-1.45, 0.22, 5.2],
    target: [0.0, 0.0, 0.0],
    roll: 0.08,
    fov: 49,
    horizonOffset: [0.16, -0.01],
    blackHoleScale: 1.52,
    diskTilt: 0.14,
    lensingStrength: 1.48,
    dopplerAsymmetry: 0.92,
    nebulaIntensity: 0.86,
    latticeIntensity: 0.65,
    themeColor: '#08070d',
  },
  {
    progress: 0.64,
    chapterId: 'frontier',
    position: [0.85, 2.55, 6.6],
    target: [-0.18, -0.22, 0.0],
    roll: -0.07,
    fov: 46,
    horizonOffset: [-0.16, -0.05],
    blackHoleScale: 1.28,
    diskTilt: 0.48,
    lensingStrength: 1.26,
    dopplerAsymmetry: 0.74,
    nebulaIntensity: 0.92,
    latticeIntensity: 0.95,
    themeColor: '#060914',
  },
  {
    progress: 0.84,
    chapterId: 'studio',
    position: [-0.95, 1.65, 8.6],
    target: [0.12, -0.18, 0.0],
    roll: 0.04,
    fov: 43,
    horizonOffset: [0.17, 0.04],
    blackHoleScale: 1.04,
    diskTilt: 0.38,
    lensingStrength: 1.1,
    dopplerAsymmetry: 0.66,
    nebulaIntensity: 0.68,
    latticeIntensity: 0.72,
    themeColor: '#04060c',
  },
  {
    progress: 1.0,
    chapterId: 'inquiry',
    position: [0.0, 1.45, 10.8],
    target: [0.0, -0.42, 0.0],
    roll: 0.0,
    fov: 40,
    horizonOffset: [0.0, 0.24],
    blackHoleScale: 0.82,
    diskTilt: 0.33,
    lensingStrength: 0.94,
    dopplerAsymmetry: 0.58,
    nebulaIntensity: 0.5,
    latticeIntensity: 0.45,
    themeColor: '#030408',
  },
];

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

/**
 * C2-continuous quintic easing (`6t^5 - 15t^4 + 10t^3`) for zero-jerk transitions.
 */
export function smootherstep01(t: number): number {
  const c = clamp01(t);
  return c * c * c * (c * (c * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpVec2(a: [number, number], b: [number, number], t: number): [number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
}

function lerpVec3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function evaluateScrollSceneState(
  rawProgress: number,
  prefersReducedMotion = false
): InterpolatedSceneState {
  const progress = clamp01(rawProgress);

  let activeChapter: ChapterId = 'top';
  let themeColor = CAMERA_KEYFRAMES[0].themeColor;
  for (let i = CAMERA_KEYFRAMES.length - 1; i >= 0; i--) {
    if (progress >= CAMERA_KEYFRAMES[i].progress - 0.08) {
      activeChapter = CAMERA_KEYFRAMES[i].chapterId;
      themeColor = CAMERA_KEYFRAMES[i].themeColor;
      break;
    }
  }

  if (prefersReducedMotion) {
    const base = CAMERA_KEYFRAMES[0];
    return {
      scrollProgress: progress,
      activeChapter,
      position: [...base.position],
      target: [...base.target],
      roll: 0,
      fov: base.fov,
      horizonOffset: [base.horizonOffset[0] * 0.45, base.horizonOffset[1]],
      blackHoleScale: 0.95,
      diskTilt: base.diskTilt,
      lensingStrength: base.lensingStrength,
      dopplerAsymmetry: base.dopplerAsymmetry,
      nebulaIntensity: base.nebulaIntensity,
      latticeIntensity: 0.5,
      themeColor,
    };
  }

  let lowerIndex = 0;
  for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
    if (progress >= CAMERA_KEYFRAMES[i].progress) {
      lowerIndex = i;
    }
  }
  const upperIndex = Math.min(lowerIndex + 1, CAMERA_KEYFRAMES.length - 1);
  const k0 = CAMERA_KEYFRAMES[lowerIndex];
  const k1 = CAMERA_KEYFRAMES[upperIndex];

  const span = k1.progress - k0.progress;
  const localT = span > 0.0001 ? (progress - k0.progress) / span : 0;
  const t = smootherstep01(localT);

  return {
    scrollProgress: progress,
    activeChapter,
    position: lerpVec3(k0.position, k1.position, t),
    target: lerpVec3(k0.target, k1.target, t),
    roll: lerp(k0.roll, k1.roll, t),
    fov: lerp(k0.fov, k1.fov, t),
    horizonOffset: lerpVec2(k0.horizonOffset, k1.horizonOffset, t),
    blackHoleScale: lerp(k0.blackHoleScale, k1.blackHoleScale, t),
    diskTilt: lerp(k0.diskTilt, k1.diskTilt, t),
    lensingStrength: lerp(k0.lensingStrength, k1.lensingStrength, t),
    dopplerAsymmetry: lerp(k0.dopplerAsymmetry, k1.dopplerAsymmetry, t),
    nebulaIntensity: lerp(k0.nebulaIntensity, k1.nebulaIntensity, t),
    latticeIntensity: lerp(k0.latticeIntensity, k1.latticeIntensity, t),
    themeColor,
  };
}
