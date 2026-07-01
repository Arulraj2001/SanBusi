import { Mail, Phone, MapPin, Linkedin, Github, Twitter, Facebook } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface FooterProps {
  setCurrentView: (view: string) => void;
  settings: WebsiteSettings;
}

export default function Footer({ setCurrentView, settings }: FooterProps) {
  const socialIcons = {
    linkedin: <Linkedin className="h-5 w-5" />,
    github: <Github className="h-5 w-5" />,
    twitter: <Twitter className="h-5 w-5" />,
    facebook: <Facebook className="h-5 w-5" />,
  };

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-850 text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-lg select-none">
                N
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Nexus<span className="text-indigo-400 font-medium">Digital</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {settings.seoDescription || "An elite, full-stack digital Lösungen studio delivering enterprise platform integrations, high-performance modular web runtimes, and customer automation loops."}
            </p>
            {/* Social media connections */}
            <div className="flex items-center gap-3.5 mt-2">
              {Object.entries(settings.socialLinks).map(([key, value]) => {
                if (!value) return null;
                const icon = socialIcons[key as keyof typeof socialIcons];
                if (!icon) return null;
                return (
                  <a
                    key={key}
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 border border-slate-850 hover:border-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/5 text-slate-400 rounded-xl transition-all duration-300"
                    title={key}
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links Col */}
          <div className="flex flex-col gap-6">
            <h3 className="text-base font-semibold text-white tracking-widest uppercase">Navigation</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <button onClick={() => handleNavClick('home')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Overview Landing
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Services Directory
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('portfolio')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Visual Case Studies
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('blog')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Strategy Insights
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('careers')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Careers Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Services Quicklist */}
          <div className="flex flex-col gap-6 font-sans">
            <h3 className="text-base font-semibold text-white tracking-widest uppercase">Offerings</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <button onClick={() => handleNavClick('services')} className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left">
                  SaaS Software Engineering
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left">
                  Automated Digital Marketing
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left">
                  UX/UI Blueprinting
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left">
                  Cloud Infrastructure Solutions
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('faq')} className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left">
                  Operational Guidelines FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="flex flex-col gap-6">
            <h3 className="text-base font-semibold text-white tracking-widest uppercase">Office Coordinates</h3>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings.address || "742 Innovation Highway, Suite 100, Silicon Valley, CA 94025"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email || "connect@nexus-digital.com"}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phone || "+1 (800) 555-0199"}
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="h-px bg-slate-800 my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <span>&copy; {new Date().getFullYear()} {settings.companyName || "Nexus Digital"}. All rights reserved globally.</span>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 transition-colors cursor-pointer" onClick={() => handleNavClick('about')}>About Corporate Profile</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer" onClick={() => handleNavClick('contact')}>Privacy & Security Guardrails</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
