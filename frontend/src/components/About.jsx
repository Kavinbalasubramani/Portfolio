import React, { useState } from 'react';
import { CheckCircle2, GraduationCap, User, MapPin, Briefcase, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

/* ─── Animation Variants ──────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -28 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const fadeRight = {
  hidden: { opacity: 0, x: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const listItem = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

/* ─── Static fallback achievements (overridden by admin panel later) ── */
const DEFAULT_ACHIEVEMENTS = [
  'Integrated Stripe and Razorpay payments with webhook handling.',
  'Automated Facebook Lead Ads sync directly into an internal CRM.',
  'Built JWT authentication with role-based access control.',
  'Designed normalized MySQL schemas and tuned slow queries.',
  'Delivered documented REST APIs used by React and mobile clients.',
];

/* ─── Static fallback journey ────────────────────────────────────── */
const DEFAULT_TIMELINE = [
  {
    year: '2021',
    title: 'Started B.E. in Computer Science',
    desc: 'Built a base in software engineering, databases and web fundamentals.',
    color: 'from-violet-500 to-purple-600',
    dot: 'bg-violet-500',
    ring: 'ring-violet-500/30',
    text: 'text-violet-400',
  },
  {
    year: '2024',
    title: 'First full-time role',
    desc: 'Joined Tech Solutions Inc. building Laravel and MERN products.',
    color: 'from-sky-500 to-blue-600',
    dot: 'bg-sky-400',
    ring: 'ring-sky-500/30',
    text: 'text-sky-400',
  },
  {
    year: 'Today',
    title: 'Shipping full-stack products',
    desc: 'E-commerce, dashboards and secure REST APIs, end to end.',
    color: 'from-emerald-500 to-teal-500',
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-500/30',
    text: 'text-emerald-400',
  },
];

/* ═══════════════════════════════════════════════════════════════════ */
const About = ({ profile, education }) => {
  const edu = education?.[0] || {
    degree: 'B.E. Computer Science and Engineering',
    institution: 'M. Kumarasamy College of Engineering, Karur',
    start_year: 2021,
    end_year: 2025,
    cgpa: '8.152',
  };

  /* Dynamic values from backend profile */
  const displayName  = profile?.name  || 'Kavin B';
  const displayTitle = profile?.title || 'Full Stack Developer';
  const displayBio   = profile?.bio   ||
    "I'm a Full Stack Developer who builds commercial e-commerce platforms, workflow tools and secure APIs with Laravel, React and Node.js. I like clean architecture, reliable data models and interfaces people enjoy using.";
  const displayLocation = profile?.location || 'Tamil Nadu, India';

  /* Bold-highlight the bio: wrap "Full Stack Developer", "Laravel, React and Node.js" */
  const bioParts = displayBio.split(/(\bFull Stack Developer\b|Laravel,\s*React\s*and\s*Node\.js)/gi);

  return (
    <section
      id="about"
      className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50/60 dark:bg-[#070B16] border-t border-slate-200/80 dark:border-slate-800/50 overflow-hidden transition-colors duration-300"
    >
      {/* Background decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-600/5 dark:bg-violet-600/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-500/5 dark:bg-sky-500/8 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ─── Section Header ─────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-14 lg:mb-16 space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/20 dark:border-sky-500/30 text-sky-700 dark:text-sky-400 text-xs font-semibold uppercase tracking-widest">
            <User className="w-3.5 h-3.5" />
            About Me
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight max-w-5xl mx-auto">
            Passionate About Crafting{' '}
            <span className="text-sky-500 dark:text-sky-400">High-Performance</span>{' '}
            Solutions
          </h2>

          {/* Subtitle */}
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto text-center leading-relaxed">
            A developer who bridges solid server-side architecture with intuitive modern user interfaces.
          </p>
        </motion.div>

        {/* ─── Main 2-Column Grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* ══ Left Column ════════════════════════════════════════════ */}
          <motion.div
            className="lg:col-span-6 space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeLeft}
            custom={0.1}
          >

            {/* Bio Paragraph – dynamic with bold highlights */}
            <div className="space-y-3">
              <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                {bioParts.map((part, i) => {
                  const isBold = /Full Stack Developer|Laravel,?\s*React\s*and\s*Node\.js/gi.test(part);
                  return isBold
                    ? <strong key={i} className="font-bold text-slate-900 dark:text-white">{part}</strong>
                    : <span key={i}>{part}</span>;
                })}
              </p>
            </div>

            {/* ── Developer Journey Timeline ──────────────────────────── */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-violet-500" />
                Developer journey
              </h3>

              <div className="relative pl-5 space-y-0">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-4 w-px bg-gradient-to-b from-violet-500/50 via-sky-500/40 to-emerald-500/30" />

                <motion.ol
                  className="space-y-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  {DEFAULT_TIMELINE.map((item, index) => (
                    <motion.li key={index} className="relative group" variants={listItem}>
                      {/* Dot */}
                      <span
                        className={`absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full ${item.dot} ring-4 ring-white dark:ring-[#070B16] ${item.ring} shadow-sm transition-transform duration-300 group-hover:scale-125`}
                      />

                      <div className="bg-white dark:bg-[#0C1222] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group-hover:-translate-y-0.5">
                        <span className={`text-xs font-bold tracking-widest font-mono ${item.text}`}>
                          {item.year}
                        </span>
                        <h4 className="font-heading font-bold text-slate-900 dark:text-white text-sm sm:text-base mt-0.5">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ol>
              </div>
            </div>

            {/* ── Education & Career Card ─────────────────────────────── */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-violet-500" />
                Education &amp; career
              </h3>

              <motion.div
                className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0C1222] border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                {/* Gradient corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-bl-3xl" />

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/25 dark:border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base leading-snug">
                      {edu.degree}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {edu.institution}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {edu.start_year || 2021}–{edu.end_year || 2025}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full">
                        CGPA {edu.cgpa || '8.152'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </motion.div>

          {/* ══ Right Column – Professional Achievements ══════════════ */}
          <motion.div
            className="lg:col-span-6 space-y-6 lg:pt-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeRight}
            custom={0.15}
          >
            {/* Section sub-heading */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
                  Professional achievements
                </h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 pl-7">
                Highlights from real production work
              </p>
            </div>

            {/* 2-Column Achievement Checklist */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {DEFAULT_ACHIEVEMENTS.map((item, index) => (
                <motion.div
                  key={index}
                  variants={listItem}
                  className="group flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-[#0C1222] border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-emerald-300/60 dark:hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {/* Animated check badge */}
                  <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200">
                    {item}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Stats Row – dynamic from profile */}
            <motion.div
              className="grid grid-cols-3 gap-3 pt-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  value: `${profile?.years_of_experience ?? 2}+`,
                  label: 'Years exp.',
                  color: 'from-violet-500 to-purple-600',
                  bg: 'bg-violet-50 dark:bg-violet-500/10',
                  border: 'border-violet-200 dark:border-violet-500/20',
                  text: 'text-violet-700 dark:text-violet-400',
                },
                {
                  value: `${profile?.projects_completed ?? 15}+`,
                  label: 'Projects',
                  color: 'from-sky-500 to-blue-600',
                  bg: 'bg-sky-50 dark:bg-sky-500/10',
                  border: 'border-sky-200 dark:border-sky-500/20',
                  text: 'text-sky-700 dark:text-sky-400',
                },
                {
                  value: edu.cgpa || '8.15',
                  label: 'CGPA',
                  color: 'from-emerald-500 to-teal-500',
                  bg: 'bg-emerald-50 dark:bg-emerald-500/10',
                  border: 'border-emerald-200 dark:border-emerald-500/20',
                  text: 'text-emerald-700 dark:text-emerald-400',
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={listItem}
                  className={`${stat.bg} ${stat.border} border rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group`}
                >
                  <span className={`block text-2xl sm:text-3xl font-heading font-extrabold ${stat.text} group-hover:scale-110 transition-transform inline-block`}>
                    {stat.value}
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
