import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Zap, X, Loader2 } from 'lucide-react';
import api from '../services/api';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend',
    level: 3,
    icon: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await api.get('/skills');
      setSkills(res.data || []);
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openCreateModal = () => {
    setEditingSkill(null);
    setFormData({ name: '', category: 'frontend', level: 3, icon: '' });
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level > 3 ? (skill.level >= 90 ? 3 : skill.level >= 75 ? 2 : 1) : skill.level,
      icon: skill.icon || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      setSkills(prev => prev.filter(s => (s.id || s._id) !== id));
    } catch (err) {
      console.error('Delete skill error:', err);
      alert('Failed to delete skill.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingSkill) {
        const id = editingSkill.id || editingSkill._id;
        const payload = { ...formData, category: formData.category.toLowerCase() };
        const res = await api.put(`/skills/${id}`, payload);
        setSkills(prev => prev.map(s => ((s.id || s._id) === id ? res.data : s)));
      } else {
        const payload = { ...formData, category: formData.category.toLowerCase() };
        const res = await api.post('/skills', payload);
        setSkills(prev => [...prev, res.data]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Save skill error:', err);
      alert('Error saving skill.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white">Skills & Competencies</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage technical proficiencies categorized by Frontend, Backend, Database, and Tools.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 shadow-md shadow-sky-500/20 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Skill
        </button>
      </div>

      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase text-slate-500 bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Skill Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Proficiency Level</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {skills.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-500">
                    No skills in database. Click "Add New Skill" to create one.
                  </td>
                </tr>
              ) : (
                skills.map((skill) => {
                  const id = skill.id || skill._id;
                  return (
                    <tr key={id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>{skill.name}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                          {skill.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3 max-w-xs">
                          <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                              className="bg-sky-500 h-2 rounded-full"
                              style={{ width: `${Math.max(1, Math.min(3, skill.level)) * 20}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-slate-400">{['Working knowledge', 'Confident', 'Daily use'][Math.max(1, Math.min(3, skill.level)) - 1]}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(skill)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
              <h3 className="text-lg font-heading font-bold text-white">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. React.js, Laravel, MySQL"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="tools">Tools</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Proficiency Level: {['Working knowledge', 'Confident', 'Daily use'][formData.level - 1]}
                  </label>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                  className="w-full accent-sky-500"
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
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSkills;
