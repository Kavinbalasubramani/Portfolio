import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Star, Image, X, Check, Loader2 } from 'lucide-react';
import { Github } from '../components/BrandIcons';
import api from '../services/api';
import { normalizeTechList } from '../utils/techUtils';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    thumbnail_url: '',
    technologies: '',
    features: '',
    github_url: '',
    live_url: '',
    is_featured: false,
    display_order: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects');
      setProjects(res.data || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      short_description: '',
      full_description: '',
      thumbnail_url: '',
      technologies: '',
      features: '',
      github_url: '',
      live_url: '',
      is_featured: false,
      display_order: 0,
    });
    setModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      slug: proj.slug || '',
      short_description: proj.short_description || proj.description || '',
      full_description: proj.full_description || '',
      thumbnail_url: proj.thumbnail_url || proj.image || '',
      technologies: normalizeTechList(proj.technologies).join(', '),
      features: Array.isArray(proj.features) ? proj.features.join('\n') : proj.features || '',
      github_url: proj.github_url || proj.githubUrl || '',
      live_url: proj.live_url || proj.liveUrl || '',
      is_featured: !!proj.is_featured,
      display_order: proj.display_order || 0,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => (p.id || p._id) !== id));
    } catch (err) {
      console.error('Delete project failed:', err);
      alert('Failed to delete project. Please check the backend connection.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      features: formData.features.split('\n').map(f => f.trim()).filter(Boolean),
    };

    try {
      if (editingProject) {
        const id = editingProject.id || editingProject._id;
        const res = await api.put(`/projects/${id}`, payload);
        setProjects(prev => prev.map(p => ((p.id || p._id) === id ? res.data : p)));
      } else {
        const res = await api.post('/projects', payload);
        setProjects(prev => [res.data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Save project error:', err);
      alert('Error saving project. Ensure the backend server is running.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white">Project Showcase Manager</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, edit, and organize portfolio projects with live links and features.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 shadow-md shadow-sky-500/20 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Project
        </button>
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase text-slate-500 bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Technologies</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Links</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    No projects found in database. Click "Add New Project" to create one.
                  </td>
                </tr>
              ) : (
                projects.map((proj) => {
                  const id = proj.id || proj._id;
                  const techs = normalizeTechList(proj.technologies);

                  return (
                    <tr key={id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={proj.thumbnail_url || proj.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&auto=format&fit=crop&q=80'}
                            alt={proj.title}
                            className="w-12 h-10 object-cover rounded-lg border border-slate-700/60 bg-slate-950"
                          />
                          <div>
                            <div className="font-semibold text-white">{proj.title}</div>
                            <div className="text-xs text-slate-500 max-w-xs truncate">
                              {proj.short_description || proj.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {techs.slice(0, 3).map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800 text-slate-300">
                              {t}
                            </span>
                          ))}
                          {techs.length > 3 && (
                            <span className="text-[11px] text-slate-500">+{techs.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {proj.is_featured ? (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                            <Star className="w-3 h-3 mr-1 fill-sky-400" /> Featured
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">Standard</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          {(proj.live_url || proj.liveUrl) && (
                            <a
                              href={proj.live_url || proj.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-sky-400"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {(proj.github_url || proj.githubUrl) && (
                            <a
                              href={proj.github_url || proj.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-white"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(proj)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
              <h3 className="text-lg font-heading font-bold text-white">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Radhe Crackers"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Slug (URL identifier)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. radhe-crackers"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Thumbnail Image URL (or upload path) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://... or /uploads/project.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Short Description *
                </label>
                <textarea
                  required
                  rows="2"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Brief summary displayed on project card..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Full Architecture Description
                </label>
                <textarea
                  rows="4"
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  placeholder="In-depth explanation of features, design patterns, and database models..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="Laravel, PHP, MySQL, React, Tailwind CSS"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Key Features (one per line)
                </label>
                <textarea
                  rows="3"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="E-Commerce CRUD with inventory tracking&#10;Facebook Lead Ads webhook sync&#10;Sub-100ms MySQL query optimization"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Live Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-500 bg-slate-950 border-slate-800 focus:ring-0"
                />
                <label htmlFor="is_featured" className="text-sm font-medium text-slate-300">
                  Feature this project on home page banner
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 transition-colors shadow-md disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
