'use client';

import { useEffect, useState } from 'react';
import { Package, Clock, Truck, CheckCircle2, ChevronRight, Ban } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await api.orders.getAll();
      setOrders(data);
    } catch { /* ignoring */ }
    finally { setLoading(false); }
  };

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'PENDING': return { icon: <Clock size={16}/>, color: 'text-amber-600 bg-amber-50', bg: 'border-amber-200' };
      case 'CONFIRMED': return { icon: <CheckCircle2 size={16}/>, color: 'text-blue-600 bg-blue-50', bg: 'border-blue-200' };
      case 'SHIPPED': return { icon: <Truck size={16}/>, color: 'text-purple-600 bg-purple-50', bg: 'border-purple-200' };
      case 'DELIVERED': return { icon: <CheckCircle2 size={16}/>, color: 'text-green-600 bg-green-50', bg: 'border-green-200' };
      case 'CANCELLED': return { icon: <Ban size={16}/>, color: 'text-red-600 bg-red-50', bg: 'border-red-200' };
      default: return { icon: <Package size={16}/>, color: 'text-slate-600 bg-slate-50', bg: 'border-slate-200' };
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400 font-bold">Syncing Orders...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-bold text-foreground mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-3xl border border-border">
          <Package className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold mb-2">No orders found</h3>
          <p className="text-slate-500 mb-6">Looks like you haven&apos;t mathematically executed any purchases yet.</p>
          <Link href="/products" className="px-6 py-3 bg-primary-600 text-white font-bold rounded-full">Explore Collection</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const status = getStatusInfo(order.status);
            return (
              <div key={order.id} className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg">Order #{order.id.slice(0,8).toUpperCase()}</h3>
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.color} ${status.bg}`}>
                        {status.icon} {order.status}
                      </div>
                    </div>
                    <div className="text-slate-500 text-sm mt-1">Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Total Calculation</div>
                    <div className="font-bold text-lg text-primary-600">₹{(order.total_paise/100).toLocaleString('en-IN')}</div>
                  </div>
                </div>

                <div className="py-6 flex gap-4 overflow-x-auto snap-x">
                  {order.order_items.map((img:any) => (
                    <div key={img.id} className="relative w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                       <Image src={img.variant?.product?.images?.[0] || 'https://via.placeholder.com/150'} alt="Item" fill className="object-cover" />
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <button className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    View Complete Details <ChevronRight size={16}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
