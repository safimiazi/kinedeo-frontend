// "use client";

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   emoji: string;
//   qty: number;
// }

// interface CartPanelProps {
//   cart: CartItem[];
//   cartTotal: number;
//   onClose: () => void;
//   onCheckout: () => void;
// }

// export default function CartPanel({ cart, cartTotal, onClose, onCheckout }: CartPanelProps) {
//   return (
//     <>
//       <div className="fixed inset-0 bg-black/40 z-[100]" onClick={onClose} />
//       <div className="fixed top-0 right-0 w-full md:w-[380px] h-screen bg-white z-[101] overflow-y-auto shadow-[-8px_0_32px_rgba(0,0,0,0.15)] flex flex-col">
//         <div className="p-6 pb-5 border-b border-[#fce4ec] flex justify-between items-center">
//           <div className="font-playfair text-[22px] font-extrabold text-[#2d1a24]">Your Cart 🛍️</div>
//           <button className="bg-transparent border-none cursor-pointer text-[22px]" onClick={onClose}>✕</button>
//         </div>
//         <div className="flex-1 overflow-y-auto px-6 py-5">
//           {cart.length === 0 ? (
//             <div className="text-center py-16">
//               <div className="text-6xl mb-4">🛍️</div>
//               <div className="font-playfair text-lg text-[#2d1a24] mb-2">Your cart is empty</div>
//               <div className="font-nunito text-sm text-[#ad1457]">Add some beautiful products!</div>
//             </div>
//           ) : (
//             cart.map((item) => (
//               <div key={item.id} className="flex gap-4 py-4 border-b border-[#fce4ec]">
//                 <div className="w-16 h-16 bg-linear-to-br from-[#fce4ec] to-[#f8bbd0] rounded-xl flex items-center justify-center text-[32px] shrink-0">
//                   {item.emoji}
//                 </div>
//                 <div className="flex-1">
//                   <div className="font-nunito font-bold text-[#2d1a24] text-sm mb-1">{item.name}</div>
//                   <div className="font-nunito text-[13px] text-[#e91e8c] font-bold">
//                     ৳{item.price.toLocaleString()} × {item.qty}
//                   </div>
//                 </div>
//                 <div className="font-nunito font-extrabold text-[#2d1a24] text-[15px] self-center">
//                   ৳{(item.price * item.qty).toLocaleString()}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {cart.length > 0 && (
//           <div className="px-6 py-5 border-t border-[#fce4ec]">
//             <div className="flex justify-between mb-4">
//               <span className="font-nunito font-semibold text-[#6d1b3b]">Total</span>
//               <span className="font-playfair font-extrabold text-[22px] text-[#e91e8c]">৳{cartTotal.toLocaleString()}</span>
//             </div>
//             <button
//               className="w-full bg-linear-to-br from-[#e91e8c] to-[#c2185b] text-white border-none py-4 rounded-2xl cursor-pointer font-nunito font-bold text-base hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all"
//               onClick={onCheckout}
//             >
//               Checkout Now →
//             </button>
//             <div className="font-nunito text-center mt-3 text-xs text-[#ad1457]">
//               🔒 Secure checkout · Free shipping on this order
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
"use client";

import { 
  ShoppingBag, 
  X, 
  Trash2, 
  Heart, 
  Shield, 
  Truck, 
  CreditCard,
  Minus,
  Plus,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  emoji: string | React.ReactNode;
  qty: number;
}

interface CartPanelProps {
  cart: CartItem[];
  cartTotal: number;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartPanel({ cart, cartTotal, onClose, onCheckout }: CartPanelProps) {
  const [localCart, setLocalCart] = useState(cart);
  
  const updateQuantity = (id: number, newQty: number) => {
    if (newQty < 1) return;
    setLocalCart(prev => prev.map(item => 
      item.id === id ? { ...item, qty: newQty } : item
    ));
  };

  const removeItem = (id: number) => {
    setLocalCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = localCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;
  const savings = 150; // Example savings

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-fade-in" 
        onClick={onClose} 
      />
      
      {/* Cart Panel */}
      <div className="fixed top-0 right-0 w-full md:w-[450px] h-screen bg-white z-[101] shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="p-6 border-b border-[#fce4ec] bg-gradient-to-r from-white to-pink-50/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e91e8c] to-[#c2185b] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-playfair text-xl font-extrabold text-[#2d1a24]">Your Cart</h2>
                <p className="font-nunito text-xs text-[#ad1457]">{localCart.length} items</p>
              </div>
            </div>
            <button 
              className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 transition-all flex items-center justify-center group"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-[#ad1457] group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {localCart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-[#ad1457]/30" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-[#2d1a24] mb-2">Your cart is empty</h3>
              <p className="font-nunito text-sm text-[#ad1457] mb-6">Add some beautiful products!</p>
              <button 
                onClick={onClose}
                className="inline-flex items-center gap-2 text-[#e91e8c] font-semibold text-sm hover:gap-3 transition-all"
              >
                Continue Shopping <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {localCart.map((item) => (
                <div key={item.id} className="group bg-white rounded-xl border border-[#fce4ec] p-3 hover:shadow-lg hover:border-[#e91e8c]/30 transition-all duration-300">
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl flex items-center justify-center text-3xl shrink-0 relative overflow-hidden">
                      {typeof item.emoji === 'string' ? (
                        <span className="text-3xl">{item.emoji}</span>
                      ) : (
                        item.emoji
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-nunito font-bold text-[#2d1a24] text-sm mb-1 line-clamp-1">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-nunito text-sm font-bold text-[#e91e8c]">
                              ৳{item.price.toLocaleString()}
                            </span>
                            <span className="text-xs text-[#ad1457]/50">per item</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                        </button>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-pink-50 rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.qty - 1)}
                            className="w-7 h-7 rounded-md bg-white hover:bg-[#e91e8c] hover:text-white transition-all flex items-center justify-center shadow-sm"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-semibold text-sm text-[#2d1a24]">
                            {item.qty}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.qty + 1)}
                            className="w-7 h-7 rounded-md bg-white hover:bg-[#e91e8c] hover:text-white transition-all flex items-center justify-center shadow-sm"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="font-playfair font-extrabold text-[#2d1a24] text-base">
                            ৳{(item.price * item.qty).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Wishlist Suggestion */}
              <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-[#e91e8c]" />
                  <span className="font-nunito text-xs font-semibold text-[#2d1a24]">Complete your look</span>
                </div>
                <p className="font-nunito text-xs text-[#ad1457]">
                  Add items from your wishlist to get free shipping!
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {localCart.length > 0 && (
          <div className="border-t border-[#fce4ec] bg-white">
            {/* Promo Code */}
            <div className="px-6 pt-4 pb-3">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Promo code"
                  className="flex-1 px-4 py-2 rounded-lg border border-pink-200 text-sm outline-none focus:border-[#e91e8c] transition-colors"
                />
                <button className="px-4 py-2 bg-pink-50 text-[#e91e8c] rounded-lg text-sm font-semibold hover:bg-pink-100 transition-colors">
                  Apply
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="px-6 py-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6d1b3b]/70">Subtotal</span>
                <span className="font-semibold text-[#2d1a24]">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6d1b3b]/70 flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  Shipping
                </span>
                <span className="font-semibold text-green-600">
                  {shipping === 0 ? "FREE" : `৳${shipping}`}
                </span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 flex items-center gap-1">
                    You Save
                  </span>
                  <span className="font-semibold text-green-600">-৳{savings.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-[#fce4ec] my-2" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-base text-[#2d1a24]">Total</span>
                <span className="font-playfair font-extrabold text-2xl text-[#e91e8c]">
                  ৳{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="px-6 pb-6 pt-2">
              <button
                className="w-full bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white py-4 rounded-2xl font-nunito font-bold text-base hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#e91e8c]/35 transition-all duration-300 flex items-center justify-center gap-2 group"
                onClick={onCheckout}
              >
                <CreditCard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Proceed to Checkout
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              {/* Security Badges */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-600" />
                  <span className="font-nunito text-[10px] text-[#ad1457]">SSL Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-green-600" />
                  <span className="font-nunito text-[10px] text-[#ad1457]">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-green-600" />
                  <span className="font-nunito text-[10px] text-[#ad1457]">30 Days Returns</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}