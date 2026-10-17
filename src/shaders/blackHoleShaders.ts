/**
 * Custom GLSL ES 1.00 Shaders for the AppverseSI 3D Cosmic Intelligence Universe.
 *
 * Includes three shader programs:
 * 1. `blackHoleVertexShader` + `blackHoleFragmentShader`:
 *    Full-viewport ray-deflected singularity, Schwarzschild event horizon shadow,
 *    asymmetric relativistic photon ring, Keplerian turbulent accretion disk, and
 *    gravitationally lensed deep-space indigo/violet/stellar nebula.
 * 2. `starfieldVertexShader` + `starfieldFragmentShader`:
 *    Real 3D logarithmic spiral galaxy & deep-space starfield with per-star
 *    blackbody color temperature, orbital rotation, and Airy-disk point spread.
 * 3. `latticeVertexShader` + `latticeFragmentShader`:
 *    3D connected super-app constellation filaments with distance-attenuated
 *    signal pulses representing interconnected digital experiences.
 */

export const blackHoleVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const blackHoleFragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec2 uHorizonOffset;
uniform float uBlackHoleScale;
uniform float uDiskTilt;
uniform float uCameraRoll;
uniform float uLensingStrength;
uniform float uDopplerAsymmetry;
uniform float uNebulaIntensity;
uniform float uScrollProgress;
uniform int uOctaves;

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    if (i >= octaves) break;
    value += amplitude * noise2D(p);
    p = rot * p * 2.03 + vec2(13.7, 9.2);
    amplitude *= 0.5;
  }
  return value;
}

mat2 rotate2D(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

// Cosmic palette: deep indigo/violet outer gas transitioning to warm stellar amber & white-gold core
vec3 accretionColorRamp(float temp, float azureMix) {
  float t = clamp(temp, 0.0, 1.0);
  vec3 outerCosmic = mix(vec3(0.24, 0.08, 0.04), vec3(0.12, 0.22, 0.48), azureMix);
  vec3 midLuminous = mix(vec3(0.88, 0.48, 0.18), vec3(0.45, 0.68, 0.98), azureMix * 0.42);
  vec3 innerCore   = vec3(0.99, 0.96, 0.91);
  vec3 col = mix(outerCosmic, midLuminous, smoothstep(0.0, 0.56, t));
  col = mix(col, innerCore, smoothstep(0.50, 1.0, t));
  return col;
}

vec3 sampleDeepSpace(vec2 lensedUv, float deflectionAmount, int octaves) {
  int oct1 = (octaves - 1 > 2) ? (octaves - 1) : 2;
  int oct2 = (octaves - 2 > 2) ? (octaves - 2) : 2;

  vec2 nebulaCoord = lensedUv * 1.4 + vec2(0.35, -0.18);
  float dustPrimary = fbm(nebulaCoord, oct1);
  float dustSecondary = fbm(nebulaCoord * 2.15 - vec2(1.6, 0.65), oct2);

  vec3 spaceBase = vec3(0.010, 0.013, 0.025);
  vec3 indigoNebula = vec3(0.045, 0.085, 0.19) * smoothstep(0.32, 0.86, dustPrimary);
  vec3 violetFilament = vec3(0.095, 0.055, 0.16) * smoothstep(0.42, 0.88, dustSecondary);
  vec3 warmDust = vec3(0.11, 0.055, 0.03) * smoothstep(0.48, 0.92, dustPrimary * dustSecondary * 1.4);

  // Gravitationally lensed background micro-starfield
  vec2 starGrid1 = lensedUv * 40.0;
  vec2 cell1 = floor(starGrid1);
  vec2 local1 = fract(starGrid1) - 0.5;
  float seed1 = hash21(cell1);
  float star1 = 0.0;
  if (seed1 > 0.964) {
    vec2 starOffset = (vec2(hash21(cell1 + 7.1), hash21(cell1 + 19.3)) - 0.5) * 0.62;
    float d = length(local1 - starOffset);
    star1 = smoothstep(0.085, 0.0, d) * fract(seed1 * 43.0);
  }

  vec2 starGrid2 = lensedUv * 82.0 + 14.7;
  vec2 cell2 = floor(starGrid2);
  vec2 local2 = fract(starGrid2) - 0.5;
  float seed2 = hash21(cell2);
  float star2 = 0.0;
  if (seed2 > 0.977) {
    float d2 = length(local2);
    star2 = smoothstep(0.06, 0.0, d2) * 0.68;
  }

  vec3 starColor1 = mix(vec3(0.74, 0.85, 1.0), vec3(1.0, 0.90, 0.76), fract(seed1 * 17.0));
  vec3 stars = starColor1 * star1 + vec3(0.80, 0.88, 1.0) * star2;

  float einsteinBoost = 1.0 + clamp(deflectionAmount * 1.55, 0.0, 2.4);

  return spaceBase + (indigoNebula + violetFilament + warmDust) * uNebulaIntensity + stars * einsteinBoost;
}

vec4 evaluateDiskSample(
  vec2 diskCoord,
  float radius,
  float innerRadius,
  float outerRadius,
  float dopplerSign,
  int octaves
) {
  if (radius <= innerRadius || radius >= outerRadius) {
    return vec4(0.0);
  }

  float radialNorm = clamp((radius - innerRadius) / (outerRadius - innerRadius), 0.0, 1.0);

  float innerFade = smoothstep(0.0, 0.07, radialNorm);
  float outerFade = 1.0 - smoothstep(0.30, 1.0, radialNorm);
  float radialEnvelope = innerFade * outerFade * outerFade;

  float angle = atan(diskCoord.y, diskCoord.x);
  float keplerSpeed = 1.18 / pow(max(radius, 0.18), 1.35);
  float advectedAngle = angle + uTime * 0.24 * keplerSpeed;

  vec2 spiralUv = vec2(
    radius * 6.8,
    sin(advectedAngle * 2.0) * 1.35 + cos(advectedAngle * 3.0) * 0.85
  );
  float turbulence = fbm(spiralUv + vec2(uTime * 0.06, -uTime * 0.04), octaves);

  float filamentWave = sin(radius * 40.0 + turbulence * 6.8 - uTime * 0.48) * 0.5 + 0.5;
  float filamentDetail = mix(0.52, 1.28, smoothstep(0.18, 0.86, filamentWave));

  float beaming = 1.0 + dopplerSign * uDopplerAsymmetry * 0.60 * (1.0 - radialNorm * 0.45);
  beaming = clamp(beaming, 0.26, 1.90);

  float temperature = pow(1.0 - radialNorm, 0.62) * mix(0.76, 1.20, turbulence) * mix(0.84, 1.16, (beaming - 0.5));
  float azureMix = smoothstep(0.25, 0.92, radialNorm) * (0.45 + 0.35 * sin(uScrollProgress * 3.14159));
  vec3 diskColor = accretionColorRamp(temperature, azureMix) * beaming * filamentDetail;

  float density = radialEnvelope * mix(0.44, 1.12, turbulence);
  return vec4(diskColor * density * 1.48, clamp(density, 0.0, 0.96));
}

void main() {
  vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
  vec2 p = (vUv - 0.5) * aspect;

  float mobileScale = uResolution.x < 768.0 ? 0.76 : 1.0;
  float scale = max(uBlackHoleScale * mobileScale, 0.45);

  vec2 pointerShift = uPointer * vec2(0.048, 0.036);
  vec2 centerOffset = uHorizonOffset * (uResolution.x < 768.0 ? vec2(0.28, 0.72) : vec2(1.0, 1.0));
  vec2 rel = (p - centerOffset - pointerShift) / scale;

  rel = rotate2D(uCameraRoll - 0.19 + uPointer.x * 0.035) * rel;

  float r = length(rel);
  vec2 dir = r > 0.0001 ? rel / r : vec2(0.0, 1.0);

  float eventHorizonRadius = 0.202;
  float photonRingRadius   = 0.221;
  float diskInnerRadius    = 0.242;
  float diskOuterRadius    = 1.15;

  float safeR = max(r, eventHorizonRadius * 0.92);
  float deflection = uLensingStrength * (eventHorizonRadius * eventHorizonRadius) / (safeR * safeR + 0.011);
  vec2 lensedBgUv = p - dir * deflection * scale;

  // 1. Deep space background with gravitational deflection
  vec3 color = sampleDeepSpace(lensedBgUv, deflection, uOctaves);

  // 2. Lensed Rear Accretion Disk bent over upper & lower shadow arches
  float tilt = clamp(uDiskTilt + uPointer.y * 0.05, 0.08, 0.65);
  float lensingWarp = (eventHorizonRadius * 1.18) / max(r, 0.06);
  vec2 rearDiskCoord = vec2(
    rel.x,
    rel.y / mix(tilt, 0.93, clamp(lensingWarp * 0.66, 0.0, 1.0))
  );
  float archRadius = mix(length(rearDiskCoord), r * (1.0 + deflection * 0.84), smoothstep(0.18, 0.56, r));
  float dopplerFactor = -rel.x / max(r, 0.15);

  vec4 rearDisk = evaluateDiskSample(
    rearDiskCoord,
    archRadius,
    diskInnerRadius,
    diskOuterRadius * 0.96,
    dopplerFactor,
    uOctaves
  );
  float outsideShadowMask = smoothstep(eventHorizonRadius * 0.96, eventHorizonRadius * 1.06, r);
  color += rearDisk.rgb * outsideShadowMask * 0.74;

  // 3. Event Horizon Shadow (true light-absorbing singularity silhouette)
  float horizonMask = smoothstep(eventHorizonRadius * 0.985, eventHorizonRadius * 1.02, r);
  color *= horizonMask;

  // 4. Relativistic Photon Ring
  float photonDist = abs(r - photonRingRadius);
  float photonCore = exp(-photonDist * 118.0);
  float photonHalo = exp(-photonDist * 27.0) * 0.40;
  float photonAsymmetry = 1.0 + 0.56 * (-rel.x / max(r, 0.05)) * uDopplerAsymmetry;
  vec3 photonColor = mix(vec3(0.68, 0.82, 1.0), vec3(1.0, 0.94, 0.84), clamp(photonAsymmetry * 0.52, 0.0, 1.0));
  color += photonColor * (photonCore * 1.2 + photonHalo) * photonAsymmetry * smoothstep(eventHorizonRadius * 0.94, eventHorizonRadius * 1.04, r);

  // 5. Primary Foreground Equatorial Accretion Disk
  vec2 frontDiskCoord = vec2(rel.x, rel.y / tilt);
  float frontRadius = length(frontDiskCoord);
  vec4 frontDisk = evaluateDiskSample(
    frontDiskCoord,
    frontRadius,
    diskInnerRadius,
    diskOuterRadius,
    dopplerFactor,
    uOctaves
  );

  float nearSidePass = smoothstep(0.04, -0.05, rel.y);
  float foregroundVisibility = max(nearSidePass, outsideShadowMask);
  color = mix(color, color + frontDisk.rgb * 1.1, frontDisk.a * foregroundVisibility);

  // 6. Subtle cosmic corona & ACES filmic tone mapping
  float corona = exp(-max(r - eventHorizonRadius, 0.0) * 3.1) * 0.16;
  color += mix(vec3(0.84, 0.48, 0.20), vec3(0.35, 0.58, 0.95), 0.38) * corona * outsideShadowMask;

  color = (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14);

  float vignette = smoothstep(1.40, 0.34, length((vUv - 0.5) * vec2(1.15, 1.0)));
  color *= mix(0.48, 1.0, vignette);

  color = pow(max(color, vec3(0.0)), vec3(1.0 / 2.2));

  gl_FragColor = vec4(color, 1.0);
}
`;

export const starfieldVertexShader = /* glsl */ `
attribute float aScale;
attribute float aTemperature;
attribute float aPhase;
attribute float aArmMix;

varying float vTemperature;
varying float vAlpha;
varying float vArmMix;

uniform float uTime;
uniform float uPixelRatio;
uniform float uSizeMultiplier;

void main() {
  vTemperature = aTemperature;
  vArmMix = aArmMix;

  // Slow differential orbital rotation of the 3D spiral galaxy
  float r = length(position.xz);
  float orbitalAngle = uTime * (0.028 / (1.0 + r * 0.12));
  float s = sin(orbitalAngle);
  float c = cos(orbitalAngle);
  vec3 rotatedPos = vec3(
    position.x * c - position.z * s,
    position.y,
    position.x * s + position.z * c
  );

  vec4 mvPosition = modelViewMatrix * vec4(rotatedPos, 1.0);
  float dist = max(-mvPosition.z, 0.5);

  float twinkle = 0.80 + 0.20 * sin(uTime * 1.5 + aPhase * 6.2831);
  float depthFade = smoothstep(32.0, 2.2, dist) * smoothstep(0.5, 2.0, dist);
  vAlpha = twinkle * depthFade;

  gl_PointSize = clamp((aScale * uSizeMultiplier * uPixelRatio * 15.0) / dist, 1.0, 7.5);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const starfieldFragmentShader = /* glsl */ `
precision mediump float;

varying float vTemperature;
varying float vAlpha;
varying float vArmMix;

void main() {
  vec2 centered = gl_PointCoord - vec2(0.5);
  float d = length(centered);
  if (d > 0.5) discard;

  float core = exp(-d * d * 24.0);
  float halo = smoothstep(0.5, 0.0, d) * 0.36;
  float intensity = core + halo;

  vec3 coolAzure = vec3(0.66, 0.82, 1.0);
  vec3 pureWhite = vec3(0.97, 0.98, 1.0);
  vec3 warmAmber = vec3(1.0, 0.83, 0.62);
  vec3 violetTint = vec3(0.76, 0.68, 1.0);

  vec3 starColor = vTemperature < 0.5
    ? mix(coolAzure, pureWhite, vTemperature * 2.0)
    : mix(pureWhite, warmAmber, (vTemperature - 0.5) * 2.0);
  starColor = mix(starColor, violetTint, vArmMix * 0.28);

  gl_FragColor = vec4(starColor, intensity * vAlpha * 0.88);
}
`;

export const latticeVertexShader = /* glsl */ `
attribute float aPulseOffset;

varying float vPulse;
varying float vDepthFade;

uniform float uTime;
uniform float uLatticeIntensity;

void main() {
  float angle = uTime * 0.035;
  float s = sin(angle);
  float c = cos(angle);
  vec3 rotatedPos = vec3(
    position.x * c - position.z * s,
    position.y,
    position.x * s + position.z * c
  );

  vec4 mvPosition = modelViewMatrix * vec4(rotatedPos, 1.0);
  float dist = max(-mvPosition.z, 0.5);

  vPulse = 0.5 + 0.5 * sin(uTime * 1.8 + aPulseOffset * 6.2831);
  vDepthFade = smoothstep(22.0, 3.0, dist) * uLatticeIntensity;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const latticeFragmentShader = /* glsl */ `
precision mediump float;

varying float vPulse;
varying float vDepthFade;

void main() {
  vec3 baseLine = vec3(0.38, 0.62, 0.98);
  vec3 activeSignal = vec3(0.98, 0.86, 0.68);
  vec3 col = mix(baseLine, activeSignal, smoothstep(0.65, 1.0, vPulse));
  float alpha = (0.09 + 0.18 * vPulse) * vDepthFade;
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.38));
}
`;
