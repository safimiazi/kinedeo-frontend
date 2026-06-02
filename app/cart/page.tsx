// "use client";

// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { useCart } from "@/lib/cart-context";

// export default function CartPage() {
//   const router = useRouter();
//   const { items, updateQty, removeItem, itemCount, subtotal } = useCart();

//   const shipping = subtotal >= 999 ? 0 : 99;
//   const total = subtotal + shipping;

//   return (
//     <div className="min-h-screen bg-[#fff0f5] font-nunito">
//       <Navbar cartCount={itemCount} onCartOpen={() => {}} />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         <h1 className="font-playfair text-3xl md:text-4xl font-extrabold text-[#2d1a24] mb-2">Your Shopping Bag</h1>
//         <p className="font-nunito text-sm text-[#ad1457] mb-8">{itemCount} item{itemCount !== 1 ? "s" : ""} in your cart</p>

//         {items.length === 0 ? (
//           <div className="text-center py-20">
//             <span className="text-6xl block mb-4">🛍️</span>
//             <h2 className="font-playfair text-2xl font-bold text-[#2d1a24] mb-3">Your cart is empty</h2>
//             <p className="text-sm text-[#6d1b3b]/60 mb-6">Add some beautiful products to get started</p>
//             <Link href="/" className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-8 py-3 rounded-full font-bold text-sm hover:shadow-lg transition-all inline-block">
//               Continue Shopping
//             </Link>
//           </div>
//         ) : (
//           <div className="flex flex-col lg:flex-row gap-8">
//             {/* Cart Items */}
//             <div className="flex-1 space-y-4">
//               {items.map((item) => (
//                 <div key={`${item.productId}-${item.variantId || "d"}`}
//                   className="bg-white rounded-2xl p-5 border border-[#fce4ec] flex flex-col sm:flex-row gap-4">
//                   <Link href={`/product/${item.productId}`}
//                     className="w-24 h-24 sm:w-28 sm:h-28 bg-pink-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
//                     {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-4xl">📦</span>}
//                   </Link>
//                   <div className="flex-1">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <Link href={`/product/${item.productId}`}>
//                           <h3 className="font-playfair text-lg font-bold text-[#2d1a24] hover:text-[#e91e8c] transition-colors">{item.name}</h3>
//                         </Link>
//                         {item.variantLabel && <p className="text-xs text-[#ad1457] mt-0.5">{item.variantLabel}</p>}
//                         {item.sku && <p className="text-[10px] text-[#6d1b3b]/40 mt-0.5">SKU: {item.sku}</p>}
//                       </div>
//                       <button onClick={() => removeItem(item.productId, item.variantId)}
//                         className="text-[#ad1457]/50 hover:text-red-500 transition-colors text-lg" aria-label="Remove">🗑️</button>
//                     </div>
//                     <div className="flex items-center justify-between mt-4">
//                       <div className="flex items-center gap-3">
//                         <button onClick={() => updateQty(item.productId, item.qty - 1, item.variantId)}
//                           className="w-8 h-8 rounded-full border border-[#fce4ec] flex items-center justify-center text-[#e91e8c] font-bold hover:bg-[#fce4ec] transition-colors">−</button>
//                         <span className="font-bold text-sm text-[#2d1a24] w-6 text-center">{item.qty}</span>
//                         <button onClick={() => updateQty(item.productId, item.qty + 1, item.variantId)}
//                           className="w-8 h-8 rounded-full border border-[#fce4ec] flex items-center justify-center text-[#e91e8c] font-bold hover:bg-[#fce4ec] transition-colors">+</button>
//                       </div>
//                       <div className="text-right">
//                         {item.originalPrice && item.originalPrice > item.price && (
//                           <span className="font-nunito text-xs text-[#ad1457] line-through mr-2">৳{(item.originalPrice * item.qty).toLocaleString()}</span>
//                         )}
//                         <span className="font-playfair text-xl font-extrabold text-[#e91e8c]">৳{(item.price * item.qty).toLocaleString()}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Order Summary */}
//             <div className="lg:w-[360px] shrink-0">
//               <div className="bg-white rounded-2xl border-2 border-[#e91e8c]/20 p-6 sticky top-20">
//                 <h3 className="font-playfair text-xl font-bold text-[#2d1a24] mb-5">Order Summary</h3>
//                 <div className="space-y-3 mb-5">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-[#2d1a24]/70">Subtotal ({itemCount} items)</span>
//                     <span className="font-semibold text-[#2d1a24]">৳{subtotal.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-[#2d1a24]/70">Shipping</span>
//                     <span className="font-semibold text-green-600">{shipping === 0 ? "FREE" : `৳${shipping}`}</span>
//                   </div>
//                   {shipping > 0 && (
//                     <p className="text-[10px] text-[#ad1457]">Free shipping on orders above ৳999</p>
//                   )}
//                 </div>
//                 <div className="border-t border-[#fce4ec] my-4" />
//                 <div className="flex justify-between items-center mb-6">
//                   <span className="font-bold text-base text-[#2d1a24]">Total</span>
//                   <span className="font-playfair font-extrabold text-2xl text-[#e91e8c]">৳{total.toLocaleString()}</span>
//                 </div>
//                 <button onClick={() => router.push("/checkout")}
//                   className="w-full bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white py-4 rounded-full font-bold text-base hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all">
//                   PROCEED TO CHECKOUT ✨
//                 </button>
//                 <div className="text-center mt-4">
//                   <Link href="/" className="text-sm text-[#e91e8c] font-semibold hover:underline">← Continue Shopping</Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, Package, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQty, removeItem, itemCount, subtotal } = useCart();

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#fff0f5] font-nunito">
      <Navbar cartCount={itemCount} onCartOpen={() => {}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-playfair text-3xl md:text-4xl font-extrabold text-[#2d1a24] mb-2">Your Shopping Bag</h1>
        <p className="font-nunito text-sm text-[#ad1457] mb-8">{itemCount} item{itemCount !== 1 ? "s" : ""} in your cart</p>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-[#ad1457]/40" />
            <h2 className="font-playfair text-2xl font-bold text-[#2d1a24] mb-3">Your cart is empty</h2>
            <p className="text-sm text-[#6d1b3b]/60 mb-6">Add some beautiful products to get started</p>
            <Link href="/" className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-8 py-3 rounded-full font-bold text-sm hover:shadow-lg transition-all inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId || "d"}`}
                  className="bg-white rounded-2xl p-5 border border-[#fce4ec] flex flex-col sm:flex-row gap-4">
                  <Link href={`/product/${item.productId}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 bg-pink-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <Package className="w-10 h-10 text-[#ad1457]/40" />}
                  </Link>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/product/${item.productId}`}>
                          <h3 className="font-playfair text-lg font-bold text-[#2d1a24] hover:text-[#e91e8c] transition-colors">{item.name}</h3>
                        </Link>
                        {item.variantLabel && <p className="text-xs text-[#ad1457] mt-0.5">{item.variantLabel}</p>}
                        {item.sku && <p className="text-[10px] text-[#6d1b3b]/40 mt-0.5">SKU: {item.sku}</p>}
                      </div>
                      <button onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-[#ad1457]/50 hover:text-red-500 transition-colors" aria-label="Remove">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQty(item.productId, item.qty - 1, item.variantId)}
                          className="w-8 h-8 rounded-full border border-[#fce4ec] flex items-center justify-center text-[#e91e8c] font-bold hover:bg-[#fce4ec] transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-sm text-[#2d1a24] w-6 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.productId, item.qty + 1, item.variantId)}
                          className="w-8 h-8 rounded-full border border-[#fce4ec] flex items-center justify-center text-[#e91e8c] font-bold hover:bg-[#fce4ec] transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="font-nunito text-xs text-[#ad1457] line-through mr-2">৳{(item.originalPrice * item.qty).toLocaleString()}</span>
                        )}
                        <span className="font-playfair text-xl font-extrabold text-[#e91e8c]">৳{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-[360px] shrink-0">
              <div className="bg-white rounded-2xl border-2 border-[#e91e8c]/20 p-6 sticky top-20">
                <h3 className="font-playfair text-xl font-bold text-[#2d1a24] mb-5">Order Summary</h3>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#2d1a24]/70">Subtotal ({itemCount} items)</span>
                    <span className="font-semibold text-[#2d1a24]">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#2d1a24]/70">Shipping</span>
                    <span className="font-semibold text-green-600">{shipping === 0 ? "FREE" : `৳${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[10px] text-[#ad1457]">Free shipping on orders above ৳999</p>
                  )}
                </div>
                <div className="border-t border-[#fce4ec] my-4" />
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-base text-[#2d1a24]">Total</span>
                  <span className="font-playfair font-extrabold text-2xl text-[#e91e8c]">৳{total.toLocaleString()}</span>
                </div>
                <button onClick={() => router.push("/checkout")}
                  className="w-full bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white py-4 rounded-full font-bold text-base hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all">
                  PROCEED TO CHECKOUT ✨
                </button>
                <div className="text-center mt-4">
                  <Link href="/" className="text-sm text-[#e91e8c] font-semibold hover:underline inline-flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}