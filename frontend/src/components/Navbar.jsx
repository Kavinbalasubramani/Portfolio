import React, { useState, useEffect } from 'react';
import { Menu, X, FileDown, Sun, Moon, Mail } from 'lucide-react';
import { Github, Linkedin } from './BrandIcons';
import { usePortfolioProfile } from '../context/PortfolioProfileContext';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5000';

const resolveUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
};

const Navbar = () => {
  const profile = usePortfolioProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem('portfolio-theme') || document.documentElement.dataset.theme || 'dark'
  );
  const isLight = theme === 'light';

  /* ── Dynamic values from profile ── */
  const logoText = profile?.brand_logo?.trim() || 'kavin';
  const resumeHref = resolveUrl(profile?.resume_url) || null;
  const githubUrl = profile?.github_url || null;
  const linkedinUrl = profile?.linkedin_url || null;
  const emailAddr = profile?.email || null;

  const toggleTheme = () => {
    const next = isLight ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('portfolio-theme', next);
    setTheme(next);
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const updateActiveSection = () => {
      const activationLine = (document.querySelector('header')?.getBoundingClientRect().height || 0) + 36;
      const candidates = navLinks
        .map((link) => ({ id: link.href.slice(1), element: document.getElementById(link.href.slice(1)) }))
        .filter(({ element }) => element);
      const active = candidates.findLast(({ element }) => element.getBoundingClientRect().top <= activationLine);
      if (active) setActiveSection(active.id);
      else setActiveSection('home');
    };
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      updateActiveSection();
    };
    handleScroll();
    window.addEventListener('hashchange', updateActiveSection);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('hashchange', updateActiveSection);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const updateTheme = () => setTheme(document.documentElement.dataset.theme || 'dark');
    window.addEventListener('storage', updateTheme);
    updateTheme();
    return () => window.removeEventListener('storage', updateTheme);
  }, []);

  /* Close mobile drawer on resize to desktop */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* Prevent body scroll when mobile drawer open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const scrollTo = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.getElementById(href.slice(1));
    if (target) {
      window.history.pushState(null, '', href);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(href.slice(1));
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? `${
              isLight
                ? 'bg-white/95 border-slate-200/90 shadow-sm'
                : 'bg-[#0A0F1D]/90 border-slate-800/80 shadow-lg shadow-black/20'
            } backdrop-blur-md border-b py-2.5`
          : `${isLight ? 'bg-white/70' : 'bg-transparent'} backdrop-blur-sm py-3.5`
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between gap-4">
          {/* ── Logo ── */}
          <a
            href="#home"
            onClick={(e) => scrollTo(e, '#home')}
            className="flex-shrink-0 flex items-center group"
            aria-label={`${profile?.name || 'Portfolio'} home`}
          >
            <span className={`font-heading font-extrabold text-xl sm:text-2xl leading-none tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {logoText.replace(/\.+$/, '')}
            </span>
          </a>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-center gap-0.5 p-1 rounded-full bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollTo(e, link.href)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? isLight
                          ? 'text-violet-700 bg-white shadow-sm'
                          : 'text-white bg-violet-600/90 shadow-sm shadow-violet-500/30'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>
          </nav>

          {/* ── Desktop Right: Dynamic CV Link + Theme Toggle ── */}
          <div className="hidden md:flex flex-shrink-0 items-center gap-2.5">
            {resumeHref ? (
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-xl shadow-sm shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <FileDown className="w-4 h-4 mr-1.5" />
                Download CV
              </a>
            ) : (
              <span className="inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-500 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl cursor-not-allowed opacity-50 select-none">
                <FileDown className="w-4 h-4 mr-1.5" />
                Download CV
              </span>
            )}

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
              className={`p-2.5 rounded-xl border transition-all ${
                isLight
                  ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm'
                  : 'border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white shadow-sm'
              }`}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>

          {/* ── Mobile Right: Theme + Hamburger ── */}
          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
              className={`p-2 rounded-lg border ${
                isLight
                  ? 'border-slate-200 text-slate-700 bg-white'
                  : 'border-slate-800 text-slate-200 bg-slate-900/80'
              }`}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg border transition-colors ${
                isLight
                  ? 'border-slate-200 text-slate-700 bg-white hover:bg-slate-100'
                  : 'border-slate-800 text-slate-200 bg-slate-900/80 hover:bg-slate-800'
              }`}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {isOpen && (
        <div
          className={`md:hidden border-t animate-fadeIn ${
            isLight ? 'bg-white/98 border-slate-200' : 'bg-[#0A0F1D]/98 border-slate-800'
          } backdrop-blur-xl`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className={`flex items-center px-4 py-2.5 rounded-xl text-base font-semibold transition-all ${
                    isActive
                      ? isLight
                        ? 'text-violet-700 bg-violet-50 border border-violet-200/60'
                        : 'text-white bg-violet-600/25 border border-violet-500/30'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                  )}
                </a>
              );
            })}

            {/* Divider */}
            <div className={`my-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`} />

            {/* Dynamic CV download */}
            {resumeHref ? (
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl shadow-sm shadow-sky-500/25 transition-all active:scale-[0.98]"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Download Resume / CV
              </a>
            ) : (
              <div className={`text-center text-sm py-2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                Resume not uploaded yet
              </div>
            )}

            {/* Dynamic Social Icons Row */}
            {(githubUrl || linkedinUrl || emailAddr) && (
              <div className="flex items-center justify-center gap-3 pt-2 pb-1">
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${
                      isLight
                        ? 'border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${
                      isLight
                        ? 'border-slate-200 bg-slate-100 text-sky-600 hover:text-sky-700'
                        : 'border-slate-800 bg-slate-900/60 text-sky-400 hover:text-sky-300'
                    }`}
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {emailAddr && (
                  <a
                    href={`mailto:${emailAddr}`}
                    aria-label="Email"
                    className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${
                      isLight
                        ? 'border-slate-200 bg-slate-100 text-emerald-600 hover:text-emerald-700'
                        : 'border-slate-800 bg-slate-900/60 text-emerald-400 hover:text-emerald-300'
                    }`}
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
