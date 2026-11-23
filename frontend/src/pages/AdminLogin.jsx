import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, Loader2, ArrowLeft, LogIn, Code2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState(import.meta.env.VITE_ADMIN_EMAIL || 'admin@kavin.dev');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login failure:', err);
      const message = err.response?.data?.message;
      setError(message || (err.response
        ? 'Sign-in failed. Check the admin email and password configured for this backend.'
        : `Cannot reach the backend API at ${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}. Start the backend and check VITE_API_URL.`));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-login-page min-h-screen bg-[#080b16] px-4 py-8 text-white sm:px-6">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="admin-login-card relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/95 p-6 shadow-2xl shadow-black/40 sm:p-7"
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-200">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Kavin B<span className="text-sky-400">.Admin</span></p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">Portfolio dashboard</p>
            </div>
          </div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> Portfolio
          </Link>
        </div>

        <div className="mb-5 text-center">
          <div className="admin-login-lock mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-slate-400">Enter your credentials to continue.</p>
        </div>

        {error && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="admin-email" className="text-sm font-medium text-slate-300">Email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="admin-login-input w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="admin-login-input w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>

          <motion.button
            whileHover={reduceMotion || submitting ? undefined : { y: -1 }}
            whileTap={reduceMotion || submitting ? undefined : { scale: 0.99 }}
            type="submit"
            disabled={submitting}
            className="admin-login-submit inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-950/30 transition focus:outline-none focus:ring-4 focus:ring-sky-500/20 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : <><LogIn className="h-4 w-4" /> Sign in</>}
          </motion.button>
        </form>

        <p className="mt-5 border-t border-slate-800 pt-4 text-center text-xs text-slate-500">Authorized administrators only</p>
      </motion.div>
    </main>
  );
};

export default AdminLogin;
