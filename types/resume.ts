export interface Resume {
  basics: {
    name: string;
    label: string;
    email: string;
    phone: string;
    summary: string;
  };
  skills: {
    name: string;
    level: string;
    keywords: string[];
  }[];
  work: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }[];
} 