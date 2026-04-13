'use client';

import React, { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  material?: string;
}

const allCategories = ['All', 'Furniture', 'Decorative', 'Greenery', 'Gifts'];
const allMaterials = ['All Materials', 'Wood', 'Ceramic', 'Brass', 'Velvet', 'Marble', 'Glass', 'Jute', 'Cotton'];

const ITEMS_PER_PAGE = 8;

function ProductsCatalogInner() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedMaterial, setSelectedMaterial] = useState('All Materials');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showFilters, setShowFilters] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category);
    if (search) params.set('search', search);

    fetch(`/api/products?${params.toString()}`)
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setLoading(false); setVisibleCount(ITEMS_PER_PAGE); })
      .catch(() => setLoading(false));
  }, [category, search]);

  const filteredProducts = products
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter(p => {
      if (selectedMaterial === 'All Materials') return true;
      return p.material?.toLowerCase().includes(selectedMaterial.toLowerCase());
    });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProducts.length;

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore) {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    }
  }, [hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const maxPrice = Math.max(...products.map(p => p.price), 100000);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-white relative pt-[90px]">
      
      {/* ═══════════ GLOBAL CINEMATIC BACKGROUND ═══════════ */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-screen"
        >
           {/* Different video, specific to the shop page */}
           <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#050505]/40 to-[#050505]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Cinematic Header without forced bg element so global video shines through */}
        <div className="relative min-h-[40vh] flex flex-col justify-center py-20 -mt-[90px] pt-[120px]">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#D4AF37]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full z-10 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex flex-col items-center text-center"
            >
              <span className="liquid-glass rounded-full px-6 py-2 border border-white/5 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#D4AF37] mb-6 drop-shadow-md">
                Curated Selection
              </span>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 drop-shadow-2xl">
                {category !== 'All' ? category : <>The <em className="italic text-white/90">Collection</em></>}
              </h1>
              <p className="max-w-xl mx-auto text-white/60 font-light text-sm md:text-base leading-relaxed mt-2">
                Explore our meticulously curated pieces designed to elevate your living environment. We bring together finest materials and timeless craftsmanship.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Search & Alignments */}
        <div className="bg-black/30 backdrop-blur-md py-8 border-y border-white/5 relative z-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 lg:gap-8 flex-1 w-full">
                 {allCategories.map(cat => (
                   <button
                     key={cat}
                     onClick={() => setCategory(cat)}
                     className={`text-xs font-semibold tracking-widest uppercase transition-colors pointer border-b-2 pb-1 ${
                       category === cat ? 'text-[#D4AF37] border-[#D4AF37]' : 'text-white/50 border-transparent hover:text-white'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>

              <div className="flex items-center gap-4 w-full lg:w-auto mt-6 lg:mt-0">
                 <div className="relative flex-1 lg:w-64">
                   <input
                     type="text"
                     value={search}
                     onChange={e => setSearch(e.target.value)}
                     className="w-full bg-transparent border-b border-white/20 py-2.5 pl-0 pr-8 text-sm outline-none transition-colors focus:border-[#D4AF37] placeholder:text-white/40 text-white"
                     placeholder="Search..."
                   />
                   <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                   </svg>
                 </div>
                 
                 <button
                   onClick={() => setShowFilters(!showFilters)}
                   className={`flex items-center gap-2 py-2.5 text-xs font-semibold tracking-widest uppercase transition-colors ${showFilters ? 'text-[#D4AF37]' : 'text-white/80 hover:text-[#D4AF37]'}`}
                 >
                   Filters
                   <svg className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                   </svg>
                 </button>
              </div>
            </div>

            {/* Filters Extension */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-12"
              >
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70 mb-4 block">Sort By</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-sm text-white/90 outline-none rounded-sm appearance-none cursor-pointer focus:border-[#D4AF37]"
                  >
                    <option value="default">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Alphabetical</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70 mb-4 block">Material</span>
                  <div className="flex flex-wrap gap-2">
                    {allMaterials.map(mat => (
                      <button
                        key={mat}
                        onClick={() => setSelectedMaterial(mat)}
                        className={`text-xs px-3 py-1.5 border transition-colors rounded-sm ${
                           selectedMaterial === mat 
                             ? 'bg-[#D4AF37] text-black border-[#D4AF37]' 
                             : 'bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70 mb-4 block">
                    Price: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    step={500}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([0, Number(e.target.value)])}
                    className="w-full h-1 bg-white/20 rounded-none cursor-pointer accent-[#D4AF37]"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-white/5 rounded-sm mb-6 border border-white/5" />
                  <div className="h-4 bg-white/5 rounded mb-3 w-1/4" />
                  <div className="h-6 bg-white/5 rounded mb-4 w-3/4" />
                  <div className="h-5 bg-white/5 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-32 flex flex-col items-center">
              <h3 className="font-serif text-3xl font-bold text-white mb-4">Nothing Found.</h3>
              <p className="text-white/60 font-light">We couldn't find items that matched your precise criteria.</p>
              <button 
                 onClick={() => { setCategory('All'); setSearch(''); setPriceRange([0, 100000]); setSelectedMaterial('All Materials'); }}
                 className="mt-8 px-8 py-3 border border-white/40 text-xs font-semibold tracking-widest uppercase transition-colors hover:bg-white hover:text-black rounded-sm"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-10 flex justify-between items-center text-sm font-light text-white/50">
                 <span>Showing {visibleProducts.length} of {sortedProducts.length} pieces</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                {visibleProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i % ITEMS_PER_PAGE) * 0.05, duration: 0.6 }}
                  >
                    <Link href={`/products/${product.id}`} className="group block h-full flex flex-col">
                      <div className="relative aspect-[3/4] overflow-hidden bg-black/40 liquid-glass border border-white/10 rounded-sm mb-6">
                        <Image 
                           src={product.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238f44b?w=600&h=800&fit=crop'} 
                           alt={product.name} 
                           fill 
                           className="object-cover opacity-90 transition-all duration-[1.5s] group-hover:scale-105 group-hover:opacity-100" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50" />
                      </div>
                      <div className="flex flex-col flex-1 px-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#D4AF37] mb-2">{product.category}</span>
                        <h3 className="font-serif text-lg font-bold text-white/90 mb-3 leading-snug group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/10">
                          <span className="text-base font-medium text-white/90">₹{product.price.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-20">
                  <span className="w-6 h-6 border-2 border-transparent border-t-[#D4AF37] border-r-[#D4AF37] rounded-full animate-spin" />
                </div>
              )}
            </>
          )}
        </div>

        <Footer />
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#050505] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-transparent border-t-[#D4AF37] border-r-[#D4AF37] rounded-full animate-spin" />
      </main>
    }>
      <ProductsCatalogInner />
    </Suspense>
  );
}
