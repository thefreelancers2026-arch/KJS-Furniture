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
    <main className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#D4AF37] selection:text-white pt-[90px]">
      <Navbar />

      {/* Header */}
      <div className="bg-[#faf9f6] py-16 border-b border-[#1a1a1a]/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37] mb-4">
              Curated Selection
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-6">
              {category !== 'All' ? category : 'The Collection'}
            </h1>
            <div className="w-16 h-[1px] bg-[#1a1a1a]/20" />
          </motion.div>

          {/* Search & Alignments */}
          <div className="flex flex-col lg:flex-row gap-6 mt-16 items-center">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 lg:gap-8 flex-1 w-full">
               {allCategories.map(cat => (
                 <button
                   key={cat}
                   onClick={() => setCategory(cat)}
                   className={`text-xs font-semibold tracking-widest uppercase transition-colors pointer border-b-2 pb-1 ${
                     category === cat ? 'text-[#D4AF37] border-[#D4AF37]' : 'text-[#7f7663] border-transparent hover:text-[#1a1a1a]'
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
                   className="w-full bg-transparent border-b border-[#1a1a1a]/20 py-2.5 pl-0 pr-8 text-sm outline-none transition-colors focus:border-[#D4AF37] placeholder:text-[#1a1a1a]/40"
                   placeholder="Search..."
                 />
                 <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
               </div>
               
               <button
                 onClick={() => setShowFilters(!showFilters)}
                 className={`flex items-center gap-2 py-2.5 text-xs font-semibold tracking-widest uppercase transition-colors ${showFilters ? 'text-[#D4AF37]' : 'text-[#1a1a1a] hover:text-[#D4AF37]'}`}
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
              className="mt-8 pt-8 border-t border-[#1a1a1a]/10 grid grid-cols-1 md:grid-cols-3 gap-12"
            >
              <div>
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1a1a1a] mb-4 block">Sort By</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full bg-transparent border border-[#1a1a1a]/10 px-4 py-3 text-sm outline-none rounded-sm appearance-none cursor-pointer focus:border-[#D4AF37]"
                >
                  <option value="default">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1a1a1a] mb-4 block">Material</span>
                <div className="flex flex-wrap gap-2">
                  {allMaterials.map(mat => (
                    <button
                      key={mat}
                      onClick={() => setSelectedMaterial(mat)}
                      className={`text-xs px-3 py-1.5 border transition-colors rounded-sm ${
                         selectedMaterial === mat 
                           ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' 
                           : 'bg-transparent text-[#5e604d] border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30'
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1a1a1a] mb-4 block">
                  Price: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                </span>
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  step={500}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([0, Number(e.target.value)])}
                  className="w-full h-1 bg-[#1a1a1a]/10 rounded-none cursor-pointer accent-[#1a1a1a]"
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
                <div className="aspect-[3/4] bg-[#faf9f6] rounded-sm mb-6" />
                <div className="h-4 bg-[#faf9f6] rounded mb-3 w-1/4" />
                <div className="h-6 bg-[#faf9f6] rounded mb-4 w-3/4" />
                <div className="h-5 bg-[#faf9f6] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-32 flex flex-col items-center">
            <h3 className="font-serif text-3xl font-bold text-[#1a1a1a] mb-4">Nothing Found.</h3>
            <p className="text-[#5e604d] font-light">We couldn't find items that matched your precise criteria.</p>
            <button 
               onClick={() => { setCategory('All'); setSearch(''); setPriceRange([0, 100000]); setSelectedMaterial('All Materials'); }}
               className="mt-8 px-8 py-3 border border-[#1a1a1a] text-xs font-semibold tracking-widest uppercase transition-colors hover:bg-[#1a1a1a] hover:text-white rounded-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-10 flex justify-between items-center text-sm font-light text-[#5e604d]">
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
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#faf9f6] rounded-sm mb-6">
                      <Image 
                         src={product.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238f44b?w=600&h=800&fit=crop'} 
                         alt={product.name} 
                         fill 
                         className="object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#D4AF37] mb-2">{product.category}</span>
                      <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-3 leading-snug group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#1a1a1a]/5">
                        <span className="text-base font-medium text-[#1a1a1a]">₹{product.price.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity">View</span>
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
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-transparent border-t-[#D4AF37] border-r-[#D4AF37] rounded-full animate-spin" />
      </main>
    }>
      <ProductsCatalogInner />
    </Suspense>
  );
}
