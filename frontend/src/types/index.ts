export interface Skill {
  _id?: string;
  name: string;
  category: string;
  level: number;
}

export interface Project {
  _id?: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  githubLink: string;
  liveLink: string;
  featured: boolean;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  email: string;
}

export interface Portfolio {
  _id?: string;
  hero: {
    name: string;
    title: string;
    tagline: string;
    image: string;
    resumeLink: string;
  };
  about: {
    description: string;
    image: string;
  };
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLinks;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AdminUser {
  email: string;
  id: string | number;
  name?: string;
  role?: string;
}
