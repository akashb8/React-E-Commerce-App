import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-400 font-sans py-12 mt-auto">
      {/* Top Section - Multi-Column Directory */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-800 text-left">

        {/* Brand Info Column */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center space-x-2.5 group cursor-pointer text-decoration-none">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-sky-500/20 group-hover:border-sky-500/40 transition-all duration-300 flex-shrink-0">
              <img src="/logo.png" alt="SmallBasket Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg font-black text-green-600 tracking-tight">
              Small<span className="text-sky-400 font-light ml-1">Basket</span>
            </span>
          </Link>

          <p className="text-xs leading-relaxed text-slate-400 font-medium">
            Your premium partner for fresh, farm-sourced organic groceries and daily household essentials. Super-fast drone delivery serving Salt Lake, Kolkata.
          </p>

          <div className="text-[11px] font-medium text-slate-500 space-y-1">
            <p>Email: <a href="mailto:support@skycart.com" className="text-sky-400 hover:underline">support@skycart.com</a></p>
            <p>HQ: Sector V, Salt Lake, Kolkata</p>
          </div>
        </div>

        {/* Categories Directory Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest">Shop Aisles</h4>
          <ul className="space-y-2 text-xs font-semibold text-slate-400">
            <li>
              <Link to="/" className="hover:text-sky-400 transition-colors">
                Fresh Groceries &amp; Veggies
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-sky-400 transition-colors">
                Premium Beauty Products
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-sky-400 transition-colors">
                Exquisite Fragrances
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-sky-400 transition-colors">
                Crafted Home Furniture
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest">Customer Support</h4>
          <ul className="space-y-2 text-xs font-semibold text-slate-400">
            <li>
              <Link to="/cart" className="hover:text-sky-400 transition-colors">
                Track My Drone Order
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-sky-400 transition-colors">
                Help &amp; Support Center
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-sky-400 transition-colors">
                Refunds &amp; Returns Policy
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-sky-400 transition-colors">
                Terms &amp; Store Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Promotional Offers Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest">Offers &amp; Services</h4>
          <ul className="space-y-2 text-xs font-semibold text-slate-400">
            <li>
              <span className="text-slate-500">First Order Code:</span>{" "}
              <span className="text-yellow-400 font-bold font-mono">SKY35</span>
            </li>
            <li>
              <span className="text-slate-500">Free delivery:</span>{" "}
              <span className="text-emerald-400 font-bold">Orders over $35</span>
            </li>
            <li>
              <Link to="/" className="hover:text-sky-400 transition-colors">
                Corporate Grocery Delivery
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-sky-400 transition-colors">
                Organic Partner Programs
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Section - Copyright & Social Links */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Copyright */}
        <div className="text-xs font-medium text-slate-500">
          &copy; {new Date().getFullYear()} Small Basket. Developed by <a href="https://github.com/akashb8" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Akash</a>. All rights reserved.
        </div>

        {/* Subtle social link icons */}
        <div className="flex items-center space-x-3 text-slate-500">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors" aria-label="Facebook">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
            </svg>
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors" aria-label="Instagram">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;