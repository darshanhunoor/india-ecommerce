'use client';

import { useState } from 'react';
import { sendOTP, verifyOTP } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import { Loader2, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { motionVariants } from '@/styles/design-system';

export default function LoginPage() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setUser = useAuthStore((s) => s.setUser);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mobile.length < 10) { setError('Please enter a valid 10-digit mobile number'); return; }
    setLoading(true);
    try {
      await sendOTP(mobile, 'recaptcha-container');
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
      const idToken = await verifyOTP(otp);
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/verify-otp`;
      const res = await fetch(url, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) throw new Error((await res.text()) || `Status ${res.status}`);
      const data = await res.json();
      setUser(data.user);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-surface-alt">

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-200/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-200/20 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        variants={motionVariants.scaleIn}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white border border-border rounded-3xl shadow-card-hover overflow-hidden">
          {/* Header stripe */}
          <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-8 pt-10 pb-8 text-white texture-noise">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/20 border border-primary-400/30 flex items-center justify-center mb-5">
              <Smartphone size={22} className="text-primary-400" />
            </div>
            <h1 className="font-display font-black text-3xl mb-2">
              {step === 'MOBILE' ? 'Welcome!' : 'Enter OTP'}
            </h1>
            <p className="text-navy-300 text-sm">
              {step === 'MOBILE'
                ? 'Sign in or create your account in seconds.'
                : `We sent a 6-digit code to +91 ${mobile}`}
            </p>
          </div>

          {/* Form body */}
          <div className="px-8 py-8">
            {error && (
              <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                <span className="text-red-400 mt-0.5">⚠️</span>
                {error}
              </div>
            )}

            {step === 'MOBILE' ? (
              <motion.form
                key="mobile"
                variants={motionVariants.fadeIn}
                initial="hidden"
                animate="visible"
                onSubmit={handleSendOtp}
                className="space-y-5"
              >
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-700 font-bold text-sm select-none">+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      className="input pl-14 text-navy-900 font-semibold tracking-wide text-base"
                      placeholder="10-digit mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                </div>

                <div id="recaptcha-container" />

                <button
                  type="submit"
                  disabled={loading || mobile.length < 10}
                  className="btn-primary w-full py-4 text-base rounded-2xl"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                  {!loading && <ArrowRight size={16} />}
                </button>

                <p className="text-center text-xs text-muted leading-relaxed">
                  By continuing you agree to our{' '}
                  <span className="text-primary-600 font-semibold cursor-pointer hover:underline">Terms</span>{' '}
                  &amp;{' '}
                  <span className="text-primary-600 font-semibold cursor-pointer hover:underline">Privacy Policy</span>.
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="otp"
                variants={motionVariants.fadeIn}
                initial="hidden"
                animate="visible"
                onSubmit={handleVerifyOtp}
                className="space-y-5"
              >
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                    6-Digit OTP
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="input text-center tracking-[0.6em] font-black text-2xl py-4"
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    disabled={loading}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="btn-primary w-full py-4 text-base rounded-2xl"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={16} />}
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>

                <button
                  type="button"
                  onClick={() => { setStep('MOBILE'); setOtp(''); setError(''); }}
                  className="w-full py-2.5 text-sm font-semibold text-muted hover:text-primary-600 transition-colors"
                >
                  ← Edit mobile number
                </button>
              </motion.form>
            )}
          </div>
        </div>

        {/* Trust stripe */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted font-medium">
          <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-green-500" /> SSL Secured</span>
          <span className="flex items-center gap-1.5">🇮🇳 Made in India</span>
          <span className="flex items-center gap-1.5">🔒 OTP Verified</span>
        </div>
      </motion.div>
    </div>
  );
}
