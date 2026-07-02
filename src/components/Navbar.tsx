import { useState } from 'react';
import { Sun, Moon, Menu, X, ShieldCheck, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  homeVideoActive?: boolean;
}

export default function Navbar({ currentView, setCurrentView, isDark, toggleTheme, homeVideoActive }: NavbarProps) {
  const { user, isAdmin, login, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', value: 'home' },
    { label: 'Services', value: 'services' },
    { label: 'Portfolio', value: 'portfolio' },
    { label: 'Blog', value: 'blog' },
    { label: 'Feedback', value: 'feedback' },
    { label: 'FAQ', value: 'faq' },
    { label: 'Contact', value: 'contact' },
    { label: 'About', value: 'about' }
  ];

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`sticky top-0 z-50 w-full backdrop-blur-md border-b transition-colors duration-500 ${
      homeVideoActive
        ? 'bg-slate-950/60 border-white/10'
        : 'bg-white/70 dark:bg-slate-950/70 border-slate-200 dark:border-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white font-bold text-lg tracking-wider">N</span>
              </div>
              <span className={`text-xl font-bold tracking-tight ${ homeVideoActive ? 'text-white' : 'text-slate-900 dark:text-white' }`}>
                Nexus<span className="text-indigo-400 font-medium">Digital</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={`text-[15px] font-medium transition-colors cursor-pointer capitalize ${
                  currentView === item.value
                    ? 'text-indigo-400 font-semibold'
                    : homeVideoActive
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action buttons (Theme, Admin status, Login/logout) */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-colors ${
                homeVideoActive
                  ? 'text-slate-300 hover:text-white bg-white/10 hover:bg-white/15'
                  : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-900'
              }`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>


          </div>

          {/* Toggle Mobile Menu (Hamburger) */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Slide-out */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 flex flex-col gap-3 overflow-hidden shadow-xl"
          >
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={`py-2 text-left text-sm font-medium w-full rounded-lg px-2 ${
                  currentView === item.value
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}


          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
