import * as Lucide from 'lucide-react';
import { WebsiteSettings } from '../types';

interface AboutProps {
  settings?: WebsiteSettings;
}

export default function About({ settings }: AboutProps) {
  const defaultValues = [
    {
      icon: "Compass",
      title: "Visionary Architecture",
      text: "We reject superficial, cookie-cutter layers. Every line of backend compilation and client UI rendering is engineered with custom structural foresight designed to scale."
    },
    {
      icon: "Eye",
      title: "Uncompromising Transparency",
      text: "We operate with absolute structural clarity. Our corporate clients receive direct visibility inside active code workspaces, staging servers, and hourly deployment reports."
    },
    {
      icon: "ShieldCheck",
      title: "Hardened Cyber Security",
      text: "Your core corporate datasets and communication lines are heavily protected. We implement strict Attribute-Based Access Controls to keep malicious actors completely locked out."
    },
    {
      icon: "Heart",
      title: "Sustained Engineering Craft",
      text: "We believe modularity, clean type casting, and proper negative space layouts are hallmarks of engineering craft. True elegance comes from robust digital performance."
    }
  ];

  const defaultTeam = [
    {
      name: "Sophia Sterling",
      role: "Chief Executive & Design Principal",
      bio: "Formerly leading SaaS visual design teams at major institutions. Sophia orchestrates Nexus design guidelines, ensuring positive whitespace pairings align with operational logic.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80"
    },
    {
      name: "Dr. Marcus Vance",
      role: "Chief Technology Officer & Architect",
      bio: "A distributed system pioneer with 15+ years compiling high-throughput cloud cluster architectures. Marcus dictates technical framework selection and database isolation paradigms.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&h=300&q=80"
    },
    {
      name: "Elena Pierce",
      role: "Principal Frontend Strategist",
      bio: "An advocate of extreme client-facing speed. Elena oversees the compilation of our lightweight single-page applications, focusing on Core Web Vital metrics and smooth animations.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80"
    }
  ];

  const defaultStats = [
    { value: "150+", label: "Completed Blueprints" },
    { value: "99.99%", label: "Uptime SLA Maintained" },
    { value: "40M+", label: "API Requests Resolved" },
    { value: "15", label: "Core Enterprise Services" }
  ];

  // Resolve active dataset
  const heroSubtitle = settings?.aboutHeroSubtitle || "Our Origin Story";
  const heroTitle = settings?.aboutHeroTitle || "Crafting the Future of High-Scale Corporate Platforms";
  const heroDesc = settings?.aboutHeroDesc || "Founded in California, Nexus emerged from a collective desire to eliminate slow, bloated, insecure software templates. We are a specialized team of software architects dedicated strictly to engineering performance.";
  
  const stats = settings?.aboutStats && settings.aboutStats.length > 0 
    ? settings.aboutStats 
    : defaultStats;

  const coreValues = settings?.aboutCoreValues && settings.aboutCoreValues.length > 0
    ? settings.aboutCoreValues
    : defaultValues;

  const teamMembers = settings?.aboutTeamMembers && settings.aboutTeamMembers.length > 0
    ? settings.aboutTeamMembers
    : defaultTeam;

  const renderIcon = (iconName: string) => {
    const IconComponent = (Lucide as any)[iconName] || Lucide.Compass;
    return <IconComponent className="h-6 w-6 text-indigo-500" />;
  };

  const bannerImg = settings?.aboutBannerUrl || "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      
      {/* 1. HERO TITLE */}
      <section className="relative py-24 bg-slate-900 text-white border-b border-slate-800 text-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
          style={{ backgroundImage: `url(${bannerImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono">{heroSubtitle}</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
            {heroTitle}
          </h1>
          <p className="text-base text-slate-300 max-w-3xl mx-auto mt-6 leading-relaxed">
            {heroDesc}
          </p>
        </div>
      </section>

      {/* 2. STATS OVERVIEW */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-900">
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">{stat.value}</span>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CORE VALUES GRID */}
      <section className="py-20 bg-white dark:bg-slate-950 border-t border-b border-slate-200 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-4 text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Our Identity</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">The Principles Guiding Our Code</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreValues.map((value, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-250/20 dark:border-slate-800 flex gap-6 items-start">
                <div className="h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-2.5 flex items-center justify-center shrink-0">
                  {renderIcon(value.icon || 'Compass')}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{value.title}</h3>
                  <p className="text-sm text-slate-505 dark:text-slate-400 leading-relaxed">
                    {value.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TEAM OFFICERS */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-4 text-center max-w-xl mx-auto mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Leadership Desk</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">The Minds Directing Our Blueprints</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 rounded-3xl p-6 flex flex-col gap-6 shadow-sm">
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100">
                <img src={member.image} alt={member.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{member.name}</h3>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{member.role}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
