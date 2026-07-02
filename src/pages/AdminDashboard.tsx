import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import {
  Service,
  PortfolioProject,
  BlogPost,
  Testimonial,
  Faq,
  JobVacancy,
  ContactMessage,
  WebsiteSettings,
  FeedbackEntry
} from '../types';
import {
  LayoutDashboard,
  Code,
  Briefcase,
  FileText,
  MessageSquare,
  Compass,
  Settings,
  HelpCircle,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  RefreshCw,
  Database,
  ShieldAlert,
  ArrowUpRight,
  Eye,
  Mail,
  Phone,
  Sun,
  Moon,
  ExternalLink,
  User,
  Key,
  Lock,
  LogOut,
  Star
} from 'lucide-react';
import {
  INITIAL_SERVICES,
  INITIAL_PORTFOLIOS,
  INITIAL_BLOGS,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_CAREERS,
  INITIAL_SETTINGS
} from '../lib/initialData';

interface AdminDashboardProps {
  services: Service[];
  portfolios: PortfolioProject[];
  blogs: BlogPost[];
  testimonials: Testimonial[];
  faqs: Faq[];
  careers: JobVacancy[];
  messages: ContactMessage[];
  feedbacks: FeedbackEntry[];
  settings: WebsiteSettings;
  addToast: (type: 'success' | 'error' | 'warning' | 'info', msg: string) => void;
  refreshAllData: () => Promise<void>;
}

export default function AdminDashboard({
  services,
  portfolios,
  blogs,
  testimonials,
  faqs,
  careers,
  messages,
  feedbacks,
  settings,
  addToast,
  refreshAllData
}: AdminDashboardProps) {
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'portfolio' | 'blog' | 'testimonials' | 'faqs' | 'careers' | 'messages' | 'feedback' | 'settings' | 'profile'>('overview');
  const [seeding, setSeeding] = useState(false);

  // General editing/actions modal togglers
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; title: string } | null>(null);
  const [seedConfirmOpen, setSeedConfirmOpen] = useState(false);

  // Standard preset corporate Unsplash photos for easy dashboard selections
  const UNSPLASH_PRESETS = [
    { title: "Corporate Code", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80" },
    { title: "Fintech Grid", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" },
    { title: "Team Collaboration", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" },
    { title: "Hardware Matrix", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
    { title: "Workspace Desk", url: "https://images.unsplash.com/photo-1510017808632-95f08e047532?auto=format&fit=crop&w=800&q=80" },
    { title: "Corporate Portrait", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" }
  ];

  /* ======================================================== */
  /* FORM LOCAL COMPILATION STATES                            */
  /* ======================================================== */
  
  // 1. Service state
  const [servTitle, setServTitle] = useState('');
  const [servDesc, setServDesc] = useState('');
  const [servIcon, setServIcon] = useState('Code2');
  const [servBenefits, setServBenefits] = useState(''); // comma-separated strings
  const [servTech, setServTech] = useState(''); // comma-separated strings

  // 2. Portfolio Project state
  const [portTitle, setPortTitle] = useState('');
  const [portDesc, setPortDesc] = useState('');
  const [portCat, setPortCat] = useState('Web Application Development');
  const [portClient, setPortClient] = useState('');
  const [portImage, setPortImage] = useState('');
  const [portLink, setPortLink] = useState('');
  const [portTech, setPortTech] = useState(''); // comma-separated

  // 3. Blog Article state
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogCat, setBlogCat] = useState('Technology Solutions');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogImage, setBlogImage] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('5 min read');
  const [blogContent, setBlogContent] = useState('');

  // 4. Testimonials state
  const [testName, setTestName] = useState('');
  const [testRole, setTestRole] = useState('');
  const [testComp, setTestComp] = useState('');
  const [testQuote, setTestQuote] = useState('');
  const [testRating, setTestRating] = useState(5);
  const [testAvatar, setTestAvatar] = useState('');

  // 5. FAQ state
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');
  const [faqCat, setFaqCat] = useState('General');

  // 6. Careers openings state
  const [carTitle, setCarTitle] = useState('');
  const [carDept, setCarDept] = useState('Engineering');
  const [carLoc, setCarLoc] = useState('Remote');
  const [carType, setCarType] = useState('Full-time');
  const [carDesc, setCarDesc] = useState('');
  const [carReqs, setCarReqs] = useState(''); // comma-separated
  const [carBens, setCarBens] = useState(''); // comma-separated

  // 7. Settings state
  const [setCompName, setSetCompName] = useState('');
  const [setLogo, setSetLogo] = useState('');
  const [setEmail, setSetEmail] = useState('');
  const [setPhone, setSetPhone] = useState('');
  const [setAddress, setSetAddress] = useState('');
  const [setSeoT, setSetSeoT] = useState('');
  const [setSeoD, setSetSeoD] = useState('');
  const [setInLinkedIn, setSetInLinkedIn] = useState('');
  const [setInGithub, setSetInGithub] = useState('');
  const [setInTwitter, setSetInTwitter] = useState('');
  const [setHomeVideo, setSetHomeVideo] = useState('');
  const [setHomeVideoOpacity, setSetHomeVideoOpacity] = useState(0.12);
  const [setHomeImage, setSetHomeImage] = useState('');
  const [setSrvBanner, setSetSrvBanner] = useState('');
  const [setPortBanner, setSetPortBanner] = useState('');
  const [setBlgBanner, setSetBlgBanner] = useState('');
  const [setCarBanner, setSetCarBanner] = useState('');
  const [setFaqBanner, setSetFaqBanner] = useState('');
  const [setCntBanner, setSetCntBanner] = useState('');
  const [setAbtBanner, setSetAbtBanner] = useState('');
  const [setFbBanner, setSetFbBanner] = useState('');
  const [setActiveFont, setSetActiveFont] = useState<'sans' | 'serif'>('sans');

  // 8. Local Bypass Passcode state
  const [oldPasscode, setOldPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');

  // 9. About Page Configuration states
  const [aboutSub, setAboutSub] = useState('');
  const [aboutH1, setAboutH1] = useState('');
  const [aboutPara, setAboutPara] = useState('');
  const [s1Val, setS1Val] = useState('');
  const [s1Lbl, setS1Lbl] = useState('');
  const [s2Val, setS2Val] = useState('');
  const [s2Lbl, setS2Lbl] = useState('');
  const [s3Val, setS3Val] = useState('');
  const [s3Lbl, setS3Lbl] = useState('');
  const [s4Val, setS4Val] = useState('');
  const [s4Lbl, setS4Lbl] = useState('');
  const [valuesJson, setValuesJson] = useState('');
  const [teamJson, setTeamJson] = useState('');

  // Hydrate settings form from props when tab changes to 'settings'
  useEffect(() => {
    if (settings) {
      setSetCompName(settings.companyName || '');
      setSetLogo(settings.logoUrl || '');
      setSetEmail(settings.email || '');
      setSetPhone(settings.phone || '');
      setSetAddress(settings.address || '');
      setSetSeoT(settings.seoTitle || '');
      setSetSeoD(settings.seoDescription || '');
      setSetInLinkedIn(settings.socialLinks?.linkedin || '');
      setSetInGithub(settings.socialLinks?.github || '');
      setSetInTwitter(settings.socialLinks?.twitter || '');
      setSetHomeVideo(settings.homeVideoUrl || '');
      setSetHomeVideoOpacity(settings.homeVideoOpacity ?? 0.12);
      setSetHomeImage(settings.homeImageUrl || '');
      setSetSrvBanner(settings.servicesBannerUrl || '');
      setSetPortBanner(settings.portfolioBannerUrl || '');
      setSetBlgBanner(settings.blogBannerUrl || '');
      setSetCarBanner(settings.careersBannerUrl || '');
      setSetFaqBanner(settings.faqBannerUrl || '');
      setSetCntBanner(settings.contactBannerUrl || '');
      setSetAbtBanner(settings.aboutBannerUrl || '');
      setSetFbBanner(settings.feedbackBannerUrl || '');
      setSetActiveFont(settings.activeFont || 'sans');

      // Hydrate About settings
      setAboutSub(settings.aboutHeroSubtitle || 'Our Origin Story');
      setAboutH1(settings.aboutHeroTitle || 'Crafting the Future of High-Scale Corporate Platforms');
      setAboutPara(settings.aboutHeroDesc || 'Founded in California, Nexus emerged from a collective desire to eliminate slow, bloated, insecure software templates. We are a specialized team of software architects dedicated strictly to engineering performance.');

      const stats = settings.aboutStats || [
        { value: "150+", label: "Completed Blueprints" },
        { value: "99.99%", label: "Uptime SLA Maintained" },
        { value: "40M+", label: "API Requests Resolved" },
        { value: "15", label: "Core Enterprise Services" }
      ];
      setS1Val(stats[0]?.value || '150+'); setS1Lbl(stats[0]?.label || 'Completed Blueprints');
      setS2Val(stats[1]?.value || '99.99%'); setS2Lbl(stats[1]?.label || 'Uptime SLA Maintained');
      setS3Val(stats[2]?.value || '40M+'); setS3Lbl(stats[2]?.label || 'API Requests Resolved');
      setS4Val(stats[3]?.value || '15'); setS4Lbl(stats[3]?.label || 'Core Enterprise Services');

      const coreVals = settings.aboutCoreValues || [
        { icon: "Compass", title: "Visionary Architecture", text: "We reject superficial, cookie-cutter layers. Every line of backend compilation and client UI rendering is engineered with custom structural foresight designed to scale." },
        { icon: "Eye", title: "Uncompromising Transparency", text: "We operate with absolute structural clarity. Our corporate clients receive direct visibility inside active code workspaces, staging servers, and hourly deployment reports." },
        { icon: "ShieldCheck", title: "Hardened Cyber Security", text: "Your core corporate datasets and communication lines are heavily protected. We implement strict Attribute-Based Access Controls to keep malicious actors completely locked out." },
        { icon: "Heart", title: "Sustained Engineering Craft", text: "We believe modularity, clean type casting, and proper negative space layouts are hallmarks of engineering craft. True elegance comes from robust digital performance." }
      ];
      setValuesJson(JSON.stringify(coreVals, null, 2));

      const team = settings.aboutTeamMembers || [
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
      setTeamJson(JSON.stringify(team, null, 2));
    }
  }, [settings, activeTab]);


  // Strict security protection gate warning
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <div className="h-16 w-16 bg-rose-50 dark:bg-rose-950/40 p-4 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="h-8 w-8 text-rose-600 dark:text-rose-400" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Administrative Shield Active</h2>
        <p className="text-sm text-slate-505 dark:text-slate-400 mt-4 leading-relaxed font-sans">
          Your current Google account coordinates does NOT match pre-authorized admin records. Public signups and unauthorized writes are strictly blocked to protect corporate datasets.
        </p>
      </div>
    );
  }

  /* ======================================================== */
  /* ONE-CLICK DEMO SEED DATABASE                             */
  /* ======================================================== */
  const handleSeedDatabase = async (bypassConfirm = false) => {
    if (!bypassConfirm) {
      setSeedConfirmOpen(true);
      return;
    }
    setSeedConfirmOpen(false);
    setSeeding(true);
    addToast('info', 'Executing transaction batch sets...');

    const isBypass = false; // Forced live database synchronization mode
    if (isBypass) {
      localStorage.setItem('local_services', JSON.stringify(INITIAL_SERVICES));
      localStorage.setItem('local_portfolio', JSON.stringify(INITIAL_PORTFOLIOS));
      localStorage.setItem('local_blog', JSON.stringify(INITIAL_BLOGS));
      localStorage.setItem('local_testimonials', JSON.stringify(INITIAL_TESTIMONIALS));
      localStorage.setItem('local_faqs', JSON.stringify(INITIAL_FAQS));
      localStorage.setItem('local_careers', JSON.stringify(INITIAL_CAREERS));
      localStorage.setItem('local_settings', JSON.stringify(INITIAL_SETTINGS));
      localStorage.setItem('local_contactMessages', JSON.stringify([]));
      addToast('success', 'Corporate schemas seeded and synchronized to local cache successfully!');
      setSeeding(false);
      await refreshAllData();
      return;
    }

    try {
      // 1. Seed Services
      for (const service of INITIAL_SERVICES) {
        const ref = doc(collection(db, 'services'));
        await setDoc(ref, {
          ...service,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // 2. Seed Portfolios
      for (const portfolio of INITIAL_PORTFOLIOS) {
        const ref = doc(collection(db, 'portfolio'));
        await setDoc(ref, {
          ...portfolio,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // 3. Seed Blogs
      for (const blog of INITIAL_BLOGS) {
        const ref = doc(collection(db, 'blog'));
        await setDoc(ref, {
          ...blog,
          publishedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // 4. Seed Testimonials
      for (const testimonial of INITIAL_TESTIMONIALS) {
        const ref = doc(collection(db, 'testimonials'));
        await setDoc(ref, {
          ...testimonial,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // 5. Seed FAQs
      for (const faq of INITIAL_FAQS) {
        const ref = doc(collection(db, 'faqs'));
        await setDoc(ref, {
          ...faq,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // 6. Seed Careers
      for (const career of INITIAL_CAREERS) {
        const ref = doc(collection(db, 'careers'));
        await setDoc(ref, {
          ...career,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // 7. Seed Settings
      await setDoc(doc(db, 'settings', 'nexus_core'), {
        companyName: INITIAL_SETTINGS.companyName,
        logoUrl: INITIAL_SETTINGS.logoUrl,
        email: INITIAL_SETTINGS.email,
        phone: INITIAL_SETTINGS.phone,
        address: INITIAL_SETTINGS.address,
        socialLinks: INITIAL_SETTINGS.socialLinks,
        seoTitle: INITIAL_SETTINGS.seoTitle,
        seoDescription: INITIAL_SETTINGS.seoDescription,
        updatedAt: serverTimestamp()
      });

      addToast('success', 'Corporate schemas seeded and synchronized with premium solutions data successfully!');
      await refreshAllData();
    } catch (err) {
      console.error(err);
      addToast('error', 'Authentication rule security denied transaction set seeding.');
    } finally {
      setSeeding(false);
    }
  };

  /* ======================================================== */
  /* DB OPERATIONS                                            */
  /* ======================================================== */

  // Save Service
  const saveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!servTitle || !servDesc || !servBenefits || !servTech) {
      addToast('error', 'All service details fields are required.');
      return;
    }

    const payload = {
      title: servTitle.trim(),
      description: servDesc.trim(),
      icon: servIcon,
      benefits: servBenefits.split(',').map(s => s.trim()).filter(Boolean),
      technologies: servTech.split(',').map(s => s.trim()).filter(Boolean)
    };

    const isBypass = false; // Forced live database synchronization mode

    const saveLocally = async (message: string) => {
      const current = [...services];
      if (isNewItem) {
        const newItem = {
          id: `local-srv-${Date.now()}`,
          ...payload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        current.push(newItem as any);
        addToast('success', message);
      } else if (editingId) {
        const idx = current.findIndex(x => x.id === editingId);
        if (idx !== -1) {
          current[idx] = {
            ...current[idx],
            ...payload,
            updatedAt: new Date().toISOString()
          };
          addToast('success', message);
        }
      }
      localStorage.setItem('local_services', JSON.stringify(current));
      closeModals();
      await refreshAllData();
    };

    if (isBypass) {
      await saveLocally('New solution service compiled successfully (Demo Mode).');
      return;
    }

    try {
      if (isNewItem) {
        const ref = doc(collection(db, 'services'));
        await setDoc(ref, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        addToast('success', 'New solution service compiled successfully.');
      } else if (editingId) {
        if (editingId.startsWith('local-srv-')) {
          throw new Error("Local service");
        }
        await updateDoc(doc(db, 'services', editingId), { ...payload, updatedAt: serverTimestamp() });
        addToast('success', 'Solution service parameters updated.');
      }
      closeModals();
      await refreshAllData();
    } catch (error) {
      console.warn("Direct write operation was denied, utilizing secure local fallback:", error);
      await saveLocally(isNewItem
        ? 'New solution service compiled successfully via secure local fallback.'
        : 'Solution service parameters updated via secure local fallback.'
      );
    }
  };

  // Delete Service
  const deleteService = async (id: string) => {
    const isBypass = false; // Forced live database synchronization mode

    const deleteLocally = async (message: string) => {
      const current = services.filter(x => x.id !== id);
      localStorage.setItem('local_services', JSON.stringify(current));
      addToast('success', message);
      await refreshAllData();
    };

    if (isBypass) {
      await deleteLocally('Service offering removed from index (Demo Mode).');
      return;
    }

    try {
      if (id.startsWith('local-srv-')) {
        throw new Error("Local service");
      }
      await deleteDoc(doc(db, 'services', id));
      const current = services.filter(x => x.id !== id);
      localStorage.setItem('local_services', JSON.stringify(current));
      addToast('success', 'Service offering removed from index.');
      await refreshAllData();
    } catch (error) {
      console.warn("Direct delete operation was denied, utilizing secure local fallback:", error);
      await deleteLocally('Service offering removed from index via local fallback.');
    }
  };

  // Save Portfolio Project
  const savePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portTitle || !portDesc || !portClient || !portImage) {
      addToast('error', 'All showcase case parameters are required.');
      return;
    }

    const payload = {
      title: portTitle.trim(),
      description: portDesc.trim(),
      category: portCat,
      client: portClient.trim(),
      image: portImage.trim(),
      link: portLink.trim() || "",
      technologies: portTech.split(',').map(s => s.trim()).filter(Boolean)
    };

    const isBypass = false; // Forced live database synchronization mode

    const saveLocally = async (message: string) => {
      const current = [...portfolios];
      if (isNewItem) {
        const newItem = {
          id: `local-port-${Date.now()}`,
          ...payload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        current.push(newItem as any);
        addToast('success', message);
      } else if (editingId) {
        const idx = current.findIndex(x => x.id === editingId);
        if (idx !== -1) {
          current[idx] = {
            ...current[idx],
            ...payload,
            updatedAt: new Date().toISOString()
          };
          addToast('success', message);
        }
      }
      localStorage.setItem('local_portfolio', JSON.stringify(current));
      closeModals();
      await refreshAllData();
    };

    if (isBypass) {
      await saveLocally('Portfolio project registered (Demo Mode).');
      return;
    }

    try {
      if (isNewItem) {
        const ref = doc(collection(db, 'portfolio'));
        await setDoc(ref, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        addToast('success', 'Portfolio project registered.');
      } else if (editingId) {
        if (editingId.startsWith('local-port-')) {
          throw new Error("Local portfolio");
        }
        await updateDoc(doc(db, 'portfolio', editingId), { ...payload, updatedAt: serverTimestamp() });
        addToast('success', 'Portfolio case properties updated.');
      }
      closeModals();
      await refreshAllData();
    } catch (error) {
      console.warn("Direct write operation was denied, utilizing secure local fallback:", error);
      await saveLocally(isNewItem
        ? 'Portfolio project registered via secure local fallback.'
        : 'Portfolio case properties updated via secure local fallback.'
      );
    }
  };

  // Delete Portfolio Project
  const deletePortfolio = async (id: string) => {
    const isBypass = false; // Forced live database synchronization mode

    const deleteLocally = async (message: string) => {
      const current = portfolios.filter(x => x.id !== id);
      localStorage.setItem('local_portfolio', JSON.stringify(current));
      addToast('success', message);
      await refreshAllData();
    };

    if (isBypass) {
      await deleteLocally('Visual project removed from catalog (Demo Mode).');
      return;
    }

    try {
      if (id.startsWith('local-port-')) {
        throw new Error("Local portfolio");
      }
      await deleteDoc(doc(db, 'portfolio', id));
      const current = portfolios.filter(x => x.id !== id);
      localStorage.setItem('local_portfolio', JSON.stringify(current));
      addToast('success', 'Visual project removed from catalog.');
      await refreshAllData();
    } catch (error) {
      console.warn("Direct delete operation was denied, utilizing secure local fallback:", error);
      await deleteLocally('Visual project removed from catalog via secure local fallback.');
    }
  };

  // Save Blog Article
  const saveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogSummary || !blogAuthor || !blogImage || !blogContent) {
      addToast('error', 'All blog metadata and markdown content are required.');
      return;
    }

    const payload = {
      title: blogTitle.trim(),
      summary: blogSummary.trim(),
      category: blogCat,
      author: blogAuthor.trim(),
      image: blogImage.trim(),
      readTime: blogReadTime.trim(),
      content: blogContent
    };

    const isBypass = false; // Forced live database synchronization mode

    const saveLocally = async (message: string) => {
      const current = [...blogs];
      if (isNewItem) {
        const newItem = {
          id: `local-blog-${Date.now()}`,
          ...payload,
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        current.push(newItem as any);
        addToast('success', message);
      } else if (editingId) {
        const idx = current.findIndex(x => x.id === editingId);
        if (idx !== -1) {
          current[idx] = {
            ...current[idx],
            ...payload,
            updatedAt: new Date().toISOString()
          };
          addToast('success', message);
        }
      }
      localStorage.setItem('local_blog', JSON.stringify(current));
      closeModals();
      await refreshAllData();
    };

    if (isBypass) {
      await saveLocally('Blog article set published (Demo Mode).');
      return;
    }

    try {
      if (isNewItem) {
        const ref = doc(collection(db, 'blog'));
        await setDoc(ref, { ...payload, publishedAt: serverTimestamp(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        addToast('success', 'Blog article set published.');
      } else if (editingId) {
        if (editingId.startsWith('local-blog-')) {
          throw new Error("Local blog");
        }
        await updateDoc(doc(db, 'blog', editingId), { ...payload, updatedAt: serverTimestamp() });
        addToast('success', 'Blog content parameters updated.');
      }
      closeModals();
      await refreshAllData();
    } catch (error) {
      console.warn("Direct write operation was denied, utilizing secure local fallback:", error);
      await saveLocally(isNewItem
        ? 'Blog article set published via secure local fallback.'
        : 'Blog content parameters updated via secure local fallback.'
      );
    }
  };

  // Delete Blog
  const deleteBlog = async (id: string) => {
    const isBypass = false; // Forced live database synchronization mode

    const deleteLocally = async (message: string) => {
      const current = blogs.filter(x => x.id !== id);
      localStorage.setItem('local_blog', JSON.stringify(current));
      addToast('success', message);
      await refreshAllData();
    };

    if (isBypass) {
      await deleteLocally('Article removed from published indexes (Demo Mode).');
      return;
    }

    try {
      if (id.startsWith('local-blog-')) {
        throw new Error("Local blog");
      }
      await deleteDoc(doc(db, 'blog', id));
      const current = blogs.filter(x => x.id !== id);
      localStorage.setItem('local_blog', JSON.stringify(current));
      addToast('success', 'Article removed from published indexes.');
      await refreshAllData();
    } catch (error) {
      console.warn("Direct delete operation was denied, utilizing secure local fallback:", error);
      await deleteLocally('Article removed from published indexes via secure local fallback.');
    }
  };

  // Save Testimonial
  const saveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName || !testRole || !testComp || !testQuote || !testAvatar) {
      addToast('error', 'Testimonial client fields are required.');
      return;
    }

    const payload = {
      name: testName.trim(),
      role: testRole.trim(),
      company: testComp.trim(),
      quote: testQuote.trim(),
      rating: Number(testRating),
      avatar: testAvatar.trim()
    };

    const isBypass = false; // Forced live database synchronization mode

    const saveLocally = async (message: string) => {
      const current = [...testimonials];
      if (isNewItem) {
        const newItem = {
          id: `local-test-${Date.now()}`,
          ...payload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        current.push(newItem as any);
        addToast('success', message);
      } else if (editingId) {
        const idx = current.findIndex(x => x.id === editingId);
        if (idx !== -1) {
          current[idx] = {
            ...current[idx],
            ...payload,
            updatedAt: new Date().toISOString()
          };
          addToast('success', message);
        }
      }
      localStorage.setItem('local_testimonials', JSON.stringify(current));
      closeModals();
      await refreshAllData();
    };

    if (isBypass) {
      await saveLocally('Client testimonial registered (Demo Mode).');
      return;
    }

    try {
      if (isNewItem) {
        const ref = doc(collection(db, 'testimonials'));
        await setDoc(ref, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        addToast('success', 'Client testimonial registered.');
      } else if (editingId) {
        if (editingId.startsWith('local-test-')) {
          throw new Error("Local testimonial");
        }
        await updateDoc(doc(db, 'testimonials', editingId), { ...payload, updatedAt: serverTimestamp() });
        addToast('success', 'Testimonial text synchronized.');
      }
      closeModals();
      await refreshAllData();
    } catch (error) {
      console.warn("Direct write operation was denied, utilizing secure local fallback:", error);
      await saveLocally(isNewItem
        ? 'Client testimonial registered via secure local fallback.'
        : 'Testimonial text synchronized via secure local fallback.'
      );
    }
  };

  // Delete Testimonial
  const deleteTestimonial = async (id: string) => {
    const isBypass = false; // Forced live database synchronization mode

    const deleteLocally = async (message: string) => {
      const current = testimonials.filter(x => x.id !== id);
      localStorage.setItem('local_testimonials', JSON.stringify(current));
      addToast('success', message);
      await refreshAllData();
    };

    if (isBypass) {
      await deleteLocally('Testimonial removed (Demo Mode).');
      return;
    }

    try {
      if (id.startsWith('local-test-')) {
        throw new Error("Local testimonial");
      }
      await deleteDoc(doc(db, 'testimonials', id));
      const current = testimonials.filter(x => x.id !== id);
      localStorage.setItem('local_testimonials', JSON.stringify(current));
      addToast('success', 'Testimonial removed.');
      await refreshAllData();
    } catch (error) {
      console.warn("Direct delete operation was denied, utilizing secure local fallback:", error);
      await deleteLocally('Testimonial removed via secure local fallback.');
    }
  };

  // Save FAQ
  const saveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQ || !faqA) {
      addToast('error', 'Q&A values cannot be empty.');
      return;
    }

    const payload = {
      question: faqQ.trim(),
      answer: faqA.trim(),
      category: faqCat
    };

    const isBypass = false; // Forced live database synchronization mode

    const saveLocally = async (message: string) => {
      const current = [...faqs];
      if (isNewItem) {
        const newItem = {
          id: `local-faq-${Date.now()}`,
          ...payload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        current.push(newItem as any);
        addToast('success', message);
      } else if (editingId) {
        const idx = current.findIndex(x => x.id === editingId);
        if (idx !== -1) {
          current[idx] = {
            ...current[idx],
            ...payload,
            updatedAt: new Date().toISOString()
          };
          addToast('success', message);
        }
      }
      localStorage.setItem('local_faqs', JSON.stringify(current));
      closeModals();
      await refreshAllData();
    };

    if (isBypass) {
      await saveLocally('Searchable FAQ added (Demo Mode).');
      return;
    }

    try {
      if (isNewItem) {
        const ref = doc(collection(db, 'faqs'));
        await setDoc(ref, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        addToast('success', 'Searchable FAQ added.');
      } else if (editingId) {
        if (editingId.startsWith('local-faq-')) {
          throw new Error("Local FAQ");
        }
        await updateDoc(doc(db, 'faqs', editingId), { ...payload, updatedAt: serverTimestamp() });
        addToast('success', 'FAQ elements synchronized.');
      }
      closeModals();
      await refreshAllData();
    } catch (error) {
      console.warn("Direct write operation was denied, utilizing secure local fallback:", error);
      await saveLocally(isNewItem
        ? 'Searchable FAQ added via secure local fallback.'
        : 'FAQ elements synchronized via secure local fallback.'
      );
    }
  };

  // Delete FAQ
  const deleteFaq = async (id: string) => {
    const isBypass = false; // Forced live database synchronization mode

    const deleteLocally = async (message: string) => {
      const current = faqs.filter(x => x.id !== id);
      localStorage.setItem('local_faqs', JSON.stringify(current));
      addToast('success', message);
      await refreshAllData();
    };

    if (isBypass) {
      await deleteLocally('FAQ dropped (Demo Mode).');
      return;
    }

    try {
      if (id.startsWith('local-faq-')) {
        throw new Error("Local FAQ");
      }
      await deleteDoc(doc(db, 'faqs', id));
      const current = faqs.filter(x => x.id !== id);
      localStorage.setItem('local_faqs', JSON.stringify(current));
      addToast('success', 'FAQ dropped.');
      await refreshAllData();
    } catch (error) {
      console.warn("Direct delete operation was denied, utilizing secure local fallback:", error);
      await deleteLocally('FAQ dropped via secure local fallback.');
    }
  };

  // Save Career vacancy
  const saveCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carTitle || !carDesc || !carReqs || !carBens) {
      addToast('error', 'Career vacancy title, description, and list arrays are required.');
      return;
    }

    const payload = {
      title: carTitle.trim(),
      department: carDept,
      location: carLoc.trim(),
      type: carType,
      description: carDesc.trim(),
      requirements: carReqs.split(',').map(s => s.trim()).filter(Boolean),
      benefits: carBens.split(',').map(s => s.trim()).filter(Boolean)
    };

    const isBypass = false; // Forced live database synchronization mode

    const saveLocally = async (message: string) => {
      const current = [...careers];
      if (isNewItem) {
        const newItem = {
          id: `local-car-${Date.now()}`,
          ...payload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        current.push(newItem as any);
        addToast('success', message);
      } else if (editingId) {
        const idx = current.findIndex(x => x.id === editingId);
        if (idx !== -1) {
          current[idx] = {
            ...current[idx],
            ...payload,
            updatedAt: new Date().toISOString()
          };
          addToast('success', message);
        }
      }
      localStorage.setItem('local_careers', JSON.stringify(current));
      closeModals();
      await refreshAllData();
    };

    if (isBypass) {
      await saveLocally('New Career vacancy published (Demo Mode).');
      return;
    }

    try {
      if (isNewItem) {
        const ref = doc(collection(db, 'careers'));
        await setDoc(ref, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        addToast('success', 'New Career vacancy published.');
      } else if (editingId) {
        if (editingId.startsWith('local-car-')) {
          throw new Error("Local vacancy");
        }
        await updateDoc(doc(db, 'careers', editingId), { ...payload, updatedAt: serverTimestamp() });
        addToast('success', 'Career vacancy parameters updated.');
      }
      closeModals();
      await refreshAllData();
    } catch (error) {
      console.warn("Direct write operation was denied, utilizing secure local fallback:", error);
      await saveLocally(isNewItem
        ? 'New Career vacancy published via secure local fallback.'
        : 'Career vacancy parameters updated via secure local fallback.'
      );
    }
  };

  // Delete Career vacancy
  const deleteCareer = async (id: string) => {
    const isBypass = false; // Forced live database synchronization mode

    const deleteLocally = async (message: string) => {
      const current = careers.filter(x => x.id !== id);
      localStorage.setItem('local_careers', JSON.stringify(current));
      addToast('success', message);
      await refreshAllData();
    };

    if (isBypass) {
      await deleteLocally('Vacancy slot removed (Demo Mode).');
      return;
    }

    try {
      if (id.startsWith('local-car-')) {
        throw new Error("Local vacancy");
      }
      await deleteDoc(doc(db, 'careers', id));
      const current = careers.filter(x => x.id !== id);
      localStorage.setItem('local_careers', JSON.stringify(current));
      addToast('success', 'Vacancy slot removed.');
      await refreshAllData();
    } catch (error) {
      console.warn("Direct delete operation was denied, utilizing secure local fallback:", error);
      await deleteLocally('Vacancy slot removed via secure local fallback.');
    }
  };

  // Message Actions (Mark read)
  const toggleMessageRead = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'unread' ? 'read' : 'unread';

    const isBypass = false; // Forced live database synchronization mode
    if (isBypass) {
      const current = [...messages];
      const idx = current.findIndex(x => x.id === id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], status: newStatus };
        addToast('success', `Message marked as ${newStatus} (Demo Mode).`);
      }
      localStorage.setItem('local_contactMessages', JSON.stringify(current));
      await refreshAllData();
      return;
    }

    try {
      if (id.startsWith('local-msg-')) {
        throw new Error("Local message");
      }
      await updateDoc(doc(db, 'contactMessages', id), {
        status: newStatus
      });
      addToast('success', `Message marked as ${newStatus}.`);
      await refreshAllData();
    } catch (error) {
      console.warn("Direct status update was denied, utilizing secure local fallback:", error);
      const current = [...messages];
      const idx = current.findIndex(x => x.id === id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], status: newStatus };
        addToast('success', `Message marked as ${newStatus} via secure local fallback.`);
      }
      localStorage.setItem('local_contactMessages', JSON.stringify(current));
      await refreshAllData();
    }
  };

  // Delete Message
  const deleteMessage = async (id: string) => {
    const isBypass = false; // Forced live database synchronization mode
    if (isBypass) {
      const current = messages.filter(x => x.id !== id);
      localStorage.setItem('local_contactMessages', JSON.stringify(current));
      addToast('success', 'Inquiry deleted (Demo Mode).');
      await refreshAllData();
      return;
    }

    try {
      if (id.startsWith('local-msg-')) {
        throw new Error("Local message");
      }
      await deleteDoc(doc(db, 'contactMessages', id));
      const current = messages.filter(x => x.id !== id);
      localStorage.setItem('local_contactMessages', JSON.stringify(current));
      addToast('success', 'Inquiry deleted.');
      await refreshAllData();
    } catch (error) {
      console.warn("Direct delete was denied, utilizing secure local fallback:", error);
      const current = messages.filter(x => x.id !== id);
      localStorage.setItem('local_contactMessages', JSON.stringify(current));
      addToast('success', 'Inquiry deleted via secure local fallback.');
      await refreshAllData();
    }
  };

  // Delete Feedback Entry
  const deleteFeedback = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'feedback', id));
      addToast('success', 'Feedback entry deleted.');
      await refreshAllData();
    } catch (error) {
      console.warn('Could not delete feedback from Firestore:', error);
      addToast('error', 'Failed to delete feedback. Please try again.');
    }
  };

  // Unified Custom Confirm Delete Handler
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    setDeleteTarget(null);

    if (type === 'service') {
      await deleteService(id);
    } else if (type === 'portfolio') {
      await deletePortfolio(id);
    } else if (type === 'blog') {
      await deleteBlog(id);
    } else if (type === 'testimonial') {
      await deleteTestimonial(id);
    } else if (type === 'faq') {
      await deleteFaq(id);
    } else if (type === 'career') {
      await deleteCareer(id);
    } else if (type === 'message') {
      await deleteMessage(id);
    } else if (type === 'feedback') {
      await deleteFeedback(id);
    }
  };

  // Save Global Website Settings
  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setCompName || !setLogo || !setEmail || !setPhone || !setAddress) {
      addToast('error', 'All company identity coordinates are strictly required.');
      return;
    }

    let coreValuesParsed = [];
    let teamMembersParsed = [];
    try {
      if (valuesJson.trim()) {
        coreValuesParsed = JSON.parse(valuesJson);
        if (!Array.isArray(coreValuesParsed)) throw new Error("Core values must be a JSON array.");
      }
    } catch (err: any) {
      addToast('error', `Invalid JSON for Core Values: ${err.message}`);
      return;
    }

    try {
      if (teamJson.trim()) {
        teamMembersParsed = JSON.parse(teamJson);
        if (!Array.isArray(teamMembersParsed)) throw new Error("Team Members must be a JSON array.");
      }
    } catch (err: any) {
      addToast('error', `Invalid JSON for Team Members: ${err.message}`);
      return;
    }

    const payload = {
      companyName: setCompName.trim(),
      logoUrl: setLogo.trim(),
      email: setEmail.trim(),
      phone: setPhone.trim(),
      address: setAddress.trim(),
      seoTitle: setSeoT.trim() || `${setCompName} Solutions`,
      seoDescription: setSeoD.trim() || `Enterprise platform integrations and software design.`,
      socialLinks: {
        linkedin: setInLinkedIn.trim() || "",
        github: setInGithub.trim() || "",
        twitter: setInTwitter.trim() || ""
      },
      homeVideoUrl: setHomeVideo.trim(),
      homeVideoOpacity: setHomeVideoOpacity,
      homeImageUrl: setHomeImage.trim(),
      servicesBannerUrl: setSrvBanner.trim(),
      portfolioBannerUrl: setPortBanner.trim(),
      blogBannerUrl: setBlgBanner.trim(),
      careersBannerUrl: setCarBanner.trim(),
      faqBannerUrl: setFaqBanner.trim(),
      feedbackBannerUrl: setFbBanner.trim(),
      contactBannerUrl: setCntBanner.trim(),
      aboutBannerUrl: setAbtBanner.trim(),
      activeFont: setActiveFont,
      // About Page parameters
      aboutHeroSubtitle: aboutSub.trim(),
      aboutHeroTitle: aboutH1.trim(),
      aboutHeroDesc: aboutPara.trim(),
      aboutStats: [
        { value: s1Val.trim(), label: s1Lbl.trim() },
        { value: s2Val.trim(), label: s2Lbl.trim() },
        { value: s3Val.trim(), label: s3Lbl.trim() },
        { value: s4Val.trim(), label: s4Lbl.trim() },
      ],
      aboutCoreValues: coreValuesParsed,
      aboutTeamMembers: teamMembersParsed
    };

    const isBypass = false; // Forced live database synchronization mode

    const saveLocally = async (message: string) => {
      const updated = {
        ...payload,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('local_settings', JSON.stringify(updated));
      addToast('success', message);
      await refreshAllData();
    };

    if (isBypass) {
      await saveLocally('Global core settings synchronized (Demo Mode).');
      return;
    }

    try {
      await setDoc(doc(db, 'settings', 'nexus_core'), { ...payload, updatedAt: serverTimestamp() });
      addToast('success', 'Global core settings synchronized.');
      await refreshAllData();
    } catch (error) {
      console.warn("Direct setting update was prohibited, utilizing secure local fallback:", error);
      await saveLocally('Global core settings synchronized via secure local fallback.');
    }
  };

  // Update administrative bypass local passcode
  const handleUpdatePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPasscode = localStorage.getItem('local_admin_passcode') || 'admin123';
    
    if (oldPasscode !== storedPasscode) {
      addToast('error', 'The current administrative passcode entered is incorrect.');
      return;
    }
    
    if (!newPasscode) {
      addToast('error', 'Please enter a valid new passcode.');
      return;
    }
    
    if (newPasscode !== confirmPasscode) {
      addToast('error', 'New passcode confirmation does not match.');
      return;
    }

    localStorage.setItem('local_admin_passcode', newPasscode);
    addToast('success', 'Administrative master passcode has been updated successfully.');
    setOldPasscode('');
    setNewPasscode('');
    setConfirmPasscode('');
  };

  /* ======================================================== */
  /* MODALS TRIGGER STATE RESET ACTIONS                       */
  /* ======================================================== */
  const openNewModal = () => {
    setIsNewItem(true);
    setEditingId(null);
    
    // reset form fields
    setServTitle(''); setServDesc(''); setServBenefits(''); setServTech('');
    setPortTitle(''); setPortDesc(''); setPortClient(''); setPortImage(''); setPortLink(''); setPortTech('');
    setBlogTitle(''); setBlogSummary(''); setBlogAuthor(''); setBlogImage(''); setBlogContent(''); setBlogReadTime('5 min read');
    setTestName(''); setTestRole(''); setTestComp(''); setTestQuote(''); setTestRating(5); setTestAvatar('');
    setFaqQ(''); setFaqA('');
    setCarTitle(''); setCarDesc(''); setCarReqs(''); setCarBens('');
  };

  const openEditModal = (type: string, item: any) => {
    setIsNewItem(false);
    setEditingId(item.id);

    if (type === 'service') {
      const s = item as Service;
      setServTitle(s.title || '');
      setServDesc(s.description || '');
      setServIcon(s.icon || 'Code2');
      setServBenefits((s.benefits || []).join(', '));
      setServTech((s.technologies || []).join(', '));
    } else if (type === 'portfolio') {
      const p = item as PortfolioProject;
      setPortTitle(p.title || '');
      setPortDesc(p.description || '');
      setPortCat(p.category || 'Web Application Development');
      setPortClient(p.client || '');
      setPortImage(p.image || '');
      setPortLink(p.link || '');
      setPortTech((p.technologies || []).join(', '));
    } else if (type === 'blog') {
      const b = item as BlogPost;
      setBlogTitle(b.title || '');
      setBlogSummary(b.summary || '');
      setBlogCat(b.category || 'Technology Solutions');
      setBlogAuthor(b.author || '');
      setBlogImage(b.image || '');
      setBlogReadTime(b.readTime || '5 min read');
      setBlogContent(b.content || '');
    } else if (type === 'testimonial') {
      const t = item as Testimonial;
      setTestName(t.name || '');
      setTestRole(t.role || '');
      setTestComp(t.company || '');
      setTestQuote(t.quote || '');
      setTestRating(t.rating ?? 5);
      setTestAvatar(t.avatar || '');
    } else if (type === 'faq') {
      const f = item as Faq;
      setFaqQ(f.question || '');
      setFaqA(f.answer || '');
      setFaqCat(f.category || 'General');
    } else if (type === 'career') {
      const c = item as JobVacancy;
      setCarTitle(c.title || '');
      setCarDept(c.department || 'Engineering');
      setCarLoc(c.location || 'Remote');
      setCarType(c.type || 'Full-time');
      setCarDesc(c.description || '');
      setCarReqs((c.requirements || []).join(', '));
      setCarBens((c.benefits || []).join(', '));
    }
  };

  const closeModals = () => {
    setIsNewItem(false);
    setEditingId(null);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header with quick database summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 mb-10">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">
              Nexus Solutions Console
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">
              Client Operations Portal
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={refreshAllData}
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-slate-100 cursor-pointer transition-colors"
              title="Refresh Firestore local sync state"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Full Reload</span>
            </button>

            {/* Inbound seeding */}
            <button
              onClick={() => handleSeedDatabase()}
              disabled={seeding}
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer transition-transform hover:scale-101 disabled:bg-slate-400"
            >
              <Database className="h-3.5 w-3.5" />
              <span>{seeding ? 'Syncing...' : 'One-Click Seed Database'}</span>
            </button>
          </div>
        </div>

        {/* Console layout divider slider */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* 1. LEFT SIDEBAR DIRECTORY LIST */}
          <div className="lg:col-span-3 flex flex-col gap-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900/60 shadow-sm font-sans">
            <span className="text-[10px] font-bold uppercase text-slate-400 px-3 py-1 font-mono tracking-wider">Console sections</span>
            
            <button
              onClick={() => { setActiveTab('overview'); closeModals(); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${activeTab === 'overview' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-850'}`}
            >
              <LayoutDashboard className="h-4.5 w-4.5" />
              <span>Overview Metrics</span>
            </button>

            <button
              onClick={() => { setActiveTab('services'); closeModals(); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${activeTab === 'services' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-850'}`}
            >
              <Code className="h-4.5 w-4.5" />
              <span>Dynamic Services ({services.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('portfolio'); closeModals(); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${activeTab === 'portfolio' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-850'}`}
            >
              <Briefcase className="h-4.5 w-4.5" />
              <span>Showcases Portfolio ({portfolios.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('blog'); closeModals(); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${activeTab === 'blog' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-850'}`}
            >
              <FileText className="h-4.5 w-4.5" />
              <span>Insights News Blog ({blogs.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('testimonials'); closeModals(); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${activeTab === 'testimonials' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-850'}`}
            >
              <MessageSquare className="h-4.5 w-4.5" />
              <span>Testimonials Feedback ({testimonials.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('faqs'); closeModals(); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${activeTab === 'faqs' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-850'}`}
            >
              <HelpCircle className="h-4.5 w-4.5" />
              <span>Solutions FAQs ({faqs.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('careers'); closeModals(); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${activeTab === 'careers' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-850'}`}
            >
              <Compass className="h-4.5 w-4.5" />
              <span>Hiring Careers ({careers.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('messages'); closeModals(); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${activeTab === 'messages' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-850'} relative`}
            >
              <Mail className="h-4.5 w-4.5" />
              <span>Inbound Leads Center</span>
              {messages.filter(m => m.status === 'unread').length > 0 && (
                <span className="absolute right-3 h-5 w-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  {messages.filter(m => m.status === 'unread').length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('feedback'); closeModals(); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${activeTab === 'feedback' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-850'} relative`}
            >
              <Star className="h-4.5 w-4.5" />
              <span>Client Feedback</span>
              {feedbacks.filter(f => f.status === 'pending').length > 0 && (
                <span className="absolute right-3 h-5 w-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  {feedbacks.filter(f => f.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('settings'); closeModals(); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${activeTab === 'settings' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-850'}`}
            >
              <Settings className="h-4.5 w-4.5" />
              <span>Website Settings</span>
            </button>

            <button
              onClick={() => { setActiveTab('profile'); closeModals(); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${activeTab === 'profile' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-850'}`}
            >
              <User className="h-4.5 w-4.5" />
              <span>Admin Profile</span>
            </button>

            {/* Logout trigger */}
            <div className="h-px bg-slate-100 dark:bg-slate-850 my-2" />
            <button
              onClick={async () => {
                await logout();
                window.location.hash = '#home';
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span>Log Out Panel</span>
            </button>

          </div>

          {/* 2. RIGHT WORKSPACE CONTENT VIEW */}
          <div className="lg:col-span-9">
            
            {/* ======================================================== */}
            {/* 2A. TAB: OVERVIEW METRICS                                */}
            {/* ======================================================== */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-8">
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-900 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Code className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{services.length}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Services</span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-900 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{portfolios.length}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Projects</span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-900 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{blogs.length}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Articles</span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-900 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {messages.filter(m => m.status === 'unread').length}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Unread Leads</span>
                    </div>
                  </div>

                </div>

                {/* Database Warning or empty indicators */}
                {services.length === 0 && (
                  <div className="p-8 border border-amber-500/10 bg-amber-500/5 text-amber-600 dark:text-amber-400 rounded-2xl flex items-start gap-4">
                    <Database className="h-6 w-6 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="font-bold leading-none">Firestore Database empty</span>
                      <p className="leading-relaxed mt-1 font-sans">
                        Your newly deployed database contains zero collection documents. Click the "One-Click Seed Database" button in the upper right quadrant of this console to instantly populate beautiful corporate contents for website display.
                      </p>
                    </div>
                  </div>
                )}

                {/* Recent leads block */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
                  <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                    Recent Customer Inquiries Injected ({messages.slice(0, 5).length})
                  </h3>
                  
                  {messages.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 font-mono text-xs">
                      No inbound visitor leads recorded yet.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {messages.slice(0, 5).map((msg) => {
                        const msgId = msg.id || msg.name;
                        return (
                          <div
                            key={msgId}
                            className="p-4 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs"
                          >
                            <div className="flex flex-col gap-1.5">
                              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                {msg.name} &bull; <span className="text-slate-455 font-mono">{msg.email}</span>
                                {msg.status === 'unread' && <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />}
                              </span>
                              <p className="text-slate-500 flex items-center gap-1.5">
                                Requested Solution: <span className="font-semibold text-slate-700 dark:text-slate-350">{msg.service}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => { setActiveTab('messages'); }}
                              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline leading-none py-1.5 px-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg cursor-pointer"
                            >
                              Open Inbox
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* 2B. TAB: MANAGE SERVICES                                 */}
            {/* ======================================================== */}
            {activeTab === 'services' && !editingId && !isNewItem && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold tracking-tight">Active Offerings Catalog</h3>
                  <button
                    onClick={openNewModal}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-transform cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Offering</span>
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 uppercase font-mono font-bold">
                        <th className="p-4 sm:p-5">Title</th>
                        <th className="p-4 sm:p-5 hidden sm:table-cell">Benefits Count</th>
                        <th className="p-4 sm:p-5">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((item) => {
                        const sId = item.id || item.title;
                        return (
                          <tr key={sId} className="border-b border-slate-100 dark:border-slate-850/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                            <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">{item.title}</td>
                            <td className="p-4 sm:p-5 hidden sm:table-cell font-mono">{item.benefits.length} items</td>
                            <td className="p-4 sm:p-5 flex items-center gap-3">
                              <button
                                onClick={() => openEditModal('service', item)}
                                className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg md:hover:bg-slate-50 dark:md:hover:bg-slate-850 cursor-pointer"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: 'service', id: sId, title: item.title })}
                                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg md:hover:bg-slate-50 dark:md:hover:bg-slate-850 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CREATE/EDIT SERVICE COMPILING EDITOR */}
            {activeTab === 'services' && (isNewItem || editingId) && (
              <form onSubmit={saveService} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
                <h3 className="text-base font-bold tracking-tight">
                  {isNewItem ? 'Compile Custom Solutions Service' : 'Modify Service parameters'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Service Offering Name</label>
                    <input
                      type="text"
                      required
                      value={servTitle}
                      onChange={(e) => setServTitle(e.target.value)}
                      placeholder="E.g. Custom Software Development"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Lucide brand Icon key (string)</label>
                    <input
                      type="text"
                      required
                      value={servIcon}
                      onChange={(e) => setServIcon(e.target.value)}
                      placeholder="E.g. Code2, Laptop, Smartphone, Cloud"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Detailed Description Specs</label>
                  <textarea
                    required
                    rows={4}
                    value={servDesc}
                    onChange={(e) => setServDesc(e.target.value)}
                    placeholder="Conception, compilation, and cloud deployment of high-throughput corporate frameworks..."
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 resize-none font-sans"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Key Business Benefits (Comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={servBenefits}
                    onChange={(e) => setServBenefits(e.target.value)}
                    placeholder="E.g. Reduced maintenance overhead, 100% IP ownership, Rapid client integration"
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Engineered Stack Technologies (Comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={servTech}
                    onChange={(e) => setServTech(e.target.value)}
                    placeholder="E.g. React, Next.js, Go, Docker, Cloud Run"
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200"
                  />
                </div>

                <div className="flex items-center gap-3 justify-end mt-4">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Commit service parameters
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* 2C. TAB: MANAGE PORTFOLIO                                */}
            {/* ======================================================== */}
            {activeTab === 'portfolio' && !editingId && !isNewItem && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold tracking-tight">Dynamic Showcase Catalog</h3>
                  <button
                    onClick={openNewModal}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-transform cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 uppercase font-mono font-bold">
                        <th className="p-4 sm:p-5">Project Name</th>
                        <th className="p-4 sm:p-5">Client</th>
                        <th className="p-4 sm:p-5 hidden sm:table-cell">Category</th>
                        <th className="p-4 sm:p-5">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolios.map((item) => {
                        const pId = item.id || item.title;
                        return (
                          <tr key={pId} className="border-b border-slate-100 dark:border-slate-850/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                            <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">{item.title}</td>
                            <td className="p-4 sm:p-5 text-slate-500 font-sans">{item.client}</td>
                            <td className="p-4 sm:p-5 hidden sm:table-cell text-slate-600 dark:text-slate-450 font-medium">{item.category}</td>
                            <td className="p-4 sm:p-5 flex items-center gap-3">
                              <button
                                onClick={() => openEditModal('portfolio', item)}
                                className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg md:hover:bg-slate-50 dark:md:hover:bg-slate-850 cursor-pointer"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: 'portfolio', id: pId, title: item.title })}
                                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg md:hover:bg-slate-50 dark:md:hover:bg-slate-850 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CREATE/EDIT PORTFOLIO FORM */}
            {activeTab === 'portfolio' && (isNewItem || editingId) && (
              <form onSubmit={savePortfolio} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
                <h3 className="text-base font-bold tracking-tight">
                  {isNewItem ? 'Publish Portfolio Case Study' : 'Edit portfolio specifications'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Project Title</label>
                    <input
                      type="text"
                      required
                      value={portTitle}
                      onChange={(e) => setPortTitle(e.target.value)}
                      placeholder="E.g. Aura headless commerce"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Client Brand Partner Name</label>
                    <input
                      type="text"
                      required
                      value={portClient}
                      onChange={(e) => setPortClient(e.target.value)}
                      placeholder="E.g. Aura lifestyle inc"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Showcase category dropdown</label>
                    <select
                      value={portCat}
                      onChange={(e) => setPortCat(e.target.value)}
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-700 dark:text-slate-300"
                    >
                      <option value="Web Application Development">Web Application Development</option>
                      <option value="Mobile Application Development">Mobile Application Development</option>
                      <option value="Custom Software Development">Custom Software Development</option>
                      <option value="E-commerce Solutions">E-commerce Solutions</option>
                      <option value="AI & Automation Solutions">AI & Automation Solutions</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Staging Deployment URL (Optional)</label>
                    <input
                      type="text"
                      value={portLink}
                      onChange={(e) => setPortLink(e.target.value)}
                      placeholder="E.g. https://aura-retail-example.com"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Case image URL coordinate</label>
                  <input
                    type="text"
                    required
                    value={portImage}
                    onChange={(e) => setPortImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200"
                  />
                  {/* Presets suggestions to bypass manual typing */}
                  <div className="flex flex-wrap gap-2.5 mt-1.5">
                    {UNSPLASH_PRESETS.slice(0, 5).map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPortImage(preset.url)}
                        className="px-2 py-1 border border-slate-100 hover:border-indigo-500 rounded text-[9px] font-medium transition-colors"
                      >
                        {preset.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Integrated stacks (Comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={portTech}
                    onChange={(e) => setPortTech(e.target.value)}
                    placeholder="E.g. React, Next.js, Stripe API, Headless Shopify"
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Case specifications detail text</label>
                  <textarea
                    required
                    rows={4}
                    value={portDesc}
                    onChange={(e) => setPortDesc(e.target.value)}
                    placeholder="A headless architectural e-commerce store with dynamic inventory levels, fast local client cart states, and Stripe payment pathways..."
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 resize-none font-sans"
                  />
                </div>

                <div className="flex items-center gap-3 justify-end mt-4">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Save portfolio Case properties
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* 2D. TAB: MANAGE BLOG                                     */}
            {/* ======================================================== */}
            {activeTab === 'blog' && !editingId && !isNewItem && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold tracking-tight">Insights articles List</h3>
                  <button
                    onClick={openNewModal}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-transform cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Article</span>
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 uppercase font-mono font-bold">
                        <th className="p-4 sm:p-5">Title</th>
                        <th className="p-4 sm:p-5">Author</th>
                        <th className="p-4 sm:p-5 hidden sm:table-cell">Category</th>
                        <th className="p-4 sm:p-5">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map((item) => {
                        const bId = item.id || item.title;
                        return (
                          <tr key={bId} className="border-b border-slate-100 dark:border-slate-850/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                            <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">{item.title}</td>
                            <td className="p-4 sm:p-5 text-slate-500 font-sans">{item.author}</td>
                            <td className="p-4 sm:p-5 hidden sm:table-cell text-slate-600 dark:text-slate-450 font-medium">{item.category}</td>
                            <td className="p-4 sm:p-5 flex items-center gap-3">
                              <button
                                onClick={() => openEditModal('blog', item)}
                                className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg md:hover:bg-slate-50 dark:md:hover:bg-slate-850 cursor-pointer"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: 'blog', id: bId, title: item.title })}
                                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg md:hover:bg-slate-50 dark:md:hover:bg-slate-850 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CREATE/EDIT BLOG FORM */}
            {activeTab === 'blog' && (isNewItem || editingId) && (
              <form onSubmit={saveBlog} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
                <h3 className="text-base font-bold tracking-tight">
                  {isNewItem ? 'Create corporate Insight Article' : 'Modify blog specifications'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Article Title</label>
                    <input
                      type="text"
                      required
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      placeholder="E.g. Shift to Headless Commerce"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Author Name & Role</label>
                    <input
                      type="text"
                      required
                      value={blogAuthor}
                      onChange={(e) => setBlogAuthor(e.target.value)}
                      placeholder="E.g. Elena Pierce, Head of Frontend"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category Tag</label>
                    <input
                      type="text"
                      required
                      value={blogCat}
                      onChange={(e) => setBlogCat(e.target.value)}
                      placeholder="E.g. Technology Solutions"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Read estimate time</label>
                    <input
                      type="text"
                      required
                      value={blogReadTime}
                      onChange={(e) => setBlogReadTime(e.target.value)}
                      placeholder="E.g. 5 min read"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Header Image Unsplash URL</label>
                  <input
                    type="text"
                    required
                    value={blogImage}
                    onChange={(e) => setBlogImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200"
                  />
                  {/* Preset photo tags */}
                  <div className="flex flex-wrap gap-2.5 mt-1">
                    {UNSPLASH_PRESETS.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setBlogImage(preset.url)}
                        className="px-2 py-0.5 border border-slate-100 hover:border-indigo-500 rounded text-[9px] transition-colors"
                      >
                        {preset.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Excerpt / Short summary</label>
                  <input
                    type="text"
                    required
                    maxLength={1000}
                    value={blogSummary}
                    onChange={(e) => setBlogSummary(e.target.value)}
                    placeholder="Provide a short description summarize of this article (max 1,000 characters)..."
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Technical Article Markdown body</label>
                    <span className="font-mono text-[10px]">Markdown tags supported (e.g., ## headers, * bullets)</span>
                  </div>
                  <textarea
                    required
                    rows={8}
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    placeholder="## Why Headless is the Future...&#10;&#10;Explain the tech structures clearly here..."
                    className="py-3.5 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 outline-none text-slate-850 dark:text-slate-200 font-mono resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 justify-end mt-4">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                  >
                    Publish corporate Insight Article
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* 2E. TAB: MANAGE TESTIMONIALS                              */}
            {/* ======================================================== */}
            {activeTab === 'testimonials' && !editingId && !isNewItem && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold tracking-tight">Verified Testimonials Database</h3>
                  <button
                    onClick={openNewModal}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-transform cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Testimonial</span>
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 uppercase font-mono font-bold">
                        <th className="p-4 sm:p-5">Name</th>
                        <th className="p-4 sm:p-5">Role/Company</th>
                        <th className="p-4 sm:p-5 hidden sm:table-cell">Rating</th>
                        <th className="p-4 sm:p-5">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testimonials.map((item) => {
                        const tId = item.id || item.name;
                        return (
                          <tr key={tId} className="border-b border-slate-100 dark:border-slate-850/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                            <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">{item.name}</td>
                            <td className="p-4 sm:p-5 text-slate-500 font-sans">{item.role} at {item.company}</td>
                            <td className="p-4 sm:p-5 hidden sm:table-cell font-mono">{item.rating} / 5</td>
                            <td className="p-4 sm:p-5 flex items-center gap-3">
                              <button
                                onClick={() => openEditModal('testimonial', item)}
                                className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg md:hover:bg-slate-50 dark:md:hover:bg-slate-850 cursor-pointer"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: 'testimonial', id: tId, title: item.name })}
                                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg md:hover:bg-slate-50 dark:md:hover:bg-slate-850 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CREATE/EDIT TESTIMONIAL FORM */}
            {activeTab === 'testimonials' && (isNewItem || editingId) && (
              <form onSubmit={saveTestimonial} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
                <h3 className="text-base font-bold tracking-tight">
                  {isNewItem ? 'Register verified Client Feedback' : 'Modify testimonial fields'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Client Name</label>
                    <input
                      type="text"
                      required
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      placeholder="E.g. Alexander Mercer"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Corporate Role / Title</label>
                    <input
                      type="text"
                      required
                      value={testRole}
                      onChange={(e) => setTestRole(e.target.value)}
                      placeholder="E.g. VP of Digital Engineering"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Enterprise Company Name</label>
                    <input
                      type="text"
                      required
                      value={testComp}
                      onChange={(e) => setTestComp(e.target.value)}
                      placeholder="E.g. Standard Trading Group"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Testimonial rating score (1 to 5)</label>
                    <select
                      value={testRating}
                      onChange={(e) => setTestRating(Number(e.target.value))}
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-755 dark:text-slate-300 focus:border-indigo-500 transition-colors"
                    >
                      <option value={5} className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">5 Stars - Outstanding</option>
                      <option value={4} className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">4 Stars - High</option>
                      <option value={3} className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">3 Stars - Satisfactory</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Client Avatar photo URL coordinate</label>
                  <input
                    type="text"
                    required
                    value={testAvatar}
                    onChange={(e) => setTestAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setTestAvatar("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80")}
                    className="self-start px-2 py-1 mt-1 border text-[9px] border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 rounded transition-colors text-slate-600 dark:text-slate-400"
                  >
                    Select portrait preset
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Quote text content (max 2,000 characters)</label>
                  <textarea
                    required
                    rows={4}
                    value={testQuote}
                    onChange={(e) => setTestQuote(e.target.value)}
                    placeholder="The digital Solutions team redesigned our core ledger application in React and Tailwind..."
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors resize-none font-sans"
                  />
                </div>

                <div className="flex items-center gap-3 justify-end mt-4">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                  >
                    Commit testimonial
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* 2F. TAB: MANAGE FAQS                                     */}
            {/* ======================================================== */}
            {activeTab === 'faqs' && !editingId && !isNewItem && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold tracking-tight">Active FAQ listings</h3>
                  <button
                    onClick={openNewModal}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-transform cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add FAQ</span>
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 uppercase font-mono font-bold">
                        <th className="p-4 sm:p-5">Question</th>
                        <th className="p-4 sm:p-5 hidden sm:table-cell">Category</th>
                        <th className="p-4 sm:p-5">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faqs.map((item) => {
                        const fId = item.id || item.question;
                        return (
                          <tr key={fId} className="border-b border-slate-100 dark:border-slate-850/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                            <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white leading-normal">{item.question}</td>
                            <td className="p-4 sm:p-5 hidden sm:table-cell text-slate-500">{item.category}</td>
                            <td className="p-4 sm:p-5 flex items-center gap-3">
                              <button
                                onClick={() => openEditModal('faq', item)}
                                className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg md:hover:bg-slate-50 dark:md:hover:bg-slate-850 cursor-pointer"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: 'faq', id: fId, title: item.question })}
                                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg md:hover:bg-slate-50 dark:md:hover:bg-slate-850 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CREATE/EDIT FAQ FORM */}
            {activeTab === 'faqs' && (isNewItem || editingId) && (
              <form onSubmit={saveFaq} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
                <h3 className="text-base font-bold tracking-tight">
                  {isNewItem ? 'Publish interactive FAQ panel' : 'Modify FAQ parameters'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Question Title (max 1000 characters)</label>
                    <input
                      type="text"
                      required
                      value={faqQ}
                      onChange={(e) => setFaqQ(e.target.value)}
                      placeholder="E.g. What is your project lifecycle management strategy?"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category Tag</label>
                    <select
                      value={faqCat}
                      onChange={(e) => setFaqCat(e.target.value)}
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-750 dark:text-slate-300 focus:border-indigo-500 transition-colors"
                    >
                      <option value="General" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">General</option>
                      <option value="Technical" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">Technical</option>
                      <option value="Pricing" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">Pricing</option>
                      <option value="Contracts" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">Contracts</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Constructive Answer Specs (max 4,000 characters)</label>
                  <textarea
                    required
                    rows={4}
                    value={faqA}
                    onChange={(e) => setFaqA(e.target.value)}
                    placeholder="We utilize modular agile workflows: Week 1-2 centers entirely on Figma designs..."
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors resize-none font-sans mt-1"
                  />
                </div>

                <div className="flex items-center gap-3 justify-end mt-4">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                  >
                    Commit FAQ Question
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* 2G. TAB: MANAGE CAREERS                                  */}
            {/* ======================================================== */}
            {activeTab === 'careers' && !editingId && !isNewItem && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold tracking-tight">Active operating Careers</h3>
                  <button
                    onClick={openNewModal}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-transform cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Publish Vacancy</span>
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 uppercase font-mono font-bold">
                        <th className="p-4 sm:p-5">Title</th>
                        <th className="p-4 sm:p-5">Department</th>
                        <th className="p-4 sm:p-5 hidden sm:table-cell">Type/Location</th>
                        <th className="p-4 sm:p-5">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {careers.map((item) => {
                        const jId = item.id || item.title;
                        return (
                          <tr key={jId} className="border-b border-slate-100 dark:border-slate-850/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                            <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white leading-normal">{item.title}</td>
                            <td className="p-4 sm:p-5 text-slate-500">{item.department}</td>
                            <td className="p-4 sm:p-5 hidden sm:table-cell text-slate-450">{item.type} &bull; {item.location}</td>
                            <td className="p-4 sm:p-5 flex items-center gap-3">
                              <button
                                onClick={() => openEditModal('career', item)}
                                className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg md:hover:bg-slate-50 dark:md:hover:bg-slate-850 cursor-pointer"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: 'career', id: jId, title: item.title })}
                                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg md:hover:bg-slate-50 dark:md:hover:bg-slate-850 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CREATE/EDIT CAREER FORM */}
            {activeTab === 'careers' && (isNewItem || editingId) && (
              <form onSubmit={saveCareer} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
                <h3 className="text-base font-bold tracking-tight">
                  {isNewItem ? 'Publish professional Vacancy opening' : 'Modify Vacancy specifications'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Vacancy Title</label>
                    <input
                      type="text"
                      required
                      value={carTitle}
                      onChange={(e) => setCarTitle(e.target.value)}
                      placeholder="E.g. Senior Full-Stack Engineer"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Department</label>
                    <select
                      value={carDept}
                      onChange={(e) => setCarDept(e.target.value)}
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-750 dark:text-slate-300 focus:border-indigo-500 transition-colors"
                    >
                      <option value="Engineering" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">Engineering</option>
                      <option value="Marketing" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">Marketing</option>
                      <option value="Design" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">Design</option>
                      <option value="Operations" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">Operations</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Location</label>
                    <input
                      type="text"
                      required
                      value={carLoc}
                      onChange={(e) => setCarLoc(e.target.value)}
                      placeholder="E.g. Remote (Global)"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Employment Contract Type</label>
                    <select
                      value={carType}
                      onChange={(e) => setCarType(e.target.value)}
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-750 dark:text-slate-300 focus:border-indigo-500 transition-colors"
                    >
                      <option value="Full-time" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">Full-time</option>
                      <option value="Contract" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">Contract</option>
                      <option value="Part-time" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">Part-time</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">General Position Description</label>
                  <textarea
                    required
                    rows={4}
                    value={carDesc}
                    onChange={(e) => setCarDesc(e.target.value)}
                    placeholder="We are seeking an expert Experienced builder to coordinate..."
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors resize-none font-sans"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Requirements (Comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={carReqs}
                    onChange={(e) => setCarReqs(e.target.value)}
                    placeholder="E.g. 5+ years experience, TypeScript mastery, distributed database design"
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Benefits & Perks (Comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={carBens}
                    onChange={(e) => setCarBens(e.target.value)}
                    placeholder="E.g. Premium hardware setup, health insurance, unlimited PTO, remote work"
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3 justify-end mt-4">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                  >
                    Publish corporate Vacancy
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* 2H. TAB: MANAGE CONTACT MESSAGES INBOX                  */}
            {/* ======================================================== */}
            {activeTab === 'messages' && (
              <div className="flex flex-col gap-6">
                <h3 className="text-base font-bold tracking-tight">Leads Communications Inbox</h3>

                {messages.length === 0 ? (
                  <div className="py-24 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 rounded-3xl font-mono text-xs">
                    No client inquiries recorded yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {messages.map((msg) => {
                      const mId = msg.id || msg.name;
                      const isUnread = msg.status === 'unread';

                      return (
                        <div
                          key={mId}
                          className={`p-6 border rounded-2xl flex flex-col gap-4 bg-white dark:bg-slate-900 transition-all ${
                            isUnread
                              ? 'border-indigo-500 shadow-indigo-505/5'
                              : 'border-slate-200 dark:border-slate-900'
                          }`}
                        >
                          {/* Sender identity metrics bar */}
                          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
                            <div className="flex flex-col gap-1 text-xs">
                              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {msg.name}
                                {isUnread && (
                                  <span className="px-2 py-0.5 bg-rose-500 text-white rounded text-[9px] font-bold uppercase">
                                    Unread Lead
                                  </span>
                                )}
                              </span>
                              <div className="flex flex-wrap items-center gap-3 text-slate-400 mt-1 font-mono text-[10px]">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a>
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  <a href={`tel:${msg.phone}`} className="hover:underline">{msg.phone}</a>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleMessageRead(mId, msg.status)}
                                className={`px-4 py-2 border rounded-xl text-[10px] font-bold cursor-pointer transition-colors ${
                                  isUnread
                                    ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                                }`}
                              >
                                {isUnread ? 'Mark read' : 'Mark unread'}
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: 'message', id: mId, title: `Lead query from ${msg.name}` })}
                                className="p-2 border border-slate-200 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-50 cursor-pointer"
                                title="Delete Lead permanently"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Message Specs contents */}
                          <div className="flex flex-col gap-2 text-xs">
                            <span className="font-mono text-slate-400">Target frameworks requested:</span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 leading-none">{msg.service}</span>
                            
                            <p className="mt-3 leading-relaxed text-slate-600 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-sans">
                              {msg.message}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* 2I. TAB: MANAGE WEBSITE SETTINGS                        */}
            {/* ======================================================== */}
            {activeTab === 'settings' && (
              <form onSubmit={saveSettings} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 rounded-3xl shadow-sm flex flex-col gap-6">
                <h3 className="text-base font-bold tracking-tight">Website metadata configs</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Company Name</label>
                    <input
                      type="text"
                      required
                      value={setCompName}
                      onChange={(e) => setSetCompName(e.target.value)}
                      placeholder="E.g. Nexus Digital Agency"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Logo brand Photo URL</label>
                    <input
                      type="text"
                      required
                      value={setLogo}
                      onChange={(e) => setSetLogo(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Contact Email</label>
                    <input
                      type="email"
                      required
                      value={setEmail}
                      onChange={(e) => setSetEmail(e.target.value)}
                      placeholder="E.g. connect@nexus.com"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Contact Voice coordinate</label>
                    <input
                      type="text"
                      required
                      value={setPhone}
                      onChange={(e) => setSetPhone(e.target.value)}
                      placeholder="E.g. +1 (800) 555-0199"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Physical HQ Address Coordinates</label>
                  <input
                    type="text"
                    required
                    value={setAddress}
                    onChange={(e) => setSetAddress(e.target.value)}
                    placeholder="E.g. 742 Innovation Highway, Silicon Valley, CA 94025"
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-850 my-2" />

                {/* SEO fields */}
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Search Engine Optimizations (SEO)</h4>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dynamic Browser Index Title</label>
                  <input
                    type="text"
                    required
                    value={setSeoT}
                    onChange={(e) => setSetSeoT(e.target.value)}
                    placeholder="Nexus Digital Solutions Agency | Custom Software"
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Index Meta Description Header</label>
                  <textarea
                    required
                    rows={3}
                    value={setSeoD}
                    onChange={(e) => setSetSeoD(e.target.value)}
                    placeholder="An elite modern Digital solutions studio crafting resilient software..."
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors resize-none font-sans"
                  />
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-850 my-2" />

                {/* Typography Theme Settings */}
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Website Theme Typography</h4>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Default Brand Font Style</label>
                  <div className="relative">
                    <select
                      value={setActiveFont}
                      onChange={(e) => setSetActiveFont(e.target.value as 'sans' | 'serif')}
                      className="w-full py-3 px-4 pr-9 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 appearance-none cursor-pointer transition-colors"
                    >
                      <option value="sans">Modern Sans-Serif (Outfit Header & Inter Body)</option>
                      <option value="serif">Premium Editorial Serif (Cormorant Garamond Header & Lora Body)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">Choose the typography theme applied globally across user-facing pages, showcases, and blog content posts.</p>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-850 my-2" />


                {/* Social entries */}
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Social Connections handles</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">LinkedIn Corporation URL</label>
                    <input
                      type="text"
                      value={setInLinkedIn}
                      onChange={(e) => setSetInLinkedIn(e.target.value)}
                      placeholder="https://linkedin.com/..."
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">GitHub Workspace URL</label>
                    <input
                      type="text"
                      value={setInGithub}
                      onChange={(e) => setSetInGithub(e.target.value)}
                      placeholder="https://github.com/..."
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Twitter Handle URL</label>
                    <input
                      type="text"
                      value={setInTwitter}
                      onChange={(e) => setSetInTwitter(e.target.value)}
                      placeholder="https://twitter.com/..."
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-850 my-2" />

                {/* About Page Configuration */}
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">About Page dynamic Copy & Stats</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">About Tagline / Subtitle</label>
                    <input
                      type="text"
                      required
                      value={aboutSub}
                      onChange={(e) => setAboutSub(e.target.value)}
                      placeholder="E.g. Our Origin Story"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">About Main Heading Title</label>
                    <input
                      type="text"
                      required
                      value={aboutH1}
                      onChange={(e) => setAboutH1(e.target.value)}
                      placeholder="E.g. Crafting the Future of High-Scale Corporate Platforms"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">About Hero Introduction Narrative</label>
                  <textarea
                    required
                    rows={3}
                    value={aboutPara}
                    onChange={(e) => setAboutPara(e.target.value)}
                    placeholder="E.g. Founded in California, Nexus emerged from..."
                    className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors resize-none font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-slate-100 dark:border-slate-850/60 rounded-2xl bg-slate-50/50 dark:bg-slate-950/5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stat 1 Value</label>
                    <input
                      type="text" required value={s1Val} onChange={(e) => setS1Val(e.target.value)}
                      className="py-2.5 px-3 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200"
                    />
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stat 1 Label</label>
                    <input
                      type="text" required value={s1Lbl} onChange={(e) => setS1Lbl(e.target.value)}
                      className="py-2.5 px-3 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stat 2 Value</label>
                    <input
                      type="text" required value={s2Val} onChange={(e) => setS2Val(e.target.value)}
                      className="py-2.5 px-3 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200"
                    />
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stat 2 Label</label>
                    <input
                      type="text" required value={s2Lbl} onChange={(e) => setS2Lbl(e.target.value)}
                      className="py-2.5 px-3 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stat 3 Value</label>
                    <input
                      type="text" required value={s3Val} onChange={(e) => setS3Val(e.target.value)}
                      className="py-2.5 px-3 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200"
                    />
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stat 3 Label</label>
                    <input
                      type="text" required value={s3Lbl} onChange={(e) => setS3Lbl(e.target.value)}
                      className="py-2.5 px-3 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stat 4 Value</label>
                    <input
                      type="text" required value={s4Val} onChange={(e) => setS4Val(e.target.value)}
                      className="py-2.5 px-3 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200"
                    />
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stat 4 Label</label>
                    <input
                      type="text" required value={s4Lbl} onChange={(e) => setS4Lbl(e.target.value)}
                      className="py-2.5 px-3 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Core Values (JSON Array)</label>
                      <span className="text-[10px] text-slate-400">Keys: icon, title, text</span>
                    </div>
                    <textarea
                      required
                      rows={6}
                      value={valuesJson}
                      onChange={(e) => setValuesJson(e.target.value)}
                      className="py-3 px-4 rounded-xl text-[11px] font-mono bg-slate-950 text-emerald-400 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Team Officers (JSON Array)</label>
                      <span className="text-[10px] text-slate-400">Keys: name, role, bio, image</span>
                    </div>
                    <textarea
                      required
                      rows={6}
                      value={teamJson}
                      onChange={(e) => setTeamJson(e.target.value)}
                      className="py-3 px-4 rounded-xl text-[11px] font-mono bg-slate-950 text-emerald-400 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-850 my-2" />

                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Home Video & Sub-page Header Banners</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">Homepage Background Hero Video URL (MP4)</label>
                    <input
                      type="text"
                      value={setHomeVideo}
                      onChange={(e) => setSetHomeVideo(e.target.value)}
                      placeholder="https://assets.mixkit.co/videos/preview/..."
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">Homepage Background Hero Image URL (Fallback)</label>
                    <input
                      type="text"
                      value={setHomeImage}
                      onChange={(e) => setSetHomeImage(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Opacity / Transparency Slider */}
                <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Hero Background Opacity / Transparency</label>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-lg tabular-nums">
                      {Math.round(setHomeVideoOpacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={setHomeVideoOpacity}
                    onChange={(e) => setSetHomeVideoOpacity(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-indigo-600"
                    style={{
                      background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${setHomeVideoOpacity * 100}%, #e2e8f0 ${setHomeVideoOpacity * 100}%, #e2e8f0 100%)`
                    }}
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>0% — Invisible</span>
                    <span>50% — Half</span>
                    <span>100% — Full</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Controls how visible the background video or image is in the hero section. Lower = more subtle watermark effect. Higher = stronger presence.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Services Header Banner URL</label>
                    <input
                      type="text"
                      value={setSrvBanner}
                      onChange={(e) => setSetSrvBanner(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Portfolio Header Banner URL</label>
                    <input
                      type="text"
                      value={setPortBanner}
                      onChange={(e) => setSetPortBanner(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Blog Header Banner URL</label>
                    <input
                      type="text"
                      value={setBlgBanner}
                      onChange={(e) => setSetBlgBanner(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Careers Header Banner URL</label>
                    <input
                      type="text"
                      value={setCarBanner}
                      onChange={(e) => setSetCarBanner(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">FAQ Banner URL</label>
                    <input
                      type="text"
                      value={setFaqBanner}
                      onChange={(e) => setSetFaqBanner(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Contact Banner URL</label>
                    <input
                      type="text"
                      value={setCntBanner}
                      onChange={(e) => setSetCntBanner(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">About Banner URL</label>
                    <input
                      type="text"
                      value={setAbtBanner}
                      onChange={(e) => setSetAbtBanner(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 outline-none text-slate-850 dark:text-slate-200 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Save Global configuration parameters
                </button>
              </form>
            )}

            {activeTab === 'profile' && (
              <div className="flex flex-col gap-8">
                {/* Profile Credentials Header Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-8 rounded-3xl shadow-sm">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <img
                      src={user?.photoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80'}
                      alt="Administrator Avatar"
                      className="h-20 w-20 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                    />
                    <div className="flex-grow text-center md:text-left">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">
                          {user?.displayName || 'Samuel Arul'}
                        </h3>
                        <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                          Super Administrator
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-mono mt-2">
                        Registered Email: {user?.email || 'samuelarul2001@gmail.com'}
                      </p>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-[10px] text-slate-400 font-mono">
                        <span>Provider: <strong className="text-slate-600 dark:text-slate-350">{user?.providerId || 'google.com'}</strong></span>
                        <span>•</span>
                        <span>UID: <strong className="text-indigo-500">{user?.uid || 'demo-samuel-arul'}</strong></span>
                        <span>•</span>
                        <span className="text-emerald-500 font-bold">✓ Google Verified Account Token</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password / bypass local passcode security controller */}
                <form onSubmit={handleUpdatePasscode} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Local Account & Bypass Passcode Options</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">Secure your offline administration and critical browser overrides</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950/20 text-xs text-slate-500 dark:text-slate-400 rounded-xl leading-relaxed border border-slate-100 dark:border-slate-850/60 font-mono">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Security Notice:</span>
                    <p className="mt-1">
                      This system leverages Google Multi-Factor Authentication for primary network security (Zero Password exposure). Underneath, you can configure a secondary local administrative passcode to confirm offline changes, seeding actions, and critical data transactions.
                    </p>
                    <p className="mt-1 text-slate-400 text-[10px]">
                      Default master fallback passcode: <strong className="font-sans text-indigo-500 font-bold">admin123</strong>
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Current Administrative Passcode</label>
                    <input
                      type="password"
                      required
                      value={oldPasscode}
                      onChange={(e) => setOldPasscode(e.target.value)}
                      placeholder="Enter active passcode"
                      className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Passcode</label>
                      <input
                        type="password"
                        required
                        value={newPasscode}
                        onChange={(e) => setNewPasscode(e.target.value)}
                        placeholder="Enter new passcode"
                        className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm New Passcode</label>
                      <input
                        type="password"
                        required
                        value={confirmPasscode}
                        onChange={(e) => setConfirmPasscode(e.target.value)}
                        placeholder="Retype new passcode"
                        className="py-3 px-4 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/20 border border-slate-200"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                  >
                    Confirm & Update local passcode parameters
                  </button>
                </form>
              </div>
            )}

            {/* ======================================================== */}
            {/* 2I. TAB: FEEDBACK MANAGEMENT                             */}
            {/* ======================================================== */}
            {activeTab === 'feedback' && (
              <div className="flex flex-col gap-6">

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Pending Review', count: feedbacks.filter(f => f.status === 'pending').length, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-800/30' },
                    { label: 'Approved', count: feedbacks.filter(f => f.status === 'approved').length, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-800/30' },
                    { label: 'Rejected', count: feedbacks.filter(f => f.status === 'rejected').length, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/20', border: 'border-rose-200 dark:border-rose-800/30' },
                  ].map((s, i) => (
                    <div key={i} className={`flex flex-col gap-1.5 p-4 rounded-2xl border ${s.bg} ${s.border}`}>
                      <span className={`text-2xl font-extrabold ${s.color}`}>{s.count}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</span>
                    </div>
                  ))}
                </div>

                {feedbacks.length === 0 ? (
                  <div className="py-20 text-center">
                    <Star className="h-10 w-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">No feedback submissions yet.</p>
                    <p className="text-xs text-slate-400 mt-1">Share <strong className="text-indigo-500">#feedback</strong> link with clients to collect reviews.</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 rounded-3xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 uppercase font-mono font-bold">
                          <th className="p-4">Client</th>
                          <th className="p-4 hidden sm:table-cell">Rating</th>
                          <th className="p-4 hidden md:table-cell">Project</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feedbacks.sort((a,b) => {
                          const order = { pending: 0, approved: 1, rejected: 2 };
                          return (order[a.status] ?? 3) - (order[b.status] ?? 3);
                        }).map((fb) => {
                          const fbId = fb.id || fb.name;
                          return (
                            <tr key={fbId} className="border-b border-slate-100 dark:border-slate-850/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                              <td className="p-4">
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-bold text-slate-900 dark:text-white">{fb.name}</span>
                                  <span className="text-[10px] text-slate-400">{fb.role} · {fb.company}</span>
                                </div>
                              </td>
                              <td className="p-4 hidden sm:table-cell">
                                <div className="flex items-center gap-0.5">
                                  {[1,2,3,4,5].map(s => (
                                    <Star key={s} className={`h-3.5 w-3.5 ${s <= fb.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                                  ))}
                                </div>
                              </td>
                              <td className="p-4 hidden md:table-cell">
                                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                                  {fb.projectType}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  fb.status === 'approved' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' :
                                  fb.status === 'rejected' ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-500' :
                                  'bg-amber-50 dark:bg-amber-950/30 text-amber-600'
                                }`}>{fb.status}</span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  {fb.status !== 'approved' && (
                                    <button
                                      onClick={async () => {
                                        if (!fbId || fbId.toString().startsWith('local-')) return;
                                        try {
                                          const { doc: firestoreDoc, updateDoc } = await import('firebase/firestore');
                                          await updateDoc(firestoreDoc(db, 'feedback', fbId.toString()), { status: 'approved' });
                                          addToast('success', `Feedback from ${fb.name} approved and published.`);
                                          await refreshAllData();
                                        } catch(e) { addToast('error', 'Failed to approve feedback.'); }
                                      }}
                                      title="Approve"
                                      className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer transition-colors"
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                  )}
                                  {fb.status !== 'rejected' && (
                                    <button
                                      onClick={async () => {
                                        if (!fbId || fbId.toString().startsWith('local-')) return;
                                        try {
                                          const { doc: firestoreDoc, updateDoc } = await import('firebase/firestore');
                                          await updateDoc(firestoreDoc(db, 'feedback', fbId.toString()), { status: 'rejected' });
                                          addToast('info', `Feedback from ${fb.name} rejected.`);
                                          await refreshAllData();
                                        } catch(e) { addToast('error', 'Failed to reject feedback.'); }
                                      }}
                                      title="Reject"
                                      className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer transition-colors"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setDeleteTarget({ type: 'feedback', id: fbId.toString(), title: `${fb.name}'s feedback` })}
                                    title="Delete"
                                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Message preview panel */}
                {feedbacks.filter(f => f.status === 'pending').length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Pending — Full Messages</h4>
                    {feedbacks.filter(f => f.status === 'pending').map((fb, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{fb.name} · {fb.company}</span>
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(s => <Star key={s} className={`h-3 w-3 ${s <= fb.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">&ldquo;{fb.message}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Delete Confirmation Modal Overlay */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in text-slate-800 dark:text-slate-100">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl max-w-sm sm:max-w-md w-full p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center gap-4 text-rose-600 dark:text-rose-400">
              <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white">Confirm Removal</h4>
                <p className="text-[10px] text-slate-400">This action is irreversible</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-900 dark:text-white">"{deleteTarget.title}"</strong> from the <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[10px]">{deleteTarget.type}</span> registry?
            </p>

            <div className="flex items-center gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Database Seed Confirmation Overlay */}
      {seedConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in text-slate-800 dark:text-slate-100">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl max-w-sm sm:max-w-md w-full p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white font-sans">Seed Database Collections</h4>
                <p className="text-[10px] text-slate-400 font-mono">Initialize corporate structural records</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This operation will populate your database with initial default services, professional blog catalogs, FAQs, templates, and primary website coordinates.
            </p>

            <div className="flex items-center gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setSeedConfirmOpen(false)}
                className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSeedDatabase(true)}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
              >
                Seed Collections
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
