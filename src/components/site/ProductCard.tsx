import { Link } from "@tanstack/react-router";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { formatPrice, type Product } from "@/data/catalog";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { toggleWishlist, wishlist, addToCart } = useShop();
  const saved = wishlist.includes(product.handle);

  return (
    <div className={cn("group relative", className)}>
      <div className="media-zoom relative aspect-[3/4] overflow-hidden bg-muted">
        <Link
          to="/products/$handle"
          params={{ handle: product.handle }}
          className="block h-full w-full"
        >
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover object-top"
          />
          {product.images[1] ? (
            <img
              src={product.images[1]}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          ) : null}
        </Link>

        {!product.inStock ? (
          <span className="nav-label absolute left-0 top-0 z-10 bg-background/90 px-3 py-2 text-muted-foreground">
            Sold out
          </span>
        ) : null}

        {/* 3 Circular Floating Action Buttons at Bottom of Image (Hover only) */}
        <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-3 px-2 opacity-0 translate-y-3 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
          {/* Option 1: Add to Bag */}
          <button
            type="button"
            title={product.inStock ? "Add to bag" : "Sold out"}
            aria-label={product.inStock ? "Add to bag" : "Sold out"}
            disabled={!product.inStock}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (product.inStock) {
                addToCart(product.handle, 1, product.sizes?.[0]);
              }
            }}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#1C1917] shadow-md transition-all duration-300 hover:scale-110 hover:bg-[#6B1D2F] hover:text-white focus-visible:scale-110 disabled:opacity-40"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
          </button>

          {/* Option 2: Quick View */}
          <Link
            to="/products/$handle"
            params={{ handle: product.handle }}
            title="Quick view"
            aria-label="Quick view"
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#1C1917] shadow-md transition-all duration-300 hover:scale-110 hover:bg-[#6B1D2F] hover:text-white focus-visible:scale-110"
          >
            <Eye className="h-4.5 w-4.5" />
          </Link>

          {/* Option 3: Wishlist Toggle */}
          <button
            type="button"
            title={saved ? "Remove from wishlist" : "Add to wishlist"}
            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.handle);
            }}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#1C1917] shadow-md transition-all duration-300 hover:scale-110 hover:bg-[#6B1D2F] hover:text-white focus-visible:scale-110"
          >
            <Heart className={cn("h-4.5 w-4.5", saved && "fill-current text-[#6B1D2F]")} />
          </button>
        </div>
      </div>

      <div className="pt-4">
        <p className="eyebrow">{product.type}</p>
        <h3 className="mt-1 font-display text-lg leading-snug">
          <Link
            to="/products/$handle"
            params={{ handle: product.handle }}
            className="link-underline"
          >
            {product.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}
