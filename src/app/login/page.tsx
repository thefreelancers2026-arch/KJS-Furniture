'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const { user, login, signup } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') router.push('/admin');
      else router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (isResetPassword) {
      try {
        const res = await fetch('/api/auth/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, newPassword: password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Reset failed');
        setSuccessMsg('Password updated successfully! Please login.');
        setIsResetPassword(false);
        setPassword('');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      if (isLogin) {
        const loggedInUser = await login(phone, password);
        if (loggedInUser.role === 'admin') router.push('/admin');
        else router.push('/');
      } else {
        const newUser = await signup(name, phone, email, password);
        if (newUser.role === 'admin') router.push('/admin');
        else router.push('/');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white text-[#1a1a1a] selection:bg-[#D4AF37] selection:text-white">
      {/* Left - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#faf9f6] p-12 flex-col justify-between items-start">
        <Link href="/" className="inline-flex items-center gap-4 group relative z-10">
          <div className="w-12 h-12 bg-[#1a1a1a] flex items-center justify-center rounded-sm transition-transform duration-300">
            <span className="text-white font-serif font-bold text-xl">K</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-tight text-[#1a1a1a] leading-none mb-1">KGS</span>
            <span className="text-[9px] uppercase tracking-[0.3em] font-semibold text-[#7f7663] leading-none">Home Decors</span>
          </div>
        </Link>
        
        <div className="absolute inset-y-12 right-12 left-12 top-32 overflow-hidden rounded-sm">
          <Image
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=1600&fit=crop"
            alt="Luxury interior"
            fill
            className="object-cover transition-transform duration-[20s] hover:scale-110"
            priority
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
        </div>
      </div>

      {/* Right - Form Container */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <Link href="/" className="lg:hidden inline-flex items-center gap-4 mb-16 relative z-10">
          <div className="w-10 h-10 bg-[#1a1a1a] flex items-center justify-center rounded-sm">
            <span className="text-white font-serif font-bold text-lg">K</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-tight text-[#1a1a1a] leading-none mb-0.5">KGS</span>
            <span className="text-[8px] uppercase tracking-[0.3em] font-semibold text-[#7f7663] leading-none">Home Decors</span>
          </div>
        </Link>

        <div className="w-full max-w-sm mx-auto lg:mx-0 lg:ml-12">
          
          <div className="mb-12">
             <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#D4AF37] mb-3 block">
               Premium Gallery
             </span>
             <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4 text-[#1a1a1a]">
               {isResetPassword ? 'Reset Password.' : isLogin ? 'Welcome Back.' : 'Join Our Curation.'}
             </h1>
             <p className="text-sm font-light text-[#5e604d] leading-relaxed">
               {isResetPassword ? 'Enter your registered phone number and a new password.' : isLogin ? 'Enter your details to access your bespoke orders and curated collections.' : 'Create an account to gain exclusive access to our timeless pieces.'}
             </p>
          </div>

          {/* Toggle */}
          {!isResetPassword && (
            <div className="flex bg-[#faf9f6] p-1.5 rounded-sm mb-10 border border-[#1a1a1a]/5">
              <button
                onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-3 text-xs font-semibold tracking-widest uppercase transition-all rounded-sm ${isLogin ? 'bg-white shadow-sm text-[#1a1a1a]' : 'text-[#7f7663] hover:text-[#1a1a1a]'}`}
              >
                Log In
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-3 text-xs font-semibold tracking-widest uppercase transition-all rounded-sm ${!isLogin ? 'bg-[#1a1a1a] shadow-sm text-white' : 'text-[#7f7663] hover:text-[#1a1a1a]'}`}
              >
                Register
              </button>
            </div>
          )}

          {successMsg && (
            <div className="mb-8 p-4 bg-green-50/50 border-l-2 border-green-500 text-green-700 text-sm flex items-start gap-3">
              <span className="mt-0.5 text-lg leading-none">✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 bg-red-50/50 border-l-2 border-red-500 text-red-600 text-sm flex items-start gap-3">
              <span className="mt-0.5 text-lg leading-none">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && !isResetPassword && (
              <div className="animate-fade-in">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full py-4 bg-transparent border-b border-[#1a1a1a]/20 text-sm outline-none transition-colors focus:border-[#D4AF37] placeholder:text-[#1a1a1a]/40"
                  placeholder="Full Name *"
                  required={!isLogin && !isResetPassword}
                />
              </div>
            )}

            <div>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full py-4 bg-transparent border-b border-[#1a1a1a]/20 text-sm outline-none transition-colors focus:border-[#D4AF37] placeholder:text-[#1a1a1a]/40"
                placeholder="Phone Number *"
                required
              />
            </div>

            {!isLogin && !isResetPassword && (
              <div className="animate-fade-in">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full py-4 bg-transparent border-b border-[#1a1a1a]/20 text-sm outline-none transition-colors focus:border-[#D4AF37] placeholder:text-[#1a1a1a]/40"
                  placeholder="Email Address (Optional)"
                />
              </div>
            )}

            <div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full py-4 bg-transparent border-b border-[#1a1a1a]/20 text-sm outline-none transition-colors focus:border-[#D4AF37] placeholder:text-[#1a1a1a]/40"
                placeholder={isResetPassword ? 'New Password *' : 'Password *'}
                required
                minLength={6}
              />
            </div>
            
            {isLogin && !isResetPassword && (
              <div className="flex justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsResetPassword(true)}
                  className="text-xs text-[#7f7663] hover:text-[#1a1a1a] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-[#1a1a1a] text-white text-sm font-semibold tracking-wider uppercase transition-all hover:bg-[#D4AF37] disabled:opacity-50 flex justify-center rounded-sm"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  {isResetPassword ? 'Resetting' : 'Authenticating'}
                </span>
              ) : (
                isResetPassword ? 'Reset Password' : isLogin ? 'Sign In' : 'Create Profile'
              )}
            </button>
            
            {isResetPassword && (
              <button 
                type="button"
                onClick={() => { setIsResetPassword(false); setError(''); }}
                className="w-full py-4 bg-transparent text-[#7f7663] text-sm font-semibold tracking-wider uppercase hover:text-[#1a1a1a] transition-colors"
              >
                Back to Login
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
