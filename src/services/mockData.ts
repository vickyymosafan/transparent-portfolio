export interface Language {
    name: string;
    percentage: number;
    color: string;
}

export interface Project {
    title: string;
    desc: string;
    tech: string[];
    category?: "Full Stack" | "Backend" | "Frontend";
    link?: string;
}

export const MOCK_GITHUB = {
    username: "vickyymosafan",
    contributions: 1146,
    top_languages: [
        { name: "TypeScript", percentage: 45, color: "#3178C6" },
        { name: "PHP", percentage: 20, color: "#4F5D95" },
        { name: "JavaScript", percentage: 15, color: "#F7DF1E" },
        { name: "C#", percentage: 10, color: "#178600" },
        { name: "Python", percentage: 10, color: "#3776AB" },
    ] as Language[]
};

export const MOCK_WAKATIME = {
    total_hours: "3,013",
    daily_average: "4 hrs 20 mins"
};

export const TECH_STACK = {
    Frontend: ["React", "Next.js", "Vue.js"],
    Backend: ["Node.js", "NestJS", "Express", "Laravel"],
    Database: ["PostgreSQL", "MySQL", "MongoDB"],
    "AI IDEs": ["Cursor", "Windsurf", "Antigravity", "Kiro"],
    Tools: ["VSCode", "Git", "GitHub"]
};

export const PROJECTS: Project[] = [
    // Full Stack
    {
        title: "AI SMARTCHAT",
        desc: "Advanced AI chat platform with context retention.",
        tech: ["Next.js", "Python", "AI integration"],
        category: "Full Stack"
    },
    {
        title: "ANTOSA ARCHITECT",
        desc: "Architectural portfolio and project management system.",
        tech: ["Vue.js", "Laravel", "MySQL"],
        category: "Full Stack"
    },
    {
        title: "SYSTEM PEMERINTAHAN",
        desc: "Government administration and tracking system.",
        tech: ["PHP", "CodeIgniter", "Bootstrap"],
        category: "Full Stack"
    },
    {
        title: "UNFOLLOWSCAN",
        desc: "Social media analytics tool for tracking engagement.",
        tech: ["Node.js", "React", "API"],
        category: "Full Stack"
    },
    // Backend
    {
        title: "BE POSYANDU DIGITAL",
        desc: "Backend API for health service digitization.",
        tech: ["NestJS", "PostgreSQL", "Docker"],
        category: "Backend"
    },
    {
        title: "BE PLAYLIST DOWNLOADER",
        desc: "High-performance media processing service.",
        tech: ["Python", "FastAPI", "FFmpeg"],
        category: "Backend"
    },
    {
        title: "BE POS INDOAUGUST",
        desc: "Point of Sale backend for retail management.",
        tech: ["Express", "MongoDB", "Redis"],
        category: "Backend"
    },
    // Frontend
    {
        title: "FE PENCATATAN POSYANDU",
        desc: "Frontend interface for Posyandu digital records.",
        tech: ["Next.js", "Tailwind", "React Query"],
        category: "Frontend"
    },
    {
        title: "FE POSYANDU DIGITAL",
        desc: "User-facing dashboard for public health data.",
        tech: ["React", "Vite", "ChakraUI"],
        category: "Frontend"
    }
];

export interface ExperienceEntry {
    company: string;
    location: string;
    period: string;
    role: string;
    bullets: string[];
}

export const EXPERIENCE: ExperienceEntry[] = [
    {
        company: "MQL5 Algo Trading",
        location: "Remote",
        period: "August 2026 — Present",
        role: "Algorithmic Trading Developer",
        bullets: [
            "Developed an automated algorithmic trading system (Expert Advisors) and custom technical indicators for the MetaTrader 5 platform using MQL5.",
            "Published and sold the financial software on the MQL5 Market, with ongoing maintenance through bug fixes, feature additions, and version updates to keep performance optimal for traders.",
        ],
    },
    {
        company: "Universitas Muhammadiyah Jember",
        location: "Jember Regency, East Java, Indonesia",
        period: "July 2025 — August 2026",
        role: "Freelance Website Developer",
        bullets: [
            "Developed a web-based elderly health monitoring system for Posyandu.",
            "Features include BMI checks, blood pressure (systolic and diastolic), cholesterol, and uric acid tracking, with automatic trend analysis and health status summaries.",
            "Built with Next.js on the frontend, Express.js + Prisma ORM on the backend, and PostgreSQL for the database.",
            "Designed for ease of use by Posyandu staff and accurate health data management.",
        ],
    },
    {
        company: "PT. Antosa Architect",
        location: "Jember Regency, East Java, Indonesia",
        period: "April 2025 — July 2025",
        role: "Project Web Architect — Information Systems",
        bullets: [
            "Designed and implemented a web-based information system to support architectural project management and company information needs.",
            "Responsible for system architecture, user interface (UI), and database design based on project requirements and business workflows.",
            "Built web features that improve management, accessibility, and operational efficiency, integrating frontend and backend into a functional, structured system.",
            "Applied modern web development practices with a focus on maintainability, usability, and system performance.",
        ],
    },
    {
        company: "PT Bank Mandiri (Persero) Tbk",
        location: "Remote",
        period: "February 2025 — March 2025",
        role: "Project-Based Virtual Intern: Mobile Apps Developer — Bank Mandiri \u00D7 Rakamin Academy",
        bullets: [
            "Completed a Virtual Internship Experience as a Mobile Apps Developer at Bank Mandiri through the Rakamin Academy program.",
            "Focused on Kotlin development, unit testing, API integration, and project management using GitLab.",
            "Developed NewsAPL, a mobile news application, available on GitHub.",
        ],
    },
];
