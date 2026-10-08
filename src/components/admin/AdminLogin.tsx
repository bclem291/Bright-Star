import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Shield, Lock, ArrowLeft, KeyRound, AlertCircle, Star } from 'lucide-react';

interface AdminLoginProps {
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToHome }) => {
  const { adminLogin, setActivePage } = useSchool();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!password.trim()) {
      setErrorMessage('Please enter the administrative password.');
      return;
    }

    setIsLoading(true);
    const result = await adminLogin(password);
    setIsLoading(false);

    if (result.success) {
      setActivePage('admin');
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/90 shadow-xl">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-linear-to-b from-blue-900 to-blue-950 border-2 border-amber-400/80 shadow-md flex flex-col items-center justify-center text-white">
            <div className="flex items-center gap-0.5 text-amber-400 -mb-0.5">
              <Star className="w-2.5 h-2.5 fill-amber-400" />
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <Star className="w-2.5 h-2.5 fill-amber-400" />
            </div>
            <span className="font-extrabold text-sm tracking-wider">BSC</span>
          </div>

          <h2 className="text-2xl font-extrabold text-blue-950 tracking-tight">
            Administrator Portal
          </h2>
          <p className="text-xs text-slate-500">
            Bright Star College · Lekki, Lagos
          </p>
          <div className="text-[11px] text-slate-400 bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-200/70 inline-block">
            Authorized School Administration Personnel Only
          </div>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Administrative Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm placeholder:text-slate-400 transition-all"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-xs tracking-wider uppercase flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>AUTHENTICATING...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>SIGN IN TO DASHBOARD</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onBackToHome}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors text-xs tracking-wide flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
