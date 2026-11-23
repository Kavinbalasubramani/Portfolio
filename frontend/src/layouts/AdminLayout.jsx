import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applyTheme, getSavedTheme, subscribeToTheme } from '../utils/theme';
import api from '../services/api';
import {
  LayoutDashboard,
  User,
  Zap,
  Briefcase,
  Clock,
  GraduationCap,
  Wrench,
  Mail,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Code2,
  Moon,
  Sun
} from 'lucide-react';

const AdminLayout = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(getSavedTheme);
  const [profileName, setProfileName] = useState('Kavin');

  useEffect(() => {
    return subscribeToTheme(setTheme);
  }, []);

  useEffect(() => {
    api.get('/profile').then((body) => {
      const profile = body?.data?.data ?? body?.data ?? body;
      if (profile?.name?.trim()) setProfileName(profile.name.trim());
    }).catch(() => {});
  }, []);

  const toggleTheme = () => setTheme(applyTheme(theme === 'dark' ? 'light' : 'dark'));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1D] flex items-center justify-center text-slate-300">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            aria-label={`Switch portfolio to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Portfolio mode: ${theme}`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <span>Verifying admin session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Profile', path: '/admin/profile', icon: User },
    { label: 'Skills', path: '/admin/skills', icon: Zap },
    { label: 'Projects', path: '/admin/projects', icon: Briefcase },
    { label: 'Experience', path: '/admin/experience', icon: Clock },
    { label: 'Education', path: '/admin/education', icon: GraduationCap },
    { label: 'Services', path: '/admin/services', icon: Wrench },
    { label: 'Messages', path: '/admin/messages', icon: Mail },
  ];

  return (
      <div className="admin-shell min-h-screen bg-[#0A0F1D] text-slate-100 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-bold">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold text-lg text-slate-100 tracking-tight">
              {profileName}<span className="text-sky-400">.Admin</span>
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
            View Live Portfolio
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top bar */}
        <header className="admin-topbar h-16 bg-[#0A0F1D]/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white mr-3 p-1.5 rounded-md hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold text-slate-200">Content Management System</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="admin-theme-toggle inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition-colors hover:text-white"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Admin: {user?.email || 'admin@kavin.dev'}</span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
