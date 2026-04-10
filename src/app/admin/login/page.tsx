'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(phone, password);
      router.push('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1c1c] px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#735c00] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#D4AF37]/20">
            <span className="text-white font-serif font-bold text-xl">K</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm text-white/40 mt-1">KGS Home Decors Management</p>
        </div>

        <div className="bg-[#2f3131] rounded-2xl p-8 shadow-2xl border border-white/5">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                placeholder="Admin phone number"
                required
                id="admin-phone"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                placeholder="Enter admin password"
                required
                id="admin-password"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-gold-solid w-full py-4 disabled:opacity-50" id="admin-login-btn">
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>
        </div>

        <Link href="/" className="block text-center text-sm text-white/30 hover:text-[#D4AF37] transition-colors mt-6">
          ← Back to Store
        </Link>
      </div>
    </div>
  );
}
