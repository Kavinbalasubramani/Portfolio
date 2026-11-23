import React, { useState, useEffect, useRef } from 'react';
import { Save, Loader2, CheckCircle2, UploadCloud, FileText, X, Trash2, Eye, User, Briefcase, MapPin, Mail } from 'lucide-react';
import api from '../services/api';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5000';

const resolveAvatarUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Client-side auto-trimming for transparent cutout PNGs
const trimTransparentPadding = (file) => {
  return new Promise((resolve) => {
    if (!file || (!file.type.includes('png') && !file.type.includes('webp'))) {
      return resolve(file);
    }
    const img = new Image();
    const objUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objUrl);
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (!w || !h || w < 20 || h < 20) return resolve(file);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return resolve(file);
      ctx.drawImage(img, 0, 0);

      let imgData;
      try {
        imgData = ctx.getImageData(0, 0, w, h);
      } catch {
        return resolve(file);
      }

      const data = imgData.data;
      let minX = w, minY = h, maxX = 0, maxY = 0, hasAlpha = false;
      const step = Math.max(1, Math.floor(Math.min(w, h) / 400));

      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (data[(y * w + x) * 4 + 3] > 20) {
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

        trimmedCanvas.toBlob((blob) => {
          if (!blob) return resolve(file);
          const trimmedFile = new File([blob], file.name.replace(/\.[^.]+$/, '') + '-trimmed.png', { type: 'image/png' });
          resolve(trimmedFile);
        }, 'image/png');
      } else {
        resolve(file);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      resolve(file);
    };
    img.src = objUrl;
  });
};

const AdminProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    brand_logo: '',
    title: '',
    animated_roles: 'Full Stack Developer\nLaravel Developer\nReact Developer\nBackend Developer',
    hero_tagline: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    resume_url: '',
    avatar_url: '',
    github_url: '',
    linkedin_url: '',
    years_of_experience: 2,
    projects_completed: 15,
    clients_served: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Resume upload state
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeSuccess, setResumeSuccess] = useState(false);
  const [resumeError, setResumeError] = useState('');
  const resumeInputRef = useRef(null);

  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarImageFailed, setAvatarImageFailed] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const avatarInputRef = useRef(null);
  const avatarPreviewUrlRef = useRef(null);

  // ── Fetch existing profile ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        const data = res?.data || res;
        if (data && typeof data === 'object') {
          setFormData((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.log('Profile endpoint not seeded yet; using defaults:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ── Save profile fields ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setSaveError('');
    try {
      const res = await api.put('/profile', formData);
      if (res?.success === false) throw new Error(res.message || 'The server could not save the profile.');
      const savedProfile = res?.data?.data || res?.data || res;
      if (!savedProfile || typeof savedProfile !== 'object') throw new Error('The server returned no saved profile.');
      setFormData((prev) => ({ ...prev, ...savedProfile }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Save profile error:', err);
      setSaveError(err.response?.data?.message || err.message || 'Could not save profile settings. Check the API connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Avatar upload ─────────────────────────────────────────────────────────────
  const handleAvatarFileChange = async (e) => {
    const rawFile = e.target.files[0];
    if (!rawFile) return;
    if (!rawFile.type.startsWith('image/')) {
      setAvatarError('Only image files (JPG, PNG, WebP, GIF) are allowed.');
      return;
    }
    if (rawFile.size > 10 * 1024 * 1024) {
      setAvatarError('Image size must be under 10 MB.');
      return;
    }
    setAvatarError('');
    setAvatarImageFailed(false);

    try {
      const processedFile = await trimTransparentPadding(rawFile);
      if (avatarPreviewUrlRef.current) URL.revokeObjectURL(avatarPreviewUrlRef.current);
      avatarPreviewUrlRef.current = URL.createObjectURL(processedFile);
      setAvatarFile(processedFile);
    } catch {
      if (avatarPreviewUrlRef.current) URL.revokeObjectURL(avatarPreviewUrlRef.current);
      avatarPreviewUrlRef.current = URL.createObjectURL(rawFile);
      setAvatarFile(rawFile);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setUploadingAvatar(true);
    setAvatarSuccess(false);
    setAvatarError('');
    try {
      const data = new FormData();
      data.append('avatar', avatarFile);
      const token = localStorage.getItem('kavin_portfolio_token');
      const res = await fetch(`${API_BASE}/api/profile/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Upload failed');
      const newAvatarUrl = json.avatar_url || json.data?.avatar_url;
      setFormData((prev) => ({ ...prev, avatar_url: newAvatarUrl }));
      setAvatarFile(null);
      if (avatarPreviewUrlRef.current) URL.revokeObjectURL(avatarPreviewUrlRef.current);
      avatarPreviewUrlRef.current = null;
      setAvatarSuccess(true);
      setTimeout(() => setAvatarSuccess(false), 4000);
    } catch (err) {
      setAvatarError(err.message || 'Failed to upload profile photo.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!window.confirm('Remove profile photo and revert to initials badge?')) return;
    try {
      const updated = { ...formData, avatar_url: '' };
      await api.put('/profile', updated);
      setFormData(updated);
      setAvatarFile(null);
    } catch (err) {
      console.error('Error removing avatar:', err);
    }
  };

  // ── Resume upload ─────────────────────────────────────────────────────────────
  const handleResumeFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setResumeError('Only PDF files are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setResumeError('File size must be under 10 MB.');
      return;
    }
    setResumeError('');
    setResumeFile(file);
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setUploadingResume(true);
    setResumeSuccess(false);
    setResumeError('');
    try {
      const data = new FormData();
      data.append('resume', resumeFile);
      const token = localStorage.getItem('kavin_portfolio_token');
      const res = await fetch(`${API_BASE}/api/profile/resume`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Upload failed');
      setFormData((prev) => ({ ...prev, resume_url: json.resume_url }));
      setResumeFile(null);
      setResumeSuccess(true);
      setTimeout(() => setResumeSuccess(false), 4000);
    } catch (err) {
      setResumeError(err.message || 'Failed to upload resume.');
    } finally {
      setUploadingResume(false);
    }
  };

  const clearResumeFile = () => {
    setResumeFile(null);
    setResumeError('');
    if (resumeInputRef.current) resumeInputRef.current.value = '';
  };

  const avatarPreviewSrc = avatarPreviewUrlRef.current || resolveAvatarUrl(formData.avatar_url);

  const initials = formData.name
    ? formData.name.split(' ').map((n) => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase()
    : 'KB';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2 text-sky-400" /> Loading profile settings…
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl space-y-8">
      {/* Page Title & Context */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
          Profile &amp; Contact Settings
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Manage your personal details, portfolio avatar, biography, roles, and resume across the entire site.
        </p>
      </div>

      {/* Balanced 2-Column Responsive Workspace Grid (Eliminating Empty Right-Side Space) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── Left Column: Media & Live Previews (lg:col-span-5) ── */}
        <div className="lg:col-span-5 space-y-6">

          {/* Profile Photo / Avatar Card */}
          <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Profile Photo / Avatar
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Displayed in the hero cosmic circle orbit
                </p>
              </div>
              {formData.avatar_url && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Revert
                </button>
              )}
            </div>

            {avatarSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> Photo uploaded and updated successfully!
              </div>
            )}
            {avatarError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {avatarError}
              </div>
            )}

            {/* Glowing Cosmic Avatar Orb Preview */}
            <div className="flex flex-col items-center justify-center py-4 bg-slate-950/70 rounded-2xl border border-slate-800/80">
              <div className="relative flex h-[280px] w-full max-w-[300px] items-end justify-center overflow-hidden">
                {avatarPreviewSrc && !avatarImageFailed ? (
                  <img
                    src={avatarPreviewSrc}
                    alt={formData.name || 'Preview'}
                    className="h-full w-auto max-w-full object-contain object-bottom"
                    onError={() => setAvatarImageFailed(true)}
                  />
                ) : (
                  <span className="mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 via-violet-400 to-cyan-400 text-3xl font-extrabold text-white shadow-[0_0_40px_rgba(168,85,247,0.4)]">{initials}</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-3 font-mono">
                {avatarPreviewSrc && !avatarImageFailed ? 'Dynamic Image Loaded' : `Default Initials (${initials})`}
              </p>
            </div>

            {/* Upload Controls */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
                >
                  <UploadCloud className="w-4 h-4 text-sky-400" />
                  {avatarFile ? 'Choose Different Image' : 'Upload Image File'}
                </button>

                {avatarFile && (
                  <button
                    type="button"
                    onClick={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-50 transition-all shadow-md shadow-sky-500/20"
                  >
                    {uploadingAvatar ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…</>
                    ) : (
                      <><CheckCircle2 className="w-3.5 h-3.5" /> Save Avatar Photo</>
                    )}
                  </button>
                )}
              </div>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleAvatarFileChange}
              />

              {/* <div className="space-y-1 pt-1">
                <p className="text-[11px] text-slate-400 font-medium">Or enter image URL directly:</p>
                <input
                  type="text"
                  value={formData.avatar_url || ''}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="/uploads/1795250456290-kavin-pic.webp"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-sky-500 focus:outline-none"
                />
              </div> */}
            </div>
          </div>

          {/* Resume / CV Card */}
          <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Resume / CV (PDF)
              </h3>
              {formData.resume_url && (
                <a
                  href={formData.resume_url.startsWith('http') ? formData.resume_url : `${API_BASE}${formData.resume_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View current PDF
                </a>
              )}
            </div>

            {resumeSuccess && (
              <div className="flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4" /> Resume PDF uploaded successfully!
              </div>
            )}
            {resumeError && (
              <div className="text-rose-400 text-xs">{resumeError}</div>
            )}

            <div
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-700 hover:border-sky-500/60 bg-slate-950/70 p-5 cursor-pointer transition-colors text-center"
              onClick={() => resumeInputRef.current?.click()}
            >
              <UploadCloud className="w-7 h-7 text-sky-400" />
              <p className="text-xs text-slate-300">
                {resumeFile ? (
                  <span className="text-sky-300 font-semibold">{resumeFile.name}</span>
                ) : (
                  <><span className="text-sky-400 font-semibold">Click to choose</span> or drop PDF here</>
                )}
              </p>
              <p className="text-[11px] text-slate-500">PDF only · max 10 MB</p>
              <input
                ref={resumeInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleResumeFileChange}
              />
            </div>

            {resumeFile && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResumeUpload}
                  disabled={uploadingResume}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-50 transition-all"
                >
                  {uploadingResume ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…</>
                  ) : (
                    <><UploadCloud className="w-3.5 h-3.5" /> Upload Resume</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={clearResumeFile}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* Quick Portfolio Preview Snippet */}
          <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-2">
              <Eye className="w-4 h-4 text-sky-400" />
              Live Portfolio Card Snapshot
            </div>
            <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-violet-400/30 bg-violet-500/10 px-2 text-xs font-bold text-violet-300">{formData.brand_logo?.trim() || initials}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">
                  {formData.hero_tagline || 'Available for new opportunities'}
                </span>
              </div>
              <h4 className="font-heading font-bold text-white text-base">
                {formData.name || 'Kavin B'}
              </h4>
              <p className="text-xs text-sky-400 font-medium">
                {formData.title || 'Full Stack Developer'}
              </p>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {formData.bio || 'Building scalable web applications with modern technologies.'}
              </p>
              <div className="flex items-center gap-4 pt-2 text-[11px] text-slate-400 border-t border-slate-900">
                <span>{formData.location || 'Tamil Nadu, India'}</span>
                <span>•</span>
                <span>{formData.email || 'kavinkbs2202@gmail.com'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Right Column: Form Settings (lg:col-span-7) ── */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-6 sm:p-8 shadow-xl">

            {success && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="font-semibold">Profile settings saved successfully!</span>
              </div>
            )}

            {saveError && (
              <div role="alert" className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                {saveError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Primary Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="animated-roles" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Animated role titles</label>
                <textarea
                  id="animated-roles"
                  rows={4}
                  maxLength={1000}
                  value={formData.animated_roles || ''}
                  onChange={(e) => setFormData({ ...formData, animated_roles: e.target.value })}
                  placeholder={'Full Stack Developer\nLaravel Developer\nReact Developer'}
                  aria-describedby="animated-roles-help"
                  className="w-full resize-y rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white transition-colors focus:border-sky-500 focus:outline-none"
                />
                <p id="animated-roles-help" className="text-xs text-slate-500">Enter one title per line. These roles animate in the public hero; your primary role title is always included.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Public logo text</label>
                <input
                  type="text"
                  maxLength={24}
                  value={formData.brand_logo || ''}
                  onChange={(e) => setFormData({ ...formData, brand_logo: e.target.value })}
                  placeholder="KB."
                  aria-describedby="brand-logo-help"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                />
                <p id="brand-logo-help" className="text-xs text-slate-500">Shown in the public navigation and footer. Leave empty to use your initials.</p>
              </div>

              {/* Hero Tagline */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Hero Tagline <span className="normal-case text-slate-500">(shown in availability status pill)</span>
                </label>
                <input
                  type="text"
                  value={formData.hero_tagline || ''}
                  onChange={(e) => setFormData({ ...formData, hero_tagline: e.target.value })}
                  placeholder="e.g. Available for new opportunities"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Bio Narrative */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  About Bio Narrative
                </label>
                <textarea
                  rows="4"
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none resize-none leading-relaxed transition-colors"
                />
              </div>

              {/* Contact: email / phone / location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Phone</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Social links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.github_url || ''}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedin_url || ''}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.years_of_experience}
                    onChange={(e) => setFormData({ ...formData, years_of_experience: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Projects Completed</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.projects_completed}
                    onChange={(e) => setFormData({ ...formData, projects_completed: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Clients Served</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.clients_served}
                    onChange={(e) => setFormData({ ...formData, clients_served: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 shadow-md shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving Profile…</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> Save Profile Settings</>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminProfile;
