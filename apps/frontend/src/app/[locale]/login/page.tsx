'use client';

import { useState } from 'react';
import { loginWithEmail, registerWithEmail } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import { Loader2, Smartphone, Lock, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { motionVariants } from '@/styles/design-system';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setUser = useAuthStore((s) => s.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (tab === 'SIGNUP' && !name.trim()) { setError('Please enter your full name'); return; }
    if (mobile.length !== 10) { setError('Please enter a valid 10-digit mobile number'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      const pseudoEmail = `${mobile}@mbecommerce.com`;
      let idToken;
      if (tab === 'SIGNUP') {
        idToken = await registerWithEmail(pseudoEmail, password);
      } else {
        idToken = await loginWithEmail(pseudoEmail, password);
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/verify-token`;
      const res = await fetch(url, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, name: tab === 'SIGNUP' ? name : undefined }),
      });
      
      if (!res.ok) throw new Error((await res.text()) || `Status ${res.status}`);
      const data = await res.json();
      setUser(data.user, data.isNewUser);
      
      if (data.isNewUser || !data.user.name) {
        router.push('/profile/setup');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      if (err.message?.includes('auth/invalid-credential') || err.message?.includes('auth/user-not-found') || err.message?.includes('auth/wrong-password')) {
        setError('Invalid mobile number or password.');
      } else if (err.message?.includes('auth/email-already-in-use')) {
        setError('This mobile number is already registered. Please login.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-surface-alt relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-200/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-200/20 rounded-full blur-[80px] pointer-events-none" />

      <motion.div variants={motionVariants.scaleIn} initial="hidden" animate="visible" className="relative z-10 w-full max-w-md">
        <div className="bg-white border border-border rounded-3xl shadow-card-hover overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              className={`flex-1 py-4 text-sm font-bold tracking-wider uppercase transition-colors ${tab === 'LOGIN' ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50' : 'text-navy-400 hover:text-navy-600'}`}
              onClick={() => { setTab('LOGIN'); setError(''); }}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 text-sm font-bold tracking-wider uppercase transition-colors ${tab === 'SIGNUP' ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50' : 'text-navy-400 hover:text-navy-600'}`}
              onClick={() => { setTab('SIGNUP'); setError(''); }}
            >
              Create Account
            </button>
          </div>

          <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-8 pt-8 pb-6 text-white texture-noise">
            <h1 className="font-display font-black text-3xl mb-2">
              {tab === 'LOGIN' ? 'Welcome Back!' : 'Join Us!'}
            </h1>
            <p className="text-navy-300 text-sm">
              {tab === 'LOGIN' ? 'Sign in to your account with Mobile & Password.' : 'Create an account in seconds.'}
            </p>
          </div>

          <div className="px-8 py-8">
            {error && (
              <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                <span className="text-red-400 mt-0.5">⚠️</span>{error}
              </div>
            )}

            <motion.form key="details" variants={motionVariants.fadeIn} initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-5">
              {tab === 'SIGNUP' && (
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">Full Name</label>
                  <input type="text" className="input" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} autoFocus={tab === 'SIGNUP'} />
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-700 font-bold text-sm select-none">+91</span>
                  <input type="tel" inputMode="numeric" maxLength={10} className="input pl-14 text-navy-900 font-semibold tracking-wide text-base" placeholder="10-digit mobile number" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} disabled={loading} autoFocus={tab === 'LOGIN'} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">Password (6+ chars)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">
                    <Lock size={18} />
                  </span>
                  <input type="password" minLength={6} className="input pl-12 text-navy-900 font-semibold tracking-wide text-base" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                </div>
              </div>

              <button type="submit" disabled={loading || mobile.length !== 10 || password.length < 6 || (tab === 'SIGNUP' && !name.trim())} className="btn-primary w-full py-4 text-base rounded-2xl">
                {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                {loading ? 'Processing...' : (tab === 'LOGIN' ? 'Login' : 'Sign Up')}
                {!loading && <ArrowRight size={16} />}
              </button>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
