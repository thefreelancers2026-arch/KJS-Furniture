'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  featured: boolean;
}

const categories = ['Furniture', 'Decorative Items', 'Plants & Greenery', 'Gifts & Interior'];

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', price: '', category: 'Furniture', image: '', description: '', featured: false });
  const [saving, setSaving] = useState(false);

  const fetchProducts = () => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setForm({ name: '', price: '', category: 'Furniture', image: '', description: '', featured: false });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (p: Product) => {
    setForm({ name: p.name, price: String(p.price), category: p.category, image: p.image, description: p.description, featured: p.featured });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editId ? `/api/products/${editId}` : '/api/products';
    const method = editId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });

    setSaving(false);
    resetForm();
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold">Products</h1>
          <p className="text-sm text-[var(--outline)] mt-1">{products.length} products in catalog</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn-gold-solid">
          {showForm ? '✕ Close' : '+ Add Product'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-8 p-6 rounded-2xl bg-[var(--surface-lowest)] shadow-sm animate-slide-down">
          <h2 className="font-serif text-xl font-semibold mb-5">{editId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] mb-2">Product Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-subtle" placeholder="Product name" required />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] mb-2">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="input-subtle" placeholder="Price" required />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] mb-2">Category *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-subtle">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] mb-2">Image URL</label>
              <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="input-subtle" placeholder="https://..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] mb-2">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-subtle min-h-[80px] resize-none" placeholder="Product description" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} id="featured-check" className="w-4 h-4 accent-[#D4AF37]" />
              <label htmlFor="featured-check" className="text-sm font-medium">Featured Product</label>
            </div>
            <div className="flex justify-end gap-3 sm:col-span-2">
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={saving} className="btn-gold-solid disabled:opacity-50">
                {saving ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 rounded-xl bg-[var(--surface-lowest)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-[var(--surface-lowest)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--surface-container)]">
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-[var(--outline)] line-clamp-1 max-w-[200px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="text-xs font-medium px-2 py-1 rounded-lg bg-[var(--surface-low)]">{product.category}</span></td>
                    <td><span className="price-display text-sm">₹{product.price.toLocaleString('en-IN')}</span></td>
                    <td>{product.featured ? <span className="text-green-500 text-xs font-medium">✓ Yes</span> : <span className="text-[var(--outline)] text-xs">No</span>}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(product)} className="text-xs text-[var(--tertiary)] hover:underline font-medium">Edit</button>
                        <button onClick={() => handleDelete(product.id)} className="text-xs text-red-400 hover:underline font-medium">Delete</button>
                      </div>
                    </td>
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
