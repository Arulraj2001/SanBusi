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

  // True when any hero background media (video or image) is set from admin
  const hasHeroBg = !!(settings?.homeVideoUrl || settings?.homeImageUrl);


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
      initial={{ opacity: 1, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easePreset }}
      className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300 overflow-x-hidden"
    >
      
      {/* 1. HERO SECTION */}
      <section className={`relative overflow-hidden py-24 lg:py-32 border-b border-slate-150 dark:border-slate-900 flex items-center min-h-[85vh] ${
        hasHeroBg ? 'bg-slate-950' : 'bg-white dark:bg-slate-950'
      }`}>
        
        {/* Background media — video takes priority, then image, both admin-controlled */}
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
        ) : settings?.homeImageUrl ? (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none z-0"
            style={{
              backgroundImage: `url(${settings.homeImageUrl})`,
              opacity: settings.homeVideoOpacity ?? 0.12
            }}
          />
        ) : null}

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
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider select-none ${
                  hasHeroBg
                    ? 'bg-indigo-500/20 border-indigo-400/30 text-indigo-300'
                    : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100/50 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span>Enterprise Digital Solutions</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeInUp}
                className={`text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.12] ${
                  hasHeroBg ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}
              >
                We Build Enterprise<br />
                Digital Systems With<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">Precision Engineering</span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                variants={fadeInUp}
                className={`text-base sm:text-lg leading-relaxed max-w-xl ${
                  hasHeroBg ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                }`}
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
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-xl shadow-sm cursor-pointer border transition-colors ${
                    hasHeroBg
                      ? 'border-white/20 bg-white/10 hover:bg-white/15 text-white backdrop-blur-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>View Case Studies</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </motion.button>
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
                className={`w-full max-w-[460px] p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 relative z-10 ${
                  hasHeroBg
                    ? 'bg-white/10 backdrop-blur-md border border-white/15'
                    : 'bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850'
                }`}
              >
                {/* Header */}
                <div className={`flex items-center gap-2.5 pb-5 mb-6 border-b ${ hasHeroBg ? 'border-white/15' : 'border-slate-100 dark:border-slate-800' }`}>
                  <BarChart2 className="h-5 w-5 text-indigo-400 shrink-0" />
                  <span className={`font-bold text-sm ${ hasHeroBg ? 'text-white' : 'text-slate-800 dark:text-slate-200' }`}>Nexus Delivery Framework</span>
                </div>

                {/* 2x2 Feature Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {/* Item 1 */}
                  {[{ icon: <Code2 className="h-5 w-5 text-violet-400" />, iconBg: 'bg-violet-500/20', title: 'Software Engineering', desc: 'Custom web apps, SaaS platforms and enterprise systems.' },
                    { icon: <Cloud className="h-5 w-5 text-blue-400" />, iconBg: 'bg-blue-500/20', title: 'Cloud Infrastructure', desc: 'Secure, scalable and cost-optimized cloud infrastructure.' },
                    { icon: <Sparkles className="h-5 w-5 text-indigo-400" />, iconBg: 'bg-indigo-500/20', title: 'AI Integration', desc: 'AI automation, intelligent workflows and business intelligence.' },
                    { icon: <ShoppingCart className="h-5 w-5 text-fuchsia-400" />, iconBg: 'bg-fuchsia-500/20', title: 'E-commerce Systems', desc: 'High-performance stores, payment flows and admin dashboards.' }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${ hasHeroBg ? item.iconBg : 'bg-slate-100 dark:bg-slate-800' }`}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 className={`text-xs sm:text-sm font-bold ${ hasHeroBg ? 'text-white' : 'text-slate-800 dark:text-white' }`}>{item.title}</h4>
                        <p className={`text-[11px] sm:text-xs leading-normal mt-1 ${ hasHeroBg ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400' }`}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Stats Footer */}
                <div className={`grid grid-cols-3 gap-2 pt-6 border-t ${ hasHeroBg ? 'border-white/15' : 'border-slate-100 dark:border-slate-800' }`}>
                  {[{ icon: <Trophy className="h-4.5 w-4.5 text-indigo-400 shrink-0" />, val: '40+', lbl: 'Delivered' },
                    { icon: <ShieldCheck className="h-4.5 w-4.5 text-indigo-400 shrink-0" />, val: '99.9%', lbl: 'Uptime' },
                    { icon: <Smile className="h-4.5 w-4.5 text-indigo-400 shrink-0" />, val: '35+', lbl: 'Clients' }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {s.icon}
                      <div className="flex flex-col leading-none">
                        <span className={`text-sm font-extrabold ${ hasHeroBg ? 'text-white' : 'text-slate-800 dark:text-white' }`}>{s.val}</span>
                        <span className={`text-[9px] uppercase mt-0.5 tracking-wider font-mono text-slate-400`}>{s.lbl}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 2. TECH STACK TRUST STRIP                          */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="relative py-12 border-b border-slate-200 dark:border-slate-900 overflow-hidden bg-white dark:bg-slate-950">
        {/* subtle gradient shimmer bg */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/40 via-violet-50/30 to-purple-50/40 dark:from-indigo-950/10 dark:via-violet-950/10 dark:to-purple-950/10 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-300/40 dark:via-indigo-700/30 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-300/30 dark:via-violet-700/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 overflow-hidden relative z-10">
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
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 3. CORE SERVICES SECTION                           */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden">
        {/* Section background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/10 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-900/50 to-transparent" />

        {/* Soft decorative glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-indigo-100/60 dark:bg-indigo-900/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="flex flex-col items-center text-center gap-4 mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <Zap className="h-3.5 w-3.5" />
              What We Build
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Our Core Services
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              End-to-end digital solutions engineered for enterprise performance.
            </p>
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mt-1" />
          </motion.div>

          {services.length === 0 ? (
            <div className="py-16 text-center text-slate-500 font-mono text-xs">No service catalog entries matched your active database records.</div>
          ) : (
            <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_12%,white_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,white_12%,white_88%,transparent)] py-10">
              <div className="animate-marquee-slow flex gap-6 whitespace-nowrap min-w-max">
                {[...services, ...services].map((service, index) => {
                  const theme = serviceThemes[index % serviceThemes.length];
                  const gradients = [
                    'from-violet-500/10 to-violet-600/5',
                    'from-blue-500/10 to-cyan-500/5',
                    'from-indigo-500/10 to-indigo-600/5',
                    'from-fuchsia-500/10 to-pink-500/5'
                  ];
                  const grad = gradients[index % gradients.length];
                  return (
                    <motion.div
                      key={`srv-${service.id || index}-loop`}
                      whileHover={{ y: -8, boxShadow: '0 24px 50px -12px rgba(99,102,241,0.18)', borderColor: 'rgba(99,102,241,0.45)', transition: { duration: 0.28 } }}
                      className="w-[320px] shrink-0 whitespace-normal p-7 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-150 dark:border-slate-800 shadow-sm flex flex-col gap-5 h-[300px] group cursor-pointer backdrop-blur-sm relative overflow-hidden"
                    >
                      {/* card inner gradient accent */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl`} />

                      <motion.div
                        whileHover={{ rotate: 6, scale: 1.08 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 14 }}
                        className={`h-13 w-13 rounded-2xl ${theme.bg} flex items-center justify-center shrink-0 shadow-sm`}
                      >
                        <RenderIcon name={service.icon} className={`h-6 w-6 ${theme.text}`} />
                      </motion.div>

                      <div className="flex flex-col gap-2 flex-grow">
                        <h3 className="text-[15px] font-bold text-slate-800 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {service.description.length > 140 ? `${service.description.slice(0, 140)}...` : service.description}
                        </p>
                      </div>

                      <button
                        onClick={() => setView('services')}
                        className={`flex items-center gap-1.5 text-xs font-bold ${theme.text} w-fit group/btn`}
                      >
                        <span>Explore service</span>
                        <ChevronRight className="h-3.5 w-3.5 transform group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-center mt-14">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 8px 25px -5px rgba(99,102,241,0.2)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setView('services')}
              className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 cursor-pointer transition-all duration-300"
            >
              <span>Explore All Services</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 4. WHY ENTERPRISES CHOOSE US                       */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden bg-slate-950">
        {/* layered bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="flex flex-col items-center text-center gap-4 mb-20"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-widest">
              <Users className="h-3.5 w-3.5" />
              Our Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Why Enterprises Choose{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">Nexus Digital</span>
            </h2>
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mt-1" />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
          >
            {chooseItems.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -6, borderColor: 'rgba(99,102,241,0.5)', boxShadow: '0 0 30px rgba(99,102,241,0.1)', transition: { duration: 0.3 } }}
                className="flex flex-col items-center text-center gap-5 p-7 rounded-2xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm group cursor-default"
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:border-indigo-400/50 transition-colors duration-300 shadow-lg shadow-indigo-500/5">
                  {item.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{item.title}</h3>
                  <p className="text-[11px] leading-relaxed text-slate-400 max-w-[180px] mx-auto">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 5. PORTFOLIO SHOWCASE                              */}
      {/* ═══════════════════════════════════════════════════ */}
      {highlightPortfolios.length > 0 && (
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/10 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
            >
              <div className="flex flex-col gap-4 max-w-xl">
                <span className="inline-flex items-center gap-2 w-fit px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
                  <Trophy className="h-3.5 w-3.5" />
                  Case Studies
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Visual Systems Built
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">For Our Partners</span>
                </h2>
              </div>
              <button
                onClick={() => setView('portfolio')}
                className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors cursor-pointer group shrink-0"
              >
                <span>View Full Portfolio</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-85px' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {highlightPortfolios.map((project, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ y: -8, boxShadow: '0 28px 60px -15px rgba(99,102,241,0.2)', borderColor: 'rgba(99,102,241,0.4)', transition: { duration: 0.3 } }}
                  onClick={() => setSelectedProject(project)}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden cursor-pointer shadow-md transition-all duration-300 flex flex-col group"
                >
                  <div className="aspect-video w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    {/* gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-indigo-600/90 text-white shadow-sm backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>
                  <div className="p-7 flex flex-col gap-3 flex-grow">
                    <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                      Client · {project.client}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-grow">
                      {project.description.slice(0, 115)}...
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-[10px] text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 font-semibold">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center font-mono">+{project.technologies.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════ */}
      {/* 6. CLIENT TESTIMONIALS                             */}
      {/* ═══════════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="relative py-28 overflow-hidden bg-slate-950">
          {/* Dark premium bg */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950 pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[250px] bg-violet-600/8 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20"
            >
              <span className="inline-flex items-center gap-2 mx-auto px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-bold uppercase tracking-widest">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                Client Reviews
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Recommended By
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400"> Elite Technology Directors</span>
              </h2>
              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 mx-auto mt-1" />
            </motion.div>

            {/* Testimonial marquee rows */}
            {[firstRowTestimonials, secondRowTestimonials].filter(row => row.length > 0).map((row, rowIdx) => (
              <div key={rowIdx} className={`relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_12%,white_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,white_12%,white_88%,transparent)] py-4 ${rowIdx > 0 ? 'mt-4' : ''}`}>
                <div className={`${rowIdx % 2 === 0 ? 'animate-marquee-left' : 'animate-marquee-slow'} flex gap-6 whitespace-nowrap min-w-max`}>
                  {[...row, ...row].map((test, index) => (
                    <div
                      key={`test-r${rowIdx}-${index}`}
                      className="w-[420px] shrink-0 whitespace-normal bg-slate-900/70 border border-slate-700/50 backdrop-blur-sm p-7 rounded-2xl flex flex-col justify-between h-[210px] group hover:border-indigo-500/40 transition-all duration-300"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-0.5">
                          {[...Array(test.rating)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]" />
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed text-slate-300 line-clamp-3 italic">
                          &ldquo;{test.quote}&rdquo;
                        </p>
                      </div>
                      <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50 mt-auto">
                        <img src={test.avatar} alt={test.name} className="h-9 w-9 rounded-full object-cover shrink-0 ring-2 ring-indigo-500/30" referrerPolicy="no-referrer" />
                        <div className="flex flex-col leading-tight">
                          <span className="text-xs font-bold text-white">{test.name}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">{test.role} · <span className="text-indigo-400 font-semibold">{test.company}</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </section>
      )}

      {/* 7. BOTTOM CTA BANNER — Premium gradient finish */}
      <section className="relative py-24 overflow-hidden">

        {/* === LAYERED GRADIENT BACKGROUND === */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-violet-950 to-slate-950" />

        {/* Mesh / noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }} />

        {/* Glowing orb — top left */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/30 blur-[100px] pointer-events-none"
        />

        {/* Glowing orb — bottom right */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -right-24 w-[450px] h-[450px] rounded-full bg-violet-600/25 blur-[90px] pointer-events-none"
        />

        {/* Glowing orb — center top */}
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-purple-500/20 blur-[80px] pointer-events-none"
        />

        {/* Shimmer top border line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
        {/* Shimmer bottom border line */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />

        {/* === CONTENT === */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center gap-8">

          {/* Badge pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-400/30 bg-indigo-400/10 text-indigo-300 text-xs font-bold uppercase tracking-widest backdrop-blur-sm"
          >
            <Atom className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            Start Your Project Today
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight leading-[1.1] text-white"
          >
            Ready To Design Your{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-violet-300 to-purple-300">
              Operational Infrastructure?
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed"
          >
            Get in touch with us to draft custom blueprints, verify integrations, and run detailed
            architectural discovery loops for your digital software models.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center mt-2"
          >
            {/* Primary */}
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(99,102,241,0.5)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              onClick={() => setView('contact')}
              className="flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 cursor-pointer group transition-all duration-300"
            >
              <span>Request Consult Call</span>
              <ArrowRight className="h-4.5 w-4.5 transform group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Secondary ghost */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              onClick={() => setView('portfolio')}
              className="flex items-center gap-2.5 px-8 py-4 border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl cursor-pointer transition-all duration-300"
            >
              <span>View Case Studies</span>
              <ChevronRight className="h-4.5 w-4.5" />
            </motion.button>
          </motion.div>

          {/* Trust micro-line */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-xs text-slate-500 mt-2"
          >
            No commitment required · Free discovery call · Response within 24 hrs
          </motion.p>

        </div>
      </section>

    </motion.div>
  );
}
