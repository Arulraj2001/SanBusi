import { useState } from 'react';
import { Service } from '../types';
import { ChevronDown, ChevronUp, CheckCircle, Cpu, Code2, Cloud, Sparkles, ShoppingCart, ArrowRight, Compass, Settings, ShieldCheck, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ServicesProps {
  services: Service[];
  setView: (view: string) => void;
}

export default function Services({ services, setView }: ServicesProps) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  // Cards definitions mapping to Firestore search keywords
  const serviceCards = [
    {
      key: 'software',
      title: 'Enterprise Software Development',
      dbKeyword: 'software',
      description: 'Conception, design, and deployment of resilient corporate software infrastructure tailored to solve operational bottlenecks and streamline efficiency.',
      icon: <Code2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      accentColor: 'border-violet-200 dark:border-violet-900/50 text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30'
    },
    {
      key: 'cloud',
      title: 'Cloud Infrastructure & Migration',
      dbKeyword: 'cloud',
      description: 'Migration of legacy structures to highly redundant serverless cloud runtimes with autoscale tolerances and encrypted security layers.',
      icon: <Cloud className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      accentColor: 'border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 bg-blue-55 dark:bg-blue-950/30'
    },
    {
      key: 'ai',
      title: 'AI Automation & Integration',
      dbKeyword: 'ai',
      description: 'Integration of modern neural networks, contextual search groundings, custom LLMs, and smart assistants into your client-facing tools.',
      icon: <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      accentColor: 'border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30'
    },
    {
      key: 'ecommerce',
      title: 'E-commerce Systems',
      dbKeyword: 'commerce',
      description: 'High-performance stores complete with inventory control, shipping APIs, custom checkout forms, and secure payment pathways.',
      icon: <ShoppingCart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      accentColor: 'border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
    }
  ];

  // Timeline process definition
  const engineeringSteps = [
    { num: '01', title: 'Discovery', desc: 'Scoping requirements, analyzing architecture, and outlining baseline key performance indicators.' },
    { num: '02', title: 'Architecture', desc: 'Designing database schemas, network topologies, API endpoints, and security guardrails.' },
    { num: '03', title: 'Development', desc: 'Writing clean, modular, and typed components in weekly sprints with continuous code reviews.' },
    { num: '04', title: 'Testing', desc: 'Executing robust unit tests, load tolerances, security compliance audits, and staging checks.' },
    { num: '05', title: 'Deployment', desc: 'Releasing to production cloud runtimes with automatic scaling and real-time monitoring alerts.' }
  ];

  const toggleExpand = (key: string) => {
    setExpandedKey(expandedKey === key ? null : key);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      
      {/* 1. HERO HEADER */}
      <section className="py-24 bg-white dark:bg-slate-900 border-b border-slate-150 dark:border-slate-850 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.03),transparent)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">Our Capabilities</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight leading-tight">
            Enterprise Digital Solutions Built for Scale
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mt-6 leading-relaxed">
            Nexus Digital designs, builds, and manages custom software architectures, cloud infrastructure, AI integrations, and high-performance e-commerce platforms for global business operations.
          </p>
        </div>
      </section>

      {/* 2. SERVICES 2x2 GRID */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {serviceCards.map((card) => {
            const isExpanded = expandedKey === card.key;
            
            // Query dynamic data from database based on keyword
            const dbService = services.find(s => 
              s.title.toLowerCase().includes(card.dbKeyword) || 
              s.description.toLowerCase().includes(card.dbKeyword)
            );

            // Fetch dynamic values, fallback to presets if database is missing
            const benefitsList = dbService?.benefits || [
              'High scalability tolerances under peak traffic loads',
              'Guaranteed modular software component clean compilation',
              'Strict data privacy compliance and access control safeguards'
            ];
            const techList = dbService?.technologies || [
              'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'
            ];

            return (
              <div
                key={card.key}
                className={`bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm border transition-all duration-350 rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm ${
                  isExpanded
                    ? 'border-indigo-500 dark:border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                    : 'border-slate-200/70 dark:border-slate-850 hover:border-slate-350 dark:hover:border-slate-750 hover:-translate-y-0.5'
                }`}
              >
                <div className="p-8">
                  {/* Top Header Row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border border-slate-100/50 dark:border-slate-800/40 bg-slate-50 dark:bg-slate-950`}>
                        {card.icon}
                      </div>
                      {/* Title & Desc */}
                      <div className="flex flex-col gap-1.5">
                        <h3 className="text-base font-bold text-slate-850 dark:text-white tracking-tight leading-snug">
                          {card.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Accordion Expansion */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-8 pt-6 border-t border-slate-100 dark:border-slate-800"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          
                          {/* Left: Core Benefits */}
                          <div className="flex flex-col gap-3.5">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                              Operational Value
                            </h4>
                            <ul className="flex flex-col gap-2.5">
                              {benefitsList.map((benefit, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                  <CheckCircle className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Right: Engineered Stack */}
                          <div className="flex flex-col gap-3.5">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                              Engineered Stack
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {techList.map((tech, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold border border-slate-200/50 dark:border-slate-800/40"
                                >
                                  <Cpu className="h-3 w-3 text-indigo-400" />
                                  <span>{tech}</span>
                                </span>
                              ))}
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom Toggle Area */}
                <div
                  onClick={() => toggleExpand(card.key)}
                  className="px-8 py-4.5 border-t border-slate-100/60 dark:border-slate-850 hover:bg-slate-55/40 dark:hover:bg-slate-850/10 transition-colors flex items-center justify-between cursor-pointer text-xs font-bold text-indigo-600 dark:text-indigo-400 select-none"
                >
                  <span>{isExpanded ? 'Collapse specifications' : 'Learn more'}</span>
                  {isExpanded ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 3. ENGINEERING APPROACH TIMELINE */}
      <section className="py-24 bg-white dark:bg-slate-900 border-t border-b border-slate-150 dark:border-slate-850 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.02),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col items-center text-center gap-4 mb-20">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">Our Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Our Engineering Approach
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              A systematic, enterprise-ready delivery pipeline ensuring precision at every milestone.
            </p>
          </div>

          {/* Stepper Timeline grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-10 relative">
            
            {/* Background Line Connector for Desktop */}
            <div className="hidden md:block absolute top-[21px] left-[10%] right-[10%] h-0.5 bg-slate-100 dark:bg-slate-800 z-0" />

            {engineeringSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left gap-4 relative z-10 group">
                
                {/* Number indicator indicator */}
                <div className="h-11 w-11 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-xs font-mono text-indigo-600 dark:text-indigo-400 group-hover:border-indigo-500 transition-colors shadow-sm select-none">
                  {step.num}
                </div>

                {/* Card copy */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-none mt-1">
                    {step.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-[210px] md:max-w-none">
                    {step.desc}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. CTA BANNER */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl bg-slate-950 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl border border-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_right_bottom,rgba(99,102,241,0.08),transparent)] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="flex flex-col gap-3 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Let’s build your next enterprise system
              </h2>
              <p className="text-xs sm:text-sm text-slate-450 leading-relaxed">
                Get in touch with our engineering team to draft technical specifications, consult on system architecture, and map out your migration timeline.
              </p>
            </div>
            <button
              onClick={() => setView('contact')}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              Start a Project
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
