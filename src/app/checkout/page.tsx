'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const steps = ['Shipping Address', 'Order Review', 'Place Order'];

function Confetti() {
  const colors = ['#D4AF37', '#ffe088', '#735c00', '#F5F5DC', '#4CAF50', '#81C784'];
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
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

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&location=${pos.coords.longitude},${pos.coords.latitude}`);
          const data = await res.json();
          
          if (data && data.address && data.address.LongLabel) {
            setAddress(data.address.LongLabel);
          } else if (data && data.address && data.address.Match_addr) {
            setAddress(data.address.Match_addr);
          } else {
            setError('Could not fetch exact street address. Please enter manually.');
          }
        } catch (err) {
          setError('Failed to fetch location data. Please enter manually.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setError(error.message || 'Location access denied or unavailable.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[#050505] text-white relative">
        <BackgroundVideo />
        <Navbar />
        <div className="relative z-10 pt-28 text-center py-20">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <span className="text-5xl mb-4 block">🔐</span>
          </motion.div>
          <h2 className="font-serif text-2xl font-semibold mb-3">Please login to checkout</h2>
          <Link href="/login" className="px-8 py-3 bg-[#D4AF37] hover:bg-[#EBCA68] text-black text-xs font-bold tracking-[0.2em] uppercase transition-all rounded-sm mt-4 inline-block">Login / Sign Up</Link>
        </div>
      </main>
    );
  }

  if (items.length === 0 && !orderSuccess) {
    return (
      <main className="min-h-screen bg-[#050505] text-white relative">
        <BackgroundVideo />
        <Navbar />
        <div className="relative z-10 pt-28 text-center py-20">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <span className="text-5xl mb-4 block">🛒</span>
          </motion.div>
          <h2 className="font-serif text-2xl font-semibold mb-3 text-white">Your cart is empty</h2>
          <Link href="/products" className="px-8 py-3 bg-[#D4AF37] hover:bg-[#EBCA68] text-black text-xs font-bold tracking-[0.2em] uppercase transition-all rounded-sm mt-4 inline-block">Shop Now</Link>
        </div>
      </main>
    );
  }

  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-[#050505] text-white relative">
        <BackgroundVideo />
        <Navbar />
        {showConfetti && <Confetti />}
        <div className="relative z-10 pt-28 max-w-lg mx-auto px-4 text-center py-20">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-700 border border-white/20 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20"
          >
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </motion.svg>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="font-serif text-3xl font-bold mb-3 text-green-400">Order Placed! 🎉</h1>
            <p className="text-white/60 mb-2">Thank you for shopping with KGS Home Decors</p>
            <div className="inline-block px-4 py-2 rounded-xl liquid-glass bg-black/40 border border-white/10 mt-3 mb-8">
              <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-1">Order ID</p>
              <p className="font-mono font-bold text-lg text-[#D4AF37]">{orderSuccess}</p>
            </div>
            <p className="text-sm text-white/40 mb-6">We'll prepare your order and keep you updated on the delivery status.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/orders" className="px-6 py-3 bg-[#D4AF37] hover:bg-[#EBCA68] text-black text-xs font-bold tracking-[0.2em] uppercase transition-all rounded-sm">View My Orders</Link>
              <Link href="/products" className="px-6 py-3 border border-white/20 text-white/90 hover:bg-white/5 text-xs font-bold tracking-[0.2em] uppercase transition-all rounded-sm">Continue Shopping</Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  const handlePlaceOrder = async () => {
    if (!address.trim()) { setError('Please enter your delivery address'); setStep(0); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
          address,
          landmark,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      clearCart();
      setOrderSuccess(data.order.id);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const canNext = () => {
    if (step === 0) return address.trim().length > 0;
    return true;
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-white relative">
      <BackgroundVideo />
      <Navbar />

      <div className="relative z-10 pt-[90px] pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-medium">Checkout</span>
            <h1 className="font-serif text-3xl font-bold mt-2 text-white/90">Complete Your Order</h1>
            <div className="w-12 h-[2px] bg-[#D4AF37] mt-3 mb-8 opacity-70" />
          </motion.div>

          {/* Step Indicator */}
          <div className="flex items-center mb-10 max-w-md mx-auto">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{ scale: step === i ? 1.1 : 1 }}
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold transition-colors ${
                      step > i 
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-black' 
                        : step === i 
                          ? 'bg-black/60 border-[#D4AF37] text-[#D4AF37]' 
                          : 'bg-black/40 border-white/20 text-white/50'
                    }`}
                  >
                    {step > i ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </motion.div>
                  <span className={`text-[10px] mt-2 text-center uppercase tracking-wider font-semibold hidden sm:block ${step === i ? 'text-[#D4AF37]' : 'text-white/40'}`}>
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-[2px] mx-2 transition-colors ${step > i ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-sm bg-red-950/40 border border-red-500/50 text-red-300 text-sm mb-6 liquid-glass"
            >
              {error}
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {/* Step 1: Address */}
                {step === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-6"
                  >
                    <div className="p-6 rounded-sm liquid-glass bg-black/40 border border-white/10">
                      <h2 className="font-serif text-lg font-semibold mb-4 text-white/90">Your Details</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-2">Name</label>
                          <div className="w-full bg-black/60 border border-white/5 px-4 py-3 text-sm text-white/40 outline-none rounded-sm cursor-not-allowed">{user.name}</div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-2">Phone</label>
                          <div className="w-full bg-black/60 border border-white/5 px-4 py-3 text-sm text-white/40 outline-none rounded-sm cursor-not-allowed">{user.phone}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-sm liquid-glass bg-black/40 border border-white/10">
                      <h2 className="font-serif text-lg font-semibold mb-4 text-white/90">Delivery Address</h2>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/50">Full Address *</label>
                            <button 
                              onClick={handleLocate}
                              disabled={isLocating}
                              className="text-[10px] font-bold tracking-widest uppercase text-[#D4AF37] hover:text-[#EBCA68] flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                               {isLocating ? (
                                <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                               ) : '📍'} Auto-Detect 
                            </button>
                          </div>
                          <textarea
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm text-white placeholder-white/20 outline-none rounded-sm transition-colors min-h-[100px] resize-none"
                            placeholder="Door No, Street Name, Area, City, Pincode"
                            required
                            id="checkout-address"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-2">
                            Landmark <span className="text-white/30 font-normal normal-case">(optional)</span>
                          </label>
                          <input
                            type="text"
                            value={landmark}
                            onChange={e => setLandmark(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm text-white placeholder-white/20 outline-none rounded-sm transition-colors"
                            placeholder="Near temple, opposite school, etc."
                            id="checkout-landmark"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Review */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-6"
                  >
                    <div className="p-6 rounded-sm liquid-glass bg-black/40 border border-white/10">
                      <h2 className="font-serif text-lg font-semibold mb-4 text-white/90">Shipping To</h2>
                      <div className="p-4 rounded-sm bg-black/40 border border-white/5">
                        <p className="font-medium text-sm text-white/90">{user.name}</p>
                        <p className="text-sm text-white/60 mt-1">{address}</p>
                        {landmark && <p className="text-xs text-white/40 mt-1">Landmark: {landmark}</p>}
                        <p className="text-sm text-white/60 mt-1">📞 {user.phone}</p>
                        <button onClick={() => setStep(0)} className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold mt-3 hover:underline">
                          Change Address
                        </button>
                      </div>
                    </div>

                    <div className="p-6 rounded-sm liquid-glass bg-black/40 border border-white/10">
                      <h2 className="font-serif text-lg font-semibold mb-4 text-white/90">Order Items ({items.length})</h2>
                      <div className="space-y-4">
                        {items.map(item => (
                          <div key={item.productId} className="flex gap-4 items-center">
                            <div className="relative w-16 h-16 rounded-sm overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                              <Image src={item.image} alt={item.name} fill className="object-cover opacity-90" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate text-white/90">{item.name}</p>
                              <p className="text-[10px] uppercase tracking-wider text-white/50 mt-1">Qty: {item.quantity}</p>
                            </div>
                            <span className="text-sm font-medium text-white/90 whitespace-nowrap">
                              <span className="text-[#D4AF37] mr-0.5">₹</span>{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Confirm */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-6"
                  >
                    <div className="p-6 rounded-sm liquid-glass bg-black/40 border border-white/10 text-center">
                      <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🎁</span>
                      </div>
                      <h2 className="font-serif text-xl font-semibold mb-2 text-white/90">Ready to Place Order?</h2>
                      <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
                        Your order of <span className="font-semibold text-[#D4AF37]">₹{totalPrice.toLocaleString('en-IN')}</span> will be delivered to the provided address. We'll keep you updated on the status.
                      </p>
                    </div>

                    <div className="p-6 rounded-sm liquid-glass bg-black/40 border border-white/10">
                      <h3 className="text-xs uppercase tracking-widest font-bold mb-4 text-[#D4AF37]">Order Summary</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-white/70">
                          <span>Items ({items.length})</span>
                          <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-white/70">
                          <span>Delivery</span>
                          <span className="text-green-400 font-medium">Free</span>
                        </div>
                        <div className="h-[1px] bg-white/10 my-2" />
                        <div className="flex justify-between">
                          <span className="font-semibold text-base text-white/90">Total</span>
                          <span className="text-xl font-medium text-white"><span className="text-[#D4AF37]">₹</span>{totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6">
                {step > 0 && (
                  <button onClick={() => setStep(step - 1)} className="px-6 py-4 border border-white/20 text-white/80 hover:bg-white/5 text-xs font-bold tracking-[0.2em] uppercase transition-all rounded-sm flex items-center justify-center">
                    ← Back
                  </button>
                )}
                {step < 2 ? (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (step === 0 && !address.trim()) { setError('Please enter your delivery address'); return; }
                      setError('');
                      setStep(step + 1);
                    }}
                    disabled={!canNext()}
                    className="flex-1 py-4 bg-[#D4AF37] hover:bg-[#EBCA68] text-black text-xs font-bold tracking-[0.2em] uppercase transition-all rounded-sm disabled:opacity-50 flex items-center justify-center"
                  >
                    Continue →
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 py-4 bg-[#D4AF37] hover:bg-[#EBCA68] text-black text-xs font-bold tracking-[0.2em] uppercase transition-all rounded-sm disabled:opacity-50 flex items-center justify-center"
                    id="place-order"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Placing Order...
                      </span>
                    ) : '🎉 Place Order'}
                  </motion.button>
                )}
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-32 p-6 rounded-sm liquid-glass bg-black/40 border border-white/10">
                <h2 className="text-[10px] uppercase tracking-widest font-bold mb-5 text-[#D4AF37]">Order Overview</h2>
                <div className="space-y-4 mb-5 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {items.map(item => (
                    <div key={item.productId} className="flex gap-3 items-center">
                      <div className="relative w-12 h-12 rounded-sm overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                        <Image src={item.image} alt={item.name} fill className="object-cover opacity-90" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate text-white/90">{item.name}</p>
                        <p className="text-[10px] uppercase font-bold text-white/40 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold text-white/90 whitespace-nowrap"><span className="text-[#D4AF37]">₹</span>{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className="h-[1px] bg-white/10 my-4" />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Delivery</span>
                    <span className="text-green-400 font-medium tracking-wide">FREE</span>
                  </div>
                  <div className="h-[1px] bg-white/10 my-3" />
                  <div className="flex justify-between">
                    <span className="font-medium text-base text-white/90">Total</span>
                    <span className="text-lg font-semibold text-white"><span className="text-[#D4AF37] text-sm">₹</span>{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
