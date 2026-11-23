import React, { useState } from 'react';
import { ExternalLink, Eye, Star } from 'lucide-react';
import { Github } from './BrandIcons';
import { normalizeTechList } from '../utils/techUtils';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5000';

const getFallbackImage = (title = '', category = '') => {
  const norm = (title + ' ' + category).toLowerCase();
  if (norm.includes('cracker') || norm.includes('e-commerce') || norm.includes('ecommerce')) {
    return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop&q=80';
  }
  if (norm.includes('mern') || norm.includes('workflow') || norm.includes('hub')) {
    return 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900&auto=format&fit=crop&q=80';
  }
  if (norm.includes('api') || norm.includes('gateway') || norm.includes('auth')) {
    return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop&q=80';
};

const resolveProjectImage = (url, title, category) => {
  if (!url) return getFallbackImage(title, category);
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
};

const ProjectCard = ({ project, onViewDetails }) => {
  const [imageFailed, setImageFailed] = useState(false);

  const techList = normalizeTechList(project.technologies);

  const rawImage = project.thumbnail_url || project.image;
  const imageSrc = !imageFailed ? resolveProjectImage(rawImage, project.title, project.category) : getFallbackImage(project.title, project.category);

  return (
    <div className="group rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/40 dark:hover:bg-slate-900 transition-all duration-300 hover:shadow-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 hover:-translate-y-1.5">
      {/* Project Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={imageSrc}
          alt={`${project.title} preview`}
          onError={() => setImageFailed(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D]/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {project.is_featured && (
          <span className="absolute top-3.5 left-3.5 inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-500 text-white shadow-md shadow-sky-500/30 backdrop-blur-md">
            <Star className="w-3 h-3 mr-1 fill-white" /> Featured
          </span>
        )}

        {project.category && (
          <span className="absolute top-3.5 right-3.5 inline-flex items-center px-2.5 py-1 text-[11px] font-mono font-medium rounded-lg bg-slate-900/85 text-slate-200 border border-slate-700/60 backdrop-blur-md shadow-sm">
            {project.category}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
            {project.short_description || project.description}
          </p>
        </div>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {techList.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-[11px] font-mono font-medium rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {(project.githubUrl || project.github_url) && (
              <a
                href={project.githubUrl || project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="View Source Code"
                aria-label={`View ${project.title} code on GitHub`}
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {(project.liveUrl || project.live_url) && (
              <a
                href={project.liveUrl || project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Live Preview"
                aria-label={`View live demo of ${project.title}`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <button
            onClick={() => onViewDetails(project)}
            className="inline-flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors group/btn"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5 group-hover/btn:scale-110 transition-transform" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
