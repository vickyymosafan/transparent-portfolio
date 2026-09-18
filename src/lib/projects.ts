export interface Project {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  technologies: string[];
  year: string;
  role: string;
  metrics: string[];
  links: {
    demo?: string;
    github?: string;
  };
}

export const PROJECTS: Project[] = [
  {
    id: "intellichat-ai",
    title: "IntelliChat AI",
    category: "Autonomous AI System",
    tagline: "High-Speed Contextual AI Chatbot",
    description:
      "Modern fullstack AI chatbot integrating Groq API and DeepSeek open-source LLM for ultra-low latency contextual reasoning and real-time streaming tokens. Powered by MongoDB persistence and responsive Tailwind UI.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Groq API", "DeepSeek LLM", "MongoDB"],
    year: "2024",
    role: "Lead Fullstack Developer & AI Engineer",
    metrics: ["<350ms Time-to-First-Token", "Multi-turn Memory Stream", "Enterprise Context Parsing"],
    links: {
      github: "https://github.com/vickyymosafan",
    },
  },
  {
    id: "smart-kost",
    title: "Smart Kost Management",
    category: "Fullstack Web Platform",
    tagline: "Comprehensive Boarding House Management",
    description:
      "All-in-one web application for boarding house search, booking, billing automation, and tenant communication. Built with Vite and TypeScript with reactive search filters and automated rent ledger.",
    technologies: ["Vite", "TypeScript", "React", "Tailwind CSS", "REST API", "Zustand"],
    year: "2024",
    role: "Frontend Architect & Product Engineer",
    metrics: ["Instant Filtering (<50ms)", "Automated Invoice Generation", "Mobile-first Tenant Portal"],
    links: {
      github: "https://github.com/vickyymosafan",
    },
  },
  {
    id: "interactive-gaming",
    title: "Interactive Gaming Platform",
    category: "Interactive Web Experience",
    tagline: "High-Performance Gaming Services",
    description:
      "Dynamic interactive platform featuring fluid micro-animations, real-time matchmaking & service pipelines, and transaction tracking with relational MySQL database.",
    technologies: ["HTML5", "CSS3", "JavaScript", "PHP", "MySQL", "GSAP"],
    year: "2023",
    role: "Interactive Frontend & Backend Developer",
    metrics: ["Fluid 60FPS UI Animations", "Zero-friction Checkout Flow", "Real-time Order Status Pipeline"],
    links: {
      github: "https://github.com/vickyymosafan",
    },
  },
  {
    id: "webgl-experiments",
    title: "3D / WebGL Experiments",
    category: "Creative Technology",
    tagline: "Procedural Architectural 3D Worlds",
    description:
      "Explorations in real-time procedural shaders, PBR lighting models, custom geometry pipelines, and camera choreography using Three.js and React Three Fiber.",
    technologies: ["Three.js", "React Three Fiber", "GLSL Shaders", "TypeScript", "GSAP"],
    year: "2024",
    role: "Creative 3D Developer",
    metrics: ["60 FPS Mobile Performance", "Zero-Blender Procedural Meshes", "Physically Grounded Aesthetics"],
    links: {
      github: "https://github.com/vickyymosafan",
    },
  },
  {
    id: "ai-automation",
    title: "AI Automation System",
    category: "Applied Machine Intelligence",
    tagline: "Autonomous Workflow & Agentic Pipelines",
    description:
      "Intelligent orchestration system leveraging agentic loops, prompt distillation, and function calling to automate enterprise workflows and digital media publishing.",
    technologies: ["TypeScript", "Next.js", "Python", "Vector Embeddings", "FastAPI"],
    year: "2024",
    role: "Systems & AI Developer",
    metrics: ["85% Manual Task Reduction", "Sub-second Pipeline Dispatch", "Reliable Structured Outputs"],
    links: {
      github: "https://github.com/vickyymosafan",
    },
  },
];
