// Types
export interface Language {
    name: string;
    percentage: number;
    color: string;
}

export interface Project {
    title: string;
    desc: string;
    tech: string[];
    link: string;
}

export const MOCK_GITHUB = {
    username: "code_wizard_99",
    repos: 42,
    contributions: 1337,
    commits_this_year: 850,
    top_languages: [
        { name: "TypeScript", percentage: 65, color: "#3178c6" },
        { name: "Rust", percentage: 20, color: "#dea584" },
        { name: "Python", percentage: 10, color: "#3572A5" },
        { name: "Go", percentage: 5, color: "#00ADD8" },
    ] as Language[],
};

export const MOCK_WAKATIME = {
    total_hours: "4,500+",
    daily_average: "6 hrs 12 mins",
    languages: [
        { name: "TypeScript", time: "2,000 hrs" },
        { name: "React", time: "1,200 hrs" },
        { name: "NestJS", time: "800 hrs" },
    ],
    editor: "VS Code (99%)",
};

export const PROJECTS: Project[] = [
    {
        title: "E-Commerce Microservices",
        desc: "A high-scale system handling 10k req/s using NestJS and Kafka.",
        tech: ["NestJS", "Kafka", "Redis"],
        link: "#",
    },
    {
        title: "AI Agent Platform",
        desc: "Autonomous coding agents built with Python and LangChain.",
        tech: ["Python", "LangChain", "OpenAI"],
        link: "#",
    },
    {
        title: "Crypto Dashboard",
        desc: "Real-time WebSockets processing for crypto arbitrage.",
        tech: ["Next.js", "WebSockets", "D3.js"],
        link: "#",
    },
];
