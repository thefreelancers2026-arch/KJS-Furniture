'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

function AdminLayoutInner({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Allow login page without auth
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1c1c]">
        <div className="text-center">
          <span className="text-5xl mb-4 block">🔐</span>
          <h2 className="font-serif text-2xl font-semibold text-white mb-3">Admin Access Required</h2>
          <Link href="/admin/login" className="btn-gold-solid">Admin Login</Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '📦' },
    { href: '/admin/orders', label: 'Orders', icon: '🛒' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
  ];

  return (
    <div className="min-h-screen bg-[var(--surface)] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#1a1c1c] text-white fixed h-screen z-30">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#735c00] flex items-center justify-center">
              <span className="text-white font-serif font-bold text-sm">K</span>
            </div>
            <div>
              <p className="font-serif text-sm font-bold">KGS Admin</p>
              <p className="text-[10px] text-white/40">Control Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === item.href ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all">
            🏪 View Store
          </Link>
          <button onClick={() => { logout(); router.push('/admin/login'); }} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all mt-1">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#1a1c1c] text-white">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#735c00] flex items-center justify-center">
              <span className="text-white font-serif font-bold text-xs">K</span>
            </div>
            <span className="font-serif text-sm font-bold">KGS Admin</span>
          </div>
          <button onClick={() => { logout(); router.push('/admin/login'); }} className="text-xs text-red-400">Logout</button>
        </div>
        <div className="flex overflow-x-auto px-2 pb-2 gap-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                pathname === item.href ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'text-white/50'
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-24 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </CartProvider>
    </AuthProvider>
  );
}
