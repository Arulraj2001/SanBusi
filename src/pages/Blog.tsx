import { useState, useMemo } from 'react';
import { BlogPost, WebsiteSettings } from '../types';
import { Search, Calendar, User, ArrowLeft, Clock, Tag } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface BlogProps {
  blogs: BlogPost[];
  settings?: WebsiteSettings;
}

export default function Blog({ blogs, settings }: BlogProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  // Derive categories list Dynamically
  const categories = useMemo(() => {
    const list = new Set(blogs.map(b => b.category));
    return ['All', ...Array.from(list)];
  }, [blogs]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, selectedCategory]);

  const handleReadBlog = (blog: BlogPost) => {
    setActiveArticle(blog);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setActiveArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Convert Firebase Timestamp or JS Date to a clean string format
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'June 2026';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    const d = new Date(timestamp);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    return 'June 13, 2026';
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      
      <AnimatePresence mode="wait">
        {!activeArticle ? (
          /* ======================================= */
          /* 1. LIST VIEW DEFAULT                   */
          /* ======================================= */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* HER0 HEADER */}
            <section className="relative py-24 bg-slate-900 text-white border-b border-slate-800 text-center overflow-hidden">
              {settings?.blogBannerUrl ? (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
                  style={{ backgroundImage: `url(${settings.blogBannerUrl})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.05),transparent)] pointer-events-none" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />

              <div className="max-w-4xl mx-auto px-4 relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono">Knowledge Lab</span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
                  Corporate Insights
                </h1>
                <p className="text-base text-slate-300 max-w-2xl mx-auto mt-6 leading-relaxed">
                  Deep-dives covering modern microservices compilation, AI semantic prompts, headless conversions, and database isolation rules.
                </p>
              </div>
            </section>

            {/* DIRECTORIES & SEARCH SECTION */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Category buttons */}
              <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-colors ${
                      selectedCategory === cat
                        ? 'bg-slate-900 border-slate-900 dark:bg-white dark:border-white text-white dark:text-slate-900 font-bold'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Keyword query bar */}
              <div className="relative w-full md:w-80">
                <Search className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs py-3 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900 outline-none text-slate-700 dark:text-slate-200 focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

            </section>

            {/* ARTICLES COLLAGE */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {filteredBlogs.length === 0 ? (
                <div className="py-24 text-center text-slate-500 font-mono text-xs">
                  No articles matched your active filter parameters.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredBlogs.map((blog) => {
                    const blogId = blog.id || blog.title;
                    return (
                      <div
                        key={blogId}
                        onClick={() => handleReadBlog(blog)}
                        className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900 overflow-hidden cursor-pointer hover:shadow-lg dark:hover:border-slate-800 transition-all duration-300 flex flex-col group"
                      >
                        <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 relative">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-4 left-4 px-2.5 py-1 bg-indigo-600 text-white rounded-md text-[9px] font-bold uppercase tracking-widest shadow-sm">
                            {blog.category}
                          </span>
                        </div>
                        <div className="p-6 flex flex-col gap-4 flex-grow justify-between">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(blog.publishedAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {blog.readTime}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-2">
                              {blog.title}
                            </h3>
                            <p className="text-xs text-slate-505 dark:text-slate-400 leading-relaxed mt-1">
                              {blog.summary}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-850/60 text-xs">
                            <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px]">
                              {blog.author.charAt(0)}
                            </div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{blog.author}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </motion.div>
        ) : (
          /* ======================================= */
          /* 2. READ ARTICLE DETAILED SCREEN        */
          /* ======================================= */
          <motion.div
            key="article"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="max-w-4xl mx-auto px-4 py-12"
          >
            {/* Back anchor */}
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 mb-8 cursor-pointer group"
            >
              <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
              <span>Back to Articles list</span>
            </button>

            {/* Meta details header */}
            <div className="flex flex-col gap-6">
              <span className="self-start px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">
                {activeArticle.category}
              </span>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.2]">
                {activeArticle.title}
              </h1>

              {/* Author and Date bar */}
              <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-900 text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                    {activeArticle.author.charAt(0)}
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{activeArticle.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{formatDate(activeArticle.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>{activeArticle.readTime}</span>
                </div>
              </div>
            </div>

            {/* Billboard image */}
            <div className="aspect-video w-full rounded-3xl overflow-hidden mt-8 border border-slate-200 dark:border-slate-900 bg-slate-100 shadow-sm">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Markdown Parsing Area (Prose wrapper avoids className tags violating spec) */}
            <article className="mt-12 text-slate-850 dark:text-slate-200 leading-relaxed font-sans max-w-none">
              <div className="prose dark:prose-invert prose-indigo max-w-none prose-sm sm:prose-base dark:prose-p:text-slate-350 dark:prose-headings:text-white dark:prose-strong:text-slate-200 dark:prose-code:text-indigo-300 dark:prose-blockquote:border-l-indigo-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-8 sm:p-12 rounded-3xl shadow-sm">
                <Markdown>{activeArticle.content}</Markdown>
              </div>
            </article>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
