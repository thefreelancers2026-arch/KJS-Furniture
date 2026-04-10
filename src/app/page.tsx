'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// FloatingFurniture component removed as we are transitioning to high-end renders.

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

const categories = [
  { name: 'Furniture', icon: '🪑', desc: 'Premium sofas, tables & more', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=800&fit=crop' },
  { name: 'Decorative', icon: '🏺', desc: 'Vases, art & elegant accents', img: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&h=800&fit=crop' },
  { name: 'Greenery', icon: '🌿', desc: 'Bring nature indoors', img: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&h=800&fit=crop' },
  { name: 'Gifts', icon: '🎁', desc: 'Curated gift collections', img: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&h=800&fit=crop' },
];

const fadeIn: any = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: "easeOut" },
  }),
};

const staggerContainer: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then(r => r.json())
      .then(d => { setFeatured(d.products || []); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  if (authLoading || !user) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="flex flex-col items-center gap-6">
           <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[#D4AF37] animate-spin" />
           <p className="text-xs tracking-widest uppercase font-medium text-[#7f7663]">Authenticating</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] selection:bg-[#D4AF37] selection:text-white">
      <Navbar />

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-[#faf9f6]">
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#D4AF37]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-[#D4AF37]/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Context/Text - 5 columns */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <span className="inline-block px-4 py-2 border border-[#D4AF37]/30 rounded-full text-xs font-semibold tracking-[0.2em] uppercase text-[#735c00] bg-[#D4AF37]/5">
                  Virudhachalam's Elite Gallery
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1a1a1a] leading-tight mb-6"
              >
                Curating <br className="hidden lg:block" />
                <span className="italic font-light text-[#D4AF37]">Timeless</span> <br className="hidden lg:block" />
                Living Spaces.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg text-[#5e604d] leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0 font-light"
              >
                Discover meticulously crafted furniture and decor designed to elevate your home with sophisticated elegance and uncompromised quality.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
              >
                <Link href="/products" className="w-full sm:w-auto relative group">
                  <div className="absolute inset-0 bg-[#D4AF37] translate-y-2 rounded-sm transition-transform duration-200 group-hover:translate-y-3 group-active:translate-y-0" />
                  <div className="relative w-full px-10 py-4 bg-[#1a1a1a] text-white text-sm font-semibold tracking-wide uppercase transition-transform duration-200 group-hover:-translate-y-1 group-active:translate-y-0 text-center rounded-sm flex items-center justify-center gap-3">
                    View Collection
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                  </div>
                </Link>

                <Link href="/products" className="w-full sm:w-auto relative group">
                  <div className="absolute inset-0 bg-[#d0c5af] translate-y-2 rounded-sm transition-transform duration-200 group-hover:translate-y-3 group-active:translate-y-0" />
                  <div className="relative w-full px-10 py-4 bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] text-sm font-bold tracking-wide uppercase transition-transform duration-200 group-hover:-translate-y-1 group-active:translate-y-0 text-center rounded-sm">
                    Shop Now
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* High-End Visual - 7 columns */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-7 order-1 lg:order-2 h-[50vh] lg:h-[70vh] relative w-full rounded-sm overflow-hidden shadow-2xl shadow-[#D4AF37]/5 bg-white border border-[#D4AF37]/10 flex items-center justify-center group"
            >
              <div className="absolute inset-0 bg-[#faf9f6]" />
              <div className="relative w-full h-full overflow-hidden">
                <Image 
                  src="/blue-sofa-render.png" 
                  alt="Premium dark blue modular sofa with gold legs"
                  fill
                  className="object-cover transition-transform duration-[20s] group-hover:scale-110 ease-out"
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
              
              <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                 <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-sm border border-black/5 text-[10px] font-bold tracking-widest uppercase text-[#1a1a1a] shadow-sm">
                    Signature Visualization
                 </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORIES ═══════════ */}
      <section className="py-32 lg:py-48 bg-white" id="categories">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            custom={0}
            className="flex flex-col items-center text-center mb-24"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-4">Categories</span>
            <h2 className="font-serif text-4xl lg:text-6xl font-bold text-[#1a1a1a]">Shop by Room</h2>
            <div className="w-16 h-0.5 bg-[#D4AF37] mt-8" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16"
          >
            {categories.map((cat, i) => (
              <motion.div key={cat.name} variants={fadeIn} custom={i}>
                <Link
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="group relative flex flex-col items-center text-center cursor-pointer"
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm mb-8 bg-[#faf9f6]">
                    <Image
                      src={cat.img}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-[#1a1a1a] mb-3 group-hover:text-[#D4AF37] transition-colors">{cat.name}</h3>
                  <p className="text-sm text-[#7f7663] px-4 font-light leading-relaxed">{cat.desc}</p>
                  <div className="mt-6 w-8 h-[1px] bg-[#1a1a1a]/20 group-hover:w-16 group-hover:bg-[#D4AF37] transition-all duration-500" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FEATURED PRODUCTS ═══════════ */}
      <section className="py-32 lg:py-48 bg-[#faf9f6]" id="featured">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            custom={0}
            className="flex flex-col md:flex-row justify-between items-center mb-24 border-b border-[#1a1a1a]/10 pb-8"
          >
            <div className="text-center md:text-left mb-8 md:mb-0">
              <h2 className="font-serif text-4xl lg:text-6xl font-bold text-[#1a1a1a] mb-4">Signature Pieces</h2>
              <p className="text-[#7f7663] text-xl font-light">Curated selections that define modern luxury.</p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-4 text-sm font-semibold tracking-widest uppercase text-[#1a1a1a] hover:text-[#D4AF37] transition-colors group">
              Explore All
              <span className="w-12 h-[1px] bg-current group-hover:w-16 transition-all" />
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24"
          >
            {featured.slice(0, 8).map((product, i) => (
              <motion.div key={product.id} variants={fadeIn} custom={i % 4}>
                <Link href={`/products/${product.id}`} className="group block h-full flex flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden bg-white rounded-sm mb-8 shadow-sm">
                    <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    {product.category === 'Furniture' && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase text-[#1a1a1a]">
                        Classic
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-3 font-semibold">{product.category}</p>
                    <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-4 leading-snug group-hover:text-[#D4AF37] transition-colors line-clamp-2">{product.name}</h3>
                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-[#1a1a1a]/10">
                      <span className="text-xl font-medium text-[#1a1a1a]">₹{product.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs font-semibold tracking-widest uppercase text-[#7f7663] group-hover:text-[#1a1a1a] transition-colors">View</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ THE ART OF LIVING ═══════════ */}
      <section className="py-24 lg:py-32 bg-white" id="story">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
             <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="relative aspect-square lg:aspect-[4/5] rounded-sm overflow-hidden"
             >
               <Image src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=1500&fit=crop" alt="Luxury interior" fill className="object-cover" />
               <div className="absolute inset-0 bg-[#D4AF37]/10 mix-blend-overlay" />
             </motion.div>
             
             <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex flex-col justify-center"
             >
               <span className="text-sm font-semibold tracking-[0.3em] uppercase text-[#D4AF37] mb-6">Our Philosophy</span>
               <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight mb-8">
                 The Art of Refined Living
               </h2>
               <p className="text-[#5e604d] text-lg leading-relaxed mb-6 font-light">
                 At KGS Home Decors, we believe that your living space is a reflection of your personality. That's why we painstakingly curate every single piece in our collection to ensure it meets our rigorous standards for design, comfort, and longevity.
               </p>
               <p className="text-[#5e604d] text-lg leading-relaxed mb-10 font-light">
                 Located in the heart of Virudhachalam, our gallery showcases an uncompromising blend of contemporary aesthetics and traditional craftsmanship. Whether you are seeking a statement piece or a complete interior redesign, our experts are here to guide your vision.
               </p>
               
               <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#1a1a1a]/10">
                  <div>
                    <h4 className="font-serif text-3xl font-bold text-[#1a1a1a] mb-2">20+</h4>
                    <p className="text-sm tracking-widest uppercase text-[#7f7663]">Years Heritage</p>
                  </div>
                  <div>
                    <h4 className="font-serif text-3xl font-bold text-[#1a1a1a] mb-2">10k+</h4>
                    <p className="text-sm tracking-widest uppercase text-[#7f7663]">Curation Items</p>
                  </div>
               </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ SERVICES ═══════════ */}
      <section className="py-24 bg-[#1a1a1a] text-white" id="features">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
          >
            {[
              { title: 'Bespoke Consultation', desc: 'Personalized interior advice tailored to your space from our design experts.' },
              { title: 'White Glove Delivery', desc: 'Impeccable handling and placement of your furniture, anywhere in India.' },
              { title: 'Quality Assurance', desc: 'We stand behind the craftsmanship of every piece with a comprehensive guarantee.' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeIn}
                custom={i}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-[1px] bg-[#D4AF37] mb-8" />
                <h3 className="font-serif text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-white/60 font-light leading-relaxed max-w-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

