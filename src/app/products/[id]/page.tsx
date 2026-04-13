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
  const { user, loading: authLoading } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

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

  if (authLoading || !user) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center relative">
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-screen">
            <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#050505]/50 to-[#050505]" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-6">
           <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[#D4AF37] animate-spin" />
           <p className="text-xs tracking-widest uppercase font-medium text-[#D4AF37]">Authenticating</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] relative">
        <Navbar />
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[#050505]" />
        </div>
        <div className="relative z-10 pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square rounded-2xl bg-white/5 border border-white/5" />
            <div className="space-y-4 py-8">
              <div className="h-4 bg-white/5 rounded w-1/4" />
              <div className="h-8 bg-white/5 rounded w-3/4" />
              <div className="h-10 bg-white/5 rounded w-1/3" />
              <div className="h-20 bg-white/5 rounded w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#050505] relative">
        <Navbar />
        <div className="relative z-10 pt-28 text-center py-20 text-white">
          <h2 className="font-serif text-2xl">Product not found</h2>
          <Link href="/products" className="btn-primary mt-4 inline-block">Back to Shop</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-white relative">
      
      {/* ═══════════ GLOBAL CINEMATIC BACKGROUND ═══════════ */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-screen"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#050505]/50 to-[#050505]" />
      </div>

      <div className="relative z-10 pt-[90px]">
        <Navbar />

        <div className="pt-8 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm mb-8"
            >
              <Link href="/" className="text-white/50 hover:text-[#D4AF37] transition-colors">Home</Link>
              <span className="text-white/30">/</span>
              <Link href="/products" className="text-white/50 hover:text-[#D4AF37] transition-colors">Shop</Link>
              <span className="text-white/30">/</span>
              <span className="text-white/90 font-medium truncate max-w-[200px]">{product.name}</span>
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
                  className="relative aspect-square rounded-2xl overflow-hidden liquid-glass bg-black/40 border border-white/10 cursor-crosshair group"
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
                        className="object-cover transition-transform duration-300 opacity-90 group-hover:opacity-100"
                        style={zoomed ? {
                          transform: 'scale(2.5)',
                          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        } : {}}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {product.category === 'Furniture' && (
                    <div className="absolute top-4 left-4 bg-[#D4AF37] px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase text-black z-10">Handcrafted</div>
                  )}

                  {/* Zoom hint */}
                  <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur-md text-white/90 border border-white/20 text-[10px] px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
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
                        className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-[#D4AF37] opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                      >
                        <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
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
                <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-medium mb-3">{product.category}</p>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white/90 mb-4 leading-tight">{product.name}</h1>

                <div className="text-3xl sm:text-4xl mb-6 font-medium text-white/90">
                  <span className="text-[#D4AF37] mr-1">₹</span>{product.price.toLocaleString('en-IN')}
                </div>

                <div className="w-full h-[1px] bg-white/10 mb-6" />

                <p className="text-white/60 font-light leading-relaxed mb-6">{product.description}</p>

                {/* Specs */}
                {(product.dimensions || product.material) && (
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl liquid-glass bg-black/20 border border-white/5">
                    {product.dimensions && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1">Dimensions</p>
                        <p className="text-sm font-medium text-white/80">{product.dimensions}</p>
                      </div>
                    )}
                    {product.material && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1">Material</p>
                        <p className="text-sm font-medium text-white/80">{product.material}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Style Notes */}
                {product.styleNotes && (
                  <div className="mb-8 p-4 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 backdrop-blur-md">
                    <p className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold mb-2 flex items-center gap-1.5">
                      <span>✨</span> Style Notes
                    </p>
                    <p className="text-sm text-white/70 leading-relaxed italic font-light">{product.styleNotes}</p>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-8">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">Quantity</label>
                  <div className="inline-flex items-center rounded-xl bg-black/40 border border-white/10 overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-lg font-medium hover:bg-white/10 transition-colors text-white">−</button>
                    <span className="w-12 h-12 flex items-center justify-center text-sm font-semibold border-x border-white/10 text-white">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center text-lg font-medium hover:bg-white/10 transition-colors text-white">+</button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToCart}
                    className={`flex-1 py-4 flex items-center justify-center gap-2 border text-xs font-bold tracking-[0.2em] uppercase transition-all rounded-sm ${added ? 'bg-green-500 border-green-500 text-white' : 'border-white/20 text-white/90 hover:bg-white/5'}`}
                    id="add-to-cart"
                  >
                    {added ? (
                      <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Added To Cart!</>
                    ) : (
                      'Add to Cart'
                    )}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleBuyNow}
                    className="flex-1 py-4 bg-[#D4AF37] hover:bg-[#EBCA68] text-black text-xs font-bold tracking-[0.2em] uppercase transition-all rounded-sm"
                    id="buy-now"
                  >
                    Buy Now
                  </motion.button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/10">
                  {[
                    { icon: '🚚', text: 'Free Delivery' },
                    { icon: '🔒', text: 'Secure Payment' },
                    { icon: '↩️', text: 'Easy Returns' },
                  ].map(badge => (
                    <div key={badge.text} className="text-center">
                      <span className="text-xl block mb-1 opacity-80">{badge.icon}</span>
                      <span className="text-[10px] text-white/50 uppercase tracking-wider">{badge.text}</span>
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
                className="mt-20 pt-10 border-t border-white/5"
              >
                <h2 className="font-serif text-3xl font-bold mb-8 text-white/90">You May Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {related.map(p => (
                    <Link key={p.id} href={`/products/${p.id}`} className="group block">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-sm liquid-glass bg-black/40 border border-white/10 mb-4">
                        <Image src={p.image} alt={p.name} fill className="object-cover opacity-80 transition-all duration-[1.5s] group-hover:scale-105 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>
                      <div className="px-2">
                        <h3 className="font-serif text-lg font-semibold text-white/80 group-hover:text-[#D4AF37] transition-colors">{p.name}</h3>
                        <div className="text-base mt-1 font-medium text-white/90"><span className="text-[#D4AF37] text-sm mr-0.5">₹</span>{p.price.toLocaleString('en-IN')}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
