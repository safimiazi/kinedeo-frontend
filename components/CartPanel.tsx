"use client";

interface CartItem {
  id: number;
  name: string;
  price: number;
  emoji: string;
  qty: number;
}

interface CartPanelProps {
  cart: CartItem[];
  cartTotal: number;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartPanel({ cart, cartTotal, onClose, onCheckout }: CartPanelProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[100]" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full md:w-[380px] h-screen bg-white z-[101] overflow-y-auto shadow-[-8px_0_32px_rgba(0,0,0,0.15)] flex flex-col">
        <div className="p-6 pb-5 border-b border-[#fce4ec] flex justify-between items-center">
          <div className="font-playfair text-[22px] font-extrabold text-[#2d1a24]">Your Cart 🛍️</div>
          <button className="bg-transparent border-none cursor-pointer text-[22px]" onClick={onClose}>✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛍️</div>
              <div className="font-playfair text-lg text-[#2d1a24] mb-2">Your cart is empty</div>
              <div className="font-nunito text-sm text-[#ad1457]">Add some beautiful products!</div>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-[#fce4ec]">
                <div className="w-16 h-16 bg-linear-to-br from-[#fce4ec] to-[#f8bbd0] rounded-xl flex items-center justify-center text-[32px] shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1">
                  <div className="font-nunito font-bold text-[#2d1a24] text-sm mb-1">{item.name}</div>
                  <div className="font-nunito text-[13px] text-[#e91e8c] font-bold">
                    ₹{item.price.toLocaleString()} × {item.qty}
                  </div>
                </div>
                <div className="font-nunito font-extrabold text-[#2d1a24] text-[15px] self-center">
                  ₹{(item.price * item.qty).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-[#fce4ec]">
            <div className="flex justify-between mb-4">
              <span className="font-nunito font-semibold text-[#6d1b3b]">Total</span>
              <span className="font-playfair font-extrabold text-[22px] text-[#e91e8c]">₹{cartTotal.toLocaleString()}</span>
            </div>
            <button
              className="w-full bg-linear-to-br from-[#e91e8c] to-[#c2185b] text-white border-none py-4 rounded-2xl cursor-pointer font-nunito font-bold text-base hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all"
              onClick={onCheckout}
            >
              Checkout Now →
            </button>
            <div className="font-nunito text-center mt-3 text-xs text-[#ad1457]">
              🔒 Secure checkout · Free shipping on this order
            </div>
          </div>
        )}
      </div>
    </>
  );
}
