import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { collection, getDocs, doc, getDoc, query, orderBy, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import {
  Service,
  PortfolioProject,
  BlogPost,
  Testimonial,
  Faq,
  JobVacancy,
  ContactMessage,
  WebsiteSettings
} from './types';
import {
  INITIAL_SERVICES,
  INITIAL_PORTFOLIOS,
  INITIAL_BLOGS,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_CAREERS,
  INITIAL_SETTINGS
} from './lib/initialData';

// UI Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast, { Toaster, useToasts } from './components/Toast';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import FAQ from './pages/Faq';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';

// Lucide icon helper
import { Shield, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const enrichServices = (arr: any[]): Service[] => arr.map((item, idx) => ({ id: item.id || `preset-srv-${idx + 1}`, ...item }));
const enrichPortfolios = (arr: any[]): PortfolioProject[] => arr.map((item, idx) => ({ id: item.id || `preset-port-${idx + 1}`, ...item }));
const enrichBlogs = (arr: any[]): BlogPost[] => arr.map((item, idx) => ({ id: item.id || `preset-blog-${idx + 1}`, ...item }));
const enrichTestimonials = (arr: any[]): Testimonial[] => arr.map((item, idx) => ({ id: item.id || `preset-test-${idx + 1}`, ...item }));
const enrichFaqs = (arr: any[]): Faq[] => arr.map((item, idx) => ({ id: item.id || `preset-faq-${idx + 1}`, ...item }));
const enrichCareers = (arr: any[]): JobVacancy[] => arr.map((item, idx) => ({ id: item.id || `preset-job-${idx + 1}`, ...item }));

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.hash || '#home');
  const { toasts, addToast, removeToast } = useToasts();
  const { user, isAdmin, login, loginWithEmail, logout, loading: authLoading, bypassLogin } = useAuth();

  const currentView = currentPath.substring(1) || 'home';
  const setCurrentView = (view: string) => {
    window.location.hash = '#' + view;
  };

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Firestore DB sync states
  const [services, setServices] = useState<Service[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioProject[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [careers, setCareers] = useState<JobVacancy[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);
  const [dbLoading, setDbLoading] = useState<boolean>(true);

  // States for selected overlay structures
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  // Router listener for sandboxed hash parameters
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      setCurrentPath(hash);
      // Automatically lock modals on page changes
      setSelectedProject(null);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch all compiled variables from Firestore with active local seed fallbacks
  const loadDatabaseState = async () => {
    setDbLoading(true);

    // Self-healing migration for FAQ cache when presets are updated
    try {
      const localFaqsVal = localStorage.getItem('local_faqs');
      if (localFaqsVal) {
        const localFaqs = JSON.parse(localFaqsVal);
        if (Array.isArray(localFaqs)) {
          const cachedPresetsCount = localFaqs.filter((item: any) => item.id?.toString().startsWith('preset-')).length;
          if (cachedPresetsCount > 0 && cachedPresetsCount < INITIAL_FAQS.length) {
            localStorage.removeItem('local_faqs');
          }
        }
      }
    } catch (e) {
      console.warn("Failed to migrate outdated FAQ cache:", e);
    }

    const isBypass = localStorage.getItem('bypass_admin') === 'true';
    if (isBypass) {
      const getCached = <T,>(key: string, preset: T): T => {
        const d = localStorage.getItem(key);
        if (d) {
          try {
            return JSON.parse(d) as T;
          } catch (e) {
            console.error("Failed to parse cached data", key, e);
          }
        }
        localStorage.setItem(key, JSON.stringify(preset));
        return preset;
      };

      setServices(enrichServices(getCached('local_services', INITIAL_SERVICES)));
      setPortfolios(enrichPortfolios(getCached('local_portfolio', INITIAL_PORTFOLIOS)));
      setBlogs(enrichBlogs(getCached('local_blog', INITIAL_BLOGS)));
      setTestimonials(enrichTestimonials(getCached('local_testimonials', INITIAL_TESTIMONIALS)));
      setFaqs(enrichFaqs(getCached('local_faqs', INITIAL_FAQS)));
      setCareers(enrichCareers(getCached('local_careers', INITIAL_CAREERS)));
      setMessages(getCached('local_contactMessages', []));
      setSettings(getCached('local_settings', INITIAL_SETTINGS));
      setDbLoading(false);
      return;
    }

    try {
      // 1. SERVICES
      let servicesList: Service[] = [];
      try {
        const servicesSnapshot = await getDocs(collection(db, 'services'));
        if (!servicesSnapshot.empty) {
          servicesList = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
        }
      } catch (e) {
        console.warn("Could not fetch services from Firestore, merging local instead:", e);
      }
      const localServicesVal = localStorage.getItem('local_services');
      let localServices: Service[] = [];
      if (localServicesVal) {
        try { localServices = JSON.parse(localServicesVal); } catch (e) {}
      }
      const localOnlyServices = localServices.filter(item => 
        item.id.toString().startsWith('local-srv-') && 
        !servicesList.some(dbItem => dbItem.id === item.id)
      );
      const mergedServices = [...servicesList, ...localOnlyServices];
      if (mergedServices.length > 0) {
        setServices(enrichServices(mergedServices));
        localStorage.setItem('local_services', JSON.stringify(mergedServices));
      } else {
        const list = enrichServices(INITIAL_SERVICES);
        setServices(list);
        localStorage.setItem('local_services', JSON.stringify(list));
      }

      // 2. PORTFOLIO
      let portfoliosList: PortfolioProject[] = [];
      try {
        const portfoliosSnapshot = await getDocs(collection(db, 'portfolio'));
        if (!portfoliosSnapshot.empty) {
          portfoliosList = portfoliosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PortfolioProject[];
        }
      } catch (e) {
        console.warn("Could not fetch portfolio from Firestore, merging local instead:", e);
      }
      const localPortfoliosVal = localStorage.getItem('local_portfolio');
      let localPortfolios: PortfolioProject[] = [];
      if (localPortfoliosVal) {
        try { localPortfolios = JSON.parse(localPortfoliosVal); } catch (e) {}
      }
      const localOnlyPortfolios = localPortfolios.filter(item => 
        item.id.toString().startsWith('local-port-') && 
        !portfoliosList.some(dbItem => dbItem.id === item.id)
      );
      const mergedPortfolios = [...portfoliosList, ...localOnlyPortfolios];
      if (mergedPortfolios.length > 0) {
        setPortfolios(enrichPortfolios(mergedPortfolios));
        localStorage.setItem('local_portfolio', JSON.stringify(mergedPortfolios));
      } else {
        const list = enrichPortfolios(INITIAL_PORTFOLIOS);
        setPortfolios(list);
        localStorage.setItem('local_portfolio', JSON.stringify(list));
      }

      // 3. BLOGS
      let blogsList: BlogPost[] = [];
      try {
        const blogsSnapshot = await getDocs(collection(db, 'blog'));
        if (!blogsSnapshot.empty) {
          blogsList = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
        }
      } catch (e) {
        console.warn("Could not fetch blog from Firestore, merging local instead:", e);
      }
      const localBlogsVal = localStorage.getItem('local_blog');
      let localBlogs: BlogPost[] = [];
      if (localBlogsVal) {
        try { localBlogs = JSON.parse(localBlogsVal); } catch (e) {}
      }
      const localOnlyBlogs = localBlogs.filter(item => 
        item.id.toString().startsWith('local-blog-') && 
        !blogsList.some(dbItem => dbItem.id === item.id)
      );
      const mergedBlogs = [...blogsList, ...localOnlyBlogs];
      if (mergedBlogs.length > 0) {
        setBlogs(enrichBlogs(mergedBlogs));
        localStorage.setItem('local_blog', JSON.stringify(mergedBlogs));
      } else {
        const list = enrichBlogs(INITIAL_BLOGS);
        setBlogs(list);
        localStorage.setItem('local_blog', JSON.stringify(list));
      }

      // 4. TESTIMONIALS
      let testimonialsList: Testimonial[] = [];
      try {
        const testimonialsSnapshot = await getDocs(collection(db, 'testimonials'));
        if (!testimonialsSnapshot.empty) {
          testimonialsList = testimonialsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Testimonial[];
        }
      } catch (e) {
        console.warn("Could not fetch testimonials from Firestore, merging local instead:", e);
      }
      const localTestimonialsVal = localStorage.getItem('local_testimonials');
      let localTestimonials: Testimonial[] = [];
      if (localTestimonialsVal) {
        try { localTestimonials = JSON.parse(localTestimonialsVal); } catch (e) {}
      }
      const localOnlyTestimonials = localTestimonials.filter(item => 
        item.id.toString().startsWith('local-test-') && 
        !testimonialsList.some(dbItem => dbItem.id === item.id)
      );
      const mergedTestimonials = [...testimonialsList, ...localOnlyTestimonials];
      if (mergedTestimonials.length > 0) {
        setTestimonials(enrichTestimonials(mergedTestimonials));
        localStorage.setItem('local_testimonials', JSON.stringify(mergedTestimonials));
      } else {
        const list = enrichTestimonials(INITIAL_TESTIMONIALS);
        setTestimonials(list);
        localStorage.setItem('local_testimonials', JSON.stringify(list));
      }

      // 5. FAQS
      let faqsList: Faq[] = [];
      try {
        const faqsSnapshot = await getDocs(collection(db, 'faqs'));
        if (!faqsSnapshot.empty) {
          faqsList = faqsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Faq[];
        }
      } catch (e) {
        console.warn("Could not fetch faqs from Firestore, merging local instead:", e);
      }
      const localFaqsVal = localStorage.getItem('local_faqs');
      let localFaqs: Faq[] = [];
      if (localFaqsVal) {
        try { localFaqs = JSON.parse(localFaqsVal); } catch (e) {}
      }
      const localOnlyFaqs = localFaqs.filter(item => 
        item.id.toString().startsWith('local-faq-') && 
        !faqsList.some(dbItem => dbItem.id === item.id)
      );
      const mergedFaqs = [...faqsList, ...localOnlyFaqs];
      if (mergedFaqs.length > 0) {
        setFaqs(enrichFaqs(mergedFaqs));
        localStorage.setItem('local_faqs', JSON.stringify(mergedFaqs));
      } else {
        const list = enrichFaqs(INITIAL_FAQS);
        setFaqs(list);
        localStorage.setItem('local_faqs', JSON.stringify(list));
      }

      // 6. CAREERS
      let careersList: JobVacancy[] = [];
      try {
        const careersSnapshot = await getDocs(collection(db, 'careers'));
        if (!careersSnapshot.empty) {
          careersList = careersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as JobVacancy[];
        }
      } catch (e) {
        console.warn("Could not fetch careers from Firestore, merging local instead:", e);
      }
      const localCareersVal = localStorage.getItem('local_careers');
      let localCareers: JobVacancy[] = [];
      if (localCareersVal) {
        try { localCareers = JSON.parse(localCareersVal); } catch (e) {}
      }
      const localOnlyCareers = localCareers.filter(item => 
        item.id.toString().startsWith('local-car-') && 
        !careersList.some(dbItem => dbItem.id === item.id)
      );
      const mergedCareers = [...careersList, ...localOnlyCareers];
      if (mergedCareers.length > 0) {
        setCareers(enrichCareers(mergedCareers));
        localStorage.setItem('local_careers', JSON.stringify(mergedCareers));
      } else {
        const list = enrichCareers(INITIAL_CAREERS);
        setCareers(list);
        localStorage.setItem('local_careers', JSON.stringify(list));
      }

      // 7. INBOUND CUSTOMER LEADS (Admin only visibility, handled securely under firestore rules)
      if (isAdmin) {
        let list: ContactMessage[] = [];
        try {
          const messagesSnapshot = await getDocs(collection(db, 'contactMessages'));
          if (!messagesSnapshot.empty) {
            list = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ContactMessage[];
          }
        } catch (e) {
          console.warn("Could not fetch contact messages from Firestore, merging local instead:", e);
        }
        const localMessagesVal = localStorage.getItem('local_contactMessages');
        let localMessages: ContactMessage[] = [];
        if (localMessagesVal) {
          try { localMessages = JSON.parse(localMessagesVal); } catch (e) {}
        }
        const localOnlyMessages = localMessages.filter(item => 
          item.id.toString().startsWith('local-msg-') && 
          !list.some(dbItem => dbItem.id === item.id)
        );
        const mergedMessages = [...list, ...localOnlyMessages];
        mergedMessages.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());

        setMessages(mergedMessages);
        localStorage.setItem('local_contactMessages', JSON.stringify(mergedMessages));
      }

      // 8. GLOBAL WEBSITE SETTINGS
      let loadedSettings: WebsiteSettings | null = null;
      try {
        const settingsDocRef = doc(db, 'settings', 'nexus_core');
        const settingsSnap = await getDoc(settingsDocRef);
        if (settingsSnap.exists()) {
          loadedSettings = settingsSnap.data() as WebsiteSettings;
        }
      } catch (e) {
        console.warn("Could not fetch settings from Firestore, using local instead:", e);
      }
      if (loadedSettings) {
        setSettings(loadedSettings);
        localStorage.setItem('local_settings', JSON.stringify(loadedSettings));
      } else {
        const localSettingsVal = localStorage.getItem('local_settings');
        let localSettings: WebsiteSettings | null = null;
        if (localSettingsVal) {
          try { localSettings = JSON.parse(localSettingsVal); } catch (e) {}
        }
        const finalSettings = localSettings || INITIAL_SETTINGS;
        setSettings(finalSettings);
        localStorage.setItem('local_settings', JSON.stringify(finalSettings));
      }

    } catch (err) {
      console.warn("Certain Firestore directories are empty or uninitialized. Utilizing pre-seeded fallback parameters:", err);
      const getCached = <T,>(key: string, preset: T): T => {
        const d = localStorage.getItem(key);
        if (d) {
          try {
            return JSON.parse(d) as T;
          } catch (e) {}
        }
        return preset;
      };

      setServices(enrichServices(getCached('local_services', INITIAL_SERVICES)));
      setPortfolios(enrichPortfolios(getCached('local_portfolio', INITIAL_PORTFOLIOS)));
      setBlogs(enrichBlogs(getCached('local_blog', INITIAL_BLOGS)));
      setTestimonials(enrichTestimonials(getCached('local_testimonials', INITIAL_TESTIMONIALS)));
      setFaqs(enrichFaqs(getCached('local_faqs', INITIAL_FAQS)));
      setCareers(enrichCareers(getCached('local_careers', INITIAL_CAREERS)));
      setMessages(getCached('local_contactMessages', []));
      setSettings(getCached('local_settings', INITIAL_SETTINGS));
    } finally {
      setDbLoading(false);
    }
  };

  // Reload details when Auth state changes (messages query requires Admin rights)
  useEffect(() => {
    loadDatabaseState();
  }, [user, isAdmin]);

  // Dynamic document title update based on loaded configurations
  useEffect(() => {
    if (settings && settings.companyName) {
      document.title = settings.seoTitle || `${settings.companyName} | Digital Agency`;
    }
  }, [settings]);

  /* ======================================================== */
  /* ADMIN AUTHENTICATION FORM CONTROLS                       */
  /* ======================================================== */
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleAdminSignIn = async () => {
    setLoginSubmitting(true);
    try {
      await login();
      addToast('success', 'Authentication verified! Launching Executive Secure Dashboard.');
      window.location.hash = '#admin';
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Google Sign-in failed or credentials denied.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleEmailPassSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailText.trim() || !passwordText.trim()) {
      addToast('error', 'Please fill in both email and password fields.');
      return;
    }
    setLoginSubmitting(true);
    try {
      await loginWithEmail(emailText.trim(), passwordText);
      addToast('success', 'Authentication verified! Launching Executive Secure Dashboard.');
      window.location.hash = '#admin';
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || 'Verification failed. Double check your typing or configuration.';
      if (errMsg.includes('auth/configuration-not-found') || errMsg.includes('auth/operation-not-allowed')) {
        errMsg = 'Email/Password login is not enabled in Firebase. Please contact your system administrator.';
      } else if (errMsg.includes('auth/invalid-credential') || errMsg.includes('auth/user-not-found') || errMsg.includes('auth/wrong-password')) {
        errMsg = 'Invalid email address or security passcode. Please verify your credentials and try again.';
      }
      addToast('error', errMsg);
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Render Page Content Router
  const renderActiveRoute = () => {
    switch (currentPath) {
      case '#home':
        return (
          <Home
            services={services}
            portfolios={portfolios}
            testimonials={testimonials}
            setView={setCurrentView}
            setSelectedProject={(proj) => {
              setSelectedProject(proj);
              setCurrentPath('#portfolio');
            }}
            settings={settings}
          />
        );
      case '#about':
        return <About settings={settings} />;
      case '#services':
        return <Services services={services} setView={setCurrentView} settings={settings} />;
      case '#portfolio':
        return (
          <Portfolio
            portfolios={portfolios}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            settings={settings}
          />
        );
      case '#blog':
        return <Blog blogs={blogs} settings={settings} />;
      case '#faq':
        return <FAQ faqs={faqs} setView={setCurrentView} settings={settings} />;
      case '#careers':
        return <Careers careers={careers} addToast={addToast} settings={settings} />;
      case '#contact':
        return <Contact services={services} settings={settings} addToast={addToast} />;
      
      case '#admin':
        if (authLoading) {
          return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
              <span className="text-xs font-mono text-slate-400">Verifying security token keys...</span>
            </div>
          );
        }

        if (!user || !isAdmin) {
          /* RENDER ADMIN LOGIN PORTAL CONTROLLER */
          return (
            <div className="bg-slate-50 dark:bg-slate-950 min-h-[85vh] flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col gap-6">
                
                <div className="text-center flex flex-col items-center gap-2.5">
                  <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 p-3 rounded-2xl flex items-center justify-center">
                    <Shield className="h-6 w-6 animate-pulse" />
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                    Nexus Admin Gateway
                  </h2>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">
                    Pre-authorized executive personnel login coordinates only. Zero public signups are enabled.
                  </p>
                </div>

                 {/* Email / Password Form */}
                <form onSubmit={handleEmailPassSignIn} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Admin Email ID</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@san.com"
                      value={emailText}
                      onChange={(e) => setEmailText(e.target.value)}
                      className="w-full py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-left relative">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Security Password</label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={passwordText}
                        onChange={(e) => setPasswordText(e.target.value)}
                        className="w-full py-3 pl-4 pr-10 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loginSubmitting}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-transform hover:scale-101 flex items-center justify-center gap-2 mt-1"
                  >
                    <Lock className="h-4 w-4" />
                    <span>{loginSubmitting ? 'Authenticating Administrative Keys...' : 'Verify Credentials'}</span>
                  </button>

                  <div className="flex items-center my-1.5">
                    <div className="flex-grow h-px bg-slate-200 dark:bg-slate-800" />
                    <span className="px-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider">Or</span>
                    <div className="flex-grow h-px bg-slate-200 dark:bg-slate-800" />
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await login();
                        addToast('success', 'Google authentication verified! Launching Executive Secure Dashboard.');
                        window.location.hash = '#admin';
                      } catch (err: any) {
                        addToast('error', err.message || 'Google verification failed.');
                      }
                    }}
                    className="w-full py-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.53 14.99 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.85 2.99c.96-2.87 3.66-4.51 6.76-4.51z"/>
                      <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.51h6.48c-.29 1.48-1.14 2.73-2.43 3.59l3.77 2.91c2.2-2.03 3.67-5.01 3.67-8.66z"/>
                      <path fill="#FBBC05" d="M5.24 14.73c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.39 7.15C.5 8.93 0 10.91 0 13s.5 4.07 1.39 5.85l3.85-3.12z"/>
                      <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.77-2.91c-1.11.75-2.53 1.19-4.16 1.19-3.1 0-5.8-2.05-6.76-4.92L1.39 16.57C3.37 20.33 7.35 23 12 23z"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                </form>

              </div>
            </div>
          );
        }

        // Active admin validated
        return (
          <AdminDashboard
            services={services}
            portfolios={portfolios}
            blogs={blogs}
            testimonials={testimonials}
            faqs={faqs}
            careers={careers}
            messages={messages}
            settings={settings}
            addToast={addToast}
            refreshAllData={loadDatabaseState}
          />
        );

      default:
        return (
          <Home
            services={services}
            portfolios={portfolios}
            testimonials={testimonials}
            settings={settings}
            setView={setCurrentView}
            setSelectedProject={(proj) => {
              setSelectedProject(proj);
              setCurrentPath('#portfolio');
            }}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Header Navigation elements */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isDark={isDark}
        toggleTheme={toggleTheme}
        homeVideoActive={currentView === 'home' && !!settings?.homeVideoUrl}
      />

      {/* 2. Main Page Render viewport */}
      <main className="flex-grow">
        {renderActiveRoute()}
      </main>

      {/* 3. Global Footer context */}
      {currentView !== 'admin' && (
        <Footer setCurrentView={setCurrentView} settings={settings} />
      )}

      {/* 4. Toaster messages */}
      <Toaster toasts={toasts} removeToast={removeToast} />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
