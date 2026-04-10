'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--surface-lowest)] z-[61] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--surface-container)]">
              <div>
                <h2 className="font-serif text-xl font-bold">Shopping Cart</h2>
                <p className="text-xs text-[var(--outline)] mt-0.5">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[var(--surface-low)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-5xl mb-4">🛍️</span>
                  <h3 className="font-serif text-lg font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-sm text-[var(--outline)] mb-6">Discover our curated collections</p>
                  <Link href="/products" onClick={onClose} className="btn-primary">
                    Explore Collection
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map(item => (
                      <motion.div
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="flex gap-4 p-3 rounded-xl bg-[var(--surface-low)] group"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--surface-container)]">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                          <p className="price-display text-base mt-0.5">
                            <span className="currency">₹</span>{item.price.toLocaleString('en-IN')}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="inline-flex items-center rounded-lg bg-[var(--surface-container)] overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-xs hover:bg-[var(--surface-high)] transition-colors"
                              >−</button>
                              <span className="w-7 h-7 flex items-center justify-center text-xs font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-xs hover:bg-[var(--surface-high)] transition-colors"
                              >+</button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-[10px] text-red-400 hover:text-red-500 transition-colors font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-[var(--surface-container)] bg-[var(--surface-lowest)]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-[var(--on-surface-variant)]">Subtotal</span>
                  <span className="price-display text-xl">
                    <span className="currency">₹</span>{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="btn-gold-solid w-full py-4 text-center"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="btn-secondary w-full py-3 mt-2 text-center"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
