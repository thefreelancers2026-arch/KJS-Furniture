'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1a1c1c] text-white relative overflow-hidden">
      {/* Gold accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#735c00] flex items-center justify-center">
                <span className="text-white font-serif font-bold">K</span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold tracking-tight">KGS Home Decors</h3>
              </div>
            </div>
            <p className="text-sm text-[#a0a0a0] leading-relaxed mb-4">
              Transform your space with elegance. Premium home decor and furniture curated for the discerning taste.
            </p>
            <div className="flex gap-3">
              {['facebook', 'instagram', 'twitter'].map(social => (
                <a key={social} href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#D4AF37]/20 flex items-center justify-center transition-all hover:scale-110 border border-white/10 hover:border-[#D4AF37]/50">
                  <span className="text-xs text-[#a0a0a0] uppercase">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-[0.15em] text-[#D4AF37] mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Shop All', href: '/products' },
                { label: 'Furniture', href: '/products?category=Furniture' },
                { label: 'Decorative Items', href: '/products?category=Decorative Items' },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[#a0a0a0] hover:text-[#D4AF37] transition-colors inline-flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-[#D4AF37]/0 group-hover:bg-[#D4AF37] transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-[0.15em] text-[#D4AF37] mb-5">Categories</h4>
            <ul className="space-y-3">
              {['Plants & Greenery', 'Gifts & Interior', 'Wall Art', 'Lighting'].map(cat => (
                <li key={cat}>
                  <Link href={`/products?category=${encodeURIComponent(cat)}`} className="text-sm text-[#a0a0a0] hover:text-[#D4AF37] transition-colors inline-flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-[#D4AF37]/0 group-hover:bg-[#D4AF37] transition-all" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-[0.15em] text-[#D4AF37] mb-5">Visit Us</h4>
            <div className="space-y-4 text-sm text-[#a0a0a0]">
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>185/G, Junction Rd, Virudhachalam, Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Open: 10 AM – 10 PM</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v18l7-3 7 3V3H5z" />
                </svg>
                <span>Free Parking Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[#666]">© 2026 KGS Home Decors. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/admin/login" className="text-xs text-[#666] hover:text-[#D4AF37] transition-colors">Admin</Link>
          </div>
        </div>
      </div>

      {/* Decorative */}
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-[#D4AF37]/[0.02] blur-3xl pointer-events-none" />
    </footer>
  );
}
