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
  ChevronRight,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useShippingSettings, calcShipping, DEFAULT_SHIPPING_SETTINGS } from "@/lib/hooks/use-shipping-settings";

interface CartPanelProps {
  onClose: () => void;
}

export default function CartPanel({ onClose }: CartPanelProps) {
  const router = useRouter();
  const { items, updateQty, removeItem, itemCount, subtotal } = useCart();

  const { data: shippingSettings } = useShippingSettings();
  const settings = shippingSettings ?? DEFAULT_SHIPPING_SETTINGS;
  const shipping = calcShipping(settings, subtotal);
  const total = subtotal + shipping;

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

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
        <div className="p-6 border-b border-[#fce4ec] bg-linear-to-r from-white to-pink-50/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#e91e8c] to-[#c2185b] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-playfair text-xl font-extrabold text-[#2d1a24]">Your Cart</h2>
                <p className="font-nunito text-xs text-[#ad1457]">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
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
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-linear-to-br from-pink-100 to-pink-50 flex items-center justify-center">
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
              {items.map((item) => {
                const key = `${item.productId}-${item.variantId || "default"}`;
                return (
                  <div
                    key={key}
                    className="group bg-white rounded-xl border border-[#fce4ec] p-3 hover:shadow-lg hover:border-[#e91e8c]/30 transition-all duration-300"
                  >
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-linear-to-br from-pink-50 to-rose-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-8 h-8 text-[#ad1457]/30" />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0 flex-1 pr-2">
                            <h4 className="font-nunito font-bold text-[#2d1a24] text-sm mb-0.5 truncate">
                              {item.name}
                            </h4>
                            {item.variantLabel && (
                              <p className="text-[10px] text-[#ad1457] mb-1">{item.variantLabel}</p>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="font-nunito text-sm font-bold text-[#e91e8c]">
                                ৳{item.price.toLocaleString()}
                              </span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="text-[10px] text-[#ad1457]/50 line-through">
                                  ৳{item.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId, item.variantId)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-lg shrink-0"
                          >
                            <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-pink-50 rounded-lg p-1">
                            <button
                              onClick={() => updateQty(item.productId, item.qty - 1, item.variantId)}
                              className="w-7 h-7 rounded-md bg-white hover:bg-[#e91e8c] hover:text-white transition-all flex items-center justify-center shadow-sm"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-semibold text-sm text-[#2d1a24]">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.productId, item.qty + 1, item.variantId)}
                              className="w-7 h-7 rounded-md bg-white hover:bg-[#e91e8c] hover:text-white transition-all flex items-center justify-center shadow-sm"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-playfair font-extrabold text-[#2d1a24] text-base">
                            ৳{(item.price * item.qty).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Free shipping nudge */}
              {subtotal < settings.freeShippingThreshold && settings.freeShippingEnabled && (
                <div className="p-3 bg-linear-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100 text-center">
                  <p className="font-nunito text-xs text-[#ad1457]">
                    Add <strong>৳{(settings.freeShippingThreshold - subtotal).toLocaleString()}</strong> more for free shipping!
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#fce4ec] bg-white">
            {/* Price Breakdown */}
            <div className="px-6 py-4 space-y-2">
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
              <div className="border-t border-[#fce4ec] my-2" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-base text-[#2d1a24]">Total</span>
                <span className="font-playfair font-extrabold text-2xl text-[#e91e8c]">
                  ৳{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="px-6 pb-6 pt-1">
              <button
                className="w-full bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white py-4 rounded-2xl font-nunito font-bold text-base hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#e91e8c]/35 transition-all duration-300 flex items-center justify-center gap-2 group"
                onClick={handleCheckout}
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
