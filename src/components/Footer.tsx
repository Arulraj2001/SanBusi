import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Linkedin, Github, Twitter, Facebook, Lock, LayoutDashboard, LogOut, X, ShieldCheck, Eye, Database, Key } from 'lucide-react';
import { WebsiteSettings } from '../types';
import { useAuth } from '../context/AuthContext';

interface FooterProps {
  setCurrentView: (view: string) => void;
  settings: WebsiteSettings;
}

export default function Footer({ setCurrentView, settings }: FooterProps) {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <span className="hover:text-slate-300 transition-colors cursor-pointer" onClick={() => setIsModalOpen(true)}>Privacy & Security Guardrails</span>
            
            {/* Admin Login / Panel Icon Trigger */}
            <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
              {user ? (
                <>
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="p-1.5 text-slate-500 hover:text-indigo-400 rounded-lg hover:bg-slate-800/40 transition-colors cursor-pointer flex items-center justify-center"
                    title="Go to Admin Panel"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={logout}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800/40 transition-colors cursor-pointer flex items-center justify-center"
                    title="Sign Out"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavClick('admin')}
                  className="p-1.5 text-slate-500 hover:text-indigo-400 rounded-lg hover:bg-slate-800/40 transition-colors cursor-pointer flex items-center justify-center"
                  title="Admin Access Control"
                >
                  <Lock className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ═══ PRIVACY & SECURITY GUARDRAILS MODAL ═══ */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-800 dark:text-slate-200"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-650 dark:hover:text-slate-250 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-400/20 bg-indigo-400/5 text-indigo-500 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                  <ShieldCheck className="h-3.5 w-3.5" /> Corporate Security Posture
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white mt-2 leading-tight">
                  Privacy & Security Guardrails
                </h3>
                <p className="text-slate-400 text-xs mt-1">Operational standards, encryption parameters, and data governance controls.</p>
              </div>

              {/* Content / Features Grid */}
              <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto flex flex-col gap-6">
                
                {/* Section 1: Data Encryption */}
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="font-extrabold text-slate-950 dark:text-white text-sm">Hardware-Hardened Encryption</span>
                    <p className="text-slate-550 dark:text-slate-350 leading-relaxed font-sans">
                      All platform payloads, client profiles, and workspace specifications are encrypted in-transit using TLS 1.3 cryptographic suites and at-rest via military-grade AES-256 standard protocols.
                    </p>
                  </div>
                </div>

                {/* Section 2: Zero Cookie Sell */}
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="font-extrabold text-slate-950 dark:text-white text-sm">Privacy Compliance Guidelines</span>
                    <p className="text-slate-550 dark:text-slate-350 leading-relaxed font-sans">
                      We operate in strict accordance with CCPA/GDPR compliance frameworks. Your contact emails, query details, and feedback metrics are never sold to external listing agents or third-party analytic matrices.
                    </p>
                  </div>
                </div>

                {/* Section 3: Access Guardrails */}
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Key className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="font-extrabold text-slate-950 dark:text-white text-sm">Executive Access Control & MFA</span>
                    <p className="text-slate-550 dark:text-slate-350 leading-relaxed font-sans">
                      Administrative console entry parameters require verified authentication token verification. We restrict dashboard configuration options using Attribute-Based Access Control policies to prevent credentials bypass.
                    </p>
                  </div>
                </div>

                {/* Section 4: Infrastructure Isolation */}
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Database className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="font-extrabold text-slate-950 dark:text-white text-sm">Hardened Sandbox Isolation</span>
                    <p className="text-slate-550 dark:text-slate-350 leading-relaxed font-sans">
                      System database nodes operate in high-availability, sandboxed private subnets. Multi-region firewalls actively restrict rogue ingress traffic, ensuring zero cross-tenant metadata leakage or unencrypted logs exposure.
                    </p>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between gap-4">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">SOC2 Type II Aligned &bull; ISO 27001 Posture</span>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition-colors cursor-pointer"
                >
                  Acknowledge Guardrails
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
