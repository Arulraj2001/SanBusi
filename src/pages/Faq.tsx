import { useState, useMemo } from 'react';
import { Faq, WebsiteSettings } from '../types';
import { ChevronDown, ChevronUp, Search, HelpCircle, ArrowRight, MessageSquare, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FaqProps {
  faqs: Faq[];
  setView: (view: string) => void;
  settings?: WebsiteSettings;
}

export default function FAQ({ faqs, setView, settings }: FaqProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('General');

  // Hardcoded corporate categories requested by the user
  const categories = ['General', 'Pricing', 'Development Process', 'Support & Maintenance', 'Security'];

  // Map category tab selections to Firestore database categories
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Category matching logic
      const dbCat = faq.category.toLowerCase();
      if (activeCategory === 'General') {
        return dbCat === 'general';
      } else if (activeCategory === 'Pricing') {
        return dbCat === 'pricing';
      } else if (activeCategory === 'Development Process') {
        return dbCat === 'process' || dbCat === 'development process' || dbCat === 'technical' || dbCat === 'development';
      } else if (activeCategory === 'Support & Maintenance') {
        return dbCat === 'support & maintenance' || dbCat === 'support' || dbCat === 'maintenance';
      } else if (activeCategory === 'Security') {
        return dbCat === 'security' || dbCat === 'compliance';
      }
      return false;
    });
  }, [faqs, activeCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const bannerImg = settings?.faqBannerUrl || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      
      {/* 1. HERO HEADER */}
      <section className="relative py-28 bg-slate-900 text-white border-b border-slate-800 text-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
          style={{ backgroundImage: `url(${bannerImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 font-mono">FAQ Directory</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-slate-300 max-w-2xl mx-auto mt-6 leading-relaxed">
            Everything you need to know about working with Nexus Digital
          </p>
        </div>
      </section>

      {/* 2. MAIN 12-COLUMN CONTENT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT AREA: CATEGORIES & ACCORDIONS (Col Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Search and Category navigation bar */}
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-between border-b border-slate-100 dark:border-slate-850 pb-6">
              {/* Category tabs */}
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setExpandedId(null);
                    }}
                    className={`px-4.5 py-2.5 rounded-xl text-xs font-bold border transition-all duration-300 cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-slate-900 border-slate-900 dark:bg-white dark:border-white text-white dark:text-slate-900'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:border-slate-350 dark:hover:border-slate-750 shadow-sm'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Field */}
              <div className="relative w-full sm:w-64">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setExpandedId(null);
                  }}
                  className="w-full text-xs py-3.5 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none text-slate-700 dark:text-slate-250 focus:border-indigo-500 transition-colors shadow-sm"
                />
              </div>
            </div>

            {/* Accordion container */}
            {filteredFaqs.length === 0 ? (
              <div className="py-20 text-center text-slate-450 bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm font-mono text-xs">
                No FAQ entries found matching this category.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredFaqs.map((faq) => {
                  const faqId = faq.id || faq.question;
                  const isExpanded = expandedId === faqId;

                  return (
                    <div
                      key={faqId}
                      className={`rounded-2xl border transition-all duration-350 overflow-hidden bg-white dark:bg-slate-900 ${
                        isExpanded
                          ? 'border-indigo-500 dark:border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                          : 'border-slate-200/70 dark:border-slate-850 hover:border-slate-350 dark:hover:border-slate-750'
                      }`}
                    >
                      <button
                        onClick={() => toggleExpand(faqId)}
                        className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <HelpCircle className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white leading-snug">
                            {faq.question}
                          </span>
                        </div>
                        <span className="p-1 text-slate-400 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-850/50">
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 pt-0 border-t border-slate-100/60 dark:border-slate-850 text-xs sm:text-sm text-slate-500 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* RIGHT AREA: SUPPORT PANEL (Col Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-28">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/70 dark:border-slate-850 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col gap-6">
              
              <div className="flex flex-col gap-2">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center border border-indigo-100/50 dark:border-indigo-900/30">
                  <MessageSquare className="h-5 w-5 text-indigo-500" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight mt-2">
                  Need direct support?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Can't find the answer you're looking for? Reach out directly to our engineering and consultation team.
                </p>
              </div>

              <button
                onClick={() => setView('contact')}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-colors duration-300 text-center flex items-center justify-center gap-1.5"
              >
                <span>Contact Us</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* 3. BOTTOM CTA SECTION */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-150 dark:border-slate-850">
        <div className="max-w-4xl mx-auto px-4 text-center flex flex-col items-center gap-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Still have questions? Talk to our team
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
            Our technology directors are ready to consult on custom requirements, system architectures, and engineering resources.
          </p>
          <button
            onClick={() => setView('contact')}
            className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/10 cursor-pointer transition-all duration-300"
          >
            <span>Request Consult Call</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

    </div>
  );
}
