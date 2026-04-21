'use client';

import { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'invalid'>('idle');
  const [deliveryDate, setDeliveryDate] = useState('');

  const handleCheck = () => {
    if (!pincode || pincode.length !== 6) {
      setStatus('invalid');
      return;
    }
    
    setStatus('checking');
    setTimeout(() => {
      setStatus('success');
      // Mock delivery dates
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 4) + 2);
      setDeliveryDate(date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }));
    }, 800);
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={16} className="text-navy-400" />
        <span className="text-sm font-bold text-navy-900">Check Delivery</span>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            maxLength={6}
            placeholder="Enter Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full bg-surface-alt border border-border rounded-xl px-4 py-2.5 text-sm font-medium text-navy-900 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>
        <button
          onClick={handleCheck}
          disabled={status === 'checking' || pincode.length < 6}
          className="bg-navy-900 hover:bg-navy-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
        >
          {status === 'checking' ? '...' : 'Check'}
        </button>
      </div>

      {status === 'success' && (
        <div className="mt-3 flex items-start gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
          <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
          <span>Delivery generally within <strong>{deliveryDate}</strong></span>
        </div>
      )}
      
      {status === 'invalid' && (
        <div className="mt-3 flex items-start gap-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>Please enter a valid 6-digit Pincode.</span>
        </div>
      )}
    </div>
  );
}
