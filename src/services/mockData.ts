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
