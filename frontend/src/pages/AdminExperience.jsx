import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, X, Loader2 } from 'lucide-react';
import api from '../services/api';

const AdminExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    designation: '',
    startDate: '',
    endDate: 'Present',
    description: '',
    responsibilities: '',
    technologies: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchExperience = async () => {
    setLoading(true);
    try {
      const res = await api.get('/experience');
      setExperiences(res.data || []);
    } catch (err) {
      console.error('Failed to load experience records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const openCreateModal = () => {
    setEditingExp(null);
    setFormData({
      company: '',
      designation: '',
      startDate: '',
      endDate: 'Present',
      description: '',
      responsibilities: '',
      technologies: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExp(exp);
    setFormData({
      company: exp.company,
      designation: exp.designation,
      startDate: exp.startDate || exp.start_date || '',
      endDate: exp.endDate || exp.end_date || 'Present',
      description: exp.description || '',
      responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities.join('\n') : exp.responsibilities || '',
      technologies: Array.isArray(exp.technologies) ? exp.technologies.join(', ') : exp.technologies || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience record?')) return;
    try {
      await api.delete(`/experience/${id}`);
      setExperiences(prev => prev.filter(e => (e.id || e._id) !== id));
    } catch (err) {
      console.error('Delete experience error:', err);
      alert('Failed to delete experience.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      responsibilities: formData.responsibilities.split('\n').map(r => r.trim()).filter(Boolean),
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      if (editingExp) {
        const id = editingExp.id || editingExp._id;
        const res = await api.put(`/experience/${id}`, payload);
        setExperiences(prev => prev.map(e => ((e.id || e._id) === id ? res.data : e)));
      } else {
        const res = await api.post('/experience', payload);
        setExperiences(prev => [...prev, res.data]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Save experience error:', err);
      alert('Error saving experience.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white">Work Experience Timeline</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage employment milestones, roles, and technical achievements.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 shadow-md shadow-sky-500/20 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </button>
      </div>

      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase text-slate-500 bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Role & Company</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Technologies</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {experiences.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-500">
                    No experience records found. Click "Add Experience" to create one.
                  </td>
                </tr>
              ) : (
                experiences.map((exp) => {
                  const id = exp.id || exp._id;
                  const techs = Array.isArray(exp.technologies) ? exp.technologies : JSON.parse(exp.technologies || '[]');
                  return (
                    <tr key={id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{exp.designation}</div>
                        <div className="text-xs text-sky-400">{exp.company}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                        {exp.startDate || exp.start_date} – {exp.endDate || exp.end_date || 'Present'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {techs.slice(0, 4).map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800 text-slate-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(exp)}
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
              <h3 className="text-lg font-heading font-bold text-white">
                {editingExp ? 'Edit Experience' : 'Add Experience Record'}
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
                    Designation / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. PHP Laravel Developer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Tech Solutions Pvt Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Start Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="e.g. 2024 or Jan 2024"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    placeholder="e.g. Present"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Summary Description
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Overview of scope and impact..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Responsibilities (one per line)
                </label>
                <textarea
                  rows="4"
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  placeholder="Developed Laravel CRUD applications&#10;Engineered scalable REST APIs&#10;Integrated third-party payment gateways"
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
                  placeholder="PHP, Laravel, MySQL, REST APIs, Git"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                />
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExperience;
