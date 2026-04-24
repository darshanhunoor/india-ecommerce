import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CheckCircle2, Phone, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddressStep({
  addresses, selectedAddress, setSelectedAddress,
  showNewAddress, setShowNewAddress,
  pincode, setPincode, serviceable, onNext, setAddresses
}: any) {
  const [formData, setFormData] = useState({ label: 'Home', flat: '', street: '', city: '', state: 'State' });
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAddress = async () => {
    if (!formData.flat || !formData.street || !formData.city || pincode.length !== 6) {
      return toast.error('Please fill all required fields');
    }
    setIsSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/addresses`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, pin_code: pincode })
      });
      if (!res.ok) throw new Error('Failed to save address');
      const newAddr = await res.json();
      setAddresses((prev: any) => [newAddr, ...prev]);
      setSelectedAddress(newAddr.id);
      setShowNewAddress(false);
      toast.success('Address saved successfully');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div key="step-0" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}} className="space-y-6">
      <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2"><MapPin className="text-primary-500" /> Select Delivery Address</h2>
      
      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="p-6 bg-surface-alt border border-dashed border-border rounded-2xl text-center">
          <p className="text-navy-500 font-medium text-sm">No saved addresses yet. Add one to checkout faster next time.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr: any) => (
            <div 
              key={addr.id} 
              onClick={() => setSelectedAddress(addr.id)}
              className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-150 border-2 ${selectedAddress === addr.id ? 'border-primary-500 bg-primary-50/30 shadow-sm' : 'border-border bg-surface hover:border-navy-300'}`}
            >
              {selectedAddress === addr.id && <span className="absolute top-3 right-3 text-primary-500"><CheckCircle2 size={22} className="fill-white" /></span>}
              <h4 className="font-bold text-navy-900 mb-1">{addr.name}</h4>
              <p className="text-sm text-navy-600 leading-relaxed mb-3">{addr.street}<br/>{addr.city}, {addr.state} {addr.pincode}</p>
              <span className="text-xs font-semibold text-navy-500 flex flex-col gap-1">
                <span className="flex items-center gap-1.5"><Phone size={12}/> +91 {addr.phone}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {addresses.length > 0 && <button onClick={() => setShowNewAddress(!showNewAddress)} className="text-primary-600 font-bold text-sm hover:underline">+ Add New Address</button>}
      
      <AnimatePresence>
        {showNewAddress && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-6 bg-surface border border-border rounded-2xl space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="floating-input-group col-span-2 sm:col-span-1">
                  <input type="text" placeholder=" " id="fname" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} />
                  <label htmlFor="fname">Label (e.g. Home, Office)</label>
                </div>
                <div className="floating-input-group col-span-2 sm:col-span-1">
                  <input type="text" placeholder=" " id="flat" value={formData.flat} onChange={e => setFormData({...formData, flat: e.target.value})} />
                  <label htmlFor="flat">Flat, House no., Building</label>
                </div>
                <div className="floating-input-group col-span-2">
                  <input type="text" placeholder=" " id="street" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
                  <label htmlFor="street">Area, Street, Sector, Village</label>
                </div>
                <div className="floating-input-group col-span-2 sm:col-span-1 relative">
                  <input type="text" placeholder=" " id="pin" maxLength={6} value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, ''))} />
                  <label htmlFor="pin">Pincode</label>
                  {serviceable === true && <CheckCircle2 size={16} className="absolute right-4 top-4 text-green-500 animate-fade-in" />}
                </div>
                <div className="floating-input-group col-span-2 sm:col-span-1">
                  <input type="text" placeholder=" " id="city" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                  <label htmlFor="city">City</label>
                </div>
              </div>
              {serviceable === false && <p className="text-xs text-red-500 font-medium">Sorry, we don&apos;t deliver to this pincode yet.</p>}
              <button 
                onClick={handleSaveAddress} 
                disabled={isSaving || serviceable === false}
                className="btn-secondary w-full text-sm font-bold flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : null} Save Address
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button onClick={onNext} className="btn-primary w-full sm:w-auto px-8">Continue to Delivery</button>
    </motion.div>
  );
}
