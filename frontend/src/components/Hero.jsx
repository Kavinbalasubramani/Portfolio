import React, { useState, useEffect } from 'react';
import { ArrowRight, FileDown, Mail, Settings, Cloud, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import api from '../services/api';
import { Github, Linkedin, getBrandMeta } from './BrandIcons';
import kavinCutout from '../assets/kavin-cutout.png';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5000';

const resolveAvatarUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
};

const Hero = ({ profile: initialProfile, skills: initialSkills }) => {
  const [profile, setProfile] = useState(initialProfile || null);
  const [skills, setSkills] = useState(initialSkills ? initialSkills.slice(0, 6) : []);
  const [loading, setLoading] = useState(!initialProfile);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const reduceMotion = useReducedMotion();
  const [headline, setHeadline] = useState(initialProfile?.title || 'Full Stack Developer');
  const [avatarSource, setAvatarSource] = useState(null);
  const [imageScale, setImageScale] = useState(1);

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
      setLoading(false);
    }
  }, [initialProfile]);

  useEffect(() => {
    setAvatarFailed(false);
    setImageScale(1);
    setAvatarSource(resolveAvatarUrl(profile?.avatar_url) || kavinCutout);
  }, [profile?.avatar_url]);

  // Auto-detect and trim any transparent padding on dynamic images so dynamic matches static 1:1
  const handleImageLoad = (e) => {
    const img = e.currentTarget;
    if (!img) return;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) return;

    // 1. Instant ratio check: If it's a wide canvas (w / h > 1.35), scale it up immediately so subject matches 1:1
    const ratio = w / h;
    if (ratio > 1.35) {
      const calculatedScale = Math.min(2.1, Math.max(1.35, ratio));
      setImageScale(calculatedScale);
    } else {
      setImageScale(1);
    }

    if (img.dataset.trimmed === 'true') return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      let minX = w, minY = h, maxX = 0, maxY = 0;
      let hasAlpha = false;
      const step = Math.max(1, Math.floor(Math.min(w, h) / 300));
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const a = data[(y * w + x) * 4 + 3];
          if (a > 20) {
            hasAlpha = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      const padLeftRatio = minX / w;
      const padRightRatio = (w - maxX) / w;
      const padTopRatio = minY / h;
      const padBottomRatio = (h - maxY) / h;
      if (hasAlpha && (padLeftRatio > 0.04 || padRightRatio > 0.04 || padTopRatio > 0.04 || padBottomRatio > 0.04)) {
        const padX = Math.floor(w * 0.01);
        const padY = Math.floor(h * 0.01);
        const cropX = Math.max(0, minX - padX);
        const cropY = Math.max(0, minY - padY);
        const cropW = Math.min(w - cropX, (maxX - minX) + padX * 2);
        const cropH = Math.min(h - cropY, (maxY - minY) + padY * 2);
        const trimmedCanvas = document.createElement('canvas');
        trimmedCanvas.width = cropW;
        trimmedCanvas.height = cropH;
        const tCtx = trimmedCanvas.getContext('2d');
        tCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        const trimmedDataUrl = trimmedCanvas.toDataURL('image/png');
        img.dataset.trimmed = 'true';
        setImageScale(1);
        setAvatarSource(trimmedDataUrl);
      }
    } catch {
      // Cross-origin fallback already covered by setImageScale
    }
  };

  useEffect(() => {
    if (initialSkills && initialSkills.length > 0) {
      setSkills(initialSkills.slice(0, 6));
    }
  }, [initialSkills]);

  // Smooth typing animation for roles without word wrapping
  useEffect(() => {
    const configuredRoles = String(profile?.animated_roles || '')
      .split(/[\r\n,]+/)
      .map((role) => role.trim())
      .filter(Boolean);
    const fallbackRoles = configuredRoles.length ? configuredRoles : [];
    const roles = Array.from(new Set([
      profile?.title?.trim(),
      ...fallbackRoles,
    ].filter(Boolean)));
    if (!roles.length) roles.push('Full Stack Developer');
    setHeadline(roles[0]);
    if (reduceMotion || roles.length < 2) return undefined;

    let roleIndex = 0;
    let characterIndex = roles[0].length;
    let deleting = true;
    let timeout;

    const tick = () => {
      characterIndex += deleting ? -1 : 1;
      setHeadline(roles[roleIndex].slice(0, Math.max(0, characterIndex)));
      let delay = deleting ? 45 : 80;

      if (characterIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 300;
      } else if (characterIndex >= roles[roleIndex].length) {
        deleting = true;
        delay = 1800;
      }

      timeout = window.setTimeout(tick, delay);
    };

    timeout = window.setTimeout(tick, 1400);
    return () => window.clearTimeout(timeout);
  }, [reduceMotion, profile?.title, profile?.animated_roles]);

  // Fallback fetch if parent didn't supply props
  useEffect(() => {
    if (initialProfile && initialSkills?.length) return;

    Promise.all([
      api.get('/profile').catch(() => null),
      api.get('/skills').catch(() => ({ data: [] }))
    ]).then(([profileRes, skillsRes]) => {
      const unwrap = (body) => body?.data?.data ?? body?.data ?? body;
      const profileData = unwrap(profileRes);
      const skillsData = unwrap(skillsRes);
      if (profileData && typeof profileData === 'object') setProfile(profileData);
      if (Array.isArray(skillsData)) setSkills(skillsData.slice(0, 6));
    }).finally(() => setLoading(false));
  }, [initialProfile, initialSkills]);

  // Resolve the resume download URL
  const resumeHref = profile?.resume_url
    ? profile.resume_url.startsWith('http')
      ? profile.resume_url
      : `${API_BASE}${profile.resume_url.startsWith('/') ? '' : '/'}${profile.resume_url}`
    : `${API_BASE}/api/cv`;

  const avatarSrc = avatarSource || kavinCutout;
  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase()
    : 'KB';

  return (
    <section id="home" className="relative min-h-[80vh] flex items-center overflow-hidden pt-36 pb-14 sm:pt-40 lg:pt-12 lg:pb-16 px-4 sm:px-6 lg:px-8">
      {/* Ambient gradient backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-purple-600/15 via-sky-500/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">

        {/* ── Left Column: Bio & CTAs (Equal 6-col width matching About layout) ── */}
        <motion.div
          className="lg:col-span-6 space-y-5 text-center lg:text-left flex flex-col justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >

          {/* Status pill */}
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold tracking-wide">
                {loading
                  ? 'Loading…'
                  : (profile?.hero_tagline || 'Available for new opportunities')}
              </span>
            </div>
          </div>

          {/* Heading with robust vertical line box (Zero letter clipping & zero unwanted wrap) */}
          {loading ? (
            <div className="space-y-2.5">
              <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-800 animate-pulse mx-auto lg:mx-0" />
              <div className="h-12 w-64 rounded bg-slate-200 dark:bg-slate-800 animate-pulse mx-auto lg:mx-0" />
            </div>
          ) : (
            <div className="space-y-1.5">
              <h2 className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-400">
                Hi, I'm{' '}
                <span className="text-slate-900 dark:text-white font-bold">
                  {profile?.name || 'Kavin B'}
                </span>
              </h2>

              {/* Title with single-line fit, unclipped ascenders/descenders, and smooth blinking cursor */}
              <div className="h-[50px] sm:h-[58px] md:h-[66px] lg:h-[70px] w-full min-w-0 flex items-center justify-center lg:justify-start">
                <h1 className="hero-title max-w-full font-heading font-extrabold tracking-tight leading-none whitespace-nowrap" aria-live="polite">
                  {(() => {
                    const t = headline || profile?.title || 'Full Stack Developer';
                    const lastSpace = t.lastIndexOf(' ');
                    if (lastSpace === -1) {
                      return (
                        <>
                          <span className="hero-gradient">{t}</span>
                          <span className="inline-block w-1 h-[0.75em] ml-1.5 bg-sky-500 animate-pulse align-middle rounded-sm" />
                        </>
                      );
                    }
                    return (
                      <>
                        <span className="text-slate-900 dark:text-white">
                          {t.slice(0, lastSpace)}{' '}
                        </span>
                        <span className="hero-gradient">
                          {t.slice(lastSpace + 1)}
                        </span>
                        <span className="inline-block w-1 h-[0.75em] ml-1.5 bg-sky-500 animate-pulse align-middle rounded-sm" />
                      </>
                    );
                  })()}
                </h1>
              </div>
            </div>
          )}

          {/* Description / Bio */}
          {loading ? (
            <div className="space-y-2 max-w-xl mx-auto lg:mx-0">
              <div className="h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
          ) : (
            <p className="hero-bio text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed mx-auto lg:mx-0 text-slate-700 dark:text-slate-300 font-normal">
              {profile?.bio ||
                'Passionate Full Stack Developer specialising in building scalable web applications with modern technologies including React.js, Node.js, Laravel and MySQL.'}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-wrap gap-3 justify-center lg:justify-start">
            <a
              href="#projects"
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              View my work
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>

            {resumeHref ? (
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              >
                <FileDown className="w-4 h-4 mr-2 text-sky-500 dark:text-sky-400" />
                Download CV
              </a>
            ) : null}

            <a
              href="#contact"
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-sm text-slate-800 dark:text-slate-300 bg-slate-100/90 dark:bg-transparent hover:bg-slate-200/90 dark:hover:bg-slate-800/80 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 transition-all shadow-sm"
            >
              <Mail className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
              Hire me
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2.5 justify-center lg:justify-start pt-1" aria-label="Social links">
            {profile?.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-violet-400 dark:hover:border-violet-500/40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-105 shadow-sm"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile?.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-2.5 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-400 dark:hover:border-sky-500/40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-105 shadow-sm"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            <a
              href={`mailto:${profile?.email || 'kavinkbs2202@gmail.com'}`}
              aria-label="Send Email"
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-2.5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-400 dark:hover:border-emerald-500/40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-105 shadow-sm"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* ── Right Column: Cosmic Portrait with Orbit Rings & developer.js Code Card ── */}
        <motion.div
          className="lg:col-span-6 relative flex items-center justify-center lg:justify-end w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
        >
          {/* Main Visual Stage (Transparent background, no box, no circle, seamless with hero) */}
          <div className="relative w-full max-w-[560px] sm:max-w-[620px] h-[520px] sm:h-[580px] lg:h-[650px] flex items-center justify-center select-none">

            {/* Ambient Radial Backdrop Glow */}
            <div
              className="absolute inset-0 pointer-events-none rounded-full blur-3xl opacity-60 dark:opacity-70 -z-10"
              style={{
                background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(192, 132, 252, 0.28) 0%, rgba(103, 232, 249, 0.22) 45%, transparent 75%)',
              }}
              aria-hidden="true"
            />

            {/* ── Behind Person: 4 Elliptical Orbit Rings (Tilted diagonally) ── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0" aria-hidden="true">
              {/* Ring 1: Primary Cyan Orbit Ring (tilted ~ -25deg) */}
              <div
                className="hero-orbit-ellipse hero-orbit-cyan"
                style={{
                  width: 'min(92%, 520px)',
                  height: 'min(78%, 430px)',
                  transform: 'rotate(-25deg)',
                }}
              />

              {/* Ring 2: Primary Purple Orbit Ring (tilted ~ +35deg) */}
              <div
                className="hero-orbit-ellipse hero-orbit-purple"
                style={{
                  width: 'min(96%, 540px)',
                  height: 'min(72%, 400px)',
                  transform: 'rotate(35deg)',
                }}
              />

              {/* Ring 3: Soft Lavender / Cyan Accent Ring (tilted ~ -10deg) */}
              <div
                className="hero-orbit-ellipse hero-orbit-accent"
                style={{
                  width: 'min(86%, 470px)',
                  height: 'min(64%, 350px)',
                  transform: 'rotate(-10deg)',
                }}
              />

              {/* Ring 4: Outer Dashed Orbit Ring (tilted ~ +18deg) */}
              <div
                className="hero-orbit-ellipse hero-orbit-dashed"
                style={{
                  width: 'min(104%, 580px)',
                  height: 'min(86%, 480px)',
                  transform: 'rotate(18deg)',
                }}
              />

              {/* Base floor grid glow */}
              <div className="hero-floor-grid absolute bottom-2 w-3/4 h-16 pointer-events-none opacity-40 dark:opacity-60" />
            </div>

            {/* ── Floating Subtle Decorations: Orbs, Sparkle Stars, Gear & Cloud Icons ── */}
            <div className="absolute inset-0 pointer-events-none z-[5]" aria-hidden="true">
              {/* Sparkle 4-point stars */}
              <span className="hero-sparkle absolute left-[12%] top-[34%]" style={{ animationDelay: '0s' }} />
              <span className="hero-sparkle absolute left-[22%] top-[66%]" style={{ animationDelay: '1.2s' }} />
              <span className="hero-sparkle absolute right-[18%] top-[16%]" style={{ animationDelay: '2.1s' }} />
              <span className="hero-sparkle absolute right-[32%] bottom-[12%]" style={{ animationDelay: '0.8s' }} />
              <span className="hero-sparkle absolute left-[48%] top-[10%]" style={{ animationDelay: '1.7s' }} />

              {/* Small Glowing Pastel Orbs & Bubbles */}
              <div className="hero-floating-orb hero-orb-cyan absolute right-[10%] top-[22%]" style={{ animationDelay: '0.5s' }} />
              <div className="hero-floating-orb hero-orb-purple absolute left-[8%] top-[25%]" style={{ animationDelay: '1.8s' }} />
              <div className="hero-floating-orb hero-orb-bubble absolute right-[12%] bottom-[20%]" style={{ animationDelay: '2.5s' }} />
              <div className="hero-floating-orb hero-orb-bubble absolute left-[14%] bottom-[24%]" style={{ animationDelay: '1.1s' }} />

              {/* Small Floating Gear Icon on the right */}
              <motion.div
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-10 z-[6] w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border border-sky-300/50 dark:border-cyan-500/30 shadow-lg shadow-sky-500/10 pointer-events-auto"
                animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, 20, 0] }}
                transition={reduceMotion ? undefined : { repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                title="Engineering"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500 dark:text-cyan-400" />
              </motion.div>

              {/* Small Floating Cloud Icon on right lower-mid */}
              <motion.div
                className="absolute right-6 sm:right-12 bottom-24 sm:bottom-28 z-[6] px-2.5 py-1.5 rounded-full flex items-center gap-1 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border border-purple-300/50 dark:border-purple-500/30 shadow-lg shadow-purple-500/10 pointer-events-auto"
                animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
                transition={reduceMotion ? undefined : { repeat: Infinity, duration: 5.5, ease: 'easeInOut', delay: 0.8 }}
                title="Cloud Architecture"
              >
                <Cloud className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500 dark:text-purple-400" />
              </motion.div>
            </div>

            {/* ── Center: Real Person Cutout Photo (Transparent BG, NO Box, NO Circle, NO Frame) ── */}
            <motion.div
              className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none"
              animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
              transition={reduceMotion ? undefined : { repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            >
              {avatarSrc && !avatarFailed ? (
                <div className="relative w-full h-full flex items-center justify-center overflow-visible">
                  <img
                    src={avatarSrc}
                    crossOrigin="anonymous"
                    alt={profile?.name || 'Kavin B'}
                    onLoad={handleImageLoad}
                    onError={() => {
                      if (avatarSource !== kavinCutout) setAvatarSource(kavinCutout);
                      else setAvatarFailed(true);
                    }}
                    className="w-auto h-[480px] sm:h-[550px] lg:h-[620px] max-w-none object-contain object-bottom drop-shadow-2xl transition-all duration-500 hover:scale-[1.02]"
                    style={{
                      transform: imageScale !== 1 ? `scale(${imageScale})` : undefined,
                      transformOrigin: 'bottom center',
                      WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 86%, rgba(0,0,0,0.85) 94%, transparent 100%)',
                      maskImage: 'linear-gradient(to bottom, #000 0%, #000 86%, rgba(0,0,0,0.85) 94%, transparent 100%)',
                    }}
                  />
                </div>
              ) : (
                /* Fallback glowing initials */
                <div
                  className="w-48 h-48 sm:w-56 sm:h-56 rounded-full flex items-center justify-center shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                  }}
                >
                  <span className="font-heading font-extrabold text-white text-5xl sm:text-6xl tracking-tight">
                    {initials}
                  </span>
                </div>
              )}
            </motion.div>

            {/* ── Bottom-Right: Glassmorphism Code Card "developer.js" (Overlapping person) ── */}
            <motion.div
              className="absolute bottom-2 sm:bottom-4 right-0 sm:right-2 lg:right-0 z-20"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
            >
              <motion.div
                className="w-[215px] sm:w-[245px] md:w-[260px] rounded-2xl p-3 sm:p-3.5 font-mono text-[11px] sm:text-xs shadow-2xl backdrop-blur-xl transition-all duration-300 bg-white/85 dark:bg-[#090D1A]/95 border border-white/70 dark:border-slate-700/80 shadow-purple-500/10 dark:shadow-black/70"
                animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                transition={reduceMotion ? undefined : { repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              >
                {/* Window header */}
                <div className="mb-2 sm:mb-2.5 flex items-center gap-1.5 border-b border-slate-200/80 dark:border-slate-800/80 pb-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                  <span className="ml-1 text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    developer.js
                  </span>
                </div>

                {/* Code body */}
                <div className="space-y-1 leading-relaxed text-[10.5px] sm:text-[11.5px]">
                  <div>
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">const</span>{' '}
                    <span className="text-indigo-950 dark:text-sky-300 font-medium">developer</span>{' '}
                    <span className="text-slate-600 dark:text-slate-400">= {'{'}</span>
                  </div>
                  <div className="pl-3">
                    <span className="text-slate-700 dark:text-sky-300">role</span>:{' '}
                    <span className="text-emerald-700 dark:text-amber-300">'Full Stack Developer'</span>,
                  </div>
                  <div className="pl-3">
                    <span className="text-slate-700 dark:text-sky-300">stack</span>:{' '}
                    <span className="text-slate-600 dark:text-slate-400">[</span>
                    <span className="text-sky-700 dark:text-emerald-400">'Laravel'</span>,{' '}
                    <span className="text-sky-700 dark:text-emerald-400">'React'</span>,{' '}
                    <span className="text-sky-700 dark:text-emerald-400">'Node.js'</span>,{' '}
                    <span className="text-sky-700 dark:text-emerald-400">'MySQL'</span>
                    <span className="text-slate-600 dark:text-slate-400">]</span>,
                  </div>
                  <div className="pl-3">
                    <span className="text-slate-700 dark:text-sky-300">status</span>:{' '}
                    <span className="text-emerald-700 dark:text-emerald-400">'ready to ship'</span>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">{'};'}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
