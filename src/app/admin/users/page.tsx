'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface UserInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export default function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setUsers(d.users || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold">User Management</h1>
        <p className="text-sm text-[var(--outline)] mt-1">{users.length} registered customers</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-[var(--surface-lowest)] animate-pulse" />)}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-[var(--surface-lowest)] rounded-2xl">
          <span className="text-5xl mb-4 block">👤</span>
          <h3 className="font-serif text-xl font-semibold mb-2">No users registered yet</h3>
          <p className="text-sm text-[var(--outline)]">Users will appear here when they sign up</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[var(--surface-lowest)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#735c00] flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-serif font-bold text-xs">{user.name[0]}</span>
                        </div>
                        <span className="font-medium text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td><span className="text-sm">{user.phone}</span></td>
                    <td><span className="text-sm text-[var(--outline)]">{user.email || '-'}</span></td>
                    <td><span className="text-sm font-medium">{user.orderCount}</span></td>
                    <td><span className="price-display text-sm">₹{user.totalSpent.toLocaleString('en-IN')}</span></td>
                    <td><span className="text-xs text-[var(--outline)]">{new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
