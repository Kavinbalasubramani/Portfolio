import React from 'react';
import { Home, UserRound, Code2, Briefcase, FolderKanban, GraduationCap, Layers3, Mail, Download, Moon, Sun } from 'lucide-react';

const links = [
  { label: 'Home', href: '#home', icon: Home },
  { label: 'About', href: '#about', icon: UserRound },
  { label: 'Skills', href: '#skills', icon: Code2 },
  { label: 'Experience', href: '#experience', icon: Briefcase },
  { label: 'Projects', href: '#projects', icon: FolderKanban },
  { label: 'Education', href: '#education', icon: GraduationCap },
  { label: 'Services', href: '#services', icon: Layers3 },
  { label: 'Contact', href: '#contact', icon: Mail },
];

const PremiumSidebar = ({ theme, toggleTheme, resumeHref }) => {
  return (
    <>
      <aside className="premium-sidebar hidden lg:flex">
        <a href="#home" className="sidebar-mark" aria-label="Kavin B home">KB</a>
        <nav className="sidebar-nav" aria-label="Primary navigation">
          {links.map(({ label, href, icon: Icon }) => (
            <a key={label} href={href} className="sidebar-link" aria-label={label}>
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </a>
          ))}
        </nav>
        {resumeHref && (
          <a href={resumeHref} target="_blank" rel="noreferrer" className="sidebar-icon" aria-label="Download resume">
            <Download size={18} />
          </a>
        )}
        <button type="button" onClick={toggleTheme} className="sidebar-icon" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </aside>

      <div className="mobile-premium-nav lg:hidden">
        <a href="#home" className="sidebar-mark">KB</a>
        <button type="button" onClick={toggleTheme} className="mobile-theme-button" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </>
  );
};

export default PremiumSidebar;
