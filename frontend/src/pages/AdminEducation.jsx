import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, X, Loader2 } from 'lucide-react';
import api from '../services/api';

const AdminEducation = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    startYear: '2021',
    endYear: '2025',
    cgpa: '8.152',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const res = await api.get('/education');
      setEducations(res.data || []);
    } catch (err) {
      console.error('Failed to load education records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const openCreateModal = () => {
    setEditingEdu(null);
    setFormData({
      degree: '',
      institution: '',
      startYear: '2021',
      endYear: '2025',
      cgpa: '8.152',
      description: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (edu) => {
    setEditingEdu(edu);
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      startYear: edu.startYear || edu.start_year || '',
      endYear: edu.endYear || edu.end_year || '',
      cgpa: edu.cgpa || '',
      description: edu.description || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this education record?')) return;
    try {
      await api.delete(`/education/${id}`);
      setEducations(prev => prev.filter(e => (e.id || e._id) !== id));
    } catch (err) {
      console.error('Delete education error:', err);
      alert('Failed to delete education.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingEdu) {
        const id = editingEdu.id || editingEdu._id;
        const res = await api.put(`/education/${id}`, formData);
        setEducations(prev => prev.map(e => ((e.id || e._id) === id ? res.data : e)));
      } else {
        const res = await api.post('/education', formData);
        setEducations(prev => [...prev, res.data]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Save education error:', err);
      alert('Error saving education.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white">Academic Qualifications</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage university degrees, CGPA metrics, and coursework details.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 shadow-md shadow-sky-500/20 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </button>
      </div>

      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase text-slate-500 bg-slate-950/60 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Degree & Institution</th>
                <th className="py-3.5 px-4">Years</th>
                <th className="py-3.5 px-4">CGPA</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {educations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-500">
                    No education records. Click "Add Education" to register your degree.
                  </td>
                </tr>
              ) : (
                educations.map((edu) => {
                  const id = edu.id || edu._id;
                  return (
                    <tr key={id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{edu.degree}</div>
                        <div className="text-xs text-sky-400">{edu.institution}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                        {edu.startYear || edu.start_year} – {edu.endYear || edu.end_year}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {edu.cgpa} / 10.0
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(edu)}
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
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
              <h3 className="text-lg font-heading font-bold text-white">
                {editingEdu ? 'Edit Education' : 'Add Education Record'}
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
                  Degree / Program *
                </label>
                <input
                  type="text"
                  required
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. B.E. Computer Science and Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Institution / College *
                </label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g. M. Kumarasamy College of Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Start Year
                  </label>
                  <input
                    type="text"
                    value={formData.startYear}
                    onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                    placeholder="2021"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    End Year
                  </label>
                  <input
                    type="text"
                    value={formData.endYear}
                    onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    CGPA
                  </label>
                  <input
                    type="text"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    placeholder="8.152"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Description / Focus
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of coursework, projects, or honors..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-sky-500 focus:outline-none resize-none"
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
                  Save Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEducation;
