import { Service, PortfolioProject, BlogPost, Testimonial, Faq, JobVacancy, WebsiteSettings } from '../types';

export const INITIAL_SERVICES: Omit<Service, 'id'>[] = [
  {
    title: "Custom Software Development",
    description: "End-to-end conception, design, and deployment of resilient corporate software infrastructure tailored to solve your unique operational bottlenecks and streamline efficiency.",
    benefits: [
      "Custom fit for your business processes",
      "Elimination of costly software license fees",
      "Robust scalability and hardware integration",
      "Complete ownership of source code IP"
    ],
    technologies: ["Node.js", "TypeScript", "Go", "Docker", "Kubernetes"],
    icon: "Code2",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Web Application Development",
    description: "High-performance, secure, and mobile-responsive internal control panels, e-commerce storefronts, and cloud-hosted single page applications built for modern browsers.",
    benefits: [
      "Blazing fast page loads & fluid transitions",
      "Robust client-side states with real-time updates",
      "Highly responsive mobile layout adapting to any device",
      "SEO optimized and accessibility compliant elements"
    ],
    technologies: ["React", "Vite", "Next.js", "Tailwind CSS", "Firebase"],
    icon: "Laptop",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Mobile Application Development",
    description: "Fast-performing, interactive, and responsive custom applications built natively for both Android and iOS devices using lightweight frameworks.",
    benefits: [
      "Single-base cross platform responsive deployment",
      "Seamless offline caching and local database state",
      "Full hardware integration (GPS, camera, push alerts)",
      "Polished, fluid gesture animations and UX design"
    ],
    technologies: ["React Native", "Flutter", "TypeScript", "Android/iOS"],
    icon: "Smartphone",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Digital Marketing Services",
    description: "ROI-driven conversion funnels, display marketing campaigns, and growth strategies designed to drive prospective enterprise buyers directly to your services.",
    benefits: [
      "Measurable performance metrics and KPIs",
      "Advanced demographic targeting parameters",
      "Optimized cost-per-acquisition (CPA)",
      "High impact landing pages and funnel loops"
    ],
    technologies: ["Google Ads", "Meta Ads", "A/B Testing", "ConvertKit"],
    icon: "Megaphone",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Social Media Content Creation",
    description: "Highly aesthetic graphic assets, engaging brand copy, video reels, and cohesive brand designs to establish authority and drive organic reach across networks.",
    benefits: [
      "Cohesive, high-end social visual identity",
      "Consistent, automated publishing schedules",
      "Higher community sentiment and engagement metrics",
      "Viral organic reach with custom vector graphics"
    ],
    technologies: ["Figma", "Photoshop", "After Effects", "Premiere Pro"],
    icon: "Share2",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "SEO Services",
    description: "Exhaustive technical search engine optimization (on-page, off-page, technical site speed) paired with strategic keyword content directories to secure top search rankings.",
    benefits: [
      "Dominant search engine placement for strategic keywords",
      "Consistent monthly organic inbound leads",
      "Technical fixes to core web vitals and speed indexes",
      "High authority editorial backlink portfolios"
    ],
    technologies: ["Google Search Console", "AHrefs", "Screaming Frog", "SemRush"],
    icon: "TrendingUp",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "UI/UX Design",
    description: "Empathetic, user-centric layout models, click-through wireframes, asset sheets, and aesthetic digital interactions created in high-fidelity mockups.",
    benefits: [
      "Significantly higher app onboarding success rates",
      "Clean, modern corporate branding layouts",
      "Rigid component system rules for seamless handoff",
      "Optimized click-through rates and clear typography hierarchy"
    ],
    technologies: ["Figma", "Adobe XD", "Miro", "Prototyping"],
    icon: "Palette",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "E-commerce Solutions",
    description: "Highly custom storefront configuration complete with flexible cart states, local shipping APIs, custom checkout forms, and secure client transactional layers.",
    benefits: [
      "Zero friction checkout with minimal load delays",
      "Dynamic catalog scaling for tens of thousands of SKUs",
      "Support for global cards, Apple Pay, and digital wallets",
      "Automated inventory management notifications"
    ],
    technologies: ["Shopify headless", "Stripe API", "NextJS", "Sanity CMS"],
    icon: "ShoppingBag",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Business Automation",
    description: "Custom internal scripts, workflow hooks, and automatic database triggers designed to eliminate manual data entry and save hours of redundant labor.",
    benefits: [
      "Hundreds of human labor hours reclaimed weekly",
      "Elimination of manual transcription mistakes",
      "Instant triggers across internal chat tools and CRMs",
      "Automated dynamic report generation loops"
    ],
    technologies: ["Nodejs", "Zapier", "Make.com", "Python", "Slack API"],
    icon: "Cpu",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Data Analytics & Reporting",
    description: "Dynamic reporting dashboards, event tracking architectures, and visual business matrices converting messy databases into clear directives.",
    benefits: [
      "Real-time visual monitoring of critical business metrics",
      "Data-driven strategic growth planning indicators",
      "Highly specific event funnel tracking on checkouts",
      "Automated reports delivered straight to stakeholders"
    ],
    technologies: ["D3.js", "Google Analytics", "Mixpanel", "SQL", "Tableau"],
    icon: "BarChart3",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "API Development & Integration",
    description: "Resilient rest endpoints, webhooks, and complex custom wrappers designed with high-throughput load tolerances and strict token request constraints.",
    benefits: [
      "Clean, self-documenting JSON/Swagger endpoints",
      "Blazing fast database query cache structures",
      "Ultra-secure authentication headers",
      "Seamless connection with third-party suppliers"
    ],
    technologies: ["Express", "FastAPI", "Swagger", "JWT", "Redis"],
    icon: "Network",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Cloud Solutions",
    description: "Migration of legacy application structures to highly redundant serverless cloud run infrastructures with autoscale tolerances and encrypted security layers.",
    benefits: [
      "Zero server downtime using auto-scaling clusters",
      "Massive structural savings on idle compute power",
      "Strict data recovery backups in geographical segments",
      "Absolute compliance with federal security guidelines"
    ],
    technologies: ["GCP", "AWS", "Terraform", "Cloud Run", "Docker"],
    icon: "Cloud",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "AI & Automation Solutions",
    description: "Integration of modern neural networks, contextual search groundings, custom LLMs, and smart assistants into your client-facing tools.",
    benefits: [
      "Intelligent, automated 24/7 customer support",
      "Contextual document extractions using AI OCR",
      "Predictive trend analysis models on client metrics",
      "Smart semantic search algorithms across internal databases"
    ],
    technologies: ["Gemini 1.5 Pro", "@google/genai", "Python", "LangChain"],
    icon: "Sparkles",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Website Maintenance",
    description: "Regular technical core patch updates, asset load speed audits, routine database optimization, and continuous uptime monitoring with real-time issue resolution.",
    benefits: [
      "Permanent protection from potential visual/layout regressions",
      "Continuous speed optimization for peak Google ratings",
      "Weekly secure backups and server status checks",
      "Instant priority tech support response windows"
    ],
    technologies: ["Git", "Vite", "Node.js", "Sentry", "NewRelic"],
    icon: "Wrench",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Technical Consulting",
    description: "Aesthetic UX walkthroughs, software architecture audits, security assessments, and digital roadmap blueprints provided by world-class software experts.",
    benefits: [
      "Clear, actionable software growth blueprints",
      "Direct mitigation of legacy code tech debt risks",
      "Unbiased, objective tool stack recommendations",
      "Accelerated developer staffing and onboarding tracks"
    ],
    technologies: ["Software Architecture", "Security Auditing", "Agile Roadmap"],
    icon: "FileText",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const INITIAL_PORTFOLIOS: Omit<PortfolioProject, 'id'>[] = [
  {
    title: "Zenith FinTech Portal",
    description: "A feature-rich asset trading dashboard with real-time graph overlays, secure ledger integrations, and a customized portfolio breakdown system serving over 100K active traders.",
    category: "Web Application Development",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Recharts", "Node.js"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    client: "Zenith Capital Ltd",
    link: "https://zenith-example.com",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Aura Commerce Platform",
    description: "A headless architectural e-commerce store with dynamic inventory levels, fast local client cart states, and Stripe payment pathways loading in under 0.8 seconds globally.",
    category: "E-commerce Solutions",
    technologies: ["Next.js", "Tailwind CSS", "Stripe API", "Headless Shopify"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    client: "Aura Lifestyle Inc",
    link: "https://aura-example.com",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "FitLife Tracker Android & iOS",
    description: "A clean mobile fitness app incorporating smart GPS metrics, motion controls, dynamic calorie counters, and a fully functional offline local state cache database.",
    category: "Mobile Application Development",
    technologies: ["React Native", "TypeScript", "Redux", "Firebase Mobile Auth"],
    image: "https://images.unsplash.com/photo-1510017808632-95f08e047532?auto=format&fit=crop&w=800&q=80",
    client: "FitLife Global Group",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const INITIAL_BLOGS: Omit<BlogPost, 'id'>[] = [
  {
    title: "The Shift to Headless E-commerce Architecture",
    content: `## Why Headless is the Future of Speed

In 2026, user engagement relies entirely on speed. Modern developers are ditching traditional monolitihic setups to opt for modular, **headless solutions**.

### Core Benefits:
1. **Uncapped Design Directives**: The backend CMS handles raw data while the customizable React client renders fluid grid animations.
2. **Instant Core Web Vitals**: Blazing load times directly increase conversions.
3. **Resilient Scaling**: Heavy user spikes on storefront layouts won't compromise checkout transactions or backend inventory updates.

We recommend marrying content providers with lightweight Vite frameworks to craft lightning-fast customer retail models.`,
    summary: "How modern separation of cart data and responsive viewport design is yielding massive layout response gains and driving up customer retention metrics.",
    category: "E-commerce Solutions",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    readTime: "4 min read",
    author: "Elena Pierce, Head of Frontend",
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Maximizing ROI using AI & Automation",
    content: `## Smarter Workflows, Less Waste

Artificial Intelligence is no longer just a trend—it is a critical tool to save employee hours and protect business margins.

### Smart Operations we build:
- **Intelligent Customer Agents**: Direct Gemini models securely parsing corporate documentation to respond to complex user tickets.
- **Form Automation**: Classifying, editing, and mapping structural email PDF attachments straight into custom accounting databases.
- **Workflow Triggers**: Triggering instant internal notifications on slack the minute a dynamic checkout funnel experiences atypical dropoffs.

Leverage the power of scalable AI tools to stay well ahead of your operational limits in 2026.`,
    summary: "An in-depth look at implementing smart natural language extraction layers and customized micro-triggers inside corporate administration software.",
    category: "AI & Automation Solutions",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    readTime: "6 min read",
    author: "Dr. Marcus Vance, Chief Architect",
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const INITIAL_TESTIMONIALS: Omit<Testimonial, 'id'>[] = [
  {
    name: "Alexander Mercer",
    role: "VP of Digital Engineering",
    company: "Standard Trading Group",
    quote: "The digital Solutions team redesigned our core ledger application in React and Tailwind. The interface loading delays plunged by 72% within days of launching are now facilitating smoother operations across our worldwide trading desks.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Genevieve Thorne",
    role: "Director of Product Growth",
    company: "Vertex Retail Ventures",
    quote: "Our custom headless e-commerce build was deployed flawlessly. We had dozens of legacy systems to tie in, but their developer resources executed the API endpoints correctly.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const INITIAL_FAQS: Omit<Faq, 'id'>[] = [
  {
    question: "Do you sign Non-Disclosure Agreements before checking codebases?",
    answer: "Absolutely. We strictly enforce corporate code guidelines. We sign NDAs and structural compliance documents during our initial discovery consultation call, ensuring your source code IP remains fully protected.",
    category: "Technical",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: "What is your project lifecycle management strategy?",
    answer: "We utilize modular agile workflows: Week 1-2 centers entirely on collaborative Figma UI blueprints and schema wireframing. Week 3-6 covers iterative build phases with staging link updates every Tuesday. Week 7 is dedicated to deep quality validation and secure cloud deployments.",
    category: "General",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: "What technology stacks do you specialize in?",
    answer: "Our core engineering capabilities focus on React, TypeScript, Tailwind CSS, Next.js, and Node.js. For cloud backend and automated operations, we leverage Firestore, Google Cloud Platform (GCP), AWS, Docker, and Gemini neural integrations.",
    category: "Technical",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: "How do you handle post-launch support and application maintenance?",
    answer: "We provide comprehensive Service Level Agreements (SLAs) tailored to your operational needs. This includes 24/7 server monitoring, weekly security dependency audits, load optimization updates, and direct developer communication channels for troubleshooting.",
    category: "General",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: "Can you collaborate with our existing in-house engineering team?",
    answer: "Yes, we integrate seamlessly with in-house teams. We align on Git branching workflows, participate in standups, share documentation via tools like Notion/Confluence, and provide structured code handoffs.",
    category: "Process",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: "How are project timelines and estimates calculated?",
    answer: "Every engagement begins with a scope discovery phase where we define specific feature deliverables. We structure our contracts based on milestone deliverables with fixed pricing, preventing budget creep and ensuring complete alignment before coding begins.",
    category: "Process",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    question: "Are your web applications search-engine (SEO) and performance optimized?",
    answer: "Yes. Every website we build adheres to strict Core Web Vitals optimization practices, utilizing static rendering, image compression pipelines, code splitting, and semantic HTML to guarantee fast page speed index ratings and crawlable configurations.",
    category: "Technical",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const INITIAL_CAREERS: Omit<JobVacancy, 'id'>[] = [
  {
    title: "Senior Full-Stack Engineer (React / Node)",
    department: "Engineering",
    location: "Remote (Global)",
    type: "Full-time",
    description: "We are seeking a high-caliber modular developer experienced in structuring React layout grids and designing highly secure REST APIs using Node and TypeScript.",
    requirements: [
      "5+ years professional experience with TypeScript",
      "Robust state control expertise across complex React models",
      "Demonstrated ability deploying secure, scalable GCP/AWS Cloud architectures",
      "A clean portfolio demonstrating desktop precision and modular code quality"
    ],
    benefits: [
      "Competitive professional salary + annual equity packages",
      "100% remote workspace with flexible hours",
      "Premium hardware equipment allowances",
      "Comprehensive medical and educational learning allowances"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const INITIAL_SETTINGS: WebsiteSettings = {
  companyName: "Nexus Digital Agency",
  logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&h=100&q=80",
  email: "connect@nexus-digital.com",
  phone: "+1 (800) 555-0199",
  address: "742 Innovation Highway, Suite 100, Silicon Valley, CA 94025",
  socialLinks: {
    linkedin: "https://linkedin.com/company/nexus-digital",
    github: "https://github.com/nexus-digital-agency",
    twitter: "https://twitter.com/nexus_digital",
    facebook: "https://facebook.com/nexus-digital"
  },
  seoTitle: "Nexus Digital Solutions Agency | Custom Software & SaaS Architecture",
  seoDescription: "An elite modern Digital solutions studio crafting resilient software, responsive single-page web experiences, native mobile engines, and automated workflow pathways.",
  updatedAt: new Date()
};
