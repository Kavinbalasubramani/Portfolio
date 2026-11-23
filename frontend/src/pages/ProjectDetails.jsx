import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, CheckCircle2, Layers } from 'lucide-react';
import { Github } from '../components/BrandIcons';
import api from '../services/api';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error('Error fetching project detail:', err);
        // Fallback demo project
        setProject({
          title: 'Radhe Crackers (Commercial E-Commerce)',
          slug: 'radhe-crackers',
          short_description: 'Full-scale e-commerce application with Admin CRUD and Facebook Lead Ads integration.',
          full_description: 'Radhe Crackers is a production e-commerce platform built to streamline seasonal firecracker wholesale and retail sales. The system features a custom cart and checkout workflow, an administrative panel with full CRUD capabilities for inventory management, and an automated webhook pipeline capturing Facebook Lead Ads directly into the order pipeline.',
          thumbnail_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop&q=80',
          technologies: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'Bootstrap', 'REST APIs'],
          features: [
            'Customer shopping cart and seasonal price tiers',
            'Admin dashboard for real-time inventory and customer order tracking',
            'Direct Facebook Lead Ads webhook capture and notification',
            'Normalized MySQL database indexing for sub-100ms queries'
          ],
          githubUrl: '',
          liveUrl: '',
          is_featured: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-300">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
        <Link to="/" className="text-sky-400 hover:underline">Return to Home</Link>
      </div>
    );
  }

  const techList = Array.isArray(project.technologies)
    ? project.technologies
    : typeof project.technologies === 'string'
    ? JSON.parse(project.technologies || '[]')
    : [];

  const featureList = Array.isArray(project.features)
    ? project.features
    : typeof project.features === 'string'
    ? JSON.parse(project.features || '[]')
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/"
        className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-sky-400 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to All Projects
      </Link>

      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl p-6 sm:p-8 space-y-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <Layers className="w-4 h-4" />
            <span>Case Study</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
            {project.title}
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            {project.short_description}
          </p>
        </div>

        <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
          <img
            src={project.image || project.thumbnail_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80'}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-heading font-bold text-white">System Architecture & Overview</h3>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
            {project.full_description || project.short_description}
          </p>
        </div>

        {featureList.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-heading font-bold text-white">Engineering Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featureList.map((f, i) => (
                <div key={i} className="flex items-start text-sm text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-lg font-heading font-bold text-white">Technologies Used</h3>
          <div className="flex flex-wrap gap-2">
            {techList.map((t, i) => (
              <span key={i} className="px-3 py-1 text-xs font-mono font-medium rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex items-center space-x-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-sky-500 hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/25"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Live Site
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <Github className="w-4 h-4 mr-2" />
              Source Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
