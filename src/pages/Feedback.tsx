import { useState, useMemo } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { FeedbackEntry, WebsiteSettings } from '../types';
import {
  Star, Send, CheckCircle2, MessageSquare, Building2,
  User, Briefcase, ChevronDown, Award, Sparkles, X, Edit3, Filter
} from 'lucide-react';

interface FeedbackProps {
  feedbacks: FeedbackEntry[];
  settings: WebsiteSettings;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

const PROJECT_TYPES = [
  'Web Application', 'Mobile App', 'Cloud Infrastructure',
  'E-Commerce Platform', 'Digital Marketing', 'AI Integration',
  'Custom Software', 'UI/UX Design', 'Other'
];

const AVATAR_GRADIENTS = [
  'from-violet-500 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-indigo-500 to-purple-500',
  'from-fuchsia-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-sky-500 to-blue-500',
];

function getAvatarGradient(name: string) {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_GRADIENTS[code % AVATAR_GRADIENTS.length];
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="cursor-pointer transition-transform duration-150 hover:scale-125"
        >
          <Star
            className={`h-7 w-7 transition-colors duration-150 ${
              star <= (hover || value)
                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                : 'text-slate-350 dark:text-slate-650'
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-xs font-bold text-amber-500">
          {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][value]}
        </span>
      )}
    </div>
  );
}

export default function Feedback({ feedbacks, settings, addToast }: FeedbackProps) {
  const approvedFeedbacks = feedbacks.filter(f => f.status === 'approved');

  // Interactive UI Filters
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string | 'all'>('all');

  const filteredFeedbacks = useMemo(() => {
    return approvedFeedbacks.filter(fb => {
      const matchStar = starFilter === 'all' || fb.rating === starFilter;
      const matchProject = projectFilter === 'all' || fb.projectType === projectFilter;
      return matchStar && matchProject;
    });
  }, [approvedFeedbacks, starFilter, projectFilter]);

  // Floating notepad trigger state
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Stats
  const avgRating = approvedFeedbacks.length
    ? (approvedFeedbacks.reduce((s, f) => s + f.rating, 0) / approvedFeedbacks.length).toFixed(1)
    : '—';
  const fiveStarCount = approvedFeedbacks.filter(f => f.rating === 5).length;

  // Form states
  const [form, setForm] = useState({
    name: '', company: '', role: '', rating: 0, projectType: '', message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const hasBanner = !!settings?.feedbackBannerUrl;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!form.company.trim()) e.company = 'Please enter your company';
    if (!form.role.trim()) e.role = 'Please enter your role';
    if (!form.rating) e.rating = 'Please select a star rating';
    if (!form.projectType) e.projectType = 'Please select a project type';
    if (form.message.trim().length < 20) e.message = 'Feedback must be at least 20 characters';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        ...form,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      addToast('success', 'Thank you! Your feedback has been submitted for review.');
    } catch (err) {
      console.error(err);
      addToast('error', 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const easePreset = [0.25, 0.46, 0.45, 0.94];

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } }
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easePreset } }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 font-sans pb-16 relative">

      {/* ═══ 1. FLOATING NOTEPAD STYLE HANGING BUTTON ═══ */}
      <div className="fixed right-0 top-1/3 -translate-y-1/2 z-40">
        <motion.button
          onClick={() => {
            setSubmitted(false);
            setIsFormOpen(true);
          }}
          whileHover={{ x: -6 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="flex items-center gap-3 py-4 pl-4 pr-6 bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:to-violet-500 text-white rounded-l-2xl shadow-2xl shadow-indigo-500/30 cursor-pointer border-l border-y border-white/20 select-none group"
        >
          <div className="p-2 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Edit3 className="h-4.5 w-4.5 text-white animate-pulse" />
          </div>
          <div className="flex flex-col items-start leading-none gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Share Story</span>
            <span className="text-xs font-extrabold tracking-tight">Leave Feedback</span>
          </div>
        </motion.button>
      </div>

      {/* ═══ 2. HERO BANNER (Enhanced Premium visual design) ═══ */}
      <section className={`relative py-28 overflow-hidden flex items-center min-h-[42vh] ${hasBanner ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950'}`}>
        {hasBanner && (
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
            style={{ backgroundImage: `url(${settings.feedbackBannerUrl})`, opacity: 0.12 }}
          />
        )}
        {/* Sleek grid matrix visual overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        {/* Dynamic mesh glows */}
        <div className="absolute -top-32 left-1/4 w-[600px] h-[350px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-[450px] h-[250px] rounded-full bg-violet-600/8 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easePreset }}
            className="flex flex-col items-center gap-5"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-400/20 bg-indigo-400/5 text-indigo-400 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              Verified Client Showcase
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
              What Our Partners
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-500 mt-2">
                Say About Us
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-lg leading-relaxed mt-2">
              Discover real operational feedback and architectural stories from engineering teams we have empowered.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ 3. STATS STRIP ═══ */}
      {approvedFeedbacks.length > 0 && (
        <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/80 shadow-sm relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { icon: <MessageSquare className="h-4.5 w-4.5 text-indigo-500" />, value: approvedFeedbacks.length.toString(), label: 'Client Reviews' },
                { icon: <Star className="h-4.5 w-4.5 text-amber-400 fill-amber-400" />, value: `★ ${avgRating}`, label: 'Average Score' },
                { icon: <Award className="h-4.5 w-4.5 text-pink-500" />, value: `${fiveStarCount}`, label: '5-Star Ratings' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1.5 border-r last:border-0 border-slate-100 dark:border-slate-800">
                  <span className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-none">{stat.value}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                    {stat.icon}
                    <span className="hidden sm:inline">{stat.label}</span>
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══ 4. FILTER BAR ═══ */}
      {approvedFeedbacks.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 shadow-sm text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Filter className="h-4 w-4" />
              <span className="font-bold uppercase tracking-wider text-[10px]">Filter Reviews:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Star Rating Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Rating:</span>
                <select
                  value={starFilter}
                  onChange={e => setStarFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold outline-none text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="all">All Stars</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                </select>
              </div>

              {/* Project Type Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Project:</span>
                <select
                  value={projectFilter}
                  onChange={e => setProjectFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold outline-none text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="all">All Projects</option>
                  {PROJECT_TYPES.map(pt => (
                    <option key={pt} value={pt}>{pt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 5. FEEDBACK SHOWCASE GRID ═══ */}
      <section className="relative py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {filteredFeedbacks.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
            >
              {filteredFeedbacks.map((fb, i) => (
                <motion.div
                  key={fb.id || i}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="break-inside-avoid mb-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 flex flex-col gap-4 group transition-all duration-300 shadow-sm hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10"
                >
                  {/* Quote mark and header */}
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-serif text-indigo-400/20 dark:text-indigo-800/40 leading-none select-none">&ldquo;</span>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`h-3 w-3 ${s <= fb.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic flex-grow">
                    {fb.message}
                  </p>

                  {/* Project type chip */}
                  <span className="w-fit text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                    {fb.projectType}
                  </span>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                    <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${getAvatarGradient(fb.name)} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-inner`}>
                      {getInitials(fb.name)}
                    </div>
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{fb.name}</span>
                      <span className="text-[10px] text-slate-400 truncate">
                        {fb.role} · <span className="text-indigo-500 dark:text-indigo-400 font-semibold">{fb.company}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <MessageSquare className="h-10 w-10 text-slate-300 dark:text-slate-700 animate-bounce" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No matching feedback found</h3>
              <p className="text-xs text-slate-400 max-w-xs">Try selecting a different filter range or submit your own review using the floating tab.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ 6. POPUP MODAL SUBMISSION FORM ═══ */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Form viewport */}
              <div className="p-6 sm:p-10 max-h-[85vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-6 text-center py-10"
                    >
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <CheckCircle2 className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Review Submitted!</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xs leading-relaxed">
                          Your response has been loaded into our administration console and will appear live upon validation.
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            setSubmitted(false);
                            setForm({ name: '', company: '', role: '', rating: 0, projectType: '', message: '' });
                          }}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                        >
                          Submit Another
                        </button>
                        <button
                          onClick={() => setIsFormOpen(false)}
                          className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer"
                        >
                          Close Window
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-5 text-slate-800 dark:text-slate-200"
                    >
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-400/20 bg-indigo-400/5 text-indigo-500 text-[10px] font-bold uppercase tracking-widest">
                          <Sparkles className="h-3 w-3" /> Share Experience
                        </span>
                        <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white mt-2">Submit Feedback</h3>
                        <p className="text-slate-400 text-xs mt-1">Briefly outline your operational experiences below.</p>
                      </div>

                      {/* Name + Company */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450">Full Name</label>
                          <input
                            type="text"
                            placeholder="Alex Johnson"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            className={`w-full px-4.5 py-2.5 rounded-xl border text-xs bg-slate-50 dark:bg-slate-950/20 outline-none focus:border-indigo-500 text-slate-900 dark:text-white ${errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                          />
                          {errors.name && <span className="text-[9px] text-rose-500">{errors.name}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450">Company Name</label>
                          <input
                            type="text"
                            placeholder="Acme Corp"
                            value={form.company}
                            onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                            className={`w-full px-4.5 py-2.5 rounded-xl border text-xs bg-slate-50 dark:bg-slate-950/20 outline-none focus:border-indigo-500 text-slate-900 dark:text-white ${errors.company ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                          />
                          {errors.company && <span className="text-[9px] text-rose-500">{errors.company}</span>}
                        </div>
                      </div>

                      {/* Role + Project Type */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-455">Corporate Role</label>
                          <input
                            type="text"
                            placeholder="Engineering Principal"
                            value={form.role}
                            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                            className={`w-full px-4.5 py-2.5 rounded-xl border text-xs bg-slate-50 dark:bg-slate-950/20 outline-none focus:border-indigo-500 text-slate-900 dark:text-white ${errors.role ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                          />
                          {errors.role && <span className="text-[9px] text-rose-500">{errors.role}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-455">Project Category</label>
                          <div className="relative">
                            <select
                              value={form.projectType}
                              onChange={e => setForm(f => ({ ...f, projectType: e.target.value }))}
                              className={`w-full px-4.5 py-2.5 pr-8 rounded-xl border text-xs bg-slate-50 dark:bg-slate-950/20 outline-none focus:border-indigo-500 appearance-none text-slate-800 dark:text-slate-200 cursor-pointer ${errors.projectType ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                            >
                              <option value="" disabled>Select category</option>
                              {PROJECT_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          </div>
                          {errors.projectType && <span className="text-[9px] text-rose-500">{errors.projectType}</span>}
                        </div>
                      </div>

                      {/* Rating selection */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-455">Rating Score</label>
                        <StarPicker value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
                        {errors.rating && <span className="text-[9px] text-rose-500">{errors.rating}</span>}
                      </div>

                      {/* Feedback Textarea */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-455">Feedback Description</label>
                        <textarea
                          rows={4}
                          placeholder="Your message (minimum 20 characters)..."
                          value={form.message}
                          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                          className={`w-full px-4.5 py-2.5 rounded-xl border text-xs bg-slate-50 dark:bg-slate-950/20 outline-none focus:border-indigo-500 resize-none text-slate-900 dark:text-white leading-relaxed ${errors.message ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                        />
                        <div className="flex items-center justify-between text-[9px] text-slate-400">
                          <span>Min 20 characters</span>
                          <span className={form.message.length < 20 ? 'text-rose-400' : 'text-emerald-500'}>
                            {form.message.length} chars
                          </span>
                        </div>
                      </div>

                      {/* Submit Trigger */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg hover:scale-[1.01] transition-transform cursor-pointer flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <div className="h-4.5 w-4.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            <span>Submit Feedback</span>
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
