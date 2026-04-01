export interface Project {
  id: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  results: string;
  image: string;
  tech: string[];
  liveDemo?: string;
  github: string;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  duration: string;
  responsibilities: string[];
}

export interface Skill {
  name: string;
  percentage: number;
  icon: string;
}

export interface TechItem {
  name: string;
  description: string;
  icon?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

export interface Stat {
  value: string;
  label: string;
}
