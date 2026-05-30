"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  sku?: string;
  variantLabel?: string;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQty: (productId: string, qty: number, variantId?: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "hovi_cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => { setItems(loadCart()); }, []);
  useEffect(() => { if (items.length > 0 || loadCart().length > 0) saveCart(items); }, [items]);

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const key = `${item.productId}-${item.variantId || "default"}`;
      const existing = prev.find((i) => `${i.productId}-${i.variantId || "default"}` === key);
      if (existing) {
        return prev.map((i) => `${i.productId}-${i.variantId || "default"}` === key ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { ...item, qty }];
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId?: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && (i.variantId || "default") === (variantId || "default"))));
  }, []);

  const updateQty = useCallback((productId: string, qty: number, variantId?: string) => {
    if (qty <= 0) { removeItem(productId, variantId); return; }
    setItems((prev) => prev.map((i) =>
      i.productId === productId && (i.variantId || "default") === (variantId || "default") ? { ...i, qty } : i
    ));
  }, [removeItem]);

  const clearCart = useCallback(() => { setItems([]); saveCart([]); }, []);

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
