'use client';

import { useState } from 'react';
import { sendOTP, verifyOTP } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const setUser = useAuthStore((state) => state.setUser);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      await sendOTP(mobile, 'recaptcha-container');
      setStep('OTP');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (otp.length < 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const idToken = await verifyOTP(otp);
      
      // Send token to our backend
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/verify-otp`;
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        let errText = await res.text();
        throw new Error(`Fetch failed! URL: ${url} | Status: ${res.status} | Body: ${errText}`);
      }

      const data = await res.json();
      setUser(data.user);
      window.location.href = '/'; // Hard redirect to guarantee navigation triggers
    } catch (err: any) {
      console.error('Login Verification Error:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl glass-card shadow-lg border border-border">
        <h1 className="text-2xl font-display font-bold text-center mb-6">
          {step === 'MOBILE' ? 'Login or Sign Up' : 'Verify OTP'}
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-800/30">
            {error}
          </div>
        )}

        {step === 'MOBILE' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Enter your 10 digit number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div id="recaptcha-container"></div>
            <button
              type="submit"
              disabled={loading || mobile.length < 10}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Enter OTP sent to +91 {mobile}
              </label>
              <input
                type="text"
                maxLength={6}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-center tracking-widest text-lg transition-all font-bold"
                placeholder="------"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              Verify & Login
            </button>

            <button
              type="button"
              onClick={() => setStep('MOBILE')}
              className="w-full py-2 text-sm text-slate-500 hover:text-primary-600 transition-colors"
            >
              Edit mobile number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
