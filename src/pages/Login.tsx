import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useHydrasync } from '../context/HydrasyncContext.tsx';
import { Droplets, Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('demo@hydrasync.ai');
  const [password, setPassword] = useState('hydra-scada-2026');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useHydrasync();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your operational email address.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      login(email);
      setIsLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  const handleDemoLogin = () => {
    setEmail('demo@hydrasync.ai');
    setPassword('hydra-scada-2026');
    setIsLoading(true);
    setTimeout(() => {
      login('demo@hydrasync.ai');
      setIsLoading(false);
      navigate('/dashboard');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <NavLink to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-sky-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Droplets className="w-6 h-6 fill-white/20" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">HYDRASYNC</span>
        </NavLink>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          SCADA & Telemetry Access Portal
        </h2>
        <p className="mt-1 text-xs text-slate-500 font-mono">
          Sector 7 Industrial Water Distribution Intelligence
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 shadow-xl space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Operator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-hidden font-mono"
                  placeholder="demo@hydrasync.ai"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  SCADA Security Token / Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-hidden font-mono"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-sky-600/20 transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Authenticating Telemetry...</span>
                ) : (
                  <>
                    <span>Authenticate & Access Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Demo Account Quick Access Box */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-mono">
              <span className="bg-white px-2 text-slate-400">Instant Demo Evaluation</span>
            </div>
          </div>

          <div className="bg-sky-50/60 rounded-xl p-4 border border-sky-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
              <KeyRound className="w-4 h-4 text-sky-600" />
              <span>Pre-Configured Lead SCADA Account</span>
            </div>
            <div className="text-xs text-slate-600 font-mono space-y-0.5">
              <div>
                Account:{' '}
                <strong className="text-slate-900 select-all">demo@hydrasync.ai</strong>
              </div>
              <div>Facility: Apex Plant 04 (Full Permissions)</div>
            </div>
            <button
              id="demo-login-btn"
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 px-4 rounded-lg bg-white border border-sky-300 hover:bg-sky-50 text-sky-800 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>One-Click Demo Login</span>
            </button>
          </div>

          <div className="text-center">
            <NavLink to="/" className="text-xs text-slate-500 hover:text-sky-600 transition-colors">
              ← Return to Product Overview
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
