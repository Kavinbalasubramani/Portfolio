import React, { useState } from 'react';
import { Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getBrandMeta } from './BrandIcons';

const Skills = ({ skills: externalSkills }) => {
  const [activeTab, setActiveTab] = useState('All');

  // Fallback initial skills matching mockup media_1795255592693.png
  const defaultSkills = [
    // Frontend
    { name: 'React.js', category: 'Frontend', level: 'Confident' },
    { name: 'JavaScript', category: 'Frontend', level: 'Daily Use' },
    { name: 'Tailwind CSS', category: 'Frontend', level: 'Confident' },

    // Backend
    { name: 'Node.js', category: 'Backend', level: 'Confident' },
    { name: 'Express.js', category: 'Backend', level: 'Confident' },
    { name: 'PHP', category: 'Backend', level: 'Confident' },
    { name: 'Laravel', category: 'Backend', level: 'Confident' },

    // Database
    { name: 'MySQL', category: 'Database', level: 'Confident' },
    { name: 'MongoDB', category: 'Database', level: 'Working Knowledge' },

    // Tools
    { name: 'Git', category: 'Tools', level: 'Confident' },
    { name: 'REST APIs', category: 'Tools', level: 'Daily Use' },
  ];

  const skillList = externalSkills && externalSkills.length > 0 ? externalSkills : defaultSkills;
  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools'];

  const getLevelLabel = (level) => {
    if (typeof level === 'string' && level.trim()) return level;
    const num = Number(level) || 2;
    if (num >= 90 || num === 3) return 'Daily Use';
    if (num >= 70 || num === 2) return 'Confident';
    return 'Working Knowledge';
  };

  const filteredSkills = activeTab === 'All'
    ? skillList
    : skillList.filter((s) => s.category?.toLowerCase() === activeTab.toLowerCase());

  return (
    <section id="skills" className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/40 dark:bg-[#0A0F1D] border-t border-slate-200/80 dark:border-slate-800/80 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Code2 className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Skills &amp; <span className="text-sky-500 dark:text-sky-400">Tech Stack</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-4xl mx-auto text-center leading-relaxed">
            A comprehensive overview of programming languages, frameworks, databases, and tools I use to deliver end-to-end software.
          </p>
        </div>

        {/* Category Filter Pills (Exact Match to Mockup media_1795255592693.png) */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {categories.map((cat) => {
            const count = cat === 'All'
              ? skillList.length
              : skillList.filter((s) => s.category?.toLowerCase() === cat.toLowerCase()).length;
            const isActive = activeTab === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105'
                    : 'bg-white dark:bg-[#0C1222] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800 shadow-sm'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Skills Cards Grid - Clean, Balanced Layout WITHOUT Range Progress Bars */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {filteredSkills.map((skill, index) => {
            const { Icon: BrandIcon, color, badgeBg } = getBrandMeta(skill.name);
            const levelLabel = getLevelLabel(skill.level);

            return (
              <motion.div
                layout
                key={skill.id || skill.name || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="group rounded-2xl bg-white dark:bg-[#0C1222] border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex items-center gap-4 hover:-translate-y-0.5"
              >
                {/* Brand Icon Box */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${badgeBg} ${color} flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                  <BrandIcon className="w-6 h-6" />
                </div>

                {/* Skill Name & Level Label */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">
                    {skill.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 capitalize truncate">
                    {skill.category} · {levelLabel}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default Skills;
