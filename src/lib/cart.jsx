import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { getProduct } from "../data/products";
import { SITE } from "../data/site";
import { readJSON, writeJSON } from "./storage";

const STORAGE_KEY = "gc-cart-v1";
const CartContext = createContext(null);

const lineKey = (slug, color) => (color ? `${slug}::${color}` : slug);
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function loadCart() {
  const items = readJSON(STORAGE_KEY, []);
  if (!Array.isArray(items)) return [];
  // Drop anything that no longer exists or is out of stock.
  return items.filter((i) => {
    const p = getProduct(i.slug);
    return p && p.stock > 0 && i.qty > 0;
  }).map((i) => ({ ...i, qty: clamp(i.qty, 1, getProduct(i.slug).stock) }));
}

function reducer(items, action) {
  switch (action.type) {
    case "add": {
      const product = getProduct(action.slug);
      if (!product || product.stock < 1) return items;
      const key = lineKey(action.slug, action.color);
      const existing = items.find((i) => i.key === key);
      if (existing) {
        return items.map((i) => (i.key === key ? { ...i, qty: clamp(i.qty + action.qty, 1, product.stock) } : i));
      }
      return [...items, { key, slug: action.slug, color: action.color ?? null, qty: clamp(action.qty, 1, product.stock) }];
    }
    case "setQty":
      return items.map((i) => (i.key === action.key ? { ...i, qty: clamp(action.qty, 1, getProduct(i.slug).stock) } : i));
    case "remove":
      return items.filter((i) => i.key !== action.key);
    case "clear":
      return [];
    default:
      return items;
  }
}

export function deliveryFee(area, subtotal) {
  if (subtotal <= 0) return 0;
  if (subtotal >= SITE.freeDeliveryOver) return 0;
  return SITE.delivery[area]?.fee ?? SITE.delivery.outside.fee;
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, loadCart);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    writeJSON(STORAGE_KEY, items);
  }, [items]);

  const add = useCallback((slug, qty = 1, color = null) => {
    dispatch({ type: "add", slug, qty, color });
    const product = getProduct(slug);
    setToast({ id: Date.now(), slug, name: product?.name, color });
  }, []);
  const setQty = useCallback((key, qty) => dispatch({ type: "setQty", key, qty }), []);
  const remove = useCallback((key) => dispatch({ type: "remove", key }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo(() => {
    const lines = items.map((i) => {
      const product = getProduct(i.slug);
      return { ...i, product, lineTotal: product.price * i.qty };
    });
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
      add,
      setQty,
      remove,
      clear,
      toast,
      dismissToast: () => setToast(null),
    };
  }, [items, toast, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
