'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <main className="min-h-screen bg-[var(--surface)]">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--outline)] font-medium">Your Selection</span>
            <h1 className="font-serif text-3xl font-bold mt-2">Shopping Cart</h1>
            <div className="w-12 h-[2px] bg-[#D4AF37] mt-3 mb-8" />
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <span className="text-6xl mb-4 block">🛍️</span>
              <h2 className="font-serif text-2xl font-semibold mb-3">Your cart is empty</h2>
              <p className="text-[var(--outline)] mb-6">Discover our curated collection and find something you love</p>
              <Link href="/products" className="btn-primary">Explore Collection</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map(item => (
                  <div key={item.productId} className="flex gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-[var(--surface-lowest)] animate-fade-in group">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--surface-container)]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.productId}`} className="font-serif text-base sm:text-lg font-semibold text-[var(--on-surface)] hover:text-[var(--gold-dark)] transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <div className="price-display text-lg mt-1">
                        <span className="currency">₹</span>{item.price.toLocaleString('en-IN')}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center rounded-lg bg-[var(--surface-low)] overflow-hidden">
                          <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-sm hover:bg-[var(--surface-container)] transition-colors">−</button>
                          <span className="w-8 h-8 flex items-center justify-center text-xs font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-sm hover:bg-[var(--surface-container)] transition-colors">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.productId)} className="text-xs text-red-400 hover:text-red-500 transition-colors font-medium">
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center">
                      <span className="price-display text-lg whitespace-nowrap">
                        <span className="currency">₹</span>{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 p-6 rounded-2xl bg-[var(--surface-lowest)] shadow-sm">
                  <h2 className="font-serif text-lg font-semibold mb-5">Order Summary</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-[var(--on-surface-variant)]">
                      <span>Subtotal ({items.length} items)</span>
                      <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[var(--on-surface-variant)]">
                      <span>Delivery</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="h-[1px] bg-[var(--surface-container)] my-3" />
                    <div className="flex justify-between">
                      <span className="font-semibold text-base">Total</span>
                      <span className="price-display text-xl"><span className="currency">₹</span>{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <Link href="/checkout" className="btn-gold-solid w-full py-4 mt-6" id="proceed-checkout">
                    Proceed to Checkout
                  </Link>
                  <Link href="/products" className="btn-secondary w-full py-3 mt-3 text-center">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
