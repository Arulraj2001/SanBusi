import { useState, useMemo, useRef } from 'react';
import { JobVacancy, WebsiteSettings } from '../types';
import { Briefcase, MapPin, Clock, X, Check, FileText, ArrowRight, Sparkles, BookOpen, Globe, Cpu, Users, GraduationCap, ArrowUpRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CareersProps {
  careers: JobVacancy[];
  addToast: (type: 'success' | 'error', msg: string) => void;
  settings?: WebsiteSettings;
}

export default function Careers({ careers, addToast, settings }: CareersProps) {
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('All');
  
  // Ref to scroll to job listings
  const jobsSectionRef = useRef<HTMLDivElement>(null);

  // Application Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCoverLetter, setFormCoverLetter] = useState('');
  const [formResumeText, setFormResumeText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const tabs = ['All', 'Engineering', 'Design', 'Marketing', 'AI'];

  const cultureCards = [
    {
      title: 'Engineering Excellence',
      desc: 'We prioritize clean, typed, modular architectures, strict testing pipelines, and cutting-edge frontend compile times.',
      icon: <Cpu className="h-6 w-6 text-indigo-500" />
    },
    {
      title: 'Remote-First Collaboration',
      desc: 'Our distributed coordinate network works asynchronously with complete workflow transparency and shared alignment.',
      icon: <Globe className="h-6 w-6 text-indigo-500" />
    },
    {
      title: 'Continuous Learning',
      desc: 'We incentivize continuous engineering progression through specialized library budgets, tech books, and stack conferences.',
      icon: <BookOpen className="h-6 w-6 text-indigo-500" />
    }
  ];

  const valueCards = [
    { title: 'High-impact projects', desc: 'Solve complex scalability challenges and shape architectures that process high transaction throughput.' },
    { title: 'Modern tech stack', desc: 'Build with React 19, TypeScript, Tailwind v4, Node.js, serverless clouds, and modern AI neural loops.' },
    { title: 'Global clients', desc: 'Partner directly with Fortune 500 corporations and industry leaders across finance, cloud, and retail.' },
    { title: 'Growth opportunities', desc: 'Advance along clear technical or management tracks with active mentorship and structural certification resources.' }
  ];

  // Filtered vacancies
  const filteredJobs = useMemo(() => {
    if (activeTab === 'All') return careers;
    return careers.filter(job => job.department === activeTab);
  }, [careers, activeTab]);

  const handleOpenApply = (job: JobVacancy) => {
    setSelectedJob(job);
    setIsApplying(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseApply = () => {
    setIsApplying(false);
    document.body.style.overflow = '';
    setSelectedJob(null);
    setFormName('');
    setFormEmail('');
    setFormCoverLetter('');
    setFormResumeText('');
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formCoverLetter.trim() || !formResumeText.trim()) {
      addToast('error', 'All contact information fields and text resume are strictly required.');
      return;
    }

    setSubmitting(true);
    // Simulate real database application recording
    setTimeout(() => {
      setSubmitting(false);
      addToast('success', `We have successfully received your candidate profile for the ${selectedJob?.title} opening! Our recruitment coordinators will reach out soon.`);
      handleCloseApply();
    }, 1500);
  };

  const scrollToJobs = () => {
    jobsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      
      {/* 1. HERO HEADER */}
      <section className="relative py-28 bg-slate-900 text-white border-b border-slate-800 text-center overflow-hidden">
        {settings?.careersBannerUrl ? (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
            style={{ backgroundImage: `url(${settings.careersBannerUrl})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.05),transparent)] pointer-events-none" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 font-mono">Join Our Team</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight leading-tight">
            Join Nexus Digital
          </h1>
          <p className="text-base text-slate-300 max-w-2xl mx-auto mt-6 leading-relaxed">
            Build enterprise systems that scale globally
          </p>
        </div>
      </section>

      {/* 2. CULTURE HIGHLIGHTS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cultureCards.map((card, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-850 shadow-sm flex flex-col gap-5 hover:shadow-md transition-shadow"
            >
              <div className="h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-900/30">
                {card.icon}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">{card.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. JOB LISTINGS SECTION */}
      <section ref={jobsSectionRef} className="py-24 bg-white dark:bg-slate-900 border-t border-b border-slate-150 dark:border-slate-850">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 border-b border-slate-100 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Current Openings
            </h2>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300 cursor-pointer ${
                    activeTab === tab
                      ? 'bg-slate-900 border-slate-900 dark:bg-white dark:border-white text-white dark:text-slate-900'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:border-slate-350 dark:hover:border-slate-750 shadow-sm'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="py-20 text-center text-slate-550 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 font-mono text-xs">
              No active job openings matching the selected department filter.
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredJobs.map((job) => {
                const jobId = job.id || job.title;
                return (
                  <div
                    key={jobId}
                    className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-850 rounded-2xl p-6 sm:p-8 hover:shadow-md hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                  >
                    <div className="flex flex-col gap-3">
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white tracking-tight leading-none">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-450 font-mono">
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4 text-indigo-500" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-indigo-500" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/20 px-2.5 py-0.5 rounded-lg border border-indigo-100/30 dark:border-indigo-900/20">
                          {job.type}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenApply(job)}
                      className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all cursor-pointer text-center whitespace-nowrap"
                    >
                      Apply Now
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 4. WHY WORK WITH US SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">Engagement Benefits</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Work With Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {valueCards.map((card, idx) => (
            <div key={idx} className="flex flex-col gap-4 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-white dark:bg-slate-900 hover:shadow-sm transition-shadow">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/30 dark:border-indigo-900/30 flex items-center justify-center font-bold text-xs font-mono text-indigo-600 dark:text-indigo-400 select-none">
                0{idx + 1}
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white tracking-tight">
                  {card.title}
                </h3>
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl bg-slate-950 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl border border-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_bottom,rgba(99,102,241,0.08),transparent)] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="flex flex-col gap-3 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Shape the future of enterprise systems
              </h2>
              <p className="text-xs sm:text-sm text-slate-450 leading-relaxed">
                Check our coordinates and apply for one of our digital engineering openings to join a team committed to craftsmanship.
              </p>
            </div>
            <button
              onClick={scrollToJobs}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              Apply Today
            </button>
          </div>
        </div>
      </section>

      {/* 6. DETAILS & APPLICATION MODAL */}
      <AnimatePresence>
        {isApplying && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseApply}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh]"
            >
              
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/20">
                <div className="flex flex-col gap-1.5 text-left">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    Apply: {selectedJob.title}
                  </h2>
                  <div className="flex gap-3 text-[10px] font-mono text-slate-400">
                    <span>{selectedJob.department}</span>
                    <span>&bull;</span>
                    <span>{selectedJob.location}</span>
                  </div>
                </div>
                <button
                  onClick={handleCloseApply}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 flex flex-col gap-6 text-left">
                
                {/* Job Description */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Job Description</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-350 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Requirements & Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col gap-2.5">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Requirements</h3>
                    <ul className="flex flex-col gap-1.5">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-300">
                          <Check className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Nexus Benefits</h3>
                    <ul className="flex flex-col gap-1.5">
                      {selectedJob.benefits.map((ben, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-300">
                          <Check className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span>{ben}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Submission Form */}
                <form onSubmit={handleApplySubmit} className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-500" />
                    Application Form
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase font-mono">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="John Doe"
                        className="py-2.5 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none text-slate-800 dark:text-slate-200 focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase font-mono">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="john.doe@enterprise.com"
                        className="py-2.5 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none text-slate-800 dark:text-slate-200 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase font-mono">Brief Cover Letter</label>
                    <textarea
                      required
                      value={formCoverLetter}
                      onChange={(e) => setFormCoverLetter(e.target.value)}
                      placeholder="Detail briefly how your engineering values align with high-performance digital systems..."
                      rows={3}
                      className="py-2.5 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none text-slate-800 dark:text-slate-200 focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase font-mono">Paste Plain Text Resume / CV</label>
                    <textarea
                      required
                      value={formResumeText}
                      onChange={(e) => setFormResumeText(e.target.value)}
                      placeholder="Paste resume content (employment history, technologies, education)..."
                      rows={4}
                      className="py-2.5 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none text-slate-800 dark:text-slate-200 focus:border-indigo-500 resize-none font-mono text-[11px]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all disabled:bg-slate-400 text-center flex items-center justify-center"
                  >
                    {submitting ? 'Transmitting Candidate File...' : 'Submit Application'}
                  </button>
                </form>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
