'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    fetch('/api/products?featured=true')
      .then(r => r.json())
      .then(d => { setFeatured(d.products || []); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-white relative">
      {/* ═══════════ GLOBAL CINEMATIC BACKGROUND ═══════════ */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen">
           <source src="https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4" type="video/mp4" /> 
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#050505]/40 to-[#050505]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* ═══════════ HERO SECTION ═══════════ */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col items-center justify-center text-center -mt-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="mb-8"
            >
              <span className="inline-block px-6 py-2 border-b border-[#D4AF37]/50 text-[10px] font-semibold tracking-[0.4em] uppercase text-[#D4AF37]">
                Virudhachalam's Elite Gallery
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold text-white leading-[1.1] mb-8 drop-shadow-2xl"
            >
              Curating <br className="hidden md:block" />
              <span className="italic font-light text-[#D4AF37]">Timeless</span> <br className="hidden md:block" />
              Living Spaces.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              className="text-base md:text-xl text-white/70 leading-relaxed mb-12 max-w-3xl mx-auto font-light drop-shadow-lg"
            >
              Discover meticulously crafted furniture and decor designed to elevate your home with sophisticated elegance and uncompromised quality.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-6 justify-center"
            >
              <Link href="/products" className="w-full sm:w-auto relative group">
                <div className="absolute inset-0 bg-[#D4AF37] translate-y-1 rounded-sm transition-transform duration-300 group-hover:translate-y-2 group-active:translate-y-0" />
                <div className="relative w-full px-12 py-4 bg-[#0a0a0a] text-[#EBCA68] text-xs font-bold tracking-[0.2em] uppercase transition-transform duration-300 group-hover:-translate-y-1 group-active:translate-y-0 text-center rounded-sm flex items-center justify-center gap-3 border border-[#D4AF37]/30 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                  View Collection
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                </div>
              </Link>

              <Link href="/products" className="w-full sm:w-auto relative group overflow-hidden rounded-sm">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/10" />
                <div className="relative w-full px-12 py-4 border border-white/20 text-white/90 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 text-center flex items-center justify-center">
                  Shop Now
                </div>
              </Link>
            </motion.div>
          </div>
          
          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          >
             <span className="text-[9px] uppercase tracking-[0.4em] text-white/40">Scroll</span>
             <div className="w-[1px] h-16 bg-gradient-to-b from-[#D4AF37]/50 to-transparent" />
          </motion.div>
        </section>

        {/* ═══════════ CATEGORIES ═══════════ */}
        <section className="py-32 lg:py-48 bg-black/20 backdrop-blur-md border-y border-white/5" id="categories">
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
              <h2 className="font-serif text-4xl lg:text-6xl font-bold text-white">Shop by Room</h2>
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
                    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm mb-8 liquid-glass border border-white/10">
                      <Image
                        src={cat.img}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <h3 className="font-serif text-3xl font-bold text-white/90 mb-3 group-hover:text-[#D4AF37] transition-colors">{cat.name}</h3>
                    <p className="text-sm text-white/50 px-4 font-light leading-relaxed">{cat.desc}</p>
                    <div className="mt-6 w-8 h-[1px] bg-white/20 group-hover:w-16 group-hover:bg-[#D4AF37] transition-all duration-500" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════ FEATURED PRODUCTS ═══════════ */}
        <section className="py-32 lg:py-48 bg-transparent" id="featured">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              custom={0}
              className="flex flex-col md:flex-row justify-between items-center mb-24 border-b border-white/10 pb-8"
            >
              <div className="text-center md:text-left mb-8 md:mb-0">
                <h2 className="font-serif text-4xl lg:text-6xl font-bold text-white mb-4">Signature Pieces</h2>
                <p className="text-white/60 text-xl font-light">Curated selections that define modern luxury.</p>
              </div>
              <Link href="/products" className="inline-flex items-center gap-4 text-sm font-semibold tracking-widest uppercase text-white/90 hover:text-[#D4AF37] transition-colors group">
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
                    <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-8 shadow-sm liquid-glass border border-white/10">
                      <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                      {product.category === 'Furniture' && (
                        <div className="absolute top-4 left-4 bg-[#D4AF37] px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase text-black">
                          Classic
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 px-2">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-3 font-semibold">{product.category}</p>
                      <h3 className="font-serif text-2xl font-bold text-white/90 mb-4 leading-snug group-hover:text-[#D4AF37] transition-colors line-clamp-2">{product.name}</h3>
                      <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/10">
                        <span className="text-xl font-medium text-white/90">₹{product.price.toLocaleString('en-IN')}</span>
                        <span className="text-xs font-semibold tracking-widest uppercase text-white/50 group-hover:text-white transition-colors">View</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════ THE ART OF LIVING ═══════════ */}
        <section className="py-24 lg:py-32 bg-black/40 backdrop-blur-lg border-y border-white/10" id="story">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
               <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                className="relative aspect-square lg:aspect-[4/5] rounded-sm overflow-hidden border border-white/10"
               >
                 <Image src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=1500&fit=crop" alt="Luxury interior" fill className="object-cover opacity-80" />
                 <div className="absolute inset-0 bg-[#D4AF37]/10 mix-blend-overlay" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
               </motion.div>
               
               <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                className="flex flex-col justify-center"
               >
                 <span className="text-sm font-semibold tracking-[0.3em] uppercase text-[#D4AF37] mb-6">Our Philosophy</span>
                 <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white/90 leading-tight mb-8">
                   The Art of Refined Living
                 </h2>
                 <p className="text-white/60 text-lg leading-relaxed mb-6 font-light">
                   At KGS Home Decors, we believe that your living space is a reflection of your personality. That's why we painstakingly curate every single piece in our collection to ensure it meets our rigorous standards for design, comfort, and longevity.
                 </p>
                 <p className="text-white/60 text-lg leading-relaxed mb-10 font-light">
                   Located in the heart of Virudhachalam, our gallery showcases an uncompromising blend of contemporary aesthetics and traditional craftsmanship. Whether you are seeking a statement piece or a complete interior redesign, our experts are here to guide your vision.
                 </p>
                 
                 <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                    <div>
                      <h4 className="font-serif text-3xl font-bold text-white mb-2">20+</h4>
                      <p className="text-sm tracking-widest uppercase text-white/50">Years Heritage</p>
                    </div>
                    <div>
                      <h4 className="font-serif text-3xl font-bold text-white mb-2">10k+</h4>
                      <p className="text-sm tracking-widest uppercase text-white/50">Curation Items</p>
                    </div>
                 </div>
               </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════ SERVICES ═══════════ */}
        <section className="py-24 bg-black/80 backdrop-blur-xl border-t border-white/5" id="features">
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
                  <h3 className="font-serif text-2xl font-semibold mb-4 text-white/90">{feature.title}</h3>
                  <p className="text-white/60 font-light leading-relaxed max-w-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
