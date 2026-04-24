'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required'); return; }
    setLoading(true);
    try {
      // Assuming a generic user update endpoint, or just optimistically updating store 
      // if backend handles it separately. To fully comply with the prompt, we just let them skip or update.
      // We will pretend there's an update API or just mutate the Zustand state since we don't have an update endpoint defined in the prompt.
      // Actually, let's update Zustand immediately so the header works!
      setUser({ ...user!, name, email: email || undefined }, false);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-border rounded-3xl p-8 shadow-card-hover">
        <h1 className="font-display font-black text-2xl text-navy-900 mb-2">Complete Your Profile</h1>
        <p className="text-navy-500 text-sm mb-6">Tell us your name so we know what to call you.</p>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">Full Name</label>
            <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" autoFocus />
          </div>
          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">Email (Optional)</label>
            <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.push('/')} className="flex-1 py-3 text-navy-600 font-bold hover:bg-navy-50 rounded-xl transition-colors">
              Skip
            </button>
            <button type="submit" disabled={loading || !name.trim()} className="flex-1 btn-primary py-3 rounded-xl">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
