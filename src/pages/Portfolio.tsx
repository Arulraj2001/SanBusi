import { useState, useMemo } from 'react';
import { PortfolioProject } from '../types';
import { X, ExternalLink, Calendar, Briefcase, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PortfolioProps {
  portfolios: PortfolioProject[];
  selectedProject: PortfolioProject | null;
  setSelectedProject: (project: PortfolioProject | null) => void;
}

export default function Portfolio({ portfolios, selectedProject, setSelectedProject }: PortfolioProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Categories list
  const categories = useMemo(() => {
    const list = new Set(portfolios.map(p => p.category));
    return ['All', ...Array.from(list)];
  }, [portfolios]);

  // Filtered portfolios
  const filteredPortfolios = useMemo(() => {
    if (activeCategory === 'All') return portfolios;
    return portfolios.filter(p => p.category === activeCategory);
  }, [portfolios, activeCategory]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      
      {/* 1. HERO HEADER */}
      <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Our Works</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight">
            Visual Case Studies
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mt-6 leading-relaxed">
            Take an in-depth visual tour across our compiled ledger apps, responsive headless retail environments, and automated administrative control suites.
          </p>
        </div>
      </section>

      {/* 2. FILTER TABS */}
      <section className="max-w-7xl mx-auto px-4 pt-12 flex flex-wrap gap-2.5 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer border transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/10 scale-102 font-bold'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-900 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* 3. PORTFOLIO GRID */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="popLayout">
          {filteredPortfolios.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center text-slate-500"
            >
              No projects have been seeded or published for this category yet. Check back momentarily.
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPortfolios.map((project) => {
                const projId = project.id || project.title;
                return (
                  <motion.div
                    key={projId}
                    layoutId={`project-card-${projId}`}
                    onClick={() => setSelectedProject(project)}
                    className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900 overflow-hidden cursor-pointer hover:shadow-lg dark:hover:border-slate-800 transition-all duration-300 flex flex-col group"
                  >
                    <div className="aspect-video w-full overflow-hidden relative bg-slate-100">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase bg-slate-900/90 text-white tracking-widest backdrop-blur-sm">
                        {project.category}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col gap-3 flex-grow">
                      <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                        Partner: {project.client}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-grow">
                        {project.description.slice(0, 140)}...
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 4. MODAL DETAILED PROJECT OVERLAY */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-250 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh]"
            >
              
              {/* Close Button Trigger */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Gallery Image Header */}
              <div className="w-full aspect-[21/9] overflow-hidden relative bg-slate-100 border-b border-slate-200 dark:border-slate-800">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Content Space */}
              <div className="p-8 overflow-y-auto flex-1">
                <div className="flex flex-wrap items-center gap-3.5 mb-6">
                  <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-150/20">
                    {selectedProject.category}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                  {selectedProject.title}
                </h2>

                <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 mb-8 whitespace-pre-wrap">
                  {selectedProject.description}
                </p>

                {/* Meta details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-[18px] w-[18px] text-indigo-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col text-xs">
                      <span className="text-slate-400 uppercase font-mono">Business Partner</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{selectedProject.client}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Tag className="h-[18px] w-[18px] text-indigo-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col text-xs">
                      <span className="text-slate-400 uppercase font-mono font-medium">Integrated Modules</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedProject.technologies.map((tech, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 rounded font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedProject.link && (
                    <div className="flex items-start gap-3">
                      <ExternalLink className="h-[18px] w-[18px] text-indigo-500 shrink-0 mt-0.5" />
                      <div className="flex flex-col text-xs">
                        <span className="text-slate-400 uppercase font-mono font-medium">Staging Deployment</span>
                        <a
                          href={selectedProject.link}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 mt-1"
                        >
                          Visit Live URL
                        </a>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
