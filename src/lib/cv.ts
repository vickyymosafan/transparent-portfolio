/**
 * Developer CV & Profile Source of Truth
 * Strictly based on M. Vicky Mosafan's official CV document.
 * Antislop compliant: No em dashes, no fabricated facts or dates.
 */

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period?: string;
  description: string;
  category: "leadership" | "teaching" | "community";
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  major: string;
  highlights: string[];
}

export interface SkillCategory {
  title: string;
  skills: string[];
  focus: string;
}

export const CV_DATA = {
  name: "M. Vicky Mosafan",
  role: "Creative Frontend Developer",
  focus: "AI x Web x 3D",
  bio: "Creative frontend developer focused on building interactive, high-performance web experiences. Combining modern architectural aesthetics, real-time 3D graphics, and responsive web technologies.",
  location: "Indonesia",
  contact: {
    email: "vickymosafan@gmail.com",
    github: "https://github.com/vickyymosafan",
    linkedin: "https://linkedin.com/in/vickymosafan",
  },
  education: [
    {
      institution: "SMAN 1 Situbondo",
      degree: "High School Diploma",
      period: "2018 - 2020",
      major: "Science Major (MIPA)",
      highlights: [
        "Focused study in mathematics and natural sciences",
        "Foundational logic and computer science exploration",
      ],
    },
  ] as EducationItem[],
  experience: [
    {
      id: "prog-tutor",
      role: "Interactive Programming Tutor",
      organization: "Elementary School Educational Initiative",
      description: "Taught computational thinking and foundational logic to elementary students using interactive visual programming tools.",
      category: "teaching",
    },
    {
      id: "rtik-volunteer",
      role: "Volunteer Assistant",
      organization: "RTIK (Relawan TIK) Jember",
      description: "Assisted in digital literacy workshops and information technology empowerment programs for local community members.",
      category: "community",
    },
    {
      id: "diklat-speaker",
      role: "Guest Speaker on Design and Programming",
      organization: "Diklat Workshop Series",
      description: "Delivered presentations and hands-on sessions on modern web design principles and frontend programming techniques.",
      category: "teaching",
    },
    {
      id: "maba-moderator",
      role: "Moderator of Welcoming Maba",
      organization: "University Orientation Program",
      description: "Facilitated orientation sessions and panels for incoming university students.",
      category: "leadership",
    },
    {
      id: "sisfo-coordinator",
      role: "Event Coordinator",
      organization: "Sisfo Insinco",
      description: "Led event organization, timeline management, and technical team coordination for Information Systems conferences.",
      category: "leadership",
    },
    {
      id: "recruitment-coordinator",
      role: "Student Organization Recruitment Coordinator",
      organization: "Student Executive Board",
      description: "Orchestrated recruitment pipelines, candidate evaluations, and onboarding for organizational members.",
      category: "leadership",
    },
    {
      id: "diklat-logistics",
      role: "Event Logistics Lead",
      organization: "Diklat Program Studi Sistem Informasi",
      description: "Managed physical inventory, venue setup, and logistical operations for academic training programs.",
      category: "leadership",
    },
    {
      id: "session-leader",
      role: "Session Leader",
      organization: "Academic Study & Development Groups",
      description: "Directed technical study groups in programming fundamentals, problem solving, and interface design.",
      category: "leadership",
    },
  ] as ExperienceItem[],
  skills: [
    {
      title: "Core Frontend & Frameworks",
      skills: ["ReactJS", "Next.js", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "Tailwind CSS"],
      focus: "Responsive design, type-safe architecture, component design systems",
    },
    {
      title: "3D & Creative Web",
      skills: ["Three.js", "React Three Fiber", "GLSL Shaders", "GSAP Animations", "Blender Workflow"],
      focus: "Interactive 3D environments, PBR lighting, performant canvas rendering",
    },
    {
      title: "Backend, Database & Tools",
      skills: ["PHP", "Node.js", "REST APIs", "MySQL", "MongoDB", "Git", "Figma"],
      focus: "Fullstack coordination, database schemas, UI prototyping",
    },
  ] as SkillCategory[],
};
