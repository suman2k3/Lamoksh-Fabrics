import { Link } from "@tanstack/react-router";
import { X, Minus, Plus } from "lucide-react";
import { formatPrice } from "@/data/catalog";
import { useShop } from "@/lib/shop-store";

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, subtotal, setQty, removeLine } = useShop();
  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close bag"
        className="absolute inset-0 bg-espresso/40"
        onClick={() => setCartOpen(false)}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <p className="nav-label">Your Bag ({lines.length})</p>
          <button type="button" aria-label="Close" onClick={() => setCartOpen(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {lines.length === 0 ? (
            <div className="py-24 text-center">
              <p className="body-lux">Your bag is empty.</p>
              <Link
                to="/new-arrivals"
                className="nav-label link-underline mt-6 inline-block"
                onClick={() => setCartOpen(false)}
              >
                Discover new arrivals
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {lines.map((l) => (
                <li key={l.product.handle} className="flex gap-4 py-6">
                  <Link
                    to="/products/$handle"
                    params={{ handle: l.product.handle }}
                    onClick={() => setCartOpen(false)}
                    className="w-24 shrink-0"
                  >
                    <img
                      src={l.product.images[0]}
                      alt={l.product.title}
                      className="aspect-[3/4] w-full object-cover"
                    />
                  </Link>
                  <div className="flex-1">
                    <p className="font-display text-lg leading-snug">{l.product.title}</p>
                    {l.size ? (
                      <p className="mt-1 text-xs text-muted-foreground">Size {l.size}</p>
                    ) : null}
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPrice(l.product.price)}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          aria-label="Decrease"
                          className="px-2 py-1"
                          onClick={() => setQty(l.product.handle, l.qty - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-sm">{l.qty}</span>
                        <button
                          type="button"
                          aria-label="Increase"
                          className="px-2 py-1"
                          onClick={() => setQty(l.product.handle, l.qty + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground underline"
                        onClick={() => removeLine(l.product.handle)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length ? (
          <div className="border-t border-border px-6 py-6">
            <div className="flex items-center justify-between">
              <span className="nav-label">Subtotal</span>
              <span className="font-display text-xl">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Taxes included. Shipping calculated at checkout.
            </p>
            <Link to="/cart" onClick={() => setCartOpen(false)} className="btn-lux mt-5 w-full">
              View bag &amp; checkout
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
