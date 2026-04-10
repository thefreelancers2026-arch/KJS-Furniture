'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  address: string;
  landmark: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

const statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchOrders = () => {
    if (!token) return;
    fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [token]);

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Confirmed': return 'status-confirmed';
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      default: return 'status-pending';
    }
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);
  const sorted = [...filteredOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold">Order Management</h1>
        <p className="text-sm text-[var(--outline)] mt-1">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', ...statuses].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`filter-pill ${filter === s ? 'active' : ''}`}
          >
            {s} {s !== 'All' && `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-xl bg-[var(--surface-lowest)] animate-pulse" />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 bg-[var(--surface-lowest)] rounded-2xl">
          <span className="text-5xl mb-4 block">📋</span>
          <h3 className="font-serif text-xl font-semibold mb-2">No orders found</h3>
          <p className="text-sm text-[var(--outline)]">Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[var(--surface-lowest)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(order => (
                  <React.Fragment key={order.id}>
                    <tr className="cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                      <td><span className="font-mono text-xs font-bold text-[var(--gold-dark)]">{order.id}</span></td>
                      <td><span className="font-medium text-sm">{order.userName}</span></td>
                      <td><span className="text-sm">{order.userPhone}</span></td>
                      <td><span className="text-sm">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span></td>
                      <td><span className="price-display text-sm">₹{order.totalPrice.toLocaleString('en-IN')}</span></td>
                      <td><span className={getStatusClass(order.status)}>{order.status}</span></td>
                      <td><span className="text-xs text-[var(--outline)]">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></td>
                      <td>
                        <select
                          value={order.status}
                          onChange={e => { e.stopPropagation(); updateStatus(order.id, e.target.value); }}
                          onClick={e => e.stopPropagation()}
                          className="text-xs px-2 py-1.5 rounded-lg bg-[var(--surface-low)] outline-none border-0 cursor-pointer"
                        >
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan={8} className="!p-0">
                          <div className="p-5 bg-[var(--surface-low)] animate-slide-down">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] mb-2">Delivery Address</p>
                                <p className="text-sm">{order.address}</p>
                                {order.landmark && <p className="text-xs text-[var(--outline)] mt-1">Landmark: {order.landmark}</p>}
                              </div>
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] mb-2">Order Items</p>
                                {order.items.map((item, i) => (
                                  <div key={i} className="flex justify-between text-sm mb-1">
                                    <span>{item.productName} × {item.quantity}</span>
                                    <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                  </div>
                                ))}
                                <div className="mt-2 pt-2 border-t border-[var(--surface-container)] flex justify-between font-semibold text-sm">
                                  <span>Total</span>
                                  <span className="text-[var(--gold-dark)]">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
