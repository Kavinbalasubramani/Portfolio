import React, { useState } from 'react';
import { Layers, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';

const Projects = ({ projects: externalProjects }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('All');

  const projectList = Array.isArray(externalProjects) ? externalProjects : [];
  const filters = ['All', ...new Set(projectList.map((project) => project.category).filter(Boolean))];

  const filteredProjects = filter === 'All'
    ? projectList
    : projectList.filter((p) => {
        return (p.category || '').toLowerCase() === filter.toLowerCase();
      });

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0A0F1D] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center space-y-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Portfolio Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            Featured <span className="hero-gradient">Projects</span>
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Real-world applications showcasing scalable architecture, clean backend design, and responsive user experiences.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 scale-105'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {externalProjects === null ? (
            <p className="col-span-full text-center text-slate-400">Loading projects…</p>
          ) : filteredProjects.length === 0 ? (
            <p className="col-span-full text-center text-slate-400">No projects available yet.</p>
          ) : (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id || project.slug || project.title}
                project={project}
                onViewDetails={(p) => setSelectedProject(p)}
              />
            ))
          )}
        </div>

        {/* Project Detail Modal */}
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
};

export default Projects;
