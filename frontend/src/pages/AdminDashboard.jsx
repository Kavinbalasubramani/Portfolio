import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Zap, Clock, GraduationCap, Mail, ArrowUpRight, Plus, Eye, RefreshCw } from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    education: 0,
    messages: 0,
    unreadMessages: 0,
  });

  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [pRes, sRes, expRes, eduRes, mRes] = await Promise.allSettled([
        api.get('/projects'),
        api.get('/skills'),
        api.get('/experience'),
        api.get('/education'),
        api.get('/messages'),
      ]);

      const projects   = pRes.status   === 'fulfilled' ? (pRes.value.data   || []) : [];
      const skills     = sRes.status   === 'fulfilled' ? (sRes.value.data   || []) : [];
      const experience = expRes.status === 'fulfilled' ? (expRes.value.data || []) : [];
      const education  = eduRes.status === 'fulfilled' ? (eduRes.value.data || []) : [];
      const messages   = mRes.status   === 'fulfilled' ? (mRes.value.data   || []) : [];

      setStats({
        projects: projects.length,
        skills: skills.length,
        experience: experience.length,
        education: education.length,
        messages: messages.length,
        unreadMessages: messages.filter((m) => !m.is_read).length,
      });

      setRecentMessages(messages.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Projects', count: stats.projects, icon: Briefcase, color: 'text-sky-400', link: '/admin/projects', bg: 'bg-sky-500/10 border-sky-500/20' },
    { title: 'Total Skills', count: stats.skills, icon: Zap, color: 'text-amber-400', link: '/admin/skills', bg: 'bg-amber-500/10 border-amber-500/20' },
    { title: 'Experience Records', count: stats.experience, icon: Clock, color: 'text-indigo-400', link: '/admin/experience', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { title: 'Education Records', count: stats.education, icon: GraduationCap, color: 'text-emerald-400', link: '/admin/education', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Inquiries & Messages', count: stats.messages, icon: Mail, color: 'text-rose-400', link: '/admin/messages', bg: 'bg-rose-500/10 border-rose-500/20', badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} New` : null },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white">Dashboard Overview</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time management metrics from your MySQL / MongoDB database.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            to="/admin/projects"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Project
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 hover:border-slate-700 transition-all hover:scale-[1.02] flex flex-col justify-between group shadow-lg shadow-black/20"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.bg} ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {card.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {card.badge}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">{card.title}</p>
                <div className="flex items-baseline justify-between mt-1">
                  <h3 className="text-2xl font-heading font-extrabold text-white">
                    {loading ? '...' : card.count}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Messages Section */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-sky-400" />
            <h3 className="text-base font-heading font-bold text-white">Recent Client Inquiries</h3>
          </div>
          <Link
            to="/admin/messages"
            className="text-xs font-medium text-sky-400 hover:text-sky-300 flex items-center"
          >
            View All Messages <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            No contact messages received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentMessages.map((msg) => (
                  <tr key={msg.id || msg._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{msg.name}</div>
                      <div className="text-xs text-slate-500">{msg.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                      {msg.subject || 'No Subject'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full ${
                          msg.is_read
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {msg.is_read ? 'Read' : 'New'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/admin/messages"
                        className="inline-flex items-center text-xs text-sky-400 hover:text-sky-300 font-medium"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
