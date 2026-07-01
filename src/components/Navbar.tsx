import { useState } from 'react';
import { Sun, Moon, Menu, X, ShieldCheck, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export default function Navbar({ currentView, setCurrentView, isDark, toggleTheme }: NavbarProps) {
  const { user, isAdmin, login, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', value: 'home' },
    { label: 'Services', value: 'services' },
    { label: 'Portfolio', value: 'portfolio' },
    { label: 'Blog', value: 'blog' },
    { label: 'Careers', value: 'careers' },
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
    <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white font-bold text-lg tracking-wider">N</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Nexus<span className="text-indigo-600 dark:text-indigo-400 font-medium">Digital</span>
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
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
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
              className="p-2.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-xl bg-slate-100 dark:bg-slate-900 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>

            {/* Dashboard shortcut if Admin logged in */}
            {user && isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'admin'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                    : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/60'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* Auth control */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end text-right">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    {user.displayName || user.email?.split('@')[0]}
                    {isAdmin && <ShieldCheck className="h-3 w-3 text-emerald-500 fill-emerald-500/10" />}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {isAdmin ? 'Administrator' : 'Guest'}
                  </span>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="photo" className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-indigo-600 dark:hover:bg-indigo-400 hover:text-white dark:hover:text-white rounded-xl text-sm font-medium shadow-sm transition-all duration-300 cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span>Admin Login</span>
              </button>
            )}
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

            <div className="h-px bg-slate-200 dark:bg-slate-900 my-2" />

            {/* Mobile Admin & Login controls */}
            {user ? (
              <div className="flex flex-col gap-3 px-2">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="photo" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold flex items-center gap-1">
                      {user.displayName || user.email?.split('@')[0]}
                      {isAdmin && <ShieldCheck className="h-3 w-3 text-emerald-500 fill-emerald-500/10" />}
                    </span>
                    <span className="text-xs text-slate-400">{isAdmin ? 'Administrator' : 'Guest'}</span>
                  </div>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="flex items-center justify-center gap-2 py-2.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-semibold"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Go to Admin Dashboard</span>
                  </button>
                )}

                <button
                  onClick={logout}
                  className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-rose-500 dark:hover:bg-slate-900/40 rounded-xl text-sm font-semibold"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-semibold"
              >
                <LogIn className="h-4 w-4" />
                <span>Admin Login Portal</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
