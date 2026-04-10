'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  description: string;
  dimensions?: string;
  material?: string;
  styleNotes?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/products/${params.id}`)
      .then(r => r.json())
      .then(d => {
        setProduct(d.product);
        setLoading(false);
        if (d.product) {
          fetch(`/api/products?category=${encodeURIComponent(d.product.category)}`)
            .then(r => r.json())
            .then(rd => setRelated((rd.products || []).filter((p: Product) => p.id !== d.product.id).slice(0, 4)));
        }
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!user) { router.push('/login'); return; }
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }, quantity);
    router.push('/checkout');
  };

  const allImages = product ? (product.images && product.images.length > 0 ? product.images : [product.image]) : [];

  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--surface)]">
        <Navbar />
        <div className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square rounded-2xl bg-[var(--surface-container)]" />
            <div className="space-y-4 py-8">
              <div className="h-4 bg-[var(--surface-container)] rounded w-1/4" />
              <div className="h-8 bg-[var(--surface-container)] rounded w-3/4" />
              <div className="h-10 bg-[var(--surface-container)] rounded w-1/3" />
              <div className="h-20 bg-[var(--surface-container)] rounded w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[var(--surface)]">
        <Navbar />
        <div className="pt-28 text-center py-20">
          <h2 className="font-serif text-2xl">Product not found</h2>
          <Link href="/products" className="btn-primary mt-4 inline-block">Back to Shop</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--surface)]">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm mb-8"
          >
            <Link href="/" className="text-[var(--outline)] hover:text-[var(--gold-dark)] transition-colors">Home</Link>
            <span className="text-[var(--outline-variant)]">/</span>
            <Link href="/products" className="text-[var(--outline)] hover:text-[var(--gold-dark)] transition-colors">Shop</Link>
            <span className="text-[var(--outline-variant)]">/</span>
            <span className="text-[var(--on-surface)] font-medium truncate max-w-[200px]">{product.name}</span>
          </motion.nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Image with Zoom */}
              <div
                className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--surface-low)] cursor-crosshair group"
                onMouseEnter={() => setZoomed(true)}
                onMouseLeave={() => setZoomed(false)}
                onMouseMove={handleZoomMove}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={allImages[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300"
                      style={zoomed ? {
                        transform: 'scale(2)',
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      } : {}}
                    />
                  </motion.div>
                </AnimatePresence>

                {product.category === 'Furniture' && (
                  <div className="heritage-badge absolute top-4 left-4 text-sm z-10">Handcrafted</div>
                )}

                {/* Zoom hint */}
                <div className="absolute bottom-4 right-4 z-10 bg-black/40 backdrop-blur-sm text-white text-[10px] px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  🔍 Hover to zoom
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`gallery-thumb flex-shrink-0 ${selectedImage === i ? 'active' : ''}`}
                    >
                      <Image src={img} alt={`${product.name} ${i + 1}`} width={80} height={80} className="object-cover w-full h-full" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:py-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--outline)] font-medium mb-3">{product.category}</p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--on-surface)] mb-4 leading-tight">{product.name}</h1>

              <div className="price-display text-3xl sm:text-4xl mb-6">
                <span className="currency">₹</span>{product.price.toLocaleString('en-IN')}
              </div>

              <div className="w-full h-[1px] bg-[var(--surface-container)] mb-6" />

              <p className="text-[var(--on-surface-variant)] leading-relaxed mb-6">{product.description}</p>

              {/* Specs */}
              {(product.dimensions || product.material) && (
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-[var(--surface-low)]">
                  {product.dimensions && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--outline)] font-semibold mb-1">Dimensions</p>
                      <p className="text-sm font-medium">{product.dimensions}</p>
                    </div>
                  )}
                  {product.material && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--outline)] font-semibold mb-1">Material</p>
                      <p className="text-sm font-medium">{product.material}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Style Notes */}
              {product.styleNotes && (
                <div className="mb-8 p-4 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03]">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--gold-dark)] font-semibold mb-2 flex items-center gap-1.5">
                    <span>✨</span> Style Notes
                  </p>
                  <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed italic">{product.styleNotes}</p>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--on-surface-variant)] mb-3">Quantity</label>
                <div className="inline-flex items-center rounded-xl bg-[var(--surface-low)] overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-lg font-medium hover:bg-[var(--surface-container)] transition-colors">−</button>
                  <span className="w-12 h-12 flex items-center justify-center text-sm font-semibold border-x border-[var(--surface-container)]">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center text-lg font-medium hover:bg-[var(--surface-container)] transition-colors">+</button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  className={`btn-primary flex-1 py-4 ${added ? '!bg-green-500 !shadow-green-500/30 !text-white' : ''}`}
                  id="add-to-cart"
                >
                  {added ? (
                    <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Added!</>
                  ) : (
                    <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> Add to Cart</>
                  )}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBuyNow}
                  className="btn-gold-solid flex-1 py-4"
                  id="buy-now"
                >
                  Buy Now
                </motion.button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-[var(--surface-container)]">
                {[
                  { icon: '🚚', text: 'Free Delivery' },
                  { icon: '🔒', text: 'Secure Payment' },
                  { icon: '↩️', text: 'Easy Returns' },
                ].map(badge => (
                  <div key={badge.text} className="text-center">
                    <span className="text-xl block mb-1">{badge.icon}</span>
                    <span className="text-[10px] text-[var(--outline)] uppercase tracking-wider">{badge.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-20"
            >
              <h2 className="font-serif text-2xl font-bold mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map(p => (
                  <Link key={p.id} href={`/products/${p.id}`} className="product-card group block">
                    <div className="product-card-image relative aspect-[4/3] overflow-hidden bg-[var(--surface-container)]">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-sm font-semibold group-hover:text-[var(--gold-dark)] transition-colors">{p.name}</h3>
                      <div className="price-display text-base mt-1"><span className="currency">₹</span>{p.price.toLocaleString('en-IN')}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
