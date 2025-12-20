import React, { useState } from 'react';
import { Mail, Lock, Key, ArrowRight, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';
// import { Link } from 'react-router-dom'; // TODO: Uncomment for routing

type Tab = 'viaOldPass' | 'viaEmail';

export default function ForgotPassword() {
  const [activeTab, setActiveTab] = useState<Tab>('viaOldPass');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form States
  const [oldPassForm, setOldPassForm] = useState({
    email: '',
    oldPassword: '',
    newPassword: ''
  });

  const [emailForm, setEmailForm] = useState({
    email: ''
  });

  // API Handlers
  const handleViaOldPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:8001/api/auth/forget-password/viaOldPass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(oldPassForm)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Server error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViaEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:8001/api/auth/forget-password/viaEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailForm)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Server error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060010] text-slate-200 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">

      <div className="w-full max-w-md relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Reset Password</h1>
          <p className="text-slate-400 font-light">Choose a method to recover your account.</p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-[#0A0514] border border-white/10 rounded-2xl p-1 mb-8 relative flex">
          {/* Sliding Indicator */}
          <div
            className={`
              absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#1A1625] rounded-xl border border-white/5 shadow-sm transition-all duration-300 ease-out
              ${activeTab === 'viaOldPass' ? 'left-1' : 'left-[calc(50%+4px)]'}
            `}
          />

          <button
            onClick={() => { setActiveTab('viaOldPass'); setMessage(null); }}
            className={`
              flex-1 relative z-10 py-2.5 text-sm font-medium text-center transition-colors duration-300
              ${activeTab === 'viaOldPass' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}
            `}
          >
            Use Old Password
          </button>
          <button
            onClick={() => { setActiveTab('viaEmail'); setMessage(null); }}
            className={`
              flex-1 relative z-10 py-2.5 text-sm font-medium text-center transition-colors duration-300
              ${activeTab === 'viaEmail' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}
            `}
          >
            Use Email Link
          </button>
        </div>

        {/* Content Area */}
        <div className="relative grid grid-cols-1">

          {/* METHOD 1: VIA OLD PASSWORD */}
          <div className={`transition-all duration-500 col-start-1 row-start-1 w-full ${activeTab === 'viaOldPass' ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-8 pointer-events-none'}`}>
            <form onSubmit={handleViaOldPass} className="space-y-5">

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" strokeWidth={1.5} />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full bg-[#0A0514] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                    value={oldPassForm.email}
                    onChange={(e) => setOldPassForm({ ...oldPassForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-1">Old Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" strokeWidth={1.5} />
                  </div>
                  <input
                    type={showOldPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#0A0514] border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                    value={oldPassForm.oldPassword}
                    onChange={(e) => setOldPassForm({ ...oldPassForm, oldPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-1">New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" strokeWidth={1.5} />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#0A0514] border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                    value={oldPassForm.newPassword}
                    onChange={(e) => setOldPassForm({ ...oldPassForm, newPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={`
                    w-full py-4 px-6 rounded-full
                    bg-[#060010] border-2 cursor-pointer
                    text-sm font-medium tracking-wider
                    flex items-center justify-center gap-2
                    transition-all duration-300 ease-out
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    ${isHovered && !isLoading
                      ? 'border-indigo-500/50 text-indigo-100 translate-y-[-2px] shadow-lg shadow-indigo-500/10'
                      : 'border-white/10 text-slate-500 hover:text-slate-300'}
                  `}
                >
                  <span>{isLoading ? 'Updating...' : 'Change Password'}</span>
                  {!isLoading && <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />}
                </button>
              </div>
            </form>
          </div>

          {/* METHOD 2: VIA EMAIL LINK */}
          <div className={`transition-all duration-500 col-start-1 row-start-1 w-full ${activeTab === 'viaEmail' ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-8 pointer-events-none'}`}>
            <div className="mb-6 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-200 text-sm leading-relaxed">
              We will send a secure link to your email address to reset your password. The link will expire in 30 minutes.
            </div>

            <form onSubmit={handleViaEmail} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" strokeWidth={1.5} />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full bg-[#0A0514] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
                    value={emailForm.email}
                    onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={`
                      w-full py-4 px-6 rounded-full
                      bg-[#060010] border-2 cursor-pointer
                      text-sm font-medium tracking-wider
                      flex items-center justify-center gap-2
                      transition-all duration-300 ease-out
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                      ${isHovered && !isLoading
                      ? 'border-indigo-500/50 text-indigo-100 translate-y-[-2px] shadow-lg shadow-indigo-500/10'
                      : 'border-white/10 text-slate-500 hover:text-slate-300'}
                    `}
                >
                  <span>{isLoading ? 'Sending...' : 'Send Reset Link'}</span>
                  {!isLoading && <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 text-sm animate-in slide-in-from-top-2 fade-in duration-300 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20' : 'bg-red-500/10 text-red-200 border border-red-500/20'}`}>
            <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${message.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`} />
            <p>{message.text}</p>
          </div>
        )}

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <a href="/login" className="text-sm text-slate-500 hover:text-indigo-300 transition-colors font-medium">
            ← Back to Login
          </a>
        </div>

      </div>
    </div>
  );
}