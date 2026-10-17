# AppverseSI — Tomorrow, Made Real (`https://appverse.si`)

Official **Next.js 14 + React 18 + Three.js/WebGL + TypeScript** project for **AppverseSI (Appverse Superintelligence)**, ready for deployment on **Vercel** via **GitHub** (`https://github.com/banarasikumar/AppverseSIG`).

## Visual & Engineering Highlights

1. **Real 3D Multi-Layered Universe (`src/shaders/blackHoleShaders.ts` & `src/components/BlackHoleCanvas.tsx`)**
   - **Singularity & Accretion Core**: Ray-deflected Schwarzschild event horizon shadow, asymmetric relativistic photon ring, Keplerian differential turbulence, and gravitationally lensed deep-space nebula.
   - **3D Logarithmic Spiral Galaxy**: Real 3D `THREE.Points` spiral galaxy with differential orbital rotation, per-star blackbody temperatures, and Airy-disk point spread.
   - **3D Connected Intelligence Lattice**: `THREE.LineSegments` orbital constellation with animated signal pulses representing AppverseSI's connected app and super-app vision.
2. **120 Hz High-Refresh Rate Engineering**
   - Uncapped `requestAnimationFrame` loop with delta-time-aware exponential smoothing (`1 - Math.exp(-lambda * dt)`), zero per-frame React state updates, and an automatic GPU frame-time resolution scaler.
   - Includes a live **Pause scene / Resume scene** control and full `prefers-reduced-motion` + WebGL fallback support.
3. **Complete Business & Product Narrative (`src/components/ScrollNarrative.tsx` & `src/lib/siteContent.ts`)**
   - **Hero (`#top`)**: *Tomorrow, made real.* Clear positioning for both in-house apps/super-apps and business software partnerships.
   - **01 / Our Products (`#apps`)**: Honest product pipeline and 3-stage roadmap toward connected super-apps.
   - **02 / Our Thinking (`#vision`)**: *Think in universes. Don't just add to the noise. Change the signal.*
   - **03 / The Frontier (`#frontier`)**: *Intelligence in formation* across intelligent applications, human-centred systems, and new paradigms.
   - **04 / The Studio (`#studio`)**: Business partnership offering for websites, custom web apps, and AI-enabled software.
   - **05 / Business Enquiries (`#inquiry`)**: Client- and server-validated enquiry flow (`POST /api/contact`) supporting `CONTACT_WEBHOOK_URL` and `RESEND_API_KEY` with a truthful fallback brief generator.
