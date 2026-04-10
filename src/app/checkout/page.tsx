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
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`, {
            headers: {
              'Accept-Language': 'en',
              'User-Agent': 'KGSHomeDecors/1.0'
            }
          });
          const data = await res.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
          } else {
            setError('Could not fetch address from coordinates.');
          }
        } catch (err) {
          setError('Failed to fetch location data.');
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setError('Location access denied or unavailable.');
        setIsLocating(false);
      }
    );
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[var(--surface)]">
        <Navbar />
        <div className="pt-28 text-center py-20">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <span className="text-5xl mb-4 block">🔐</span>
          </motion.div>
          <h2 className="font-serif text-2xl font-semibold mb-3">Please login to checkout</h2>
          <Link href="/login" className="btn-primary mt-4 inline-block">Login / Sign Up</Link>
        </div>
      </main>
    );
  }

  if (items.length === 0 && !orderSuccess) {
    return (
      <main className="min-h-screen bg-[var(--surface)]">
        <Navbar />
        <div className="pt-28 text-center py-20">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <span className="text-5xl mb-4 block">🛒</span>
          </motion.div>
          <h2 className="font-serif text-2xl font-semibold mb-3">Your cart is empty</h2>
          <Link href="/products" className="btn-primary mt-4 inline-block">Shop Now</Link>
        </div>
      </main>
    );
  }

  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-[var(--surface)]">
        <Navbar />
        {showConfetti && <Confetti />}
        <div className="pt-28 max-w-lg mx-auto px-4 text-center py-20">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20"
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
            <h1 className="font-serif text-3xl font-bold mb-3 text-green-700">Order Placed! 🎉</h1>
            <p className="text-[var(--on-surface-variant)] mb-2">Thank you for shopping with KGS Home Decors</p>
            <div className="inline-block px-4 py-2 rounded-xl bg-[var(--surface-low)] mt-3 mb-8">
              <p className="text-xs text-[var(--outline)] uppercase tracking-wider">Order ID</p>
              <p className="font-mono font-bold text-lg text-[var(--gold-dark)]">{orderSuccess}</p>
            </div>
            <p className="text-sm text-[var(--outline)] mb-6">We&apos;ll prepare your order and keep you updated on the delivery status.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/orders" className="btn-primary">View My Orders</Link>
              <Link href="/products" className="btn-secondary">Continue Shopping</Link>
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
    <main className="min-h-screen bg-[var(--surface)]">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--outline)] font-medium">Checkout</span>
            <h1 className="font-serif text-3xl font-bold mt-2">Complete Your Order</h1>
            <div className="w-12 h-[2px] bg-[#D4AF37] mt-3 mb-8" />
          </motion.div>

          {/* Step Indicator */}
          <div className="flex items-center mb-10 max-w-md mx-auto">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: step === i ? 1.1 : 1,
                    }}
                    className={`step-dot ${step > i ? 'completed' : step === i ? 'active' : 'inactive'}`}
                  >
                    {step > i ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </motion.div>
                  <span className="text-[10px] mt-2 text-center text-[var(--outline)] font-medium hidden sm:block">{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`step-line ${step > i ? 'active' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm mb-6"
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
                    <div className="p-6 rounded-2xl bg-[var(--surface-lowest)]">
                      <h2 className="font-serif text-lg font-semibold mb-4">Your Details</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] mb-2">Name</label>
                          <div className="input-subtle bg-[var(--surface-container)] cursor-not-allowed opacity-70">{user.name}</div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] mb-2">Phone</label>
                          <div className="input-subtle bg-[var(--surface-container)] cursor-not-allowed opacity-70">{user.phone}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[var(--surface-lowest)]">
                      <h2 className="font-serif text-lg font-semibold mb-4">Delivery Address</h2>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-variant)]">Full Address *</label>
                            <button 
                              onClick={handleLocate}
                              disabled={isLocating}
                              className="text-xs font-semibold tracking-wider uppercase text-[#D4AF37] hover:text-[#735c00] flex items-center gap-1 transition-colors disabled:opacity-50"
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
                            className="input-subtle min-h-[100px] resize-none"
                            placeholder="Door No, Street Name, Area, City, Pincode"
                            required
                            id="checkout-address"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] mb-2">
                            Landmark <span className="text-[var(--outline)] font-normal normal-case">(optional)</span>
                          </label>
                          <input
                            type="text"
                            value={landmark}
                            onChange={e => setLandmark(e.target.value)}
                            className="input-subtle"
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
                    <div className="p-6 rounded-2xl bg-[var(--surface-lowest)]">
                      <h2 className="font-serif text-lg font-semibold mb-4">Shipping To</h2>
                      <div className="p-4 rounded-xl bg-[var(--surface-low)]">
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-sm text-[var(--on-surface-variant)] mt-1">{address}</p>
                        {landmark && <p className="text-xs text-[var(--outline)] mt-1">Landmark: {landmark}</p>}
                        <p className="text-sm text-[var(--on-surface-variant)] mt-1">📞 {user.phone}</p>
                        <button onClick={() => setStep(0)} className="text-xs text-[var(--gold-dark)] font-semibold mt-2 hover:underline">
                          Change Address
                        </button>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[var(--surface-lowest)]">
                      <h2 className="font-serif text-lg font-semibold mb-4">Order Items ({items.length})</h2>
                      <div className="space-y-4">
                        {items.map(item => (
                          <div key={item.productId} className="flex gap-4 items-center">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--surface-container)]">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              <p className="text-xs text-[var(--outline)]">Qty: {item.quantity}</p>
                            </div>
                            <span className="price-display text-sm whitespace-nowrap">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
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
                    <div className="p-6 rounded-2xl bg-[var(--surface-lowest)] text-center">
                      <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🎁</span>
                      </div>
                      <h2 className="font-serif text-xl font-semibold mb-2">Ready to Place Order?</h2>
                      <p className="text-sm text-[var(--on-surface-variant)] max-w-md mx-auto">
                        Your order of <span className="font-semibold text-[var(--gold-dark)]">₹{totalPrice.toLocaleString('en-IN')}</span> will be delivered to the provided address. We&apos;ll keep you updated on the status.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-[var(--surface-lowest)]">
                      <h3 className="text-sm font-semibold mb-3">Order Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-[var(--on-surface-variant)]">
                          <span>Items ({items.length})</span>
                          <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-[var(--on-surface-variant)]">
                          <span>Delivery</span>
                          <span className="text-green-600 font-medium">Free</span>
                        </div>
                        <div className="h-[1px] bg-[var(--surface-container)] my-2" />
                        <div className="flex justify-between">
                          <span className="font-semibold text-base">Total</span>
                          <span className="price-display text-xl"><span className="currency">₹</span>{totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6">
                {step > 0 && (
                  <button onClick={() => setStep(step - 1)} className="btn-secondary">
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
                    className="btn-gold-solid flex-1 py-4 disabled:opacity-50"
                  >
                    Continue →
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="btn-gold-solid flex-1 py-4 disabled:opacity-50"
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
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 rounded-2xl bg-[var(--surface-lowest)] shadow-sm">
                <h2 className="font-serif text-lg font-semibold mb-5">Order Summary</h2>
                <div className="space-y-3 mb-5 max-h-48 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.productId} className="flex gap-3 items-center">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--surface-container)]">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.name}</p>
                        <p className="text-xs text-[var(--outline)]">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold text-[var(--gold-dark)] whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className="h-[1px] bg-[var(--surface-container)] my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[var(--on-surface-variant)]">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[var(--on-surface-variant)]">
                    <span>Delivery</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="h-[1px] bg-[var(--surface-container)] my-2" />
                  <div className="flex justify-between">
                    <span className="font-semibold text-base">Total</span>
                    <span className="price-display text-xl"><span className="currency">₹</span>{totalPrice.toLocaleString('en-IN')}</span>
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
