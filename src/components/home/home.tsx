import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { ProductListType } from "../../types/type";
import { useStore } from "../../store/store";

const Home: React.FC = () => {
  const { products, isLoading, isError, setProductsList, searchQuery, setSearchQuery } = useStore((state) => state);
  
  // Local state for interactive filtering & sorting
  const [selectedCategory, setSelectedCategory] = useState("groceries");
  const [sortOption, setSortOption] = useState("default");
  
  // visibleCount for pagination/See More shortening
  const [visibleCount, setVisibleCount] = useState(8);
  
  // Track micro-interaction click states for individual products
  const [addedItems, setAddedItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setProductsList();
  }, []);

  // Reset Visible Count back to 8 when filters change to preserve short UI
  useEffect(() => {
    setVisibleCount(8);
  }, [searchQuery, selectedCategory, sortOption]);

  const handleAddToCart = (product: ProductListType) => {
    const cartString = localStorage.getItem("grocery_cart_items");
    let cart = cartString ? JSON.parse(cartString) : [];
    
    const existingItem = cart.find((item: any) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem("grocery_cart_items", JSON.stringify(cart));
    
    const totalCount = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
    localStorage.setItem("grocery_cart_count", totalCount.toString());
    
    // Trigger custom event to notify Header cart to update/bounce in real-time
    window.dispatchEvent(new Event("cart-updated"));
    
    // Set active state for loading/added checkmark micro-animation
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  // Extract unique categories dynamically from products to keep it robust
  const categories = ["All Aisles", ...Array.from(new Set(products.map((p) => p.category)))];

  // Search, filter and sort logic (safe optional chains to prevent crash)
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.brand?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (product.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === "All Aisles" ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === "price-low-high") return a.price - b.price;
      if (sortOption === "price-high-low") return b.price - a.price;
      if (sortOption === "rating-high-low") return b.rating - a.rating;
      return 0; // default order
    });

  // Render pristine pulsing card loading skeletons for premium UX
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {/* Banner Skeleton */}
        <div className="h-44 w-full bg-slate-800 rounded-3xl animate-pulse mb-8"></div>
        {/* Filters Skeletons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {Array(5).fill(0).map((_, idx) => (
            <div key={idx} className="h-9 w-28 bg-slate-800 rounded-full animate-pulse"></div>
          ))}
        </div>
        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, idx) => (
            <div key={idx} className="bg-slate-900 rounded-2xl border border-slate-850 p-4 space-y-4 shadow-sm animate-pulse">
              <div className="h-48 w-full bg-slate-800 rounded-xl"></div>
              <div className="h-4 w-1/3 bg-slate-800 rounded"></div>
              <div className="h-6 w-3/4 bg-slate-800 rounded"></div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 w-1/4 bg-slate-800 rounded"></div>
                <div className="h-8 w-1/3 bg-slate-800 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-16 font-sans">
      {/* 1. Stunning Hero Banner */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white p-8 md:p-12 shadow-md">
          {/* Subtle background abstract shapes */}
          <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute left-1/3 bottom-0 -mb-16 w-80 h-80 rounded-full bg-sky-400/20 blur-3xl"></div>
          
          <div className="relative max-w-2xl text-left space-y-4">
            <span className="bg-sky-400/20 text-sky-200 text-xs px-3 py-1 rounded-full font-bold tracking-wider uppercase border border-sky-400/30">
              Flash Deal of the Day
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Fresh Deals, <br />
              <span className="text-sky-300">Delivered in 15 Mins!</span>
            </h1>
            <p className="text-sm md:text-base text-sky-100 font-medium">
              Locally sourced fresh organic groceries and household essentials delivered straight to your door in Salt Lake, Kolkata.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-xs md:text-sm font-bold">
              <Link to="/discounts" className="text-sky-200 hover:text-white transition-colors cursor-pointer flex items-center space-x-1">
                <span>View all discounts</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Navigation Filters & Controls */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-slate-800">
        
        {/* Category Pills Slider */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 select-none no-scrollbar">
          {categories.map((category) => {
            const isSelected = selectedCategory.toLowerCase() === category.toLowerCase();
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 ${
                  isSelected
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-slate-900 border border-slate-800/80 hover:border-sky-500/50 text-slate-300"
                }`}
              >
                <span className="capitalize">{category}</span>
              </button>
            );
          })}
        </div>

        {/* Local Search & Sorting Dropdowns */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Quick local Filter Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Filter these products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl text-xs transition-all focus:outline-none placeholder-slate-500 text-slate-100 shadow-sm"
            />
            <svg className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>

          {/* Sort Menu */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full sm:w-44 bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-sky-500 px-3 py-2 rounded-xl text-xs focus:outline-none transition-all text-slate-300 shadow-sm cursor-pointer"
          >
            <option value="default">Sort by: Relevance</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating-high-low">Customer Rating</option>
          </select>
        </div>
      </div>

      {/* 3. Products List Catalog */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isError ? (
          <div className="flex h-[40vh] items-center justify-center">
            <div className="bg-red-950/30 border border-red-900/40 rounded-2xl p-6 text-center max-w-md shadow-sm">
              <p className="text-red-400 text-sm font-semibold mb-2">Oops! Something went wrong</p>
              <p className="text-red-400 text-xs italic">{isError}</p>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.slice(0, visibleCount).map((product) => {
                const isAdded = addedItems[product.id] || false;
                const catLower = product.category.toLowerCase();
                
                // Custom category badges
                let badgeColor = "bg-emerald-950/60 text-emerald-400 border-emerald-900/40";
                let badgeText = "Organic Fresh";
                if (catLower.includes("beauty")) {
                  badgeColor = "bg-purple-950/60 text-purple-400 border-purple-900/40";
                  badgeText = "Premium Beauty";
                } else if (catLower.includes("fragrance")) {
                  badgeColor = "bg-pink-950/60 text-pink-400 border-pink-900/40";
                  badgeText = "Exquisite";
                } else if (catLower.includes("furniture")) {
                  badgeColor = "bg-blue-950/60 text-blue-400 border-blue-900/40";
                  badgeText = "Crafted Home";
                }

                return (
                  <div
                    key={product.id}
                    className="group overflow-hidden rounded-3xl bg-slate-900 border border-slate-800/80 hover:border-sky-500/30 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    {/* Thumbnail Cover with Hover Scale & Badge */}
                    <div className="relative h-56 w-full bg-slate-950 overflow-hidden">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-full w-full object-cover group-hover:scale-108 transition-all duration-500 ease-out"
                        loading="lazy"
                      />
                      
                      {/* Category pill on card overlay */}
                      <span className={`absolute left-3 top-3 border text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm capitalize ${badgeColor}`}>
                        {badgeText}
                      </span>

                      {/* Quick discount tag overlay if available */}
                      {product.discountPercentage && (
                        <span className="absolute right-3 top-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                          {Math.round(product.discountPercentage)}% OFF
                        </span>
                      )}
                    </div>

                    {/* Product Details Section */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest leading-none">
                          {product.brand || "SkyCart Sourced"}
                        </p>

                        <h2 className="line-clamp-1 text-base font-bold text-slate-100 tracking-tight group-hover:text-sky-400 transition-colors">
                          {product.title}
                        </h2>
                        
                        <p className="line-clamp-2 text-xs text-slate-400 font-medium">
                          {product.description || "Fresh selection item sourced premium directly for Salt Lake delivery."}
                        </p>
                      </div>

                      {/* Bottom Action Row */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase leading-none mb-0.5">Price</p>
                          <p className="text-xl font-black text-slate-100 leading-none">
                            ${product.price}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          {/* Rating Display */}
                          <div className="flex items-center bg-yellow-950/40 border border-yellow-900/30 px-2 py-1 rounded-lg text-[10px] font-bold text-yellow-400 shadow-sm leading-none space-x-0.5">
                            <span className="text-yellow-400 font-bold">★</span>
                            <span>{product.rating}</span>
                          </div>

                          {/* Interactive Add to Cart button */}
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`p-2.5 rounded-xl transition-all duration-200 shadow-sm select-none active:scale-90 cursor-pointer ${
                              isAdded
                                ? "bg-emerald-500 text-white scale-105"
                                : "bg-sky-950/60 hover:bg-sky-500 text-sky-400 hover:text-white border border-sky-900/50 hover:border-sky-500"
                            }`}
                            aria-label="Add to Cart"
                          >
                            {isAdded ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* 4. Elegant See More Button */}
            {visibleCount < filteredProducts.length && (
              <div className="flex justify-center pt-6">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="px-8 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 text-xs cursor-pointer select-none"
                >
                  See More Products
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-[40vh] items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-slate-400 font-bold text-sm">No organic products found.</p>
              <p className="text-slate-500 text-xs font-medium">Try sorting differently or search another term!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;