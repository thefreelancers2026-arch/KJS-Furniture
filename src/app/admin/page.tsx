'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: RecentOrder[];
  ordersByStatus: Record<string, number>;
  revenueByMonth: { month: string; revenue: number }[];
}

interface RecentOrder {
  id: string;
  userName: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const statCards = stats ? [
    { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'from-blue-500 to-blue-600' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: 'from-amber-500 to-orange-500' },
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'from-emerald-500 to-green-600' },
    { label: 'Total Products', value: stats.totalProducts, icon: '🏷️', color: 'from-purple-500 to-violet-600' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: '💰', color: 'from-[#D4AF37] to-[#735c00]' },
  ] : [];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Confirmed': return 'status-confirmed';
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      default: return 'status-pending';
    }
  };

  // Chart data
  const chartData = stats?.revenueByMonth || [
    { month: 'Jan', revenue: 0 },
    { month: 'Feb', revenue: 0 },
    { month: 'Mar', revenue: 0 },
    { month: 'Apr', revenue: stats?.totalRevenue || 0 },
  ];
  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);

  const statusData = stats?.ordersByStatus || {};
  const statusColors: Record<string, string> = {
    Pending: '#E65100',
    Confirmed: '#1565C0',
    Shipped: '#7B1FA2',
    Delivered: '#2E7D32',
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-[var(--outline)] mt-1">Welcome back, Admin. Here&apos;s your store overview.</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="stat-card animate-pulse">
              <div className="h-10 w-10 rounded-xl bg-[var(--surface-container)] mb-3" />
              <div className="h-8 bg-[var(--surface-container)] rounded w-1/2 mb-2" />
              <div className="h-3 bg-[var(--surface-container)] rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
          >
            {statCards.map((card, i) => (
              <motion.div key={card.label} variants={fadeIn} custom={i} className="stat-card">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-xl mb-4 shadow-lg`}>
                  {card.icon}
                </div>
                <p className="text-2xl font-bold text-[var(--on-surface)]">{card.value}</p>
                <p className="text-xs text-[var(--outline)] uppercase tracking-wider mt-1">{card.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-[var(--surface-lowest)] shadow-sm"
            >
              <h3 className="font-serif text-lg font-semibold mb-6">Revenue Overview</h3>
              <div className="flex items-end gap-3 h-48">
                {chartData.map((data, i) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                      className="chart-bar w-full min-h-[4px]"
                    />
                    <span className="text-[10px] text-[var(--outline)] font-medium">{data.month}</span>
                  </div>
                ))}
              </div>
              {stats && stats.totalRevenue > 0 && (
                <p className="text-xs text-[var(--outline)] mt-4">
                  Total: <span className="font-semibold text-[var(--gold-dark)]">₹{stats.totalRevenue.toLocaleString('en-IN')}</span>
                </p>
              )}
            </motion.div>

            {/* Orders by Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-[var(--surface-lowest)] shadow-sm"
            >
              <h3 className="font-serif text-lg font-semibold mb-6">Orders by Status</h3>
              {Object.keys(statusData).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(statusData).map(([status, count], i) => (
                    <div key={status}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium">{status}</span>
                        <span className="text-sm font-bold">{count as number}</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-[var(--surface-container)] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${((count as number) / (stats?.totalOrders || 1)) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: statusColors[status] || '#D4AF37' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-[var(--outline)]">
                  <div className="text-center">
                    <span className="text-3xl mb-2 block">📊</span>
                    <p className="text-sm">No order data yet</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 rounded-2xl bg-[var(--surface-lowest)] shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-lg font-semibold">Recent Orders</h3>
              <a href="/admin/orders" className="text-xs text-[var(--gold-dark)] font-semibold hover:underline">
                View All →
              </a>
            </div>
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.slice(0, 5).map(order => (
                      <tr key={order.id}>
                        <td><span className="font-mono text-xs font-bold text-[var(--gold-dark)]">{order.id}</span></td>
                        <td><span className="text-sm font-medium">{order.userName}</span></td>
                        <td><span className="price-display text-sm">₹{order.totalPrice.toLocaleString('en-IN')}</span></td>
                        <td><span className={getStatusClass(order.status)}>{order.status}</span></td>
                        <td><span className="text-xs text-[var(--outline)]">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--outline)]">
                <span className="text-3xl mb-2 block">📋</span>
                <p className="text-sm">No orders yet. They&apos;ll appear here.</p>
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <a href="/admin/products" className="p-6 rounded-2xl bg-[var(--surface-lowest)] hover:shadow-lg transition-all group cursor-pointer border border-transparent hover:border-[#D4AF37]/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--surface-low)] flex items-center justify-center text-xl group-hover:bg-[#D4AF37]/10 transition-colors">📦</div>
                <div>
                  <h3 className="font-serif font-semibold">Manage Products</h3>
                  <p className="text-xs text-[var(--outline)]">Add, edit, or remove products</p>
                </div>
              </div>
            </a>
            <a href="/admin/orders" className="p-6 rounded-2xl bg-[var(--surface-lowest)] hover:shadow-lg transition-all group cursor-pointer border border-transparent hover:border-[#D4AF37]/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--surface-low)] flex items-center justify-center text-xl group-hover:bg-[#D4AF37]/10 transition-colors">🛒</div>
                <div>
                  <h3 className="font-serif font-semibold">View Orders</h3>
                  <p className="text-xs text-[var(--outline)]">Track and manage customer orders</p>
                </div>
              </div>
            </a>
            <a href="/admin/users" className="p-6 rounded-2xl bg-[var(--surface-lowest)] hover:shadow-lg transition-all group cursor-pointer border border-transparent hover:border-[#D4AF37]/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--surface-low)] flex items-center justify-center text-xl group-hover:bg-[#D4AF37]/10 transition-colors">👥</div>
                <div>
                  <h3 className="font-serif font-semibold">Customer Base</h3>
                  <p className="text-xs text-[var(--outline)]">View registered customers</p>
                </div>
              </div>
            </a>
          </motion.div>
        </>
      )}
    </div>
  );
}
