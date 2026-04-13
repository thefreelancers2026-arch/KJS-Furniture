'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  address: string;
  createdAt: string;
}

const BackgroundVideo = () => (
  <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
    <video 
      autoPlay 
      loop 
      muted 
      playsInline 
      className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-screen"
    >
      <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4" type="video/mp4" />
    </video>
    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#050505]/50 to-[#050505]" />
  </div>
);

export default function OrdersPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-[#D4AF37] border-[#D4AF37]/50 bg-[#D4AF37]/10 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold';
      case 'Confirmed': return 'text-blue-400 border-blue-400/50 bg-blue-900/40 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold';
      case 'Shipped': return 'text-purple-400 border-purple-400/50 bg-purple-900/40 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold';
      case 'Delivered': return 'text-green-400 border-green-400/50 bg-green-900/40 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold';
      default: return 'text-[#D4AF37] border-[#D4AF37]/50 bg-[#D4AF37]/10 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold';
    }
  };

  if (authLoading || !user) {
    return (
      <main className="min-h-screen bg-[#050505] text-white relative">
        <BackgroundVideo />
        <Navbar />
        <div className="relative z-10 pt-28 text-center py-20 flex flex-col items-center">
          {authLoading ? (
            <div className="flex flex-col items-center gap-6">
              <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[#D4AF37] animate-spin" />
              <p className="text-xs tracking-widest uppercase font-medium text-[#D4AF37]">Authenticating</p>
            </div>
          ) : (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                <span className="text-5xl mb-4 block">🔐</span>
              </motion.div>
              <h2 className="font-serif text-2xl font-semibold mb-3 text-white">Please login to view orders</h2>
              <Link href="/login" className="px-8 py-3 bg-[#D4AF37] hover:bg-[#EBCA68] text-black text-xs font-bold tracking-[0.2em] uppercase transition-all rounded-sm mt-4 inline-block">Login</Link>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-white relative">
      <BackgroundVideo />
      <Navbar />

      <div className="relative z-10 pt-[90px] pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          {/* Profile Header */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="p-6 sm:p-8 rounded-sm liquid-glass bg-black/40 border border-white/10 mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C7423] border-2 border-[#D4AF37]/50 flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <span className="text-black font-serif font-bold text-xl">{user.name[0]}</span>
              </div>
              <div>
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-white/90">{user.name}</h1>
                <p className="text-sm text-white/60 mt-1">{user.phone} {user.email ? `• ${user.email}` : ''}</p>
              </div>
            </div>
          </motion.div>

          {/* Orders */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
          >
            <h2 className="font-serif text-2xl font-bold mb-6 text-white/90">My Orders Dashboard</h2>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-6 rounded-sm bg-black/40 border border-white/5 animate-pulse">
                    <div className="h-4 bg-white/10 rounded-sm w-1/3 mb-4" />
                    <div className="h-3 bg-white/10 rounded-sm w-2/3 mb-3" />
                    <div className="h-3 bg-white/10 rounded-sm w-1/2" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 liquid-glass bg-black/40 border border-white/10 rounded-sm">
                <span className="text-5xl mb-4 block">📦</span>
                <h3 className="font-serif text-xl font-semibold mb-2 text-white/90">No orders yet</h3>
                <p className="text-sm text-white/50 mb-6">Start shopping to see your beautifully curated pieces here.</p>
                <Link href="/products" className="px-8 py-3 bg-[#D4AF37] hover:bg-[#EBCA68] text-black text-xs font-bold tracking-[0.2em] uppercase transition-all rounded-sm inline-block">Browse Collection</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    key={order.id} 
                    className="p-5 sm:p-6 rounded-sm liquid-glass bg-black/40 border border-white/10 hover:border-white/30 transition-all hover:bg-black/60 group"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Order ID</p>
                        <p className="font-mono font-bold text-[#D4AF37] text-lg">{order.id}</p>
                      </div>
                      <div className="flex items-start gap-4">
                        <span className={`border ${getStatusClass(order.status)}`}>{order.status}</span>
                        <span className="text-[10px] text-white/50 uppercase font-semibold tracking-wider mt-1">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-white/80">{item.productName} <span className="text-white/40 ml-2">× {item.quantity}</span></span>
                          <span className="font-medium text-white/90">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
                         📍 <span className="normal-case opacity-80">{order.address.substring(0, 50)}{order.address.length > 50 ? '...' : ''}</span>
                      </span>
                      <span className="text-xl font-medium text-white"><span className="text-[#D4AF37] text-sm">₹</span>{order.totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
