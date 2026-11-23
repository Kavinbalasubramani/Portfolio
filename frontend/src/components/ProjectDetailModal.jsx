import React, { useEffect } from 'react';
import { X, ExternalLink, CheckCircle2, Layers } from 'lucide-react';
import { Github } from './BrandIcons';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5000';

const resolveImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
};

const ProjectDetailModal = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const techList = Array.isArray(project.technologies)
    ? project.technologies
    : typeof project.technologies === 'string'
    ? (() => {
        try {
          const parsed = JSON.parse(project.technologies);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return project.technologies.split(',').map((s) => s.trim());
        }
      })()
    : [];

  const featureList = Array.isArray(project.features)
    ? project.features
    : typeof project.features === 'string'
    ? (() => {
        try {
          const parsed = JSON.parse(project.features);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return project.features.split(',').map((s) => s.trim());
        }
      })()
    : [];

  const imageSrc = resolveImageUrl(project.image || project.thumbnail_url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0B1120]">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-heading font-bold text-white">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Project Image */}
          <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative group">
            <img
              src={imageSrc}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            {project.is_featured && (
              <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-sky-500 text-white shadow-md">
                Featured Commercial Project
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Overview &amp; Architecture
            </h4>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {project.full_description || project.description || project.short_description}
            </p>
          </div>

          {/* Key Features */}
          {featureList.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Key Features &amp; Engineering Highlights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {featureList.map((feat, idx) => (
                  <div key={idx} className="flex items-start text-xs sm:text-sm text-slate-300 bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {techList.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                Technology Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {techList.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-mono font-medium rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-t border-slate-800 bg-[#0B1120]">
          <div className="flex items-center space-x-3">
            {project.liveUrl || project.live_url ? (
              <a
                href={project.liveUrl || project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-400 rounded-lg shadow-md transition-all"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Live Application
              </a>
            ) : null}
            {project.githubUrl || project.github_url ? (
              <a
                href={project.githubUrl || project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all"
              >
                <Github className="w-4 h-4 mr-2" />
                Source Code
              </a>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
