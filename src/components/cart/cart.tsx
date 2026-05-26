import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { ProductListType } from "../../types/type";

interface CartItem extends ProductListType {
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("grocery_cart_items");
    return saved ? JSON.parse(saved) : [];
  });

  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  
  // Coupon system states
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);
  const [couponFlatDiscount, setCouponFlatDiscount] = useState(0);

  // Sync state with localStorage and notify header on item updates
  useEffect(() => {
    localStorage.setItem("grocery_cart_items", JSON.stringify(cartItems));
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem("grocery_cart_count", totalCount.toString());
    
    // Dispatch event to sync Header in real-time
    window.dispatchEvent(new Event("cart-updated"));
  }, [cartItems]);

  const handleUpdateQuantity = (id: number, delta: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    // Clear cart in state (triggers localstorage sync)
    setCartItems([]);
    setAppliedCoupon("");
    setCouponDiscountPercent(0);
    setCouponFlatDiscount(0);
  };

  // Coupon application handler
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    
    const code = couponInput.trim().toUpperCase();
    if (code === "SKY35") {
      setAppliedCoupon(code);
      setCouponDiscountPercent(35);
      setCouponFlatDiscount(0);
      setCouponInput("");
    } else if (code === "FRESH5") {
      setAppliedCoupon(code);
      setCouponDiscountPercent(0);
      setCouponFlatDiscount(5);
      setCouponInput("");
    } else if (code === "") {
      setCouponError("Please enter a coupon code");
    } else {
      setCouponError("Invalid coupon. Try SKY35 or FRESH5");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon("");
    setCouponDiscountPercent(0);
    setCouponFlatDiscount(0);
  };

  // Pricing calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // 1. Threshold Discount: 10% off if subtotal >= $50, 20% off if subtotal >= $100
  let autoDiscountPercent = 0;
  if (subtotal >= 100) {
    autoDiscountPercent = 20;
  } else if (subtotal >= 50) {
    autoDiscountPercent = 10;
  }
  const automaticDiscountAmount = subtotal * (autoDiscountPercent / 100);

  // 2. Coupon Discount
  const remainingSubtotal = subtotal - automaticDiscountAmount;
  const promoDiscountAmount = remainingSubtotal * (couponDiscountPercent / 100) + couponFlatDiscount;

  const discountedSubtotal = Math.max(0, subtotal - automaticDiscountAmount - promoDiscountAmount);
  
  const deliveryFee = discountedSubtotal === 0 ? 0 : discountedSubtotal >= 35 ? 0 : 4.99;
  const estimatedTax = discountedSubtotal * 0.05; // 5% standard grocery tax
  const total = discountedSubtotal + deliveryFee + estimatedTax;

  if (checkoutSuccess) {
    return (
      <div className="min-h-[75vh] bg-slate-950 flex items-center justify-center px-6 py-12 font-sans">
        <div className="bg-slate-900 border border-slate-800/80 max-w-md w-full rounded-3xl p-8 text-center shadow-md space-y-6 animate-fade-in">
          <div className="mx-auto w-16 h-16 bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-900/40 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">Order Placed Successfully!</h2>
            <p className="text-sm text-slate-400 font-medium">
              Thank you for shopping with SkyCart. Your drone delivery is scheduled and will arrive in approximately 15 minutes.
            </p>
          </div>

          <div className="bg-sky-950/40 border border-sky-900/30 rounded-2xl p-4 text-left space-y-1.5 font-mono text-xs text-sky-300">
            <p className="font-bold text-sky-200 border-b border-sky-900/40 pb-1 flex justify-between">
              <span>Delivery Status</span>
              <span>Active</span>
            </p>
            <p>Destination: Your Address</p>
            <p>Vehicle: SkyDrone-4</p>
            <p>ETA: ~12 Mins</p>
          </div>

          <Link
            to="/"
            onClick={() => setCheckoutSuccess(false)}
            className="block w-full text-center bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-2xl shadow-md transition-all hover:scale-[1.02] active:scale-95 text-sm"
          >
            Return to Aisles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-slate-950 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Page title */}
        <div className="text-left mb-8 space-y-1">
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
            Review your fresh grocery items before delivery
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Columns - Cart items list */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800/80 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex-shrink-0">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Title and Brand */}
                    <div className="text-left space-y-1">
                      <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest leading-none">
                        {item.brand || "SkyCart Sourced"}
                      </span>
                      <h3 className="text-sm font-bold text-slate-100 leading-snug line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs font-black text-slate-100 leading-none">
                        ${item.price} <span className="text-slate-500 font-medium text-[10px]">/ item</span>
                      </p>
                    </div>
                  </div>

                  {/* Quantity controls and remove button */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800/60">
                    <div className="flex items-center space-x-3 bg-slate-955 border border-slate-800 rounded-xl p-1 shadow-inner">
                      {/* Decrease */}
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="w-7 h-7 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg font-bold text-slate-300 flex items-center justify-center cursor-pointer active:scale-90 transition-transform text-xs"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-slate-100 text-xs w-6 text-center select-none">
                        {item.quantity}
                      </span>
                      {/* Increase */}
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="w-7 h-7 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg font-bold text-slate-300 flex items-center justify-center cursor-pointer active:scale-90 transition-transform text-xs"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Subtotal & Delete Actions */}
                    <div className="flex items-center space-x-4 text-right">
                      <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase leading-none mb-0.5">Subtotal</p>
                        <p className="font-black text-sm text-slate-100 leading-none">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-955/30 rounded-xl transition-all cursor-pointer"
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Order Summary Widget */}
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-slate-100 text-left border-b border-slate-800/60 pb-3">Order Summary</h2>
                
                {/* Details list */}
                <div className="space-y-3 font-medium text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-200 font-bold">${subtotal.toFixed(2)}</span>
                  </div>

                  {/* Threshold Discount */}
                  {automaticDiscountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Threshold Discount ({autoDiscountPercent}%)</span>
                      <span className="font-mono">-${automaticDiscountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Promo Discount */}
                  {promoDiscountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Promo Discount ({appliedCoupon})</span>
                      <span className="font-mono">-${promoDiscountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Delivery Fee</span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/40 leading-none">Free</span>
                    ) : (
                      <span className="font-mono text-slate-200 font-bold">${deliveryFee.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Taxes (5%)</span>
                    <span className="font-mono text-slate-200 font-bold">${estimatedTax.toFixed(2)}</span>
                  </div>

                  {deliveryFee > 0 && (
                    <p className="text-[10px] text-sky-300 bg-sky-955/40 p-2.5 rounded-xl border border-sky-900/30 leading-relaxed font-semibold italic text-left">
                      Tip: Add ${(35 - discountedSubtotal).toFixed(2)} more to unlock free delivery!
                    </p>
                  )}
                </div>

                {/* Coupon Code Input Form */}
                <div className="border-t border-slate-800/60 pt-4 text-left">
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Have a coupon code?</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try SKY35 or FRESH5"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 focus:outline-none rounded-xl text-xs font-semibold text-slate-200 shadow-inner"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm whitespace-nowrap"
                      >
                        Apply
                      </button>
                    </div>
                  </form>
                  {couponError && (
                    <p className="text-[10px] text-red-500 font-bold mt-1.5">{couponError}</p>
                  )}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between bg-emerald-955/50 border border-emerald-900/30 rounded-xl p-2.5 mt-2 text-[10px] text-emerald-300 font-bold">
                      <span>Coupon applied: {appliedCoupon}</span>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-700 font-bold ml-2 underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Grand Total divider */}
                <div className="border-t border-slate-800/60 pt-4 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-200">Total Price</span>
                  <span className="text-2xl font-black text-sky-400 font-mono">${total.toFixed(2)}</span>
                </div>

                {/* Order buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3.5 rounded-2xl shadow-md transition-all hover:scale-[1.02] active:scale-95 text-sm cursor-pointer"
                  >
                    Proceed to Checkout
                  </button>

                  <Link
                    to="/"
                    className="block w-full text-center border border-slate-800 hover:border-sky-900/50 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-sky-400 font-bold py-3 rounded-2xl shadow-sm transition-all hover:scale-[1.02] active:scale-95 text-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Security info card */}
              <div className="bg-sky-955/30 border border-sky-900/20 rounded-2xl p-4 flex items-center space-x-3 text-left">
                <svg className="w-5 h-5 text-sky-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.952 11.952 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div className="text-[10px] text-sky-300 leading-tight">
                  <p className="font-bold text-sky-300">100% Encrypted Transactions</p>
                  <p className="text-sky-400 mt-0.5 font-medium">SkyCart ensures highly secure billing & fresh guarantee.</p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Empty state */
          <div className="min-h-[50vh] bg-slate-900 border border-slate-800/80 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-slate-950 border border-slate-850 text-slate-500 rounded-full flex items-center justify-center shadow-inner">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-100">Your Cart is Empty</h2>
              <p className="text-xs text-slate-400 font-medium">Add some fresh ingredients to start your first SkyCart delivery.</p>
            </div>
            <Link
              to="/"
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-2.5 rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 text-xs inline-block"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Cart;
