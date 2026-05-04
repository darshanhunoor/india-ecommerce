'use client';

import { useState } from 'react';
import { sendOTP, verifyOTP } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import { Loader2, Mail, ShieldCheck, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { motionVariants } from '@/styles/design-system';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setUser = useAuthStore((s) => s.setUser);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (tab === 'SIGNUP' && !name.trim()) { setError('Please enter your full name'); return; }
    if (!email || !email.includes('@')) { setError('Please enter a valid email address'); return; }
    setLoading(true);
    try {
      await sendOTP(email);
      setStep('OTP');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length < 6) { setError('Please enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const idToken = await verifyOTP(email, otp);
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/verify-otp`;
      const res = await fetch(url, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, name: tab === 'SIGNUP' ? name : undefined, email }),
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
      setError(err.message || 'Verification failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-surface-alt relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-200/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-200/20 rounded-full blur-[80px] pointer-events-none" />

      <motion.div variants={motionVariants.scaleIn} initial="hidden" animate="visible" className="relative z-10 w-full max-w-md">
        <div className="bg-white border border-border rounded-3xl shadow-card-hover overflow-hidden">
          {/* Tabs */}
          {step === 'DETAILS' && (
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
          )}

          <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-8 pt-8 pb-6 text-white texture-noise">
            <h1 className="font-display font-black text-3xl mb-2">
              {step === 'DETAILS' ? (tab === 'LOGIN' ? 'Welcome Back!' : 'Join Us!') : 'Enter OTP'}
            </h1>
            <p className="text-navy-300 text-sm">
              {step === 'DETAILS'
                ? (tab === 'LOGIN' ? 'Sign in to your account.' : 'Create an account in seconds.')
                : `We sent a 6-digit code to ${email}`}
            </p>
          </div>

          <div className="px-8 py-8">
            {error && (
              <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                <span className="text-red-400 mt-0.5">⚠️</span>{error}
              </div>
            )}

            {step === 'DETAILS' ? (
              <motion.form key="details" variants={motionVariants.fadeIn} initial="hidden" animate="visible" onSubmit={handleSendOtp} className="space-y-5">
                {tab === 'SIGNUP' && (
                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" className="input" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} autoFocus={tab === 'SIGNUP'} />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">
                      <Mail size={18} />
                    </span>
                    <input type="email" className="input pl-12 text-navy-900 font-semibold tracking-wide text-base" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} autoFocus={tab === 'LOGIN'} />
                  </div>
                </div>

                <button type="submit" disabled={loading || !email.includes('@') || (tab === 'SIGNUP' && !name.trim())} className="btn-primary w-full py-4 text-base rounded-2xl">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </motion.form>
            ) : (
              <motion.form key="otp" variants={motionVariants.fadeIn} initial="hidden" animate="visible" onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">6-Digit OTP</label>
                  <input type="text" inputMode="numeric" maxLength={6} className="input text-center tracking-[0.6em] font-black text-2xl py-4" placeholder="• • • • • •" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} disabled={loading} autoFocus />
                </div>

                <button type="submit" disabled={loading || otp.length < 6} className="btn-primary w-full py-4 text-base rounded-2xl">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={16} />}
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>

                <button type="button" onClick={() => { setStep('DETAILS'); setOtp(''); setError(''); }} className="w-full py-2.5 text-sm font-semibold text-muted hover:text-primary-600 transition-colors">
                  ← Edit email address
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
