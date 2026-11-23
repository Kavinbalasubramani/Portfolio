import type { Portfolio } from "../types";

// Edit this file directly to update your portfolio content.
// No backend or API call needed — the site reads straight from here.
const portfolioData: Portfolio = {
  hero: {
    name: "Kavin B",
    title: "Full Stack Developer",
    tagline: "I build fast, secure web apps and REST APIs with Laravel and the MERN stack.",
    image: "",
    resumeLink: "",
  },
  about: {
    description:
      "I'm a Full Stack Developer who builds commercial e-commerce platforms, workflow tools and secure APIs with Laravel, React and Node.js.",
    image: "",
  },
  skills: [
    { name: "PHP", category: "Backend", level: 3 },
    { name: "Laravel", category: "Backend", level: 3 },
    { name: "JavaScript", category: "Frontend", level: 3 },
    { name: "React JS", category: "Frontend", level: 3 },
    { name: "HTML5", category: "Frontend", level: 3 },
    { name: "CSS3", category: "Frontend", level: 3 },
    { name: "Bootstrap", category: "Frontend", level: 2 },
    { name: "Tailwind CSS", category: "Frontend", level: 3 },
    { name: "MySQL", category: "Database", level: 3 },
    { name: "MongoDB", category: "Database", level: 2 },
    { name: "Git", category: "Tools", level: 3 },
    { name: "GitHub", category: "Tools", level: 3 },
    { name: "Figma", category: "Tools", level: 1 },
  ],
  projects: [
    {
      title: "Radhe Crackers",
      description: "Commercial e-commerce platform with product catalogs, admin management and Facebook Lead Ads automation.",
      image: "",
      techStack: ["Laravel", "PHP", "MySQL"],
      githubLink: "",
      liveLink: "",
      featured: true,
    },
    {
      title: "MERN Enterprise Workflow Hub",
      description: "Real-time project management dashboard with collaborative boards, JWT authentication and live metrics.",
      image: "",
      techStack: ["React", "Node.js", "MongoDB"],
      githubLink: "",
      liveLink: "",
      featured: true,
    },
    {
      title: "Secure REST API Gateway & Auth Service",
      description: "Microservice-ready REST API with rate limiting, token refresh, encryption and a MySQL schema.",
      image: "",
      techStack: ["Node.js", "Express", "JWT", "MySQL"],
      githubLink: "",
      liveLink: "",
      featured: true,
    },
  ],
  socialLinks: {
    github: "",
    linkedin: "",
    twitter: "",
    email: "kavinkbs2202@gmail.com",
  },
};

export default portfolioData;
