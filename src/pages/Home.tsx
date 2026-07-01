import { ArrowRight, Star, Code2, Users, Shield, Zap, Cloud, Sparkles, ShoppingCart, BarChart2, ShieldCheck, Smile, Trophy, Headphones, Lock, Atom, Flame, Wind, HelpCircle, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Service, PortfolioProject, Testimonial, WebsiteSettings } from '../types';
import { motion } from 'motion/react';

interface HomeProps {
  services: Service[];
  portfolios: PortfolioProject[];
  testimonials: Testimonial[];
  setView: (view: string) => void;
  setSelectedProject: (project: PortfolioProject) => void;
  settings: WebsiteSettings;
}

// Helper to render Lucide Icons by name dynamically
export function RenderIcon({ name, className = "h-6 w-6 text-indigo-600 dark:text-indigo-400" }: { name: string; className?: string }) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    return <HelpCircle className={className} />;
  }
  return <IconComponent className={className} />;
}

export default function Home({ services, portfolios, testimonials, setView, setSelectedProject, settings }: HomeProps) {
  const highlightPortfolios = portfolios.slice(0, 3);

  const showTwoRows = testimonials.length > 2;
  const firstRowTestimonials = showTwoRows ? testimonials.filter((_, idx) => idx % 2 === 0) : testimonials;
  const secondRowTestimonials = showTwoRows ? testimonials.filter((_, idx) => idx % 2 === 1) : [];

  const chooseItems = [
    { icon: <Shield className="h-5 w-5 text-indigo-400" />, title: "Business-Focused", desc: "We align technology with your business goals and ROI." },
    { icon: <Zap className="h-5 w-5 text-indigo-400" />, title: "Agile & Fast Delivery", desc: "Iterative development for faster time-to-market." },
    { icon: <Lock className="h-5 w-5 text-indigo-400" />, title: "Secure & Compliant", desc: "Security-first approach with industry best practices." },
    { icon: <BarChart2 className="h-5 w-5 text-indigo-400" />, title: "Scalable Solutions", desc: "Built to scale with your business today and tomorrow." },
    { icon: <Headphones className="h-5 w-5 text-indigo-400" />, title: "Long-Term Support", desc: "Reliable maintenance and support whenever you need us." }
  ];

  const serviceThemes = [
    { bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-600 dark:text-violet-400' },
    { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400' },
    { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400' },
    { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400' }
  ];

  // Premium Animation System Presets (Cubic-Bezier Easing)
  const easePreset = [0.4, 0, 0.2, 1];

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { y: 24, opacity: 0, filter: 'blur(4px)' },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.65,
        ease: easePreset
      }
    }
  };

  const scaleHover = {
    hover: {
      scale: 1.03,
      boxShadow: "0 12px 30px -5px rgba(99, 102, 241, 0.15)",
      transition: { duration: 0.3, ease: easePreset }
    },
    tap: { scale: 0.98 }
  };

  const cardLift = {
    hidden: { y: 24, opacity: 0, filter: 'blur(4px)' },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.65,
        ease: easePreset
      }
    },
    hover: {
      y: -6,
      boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.08)",
      borderColor: "rgba(99, 102, 241, 0.3)",
      transition: { duration: 0.3, ease: easePreset }
    }
  };

  const springSlideIn = {
    hidden: { x: -60, y: 30, opacity: 0, scale: 0.95 },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 110,
        damping: 14
      }
    },
    hover: {
      y: -8,
      boxShadow: "0 22px 45px -15px rgba(15, 23, 42, 0.08)",
      borderColor: "rgba(99, 102, 241, 0.35)",
      transition: { type: "spring", stiffness: 200, damping: 18 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: easePreset }}
      className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300 overflow-x-hidden"
    >
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden py-24 lg:py-32 bg-white dark:bg-slate-950 border-b border-slate-150 dark:border-slate-900 flex items-center min-h-[85vh]">
        
        {/* Background media loop with admin-controlled opacity */}
        {settings?.homeVideoUrl ? (
          <video
            key={settings.homeVideoUrl}
            src={settings.homeVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
            style={{ opacity: settings.homeVideoOpacity ?? 0.12 }}
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none z-0"
            style={{
              backgroundImage: `url(${settings?.homeImageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80"})`,
              opacity: settings?.homeVideoOpacity ?? 0.12
            }}
          />
        )}

        {/* Subtle moving background glow */}
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.04),transparent_50%)] pointer-events-none z-0"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Text Area (Staggered Entrance) */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 flex flex-col items-start gap-6"
            >
              {/* Badge */}
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider select-none"
              >
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span>Enterprise Digital Solutions</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]"
              >
                We Build Enterprise<br />
                Digital Systems With<br />
                <span className="text-indigo-600 dark:text-indigo-400 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">Precision Engineering</span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl"
              >
                Nexus Digital helps enterprises design, build, and scale custom software, cloud infrastructure, e-commerce platforms, and AI-powered automation systems with reliable engineering and measurable outcomes.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4 w-full sm:w-auto mt-2"
              >
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={scaleHover}
                  onClick={() => setView('contact')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg cursor-pointer"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </motion.button>
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={scaleHover}
                  onClick={() => setView('portfolio')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold rounded-xl shadow-sm cursor-pointer"
                >
                  <span>View Case Studies</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </motion.button>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-4 mt-4"
              >
                <div className="flex -space-x-3 overflow-hidden">
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-950 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" alt="Client 1" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-950 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" alt="Client 2" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-950 object-cover" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&h=100&q=80" alt="Client 3" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-950 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80" alt="Client 4" />
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold text-xs ring-2 ring-white dark:ring-slate-950 select-none">
                    40+
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Trusted by <strong className="text-slate-800 dark:text-slate-200">40+ businesses</strong> to deliver impact at scale.
                </p>
              </motion.div>
            </motion.div>

            {/* Hero Right Visual Column: Oscillating Dashboard Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, ease: easePreset, delay: 0.2 }}
              className="lg:col-span-5 relative w-full flex justify-center lg:justify-end"
            >
              <motion.div
                animate={{
                  y: [0, -8, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-full max-w-[460px] bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 relative z-10"
              >
                {/* Header */}
                <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
                  <BarChart2 className="h-5 w-5 text-indigo-500 shrink-0" />
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Nexus Delivery Framework</span>
                </div>

                {/* 2x2 Feature Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {/* Item 1 */}
                  <div className="flex flex-col gap-3">
                    <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center shrink-0">
                      <Code2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">Software Engineering</h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-normal mt-1">
                        Custom web apps, SaaS platforms and enterprise systems.
                      </p>
                    </div>
                  </div>
                  {/* Item 2 */}
                  <div className="flex flex-col gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                      <Cloud className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">Cloud Infrastructure</h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-normal mt-1">
                        Secure, scalable and cost-optimized cloud infrastructure.
                      </p>
                    </div>
                  </div>
                  {/* Item 3 */}
                  <div className="flex flex-col gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shrink-0">
                      <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">AI Integration</h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-normal mt-1">
                        AI automation, intelligent workflows and business intelligence.
                      </p>
                    </div>
                  </div>
                  {/* Item 4 */}
                  <div className="flex flex-col gap-3">
                    <div className="h-10 w-10 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/30 flex items-center justify-center shrink-0">
                      <ShoppingCart className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">E-commerce Systems</h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-normal mt-1">
                        High-performance stores, payment flows and admin dashboards.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Stats Footer */}
                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                    <div className="flex flex-col leading-none">
                      <span className="text-sm font-extrabold text-slate-800 dark:text-white">40+</span>
                      <span className="text-[9px] text-slate-400 uppercase mt-0.5 tracking-wider font-mono">Delivered</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                    <div className="flex flex-col leading-none">
                      <span className="text-sm font-extrabold text-slate-800 dark:text-white">99.9%</span>
                      <span className="text-[9px] text-slate-400 uppercase mt-0.5 tracking-wider font-mono">Uptime</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smile className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                    <div className="flex flex-col leading-none">
                      <span className="text-sm font-extrabold text-slate-800 dark:text-white">35+</span>
                      <span className="text-[9px] text-slate-400 uppercase mt-0.5 tracking-wider font-mono">Clients</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP WITH INFINITE COLOR GRADIENT BACKGROUND & TICKER */}
      <motion.section
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
        className="py-10 bg-gradient-to-r from-indigo-50/50 via-violet-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:via-violet-950/20 dark:to-purple-950/20 bg-[length:200%_auto] border-b border-slate-150 dark:border-slate-900/40 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 overflow-hidden relative">
          <p className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 text-center mb-6 relative z-10">
            Trusted by modern businesses. Built with leading technologies.
          </p>
          
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] py-2">
            <motion.div
              animate={{
                x: ["-50%", "0%"]
              }}
              transition={{
                ease: "linear",
                duration: 28,
                repeat: Infinity
              }}
              className="flex gap-16 whitespace-nowrap min-w-max"
            >
              {/* First loop of logos */}
              <div className="flex items-center gap-16 text-slate-400 dark:text-slate-400 select-none">
                <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <Atom className="h-4.5 w-4.5 text-[#61DAFB] animate-[spin_8s_linear_infinite]" />
                  <span className="text-xs font-bold font-sans">React</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <span className="text-xs font-extrabold font-sans tracking-tight text-slate-850 dark:text-slate-200">▲ Next.js</span>
                </div>
                <div className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <span className="text-[9px] font-bold bg-[#3178C6] text-white px-1 py-0.2 rounded font-sans leading-none">TS</span>
                  <span className="text-xs font-bold font-sans ml-1">TypeScript</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <Flame className="h-4.5 w-4.5 text-[#FFCA28]" />
                  <span className="text-xs font-bold font-sans">Firebase</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <Cloud className="h-4.5 w-4.5 text-amber-500" />
                  <span className="text-xs font-bold font-sans uppercase">AWS</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <div className="h-4.5 w-4.5 rounded bg-emerald-500 flex items-center justify-center text-[9px] text-white font-bold leading-none">N</div>
                  <span className="text-xs font-bold font-sans">Node.js</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <Sparkles className="h-4.5 w-4.5 text-purple-500 animate-pulse" />
                  <span className="text-xs font-bold font-sans">OpenAI</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <div className="px-1 py-0.2 bg-indigo-500 text-white rounded text-[8px] font-extrabold uppercase leading-none tracking-wider">S</div>
                  <span className="text-xs font-bold font-sans">Stripe</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <Wind className="h-4.5 w-4.5 text-[#38BDF8]" />
                  <span className="text-xs font-bold font-sans">Tailwind CSS</span>
                </div>
              </div>

              {/* Second identical loop of logos to form seamless marquee scrolling */}
              <div className="flex items-center gap-16 text-slate-400 dark:text-slate-400 select-none">
                <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <Atom className="h-4.5 w-4.5 text-[#61DAFB] animate-[spin_8s_linear_infinite]" />
                  <span className="text-xs font-bold font-sans">React</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <span className="text-xs font-extrabold font-sans tracking-tight text-slate-850 dark:text-slate-200">▲ Next.js</span>
                </div>
                <div className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <span className="text-[9px] font-bold bg-[#3178C6] text-white px-1 py-0.2 rounded font-sans leading-none">TS</span>
                  <span className="text-xs font-bold font-sans ml-1">TypeScript</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <Flame className="h-4.5 w-4.5 text-[#FFCA28]" />
                  <span className="text-xs font-bold font-sans">Firebase</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <Cloud className="h-4.5 w-4.5 text-amber-500" />
                  <span className="text-xs font-bold font-sans uppercase">AWS</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <div className="h-4.5 w-4.5 rounded bg-emerald-500 flex items-center justify-center text-[9px] text-white font-bold leading-none">N</div>
                  <span className="text-xs font-bold font-sans">Node.js</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <Sparkles className="h-4.5 w-4.5 text-purple-500 animate-pulse" />
                  <span className="text-xs font-bold font-sans">OpenAI</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <div className="px-1 py-0.2 bg-indigo-500 text-white rounded text-[8px] font-extrabold uppercase leading-none tracking-wider">S</div>
                  <span className="text-xs font-bold font-sans">Stripe</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-white transition-colors duration-300">
                  <Wind className="h-4.5 w-4.5 text-[#38BDF8]" />
                  <span className="text-xs font-bold font-sans">Tailwind CSS</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 3. CORE SERVICES SECTION (Staggered cards reveal on scroll) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Our Core Services
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            End-to-end digital solutions tailored for enterprise success.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="py-16 text-center text-slate-500 font-mono text-xs">
            No service catalog entries matched your active database records.
          </div>
        ) : (
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)] py-16">
            <div className="animate-marquee-slow flex gap-8 whitespace-nowrap min-w-max">
              {/* Loop 1 */}
              {services.map((service, index) => {
                const theme = serviceThemes[index % serviceThemes.length];

                return (
                  <motion.div
                    key={`srv-${service.id || index}-1`}
                    whileHover={{
                      scale: 1.025,
                      boxShadow: "0 22px 45px -15px rgba(15, 23, 42, 0.08)",
                      borderColor: "rgba(99, 102, 241, 0.35)",
                      y: -6,
                      transition: { duration: 0.3 }
                    }}
                    className="w-[340px] shrink-0 whitespace-normal p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-900/60 shadow-sm flex flex-col justify-between h-[280px] group cursor-pointer"
                  >
                    <div className="flex flex-col gap-5">
                      {/* Icon with Hover Rotation */}
                      <motion.div
                        whileHover={{ rotate: 5, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className={`h-12 w-12 rounded-xl ${theme.bg} flex items-center justify-center shrink-0 border border-transparent`}
                      >
                        <RenderIcon name={service.icon} className={`h-6 w-6 ${theme.text}`} />
                      </motion.div>
                      
                      <div className="flex flex-col gap-2">
                        <h3 className="text-base font-bold text-slate-800 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                          {service.description.length > 130 ? `${service.description.slice(0, 130)}...` : service.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setView('services')}
                      className={`flex items-center gap-1.5 text-xs font-bold ${theme.text} hover:opacity-85 transition-opacity cursor-pointer text-left w-fit mt-2`}
                    >
                      <span>Learn more</span>
                      <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </motion.div>
                );
              })}

              {/* Loop 2 */}
              {services.map((service, index) => {
                const theme = serviceThemes[index % serviceThemes.length];

                return (
                  <motion.div
                    key={`srv-${service.id || index}-2`}
                    whileHover={{
                      scale: 1.025,
                      boxShadow: "0 22px 45px -15px rgba(15, 23, 42, 0.08)",
                      borderColor: "rgba(99, 102, 241, 0.35)",
                      y: -6,
                      transition: { duration: 0.3 }
                    }}
                    className="w-[340px] shrink-0 whitespace-normal p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-900/60 shadow-sm flex flex-col justify-between h-[280px] group cursor-pointer"
                  >
                    <div className="flex flex-col gap-5">
                      {/* Icon with Hover Rotation */}
                      <motion.div
                        whileHover={{ rotate: 5, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className={`h-12 w-12 rounded-xl ${theme.bg} flex items-center justify-center shrink-0 border border-transparent`}
                      >
                        <RenderIcon name={service.icon} className={`h-6 w-6 ${theme.text}`} />
                      </motion.div>
                      
                      <div className="flex flex-col gap-2">
                        <h3 className="text-base font-bold text-slate-800 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                          {service.description.length > 130 ? `${service.description.slice(0, 130)}...` : service.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setView('services')}
                      className={`flex items-center gap-1.5 text-xs font-bold ${theme.text} hover:opacity-85 transition-opacity cursor-pointer text-left w-fit mt-2`}
                    >
                      <span>Learn more</span>
                      <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-center mt-12">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ ease: easePreset, duration: 0.2 }}
            onClick={() => setView('services')}
            className="flex items-center gap-2 px-6 py-3.5 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl shadow-sm hover:shadow cursor-pointer"
          >
            <span>Explore All Services</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </section>

      {/* 4. WHY ENTERPRISES CHOOSE US SECTION */}
      <section className="py-24 bg-slate-950 text-white border-b border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(99,102,241,0.03),transparent)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-16 tracking-tight">
            Why Enterprises Choose Nexus Digital
          </h2>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8"
          >
            {chooseItems.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="flex flex-col items-center text-center gap-4 group"
              >
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center group-hover:border-indigo-500 transition-colors duration-300 shadow-sm"
                >
                  {item.icon}
                </motion.div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                  <p className="text-[11px] leading-relaxed text-slate-400 max-w-[200px] mx-auto">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. INLINE PORTFOLIO SHOWCASE */}
      {highlightPortfolios.length > 0 && (
        <section className="py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="flex flex-col gap-4 max-w-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">Case Studies</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Visual Systems Built For Our Partners
                </h2>
              </div>
              <button
                onClick={() => setView('portfolio')}
                className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-550 transition-colors cursor-pointer group"
              >
                <span>View Full Portfolio</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-85px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {highlightPortfolios.map((project, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ y: -6, transition: { duration: 0.3, ease: easePreset } }}
                  onClick={() => setSelectedProject(project)}
                  className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-slate-900 overflow-hidden cursor-pointer shadow-sm hover:shadow-lg dark:hover:border-slate-800 transition-all duration-300 flex flex-col group"
                >
                  <div className="aspect-video w-full overflow-hidden relative bg-slate-100">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover group-hover:scale-104 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-white/95 text-slate-900 shadow-sm border border-slate-100">
                      {project.category}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col gap-3 flex-grow">
                    <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500">
                      Client: {project.client}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-grow">
                      {project.description.slice(0, 110)}...
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-700/40 font-semibold">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center font-mono">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* 6. CLIENT TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-slate-50 dark:bg-slate-950/20 border-b border-slate-200 dark:border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">Earning Trust</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Recommended By Elite Technology Directors
              </h2>
            </div>

            <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)] py-6">
              <div className="animate-marquee-left flex gap-8 whitespace-nowrap min-w-max">
                {/* Loop 1 */}
                {firstRowTestimonials.map((test, index) => (
                  <div
                    key={`test-r1-g1-${index}`}
                    className="w-[440px] shrink-0 whitespace-normal bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-8 rounded-2xl shadow-sm flex flex-col justify-between h-[220px] group transition-all duration-300"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-1">
                        {[...Array(test.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm italic leading-relaxed text-slate-650 dark:text-slate-350 line-clamp-3">
                        &ldquo;{test.quote}&rdquo;
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
                      <img
                        src={test.avatar}
                        alt={test.name}
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col leading-tight">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{test.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          {test.role} at <span className="text-slate-800 dark:text-slate-205 font-bold">{test.company}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Loop 2 (Duplicate) */}
                {firstRowTestimonials.map((test, index) => (
                  <div
                    key={`test-r1-g2-${index}`}
                    className="w-[440px] shrink-0 whitespace-normal bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-8 rounded-2xl shadow-sm flex flex-col justify-between h-[220px] group transition-all duration-300"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-1">
                        {[...Array(test.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm italic leading-relaxed text-slate-650 dark:text-slate-350 line-clamp-3">
                        &ldquo;{test.quote}&rdquo;
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
                      <img
                        src={test.avatar}
                        alt={test.name}
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col leading-tight">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{test.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          {test.role} at <span className="text-slate-800 dark:text-slate-205 font-bold">{test.company}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {showTwoRows && (
              <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)] py-6 mt-4">
                <div className="animate-marquee-right flex gap-8 whitespace-nowrap min-w-max">
                  {/* Loop 1 */}
                  {secondRowTestimonials.map((test, index) => (
                    <div
                      key={`test-r2-g1-${index}`}
                      className="w-[440px] shrink-0 whitespace-normal bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-8 rounded-2xl shadow-sm flex flex-col justify-between h-[220px] group transition-all duration-300"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-1">
                          {[...Array(test.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm italic leading-relaxed text-slate-650 dark:text-slate-350 line-clamp-3">
                          &ldquo;{test.quote}&rdquo;
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
                        <img
                          src={test.avatar}
                          alt={test.name}
                          className="h-10 w-10 rounded-full object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col leading-tight">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{test.name}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                            {test.role} at <span className="text-slate-800 dark:text-slate-205 font-bold">{test.company}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Loop 2 (Duplicate) */}
                  {secondRowTestimonials.map((test, index) => (
                    <div
                      key={`test-r2-g2-${index}`}
                      className="w-[440px] shrink-0 whitespace-normal bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-8 rounded-2xl shadow-sm flex flex-col justify-between h-[220px] group transition-all duration-300"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-1">
                          {[...Array(test.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm italic leading-relaxed text-slate-650 dark:text-slate-350 line-clamp-3">
                          &ldquo;{test.quote}&rdquo;
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
                        <img
                          src={test.avatar}
                          alt={test.name}
                          className="h-10 w-10 rounded-full object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col leading-tight">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{test.name}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                            {test.role} at <span className="text-slate-800 dark:text-slate-205 font-bold">{test.company}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 7. BOTTOM CTA BANNER (With subtle button pulse visual cue) */}
      <section className="py-20 bg-indigo-600 dark:bg-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center flex flex-col items-center gap-8">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight">
            Ready To Design Your Operational Infrastructure?
          </h2>
          <p className="text-indigo-100 text-base sm:text-lg max-w-2xl leading-relaxed">
            Get in touch with us to draft custom blueprints, verify integrations, and run detailed architectural discovery loops for your digital software models.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ ease: easePreset, duration: 0.2 }}
            onClick={() => setView('contact')}
            className="px-8 py-4 bg-white text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-2 group"
          >
            <span>Request Consult Call</span>
            <ArrowRight className="h-4.5 w-4.5 transform group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </section>

    </motion.div>
  );
}
