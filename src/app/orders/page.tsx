'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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

export default function OrdersPage() {
  const { user, token } = useAuth();
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
      case 'Pending': return 'status-pending';
      case 'Confirmed': return 'status-confirmed';
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      default: return 'status-pending';
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[var(--surface)]">
        <Navbar />
        <div className="pt-28 text-center py-20">
          <span className="text-5xl mb-4 block">🔐</span>
          <h2 className="font-serif text-2xl font-semibold mb-3">Please login to view orders</h2>
          <Link href="/login" className="btn-primary mt-4 inline-block">Login</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--surface)]">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface-lowest)] mb-8 animate-fade-in-up">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#735c00] flex items-center justify-center shadow-lg">
                <span className="text-white font-serif font-bold text-xl">{user.name[0]}</span>
              </div>
              <div>
                <h1 className="font-serif text-xl sm:text-2xl font-bold">{user.name}</h1>
                <p className="text-sm text-[var(--outline)]">{user.phone} {user.email ? `• ${user.email}` : ''}</p>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="animate-fade-in-up delay-200">
            <h2 className="font-serif text-2xl font-bold mb-6">My Orders</h2>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-6 rounded-2xl bg-[var(--surface-lowest)] animate-pulse">
                    <div className="h-4 bg-[var(--surface-container)] rounded w-1/3 mb-3" />
                    <div className="h-3 bg-[var(--surface-container)] rounded w-2/3 mb-2" />
                    <div className="h-3 bg-[var(--surface-container)] rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-5xl mb-4 block">📦</span>
                <h3 className="font-serif text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-sm text-[var(--outline)] mb-4">Start shopping to see your orders here</p>
                <Link href="/products" className="btn-primary">Browse Products</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
                  <div key={order.id} className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-lowest)] hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
                      <div>
                        <p className="text-xs text-[var(--outline)] uppercase tracking-wider mb-1">Order ID</p>
                        <p className="font-mono font-bold text-[var(--gold-dark)]">{order.id}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className={getStatusClass(order.status)}>{order.status}</span>
                        <span className="text-xs text-[var(--outline)]">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-[var(--on-surface-variant)]">{item.productName} × {item.quantity}</span>
                          <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-[var(--surface-container)]">
                      <span className="text-xs text-[var(--outline)]">📍 {order.address.substring(0, 50)}...</span>
                      <span className="price-display text-lg"><span className="currency">₹</span>{order.totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
