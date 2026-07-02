export interface Service {
  id?: string;
  title: string;
  description: string;
  benefits: string[];
  technologies: string[];
  icon: string; // Lucide icon name
  createdAt: any; // Timestamp or Date
  updatedAt: any;
}

export interface PortfolioProject {
  id?: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  image: string; // URL or base64 data
  client: string;
  link?: string;
  createdAt: any;
  updatedAt: any;
}

export interface BlogPost {
  id?: string;
  title: string;
  content: string; // Markdown text
  summary: string;
  category: string;
  image: string; // URL or base64 data
  readTime: string; // e.g. "5 min read"
  author: string;
  publishedAt: any;
  createdAt: any;
  updatedAt: any;
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number; // 1-5
  avatar: string; // URL or base64 data
  createdAt: any;
  updatedAt: any;
}

export interface Faq {
  id?: string;
  question: string;
  answer: string;
  category: string;
  createdAt: any;
  updatedAt: any;
}

export interface JobVacancy {
  id?: string;
  title: string;
  department: string;
  location: string;
  type: string; // e.g. "Full-time", "Remote"
  description: string;
  requirements: string[];
  benefits: string[];
  createdAt: any;
  updatedAt: any;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: any;
}

export interface FeedbackEntry {
  id?: string;
  name: string;          // Client full name
  company: string;       // Client company
  role: string;          // e.g. "CTO", "Product Manager"
  rating: number;        // 1–5 stars
  projectType: string;   // e.g. "Web App", "Mobile App"
  message: string;       // The feedback/review text
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export interface WebsiteSettings {
  companyName: string;
  logoUrl: string;
  email: string;
  phone: string;
  address: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    facebook?: string;
  };
  seoTitle: string;
  seoDescription: string;
  updatedAt: any;
  aboutHeroSubtitle?: string;
  aboutHeroTitle?: string;
  aboutHeroDesc?: string;
  aboutStats?: Array<{ value: string; label: string }>;
  aboutCoreValues?: Array<{ title: string; text: string; icon?: string }>;
  aboutTeamMembers?: Array<{ name: string; role: string; bio: string; image: string }>;
  homeVideoUrl?: string;
  homeImageUrl?: string;
  homeVideoOpacity?: number; // 0–1, controls hero background media transparency
  feedbackBannerUrl?: string;
  servicesBannerUrl?: string;
  portfolioBannerUrl?: string;
  blogBannerUrl?: string;
  careersBannerUrl?: string;
  faqBannerUrl?: string;
  contactBannerUrl?: string;
  aboutBannerUrl?: string;
  activeFont?: 'sans' | 'serif' | 'corporate' | 'minimalist' | 'luxury';
}

export interface Admin {
  id: string; // Auth UID
  email: string;
  role: 'admin';
  createdAt: any;
}
