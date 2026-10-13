import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "@/data/catalog";
import { dbStore } from "@/lib/db/store";

export type CartLine = { handle: string; qty: number; size?: string | undefined };

type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  recent: string[];
  cartOpen: boolean;
  searchOpen: boolean;
  addToCart: (handle: string, qty?: number, size?: string) => void;
  setQty: (handle: string, qty: number) => void;
  removeLine: (handle: string) => void;
  clearCart: () => void;
  toggleWishlist: (handle: string) => void;
  markViewed: (handle: string) => void;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  cartCount: number;
  subtotal: number;
  lines: { product: Product; qty: number; size?: string | undefined }[];
};

const ShopContext = createContext<ShopState | null>(null);

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dbVersion, setDbVersion] = useState(0);

  useEffect(() => {
    setCart(read<CartLine[]>("mn.cart", []));
    setWishlist(read<string[]>("mn.wishlist", []));
    setRecent(read<string[]>("mn.recent", []));

    const onDbUpdate = () => setDbVersion((v) => v + 1);
    window.addEventListener("manmayi_db_updated", onDbUpdate);
    return () => window.removeEventListener("manmayi_db_updated", onDbUpdate);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("mn.cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    if (typeof window !== "undefined")
      window.localStorage.setItem("mn.wishlist", JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    if (typeof window !== "undefined")
      window.localStorage.setItem("mn.recent", JSON.stringify(recent));
  }, [recent]);

  const addToCart = useCallback((handle: string, qty = 1, size?: string) => {
    setCart((prev) => {
      const found = prev.find((l) => l.handle === handle);
      if (found)
        return prev.map((l) =>
          l.handle === handle ? { ...l, qty: l.qty + qty, size: size ?? l.size } : l,
        );
      return [...prev, { handle, qty, size }];
    });
    setCartOpen(true);
  }, []);

  const setQty = useCallback((handle: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.handle !== handle)
        : prev.map((l) => (l.handle === handle ? { ...l, qty } : l)),
    );
  }, []);

  const removeLine = useCallback((handle: string) => {
    setCart((prev) => prev.filter((l) => l.handle !== handle));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback((handle: string) => {
    setWishlist((prev) =>
      prev.includes(handle) ? prev.filter((h) => h !== handle) : [handle, ...prev],
    );
  }, []);

  const markViewed = useCallback((handle: string) => {
    setRecent((prev) => [handle, ...prev.filter((h) => h !== handle)].slice(0, 8));
  }, []);

  const lines = useMemo(() => {
    const currentProducts = dbStore.getProducts();
    return cart
      .map((l) => {
        const product = currentProducts.find((p) => p.handle === l.handle || p.id === l.handle) || products.find((p) => p.handle === l.handle);
        return product ? { product, qty: l.qty, size: l.size } : null;
      })
      .filter(Boolean) as { product: Product; qty: number; size?: string | undefined }[];
  }, [cart, dbVersion]);

  const value: ShopState = {
    cart,
    wishlist,
    recent,
    cartOpen,
    searchOpen,
    addToCart,
    setQty,
    removeLine,
    clearCart,
    toggleWishlist,
    markViewed,
    setCartOpen,
    setSearchOpen,
    cartCount: cart.reduce((n, l) => n + l.qty, 0),
    subtotal: lines.reduce((n, l) => n + l.product.price * l.qty, 0),
    lines,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
