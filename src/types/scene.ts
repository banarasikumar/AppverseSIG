export type QualityTier = 'ultra' | 'high' | 'medium' | 'low' | 'minimal';

export interface QualityProfile {
  tier: QualityTier;
  dpr: number;
  galaxyStarCount: number;
  constellationNodeCount: number;
  diskOctaves: number;
  prefersReducedMotion: boolean;
  webglSupported: boolean;
}

export type ChapterId =
  | 'top'
  | 'apps'
  | 'vision'
  | 'frontier'
  | 'studio'
  | 'inquiry';

export interface CameraKeyframe {
  /** Normalized scroll progress [0..1] */
  progress: number;
  chapterId: ChapterId;
  /** 3D PerspectiveCamera world position */
  position: [number, number, number];
  /** 3D PerspectiveCamera lookAt target */
  target: [number, number, number];
  /** Camera roll angle in radians */
  roll: number;
  /** Camera vertical FOV in degrees */
  fov: number;
  /** Screen-space offset for the singularity core */
  horizonOffset: [number, number];
  /** Apparent angular scale of the singularity & accretion disk */
  blackHoleScale: number;
  /** Accretion disk inclination angle in radians */
  diskTilt: number;
  /** Gravitational lensing deflection multiplier */
  lensingStrength: number;
  /** Relativistic Doppler beaming asymmetry */
  dopplerAsymmetry: number;
  /** Cosmic indigo/violet/stellar nebula intensity */
  nebulaIntensity: number;
  /** Visibility weight of the 3D connected intelligence lattice */
  latticeIntensity: number;
  /** Browser meta[name="theme-color"] value */
  themeColor: string;
}

export interface InterpolatedSceneState {
  scrollProgress: number;
  activeChapter: ChapterId;
  position: [number, number, number];
  target: [number, number, number];
  roll: number;
  fov: number;
  horizonOffset: [number, number];
  blackHoleScale: number;
  diskTilt: number;
  lensingStrength: number;
  dopplerAsymmetry: number;
  nebulaIntensity: number;
  latticeIntensity: number;
  themeColor: string;
}

export interface ProductCardItem {
  code: string;
  badge: string;
  status: string;
  title: string;
  tagline: string;
  description: string;
  specs: string[];
}

export interface PrincipleItem {
  index: string;
  label: string;
  title: string;
  description: string;
}

export interface FrontierFieldItem {
  code: string;
  title: string;
  status: string;
  description: string;
}

export interface StudioCapabilityItem {
  index: string;
  title: string;
  description: string;
  deliverables: string[];
}

export interface ContactSubmissionPayload {
  name: string;
  email: string;
  company?: string;
  projectType: 'web-app' | 'website-3d' | 'custom-software' | 'ai-workflow' | 'partnership';
  scope?: 'focused-mvp' | 'full-product' | 'long-term-partner' | 'undecided';
  message: string;
  website?: string; // Honeypot spam trap
}
