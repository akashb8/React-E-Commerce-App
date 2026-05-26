import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../store/store";

const Header: React.FC = () => {
  const [cartCount, setCartCount] = useState<number>(() => {
    const saved = localStorage.getItem("grocery_cart_count");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [cartBounce, setCartBounce] = useState(false);

  useEffect(() => {
    localStorage.setItem("grocery_cart_count", cartCount.toString());
  }, [cartCount]);

  useEffect(() => {
    const handleCartUpdate = () => {
      const saved = localStorage.getItem("grocery_cart_count");
      setCartCount(saved ? parseInt(saved, 10) : 0);
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 500);
    };
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  const { searchQuery, setSearchQuery } = useStore((state) => state);

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800/80 text-slate-100 font-sans sticky top-0 z-50 shadow-md">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className="flex items-center space-x-2.5 group cursor-pointer text-decoration-none">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-sky-900/30 group-hover:border-sky-500/50 transition-all duration-300 shadow-sm flex-shrink-0">
              <img src="/logo.png" alt="SmallBasket Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-green-600 leading-tight">
                Small<span className="text-sky-400 font-light ml-1">Basket</span>
              </span>
              <span className="text-[10px] text-sky-400 font-semibold tracking-widest uppercase">
                Freshness Delivered Fast
              </span>
            </div>
          </Link>
        </div>

        {/* Smart Search Bar */}
        <div className="flex-1 max-w-lg w-full relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fresh vegetables, organic fruits, bakery..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 hover:bg-slate-800/80 focus:bg-slate-900 border border-slate-700/80 focus:border-sky-500 focus:outline-none rounded-2xl text-sm transition-all duration-200 text-slate-100 placeholder-slate-500 shadow-inner"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Cart Action */}
        <div className="flex items-center justify-end w-full md:w-auto">
          {/* Shopping Cart Icon */}
          <div className="relative">
            <Link
              to="/cart"
              className={`flex items-center space-x-2 bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-900/40 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-sm active:scale-95 cursor-pointer relative ${cartBounce ? "animate-bounce scale-105" : ""
                }`}
            >
              <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden sm:inline">My Cart</span>
              <span className="bg-sky-600 text-white text-xs px-2 py-0.5 rounded-full font-black animate-pulse">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;