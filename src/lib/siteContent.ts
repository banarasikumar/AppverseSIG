import type {
  FrontierFieldItem,
  PrincipleItem,
  ProductCardItem,
  StudioCapabilityItem,
} from '@/types/scene';

export const PRODUCT_PIPELINE: readonly ProductCardItem[] = [
  {
    code: 'APPVERSESI / IN-HOUSE',
    badge: 'FOUNDATION ACTIVE',
    status: 'IN-HOUSE PORTFOLIO',
    title: 'Made here. Released with purpose.',
    tagline: 'Focused applications built from first principles.',
    description:
      'We design, engineer, and publish our own software products in-house. Every application starts with a clear everyday utility—engineered for speed, visual clarity, and zero bloat.',
    specs: [
      'Independent consumer & productivity apps',
      'High-frame-rate, responsive interfaces',
      'Engineered and maintained directly by AppverseSI',
    ],
  },
  {
    code: 'PRODUCT PIPELINE / 001',
    badge: 'IN DEVELOPMENT',
    status: 'REVEALED WHEN READY',
    title: 'Built with intent. Announced when ready.',
    tagline: 'Our first flagship release is currently in development.',
    description:
      'We do not publish vapourware, mock screenshots, or premature countdowns. This space is reserved to introduce each AppverseSI application the moment it is ready for people to use.',
    specs: [
      'Currently in active internal engineering',
      'Built for web and mobile-first workflows',
      'Public release details published upon completion',
    ],
  },
  {
    code: 'ECOSYSTEM / CONVERGENCE',
    badge: 'LONG-TERM ARCHITECTURE',
    status: 'SUPER-APP HORIZON',
    title: 'Connected digital experiences.',
    tagline: 'From standalone apps to a unified super-app fabric.',
    description:
      'Over time, our individual products are architected to work together naturally—sharing identity, context, and intelligent workflows so users can move across tasks inside one cohesive ecosystem.',
    specs: [
      'Shared cross-application state & identity layer',
      'Composable workflows across separate tools',
      'AI-assisted continuity without interface clutter',
    ],
  },
];

export const ROADMAP_PILLARS = [
  {
    index: '01',
    title: 'Useful Independent Apps',
    detail: 'Ship focused, high-craft applications that solve real problems immediately on their own.',
  },
  {
    index: '02',
    title: 'Connected Digital Experiences',
    detail: 'Bridge standalone products so workflows, preferences, and intelligence carry effortlessly between them.',
  },
  {
    index: '03',
    title: 'Long-Term Super-App Ambition',
    detail: 'Unify our growing ecosystem into an integrated super-app platform where everyday tools work as one.',
  },
] as const;

export const CORE_PRINCIPLES: readonly PrincipleItem[] = [
  {
    index: '01 / CURIOSITY',
    label: 'FIRST PRINCIPLES',
    title: 'Ask the bigger question.',
    description:
      'Look beyond convention and template software. Imagine what a digital experience should feel like from first principles, then work backward with rigorous discipline.',
  },
  {
    index: '02 / ENGINEERING',
    label: 'EXECUTION & CRAFT',
    title: 'Make the impossible tangible.',
    description:
      'Ambition only matters when it ships as fast, reliable, thoughtfully considered software. We treat frame pacing, architecture, and usability as inseparable.',
  },
  {
    index: '03 / INTELLIGENCE',
    label: 'LONG HORIZON',
    title: 'Build toward the horizon.',
    description:
      'Every generation of software we write is structured so the next layer of intelligence can integrate cleanly—amplifying human capability rather than adding noise.',
  },
];

export const FRONTIER_FIELDS: readonly FrontierFieldItem[] = [
  {
    code: 'A / 01',
    title: 'Intelligent applications',
    status: 'IN DEVELOPMENT',
    description:
      'Software designed around new ways to think, synthesize, create, and solve complex everyday problems with AI-native assistance.',
  },
  {
    code: 'A / 02',
    title: 'Human-centred systems',
    status: 'IN DEVELOPMENT',
    description:
      'Calm, high-velocity interfaces that strip away mechanical friction and make sophisticated multi-step workflows feel immediate.',
  },
  {
    code: 'A / 03',
    title: 'New software paradigms',
    status: 'EVOLVING',
    description:
      'Exploring how real-time 3D spatial computing, adaptive interfaces, and connected super-app architectures reshape digital products.',
  },
];

export const STUDIO_CAPABILITIES: readonly StudioCapabilityItem[] = [
  {
    index: 'CAPABILITY / 01',
    title: 'Websites with a point of view',
    description:
      'Distinctive, high-performance web experiences—including real-time 3D/WebGL and interactive storytelling—that make a company feel unmistakably itself.',
    deliverables: [
      'Flagship brand & product websites',
      'Interactive 3D / WebGL experiences',
      'Responsive desktop & mobile performance optimization',
    ],
  },
  {
    index: 'CAPABILITY / 02',
    title: 'Custom web & product applications',
    description:
      'Useful, fast applications engineered around real workflows and real people—from focused MVPs to full-scale customer-facing platforms.',
    deliverables: [
      'Full-stack Next.js, React & TypeScript apps',
      'Mobile-responsive SaaS & consumer interfaces',
      'Clean design systems built to scale',
    ],
  },
  {
    index: 'CAPABILITY / 03',
    title: 'AI workflows & software engineering',
    description:
      'Careful technical implementation, resilient backend architecture, and practical integration of modern AI capabilities with room to evolve.',
    deliverables: [
      'AI-enabled product features & automation',
      'API architecture & cloud deployment (Vercel / edge)',
      'Long-term technical iteration & refinement',
    ],
  },
];

export const STUDIO_STEPS = [
  {
    step: '01',
    title: 'Scope & First Principles',
    detail: 'We define the exact problem, user outcome, and technical architecture before writing code.',
  },
  {
    step: '02',
    title: 'Design & Interactive Direction',
    detail: 'We craft typography, spatial layout, motion, and responsive interaction states with zero template filler.',
  },
  {
    step: '03',
    title: 'Full-Stack & 3D Engineering',
    detail: 'We build with production TypeScript, React, Next.js, and custom WebGL shaders tuned for high-refresh displays.',
  },
  {
    step: '04',
    title: 'Verification & Launch',
    detail: 'We test across desktop and mobile viewports, verify accessibility and fallbacks, and deploy cleanly.',
  },
] as const;
