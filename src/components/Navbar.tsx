'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#735c00] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-white font-serif font-bold text-sm sm:text-base">K</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A] tracking-tight leading-none">KGS</span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#7f7663] leading-none font-medium">Home Decors</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/products" className="nav-link">Shop</Link>
              {user && user.role === 'user' && (
                <Link href="/orders" className="nav-link">My Orders</Link>
              )}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Cart - Opens drawer */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-xl hover:bg-[#f3f3f3] transition-colors group"
                id="cart-btn"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#1A1A1A] group-hover:text-[#735c00] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-[#D4AF37] to-[#735c00] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow animate-pop">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Auth */}
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm font-medium text-[#4d4635] max-w-[100px] truncate">{user.name}</span>
                  <button onClick={logout} className="text-xs font-medium text-[#7f7663] hover:text-[#735c00] transition-colors px-3 py-1.5 rounded-lg border border-[#d0c5af] hover:border-[#D4AF37]">
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#554300] bg-gradient-to-r from-[#ffe088] to-[#D4AF37] rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all hover:scale-105">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Login
                </Link>
              )}

              {/* Mobile menu */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-[#f3f3f3] transition-colors" id="mobile-menu-btn">
                <svg className="w-5 h-5 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-96 border-t border-[#eeeeee]' : 'max-h-0'}`}>
          <div className="px-4 py-4 space-y-1 bg-white/90 backdrop-blur-xl">
            <Link href="/" onClick={() => setMenuOpen(false)} className="block py-2.5 px-4 rounded-xl text-sm font-medium text-[#1A1A1A] hover:bg-[#f3f3f3] transition-colors">Home</Link>
            <Link href="/products" onClick={() => setMenuOpen(false)} className="block py-2.5 px-4 rounded-xl text-sm font-medium text-[#1A1A1A] hover:bg-[#f3f3f3] transition-colors">Shop</Link>
            {user && user.role === 'user' && (
              <Link href="/orders" onClick={() => setMenuOpen(false)} className="block py-2.5 px-4 rounded-xl text-sm font-medium text-[#1A1A1A] hover:bg-[#f3f3f3] transition-colors">My Orders</Link>
            )}
            <div className="pt-2 border-t border-[#eeeeee]">
              {user ? (
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm font-medium text-[#4d4635]">{user.name}</span>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="text-xs font-medium text-[#735c00] border border-[#D4AF37] px-3 py-1.5 rounded-lg">Logout</button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block py-2.5 px-4 rounded-xl text-sm font-semibold text-[#554300] bg-gradient-to-r from-[#ffe088] to-[#D4AF37] text-center">Login / Sign Up</Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
