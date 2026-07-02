import { useState, useMemo } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { FeedbackEntry, WebsiteSettings } from '../types';
import {
  Star, Send, CheckCircle2, MessageSquare, Building2,
  User, Briefcase, ChevronDown, TrendingUp, Award, Users, Sparkles
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

// Gradient palette for avatar initials
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
                : 'text-slate-300 dark:text-slate-600'
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

  // Stats
  const avgRating = approvedFeedbacks.length
    ? (approvedFeedbacks.reduce((s, f) => s + f.rating, 0) / approvedFeedbacks.length).toFixed(1)
    : '—';
  const fiveStarCount = approvedFeedbacks.filter(f => f.rating === 5).length;

  // Form state
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
    visible: { transition: { staggerChildren: 0.08 } }
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easePreset } }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">

      {/* ═══ HERO BANNER ═══ */}
      <section className={`relative py-24 overflow-hidden flex items-center min-h-[38vh] ${hasBanner ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900'}`}>
        {hasBanner && (
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
            style={{ backgroundImage: `url(${settings.feedbackBannerUrl})`, opacity: 0.18 }}
          />
        )}
        {/* Decorative orbs */}
        <div className="absolute -top-20 left-1/3 w-[500px] h-[300px] rounded-full bg-indigo-600/15 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[200px] rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easePreset }}
            className="flex flex-col items-center gap-5"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-bold uppercase tracking-widest">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              Client Feedback
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              What Our Clients
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                Say About Us
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Real experiences from the businesses we've helped grow. Share yours below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS STRIP ═══ */}
      {approvedFeedbacks.length > 0 && (
        <section className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-3 gap-4 sm:gap-8"
            >
              {[
                { icon: <MessageSquare className="h-5 w-5 text-indigo-500" />, value: approvedFeedbacks.length.toString(), label: 'Client Reviews' },
                { icon: <Star className="h-5 w-5 text-amber-400 fill-amber-400" />, value: `★ ${avgRating}`, label: 'Average Rating' },
                { icon: <Award className="h-5 w-5 text-violet-500" />, value: `${fiveStarCount}`, label: '5-Star Reviews' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══ FEEDBACK SHOWCASE GRID ═══ */}
      {approvedFeedbacks.length > 0 ? (
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
            >
              {approvedFeedbacks.map((fb, i) => (
                <motion.div
                  key={fb.id || i}
                  variants={fadeUp}
                  whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.35)', transition: { duration: 0.25 } }}
                  className="break-inside-avoid mb-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-4 group transition-all duration-300"
                >
                  {/* Quote mark */}
                  <div className="text-5xl font-serif text-indigo-100 dark:text-indigo-900/60 leading-none select-none">&ldquo;</div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 -mt-4">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`h-4 w-4 ${s <= fb.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                    ))}
                    <span className="ml-2 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                      {['','Poor','Fair','Good','Great','Excellent'][fb.rating]}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic flex-grow">
                    {fb.message}
                  </p>

                  {/* Project type chip */}
                  <span className="w-fit text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/40">
                    {fb.projectType}
                  </span>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-50 dark:border-slate-800">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${getAvatarGradient(fb.name)} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}>
                      {getInitials(fb.name)}
                    </div>
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{fb.name}</span>
                      <span className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {fb.role} · <span className="text-indigo-500 dark:text-indigo-400 font-semibold">{fb.company}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      ) : (
        <section className="py-24 flex flex-col items-center justify-center gap-4 text-center px-4">
          <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No feedback yet</h3>
          <p className="text-sm text-slate-400 max-w-xs">Be the first to share your experience — scroll down to submit yours.</p>
        </section>
      )}

      {/* ═══ SUBMIT FEEDBACK FORM ═══ */}
      <section id="feedback-form" className="relative py-24 overflow-hidden bg-slate-950">
        {/* Layered bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[200px] bg-violet-600/8 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center gap-4 mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              Share Your Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How Did We Do?
            </h2>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Your feedback helps us improve and lets future clients make informed decisions.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: easePreset }}
                className="flex flex-col items-center gap-6 text-center bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm rounded-3xl p-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                  className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/30"
                >
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </motion.div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-extrabold text-white">Thank You!</h3>
                  <p className="text-slate-300 text-sm max-w-xs leading-relaxed">
                    Your feedback has been submitted and is pending review. It will appear on this page once approved.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Typically reviewed within 24 hours</span>
                </div>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', company: '', role: '', rating: 0, projectType: '', message: '' }); }}
                  className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:border-indigo-500 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  Submit Another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm rounded-3xl p-7 sm:p-10 flex flex-col gap-6"
              >

                {/* Row 1: Name + Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <User className="h-3 w-3" /> Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Alex Johnson"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-800/60 border text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors ${errors.name ? 'border-rose-500' : 'border-slate-700'}`}
                    />
                    {errors.name && <span className="text-[10px] text-rose-400">{errors.name}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Building2 className="h-3 w-3" /> Company
                    </label>
                    <input
                      type="text"
                      placeholder="Acme Corp"
                      value={form.company}
                      onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-800/60 border text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors ${errors.company ? 'border-rose-500' : 'border-slate-700'}`}
                    />
                    {errors.company && <span className="text-[10px] text-rose-400">{errors.company}</span>}
                  </div>
                </div>

                {/* Row 2: Role + Project Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Briefcase className="h-3 w-3" /> Your Role
                    </label>
                    <input
                      type="text"
                      placeholder="CTO, Product Manager..."
                      value={form.role}
                      onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-800/60 border text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors ${errors.role ? 'border-rose-500' : 'border-slate-700'}`}
                    />
                    {errors.role && <span className="text-[10px] text-rose-400">{errors.role}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <TrendingUp className="h-3 w-3" /> Project Type
                    </label>
                    <div className="relative">
                      <select
                        value={form.projectType}
                        onChange={e => setForm(f => ({ ...f, projectType: e.target.value }))}
                        className={`w-full px-4 py-3 pr-9 rounded-xl bg-slate-800/60 border text-sm text-white outline-none focus:border-indigo-500 appearance-none transition-colors cursor-pointer ${errors.projectType ? 'border-rose-500' : 'border-slate-700'} ${!form.projectType ? 'text-slate-500' : 'text-white'}`}
                      >
                        <option value="" disabled className="bg-slate-800">Select project type</option>
                        {PROJECT_TYPES.map(pt => (
                          <option key={pt} value={pt} className="bg-slate-800">{pt}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                    {errors.projectType && <span className="text-[10px] text-rose-400">{errors.projectType}</span>}
                  </div>
                </div>

                {/* Row 3: Star Rating */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Star className="h-3 w-3" /> Your Rating
                  </label>
                  <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
                  {errors.rating && <span className="text-[10px] text-rose-400">{errors.rating}</span>}
                </div>

                {/* Row 4: Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3" /> Your Feedback
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us about your experience working with us — what went well, what we delivered, and how it impacted your business..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-800/60 border text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 resize-none transition-colors leading-relaxed ${errors.message ? 'border-rose-500' : 'border-slate-700'}`}
                  />
                  <div className="flex items-center justify-between">
                    {errors.message
                      ? <span className="text-[10px] text-rose-400">{errors.message}</span>
                      : <span className="text-[10px] text-slate-500">Minimum 20 characters</span>
                    }
                    <span className={`text-[10px] font-mono ${form.message.length < 20 ? 'text-slate-600' : 'text-emerald-500'}`}>
                      {form.message.length} chars
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px -5px rgba(99,102,241,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2.5 w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 cursor-pointer transition-all duration-300"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </motion.button>

                <p className="text-center text-[10px] text-slate-500 leading-relaxed">
                  Your feedback is reviewed before publishing. We may reach out to verify your submission.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
