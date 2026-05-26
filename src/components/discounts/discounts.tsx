import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { ProductListType } from "../../types/type";
import { useStore } from "../../store/store";

const Discounts: React.FC = () => {
  const { products, isLoading, isError, setProductsList } = useStore((state) => state);

  const [sortOption, setSortOption] = useState("discount-high");
  const [visibleCount, setVisibleCount] = useState(12);
  const [addedItems, setAddedItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (products.length === 0) {
      setProductsList();
    }
  }, []);

  useEffect(() => {
    setVisibleCount(12);
  }, [sortOption]);

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

    window.dispatchEvent(new Event("cart-updated"));

    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  // Filter only products with a meaningful discount
  const discountedProducts = products
    .filter((p) => p.discountPercentage && p.discountPercentage > 0)
    .sort((a, b) => {
      if (sortOption === "discount-high") return b.discountPercentage - a.discountPercentage;
      if (sortOption === "price-low-high") return a.price - b.price;
      if (sortOption === "price-high-low") return b.price - a.price;
      if (sortOption === "rating-high-low") return b.rating - a.rating;
      return 0;
    });

  // Calculate some stats for the hero
  const maxDiscount = discountedProducts.length > 0
    ? Math.round(Math.max(...discountedProducts.map((p) => p.discountPercentage)))
    : 0;
  const totalDeals = discountedProducts.length;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-12 max-w-7xl mx-auto w-full">
        <div className="h-52 w-full bg-slate-800 rounded-3xl animate-pulse mb-8"></div>
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

      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 text-white p-8 md:p-12 shadow-md">
          {/* Abstract glow shapes */}
          <div className="absolute right-0 top-0 -mt-16 -mr-16 w-72 h-72 rounded-full bg-yellow-400/20 blur-3xl"></div>
          <div className="absolute left-1/4 bottom-0 -mb-20 w-96 h-96 rounded-full bg-red-400/15 blur-3xl"></div>

          <div className="relative max-w-2xl text-left space-y-4">
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold tracking-wider uppercase border border-white/30">
              Hot Deals Hub
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Up to <span className="text-yellow-300">{maxDiscount}% OFF</span><br />
              on {totalDeals}+ Products!
            </h1>
            <p className="text-sm md:text-base text-orange-100 font-medium">
              Grab the best discounts on fresh groceries, beauty essentials, furniture, and more. Limited time offers — don't miss out!
            </p>
            <div className="pt-2 flex items-center space-x-3 text-xs md:text-sm font-bold">
              <Link
                to="/"
                className="bg-white text-orange-700 px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer font-black"
              >
                ← Back to Store
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
            {totalDeals} Deals Found
          </span>
        </div>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full sm:w-52 bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-sky-500 px-3 py-2 rounded-xl text-xs focus:outline-none transition-all text-slate-300 shadow-sm cursor-pointer"
        >
          <option value="discount-high">Biggest Discount First</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="rating-high-low">Customer Rating</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isError ? (
          <div className="flex h-[40vh] items-center justify-center">
            <div className="bg-red-950/30 border border-red-900/40 rounded-2xl p-6 text-center max-w-md shadow-sm">
              <p className="text-red-400 text-sm font-semibold mb-2">Oops! Something went wrong</p>
              <p className="text-red-400 text-xs italic">{isError}</p>
            </div>
          </div>
        ) : discountedProducts.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {discountedProducts.slice(0, visibleCount).map((product) => {
                const isAdded = addedItems[product.id] || false;
                const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);

                return (
                  <div
                    key={product.id}
                    className="group overflow-hidden rounded-3xl bg-slate-900 border border-slate-800/80 hover:border-red-500/30 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col relative"
                  >
                    {/* Discount Badge - prominent */}
                    <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg animate-pulse">
                      {Math.round(product.discountPercentage)}% OFF
                    </div>

                    {/* Thumbnail */}
                    <div className="relative h-56 w-full bg-slate-950 overflow-hidden">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-full w-full object-cover group-hover:scale-108 transition-all duration-500 ease-out"
                        loading="lazy"
                      />
                      <span className="absolute left-3 top-3 bg-slate-900/80 border border-slate-700/60 text-[10px] font-bold text-slate-300 px-2.5 py-0.5 rounded-full capitalize">
                        {product.category}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest leading-none">
                          {product.brand || "SmallBasket Sourced"}
                        </p>
                        <h2 className="line-clamp-1 text-base font-bold text-slate-100 tracking-tight group-hover:text-red-400 transition-colors">
                          {product.title}
                        </h2>
                        <p className="line-clamp-2 text-xs text-slate-400 font-medium">
                          {product.description || "Premium product at a massive discount."}
                        </p>
                      </div>

                      {/* Price Row */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase leading-none mb-0.5">Price</p>
                          <div className="flex items-baseline space-x-2">
                            <p className="text-xl font-black text-emerald-400 leading-none">
                              ${discountedPrice}
                            </p>
                            <p className="text-xs font-bold text-slate-500 line-through">
                              ${product.price}
                            </p>
                          </div>
                          <p className="text-[10px] font-bold text-red-400 mt-0.5">
                            Save ${(product.price - parseFloat(discountedPrice)).toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          {/* Rating */}
                          <div className="flex items-center bg-yellow-950/40 border border-yellow-900/30 px-2 py-1 rounded-lg text-[10px] font-bold text-yellow-400 shadow-sm leading-none space-x-0.5">
                            <span className="text-yellow-400 font-bold">★</span>
                            <span>{product.rating}</span>
                          </div>

                          {/* Add to Cart */}
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`p-2.5 rounded-xl transition-all duration-200 shadow-sm select-none active:scale-90 cursor-pointer ${isAdded
                                ? "bg-emerald-500 text-white scale-105"
                                : "bg-red-950/60 hover:bg-red-500 text-red-400 hover:text-white border border-red-900/50 hover:border-red-500"
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

            {/* See More */}
            {visibleCount < discountedProducts.length && (
              <div className="flex justify-center pt-6">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 text-xs cursor-pointer select-none"
                >
                  Load More Deals
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-[40vh] items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-slate-400 font-bold text-sm">No discounted products available right now.</p>
              <p className="text-slate-500 text-xs font-medium">Check back soon for fresh deals!</p>
              <Link
                to="/"
                className="inline-block mt-4 bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-2.5 rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 text-xs"
              >
                Back to Store
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discounts;
