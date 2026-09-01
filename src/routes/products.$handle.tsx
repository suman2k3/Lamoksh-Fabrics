import { useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Heart, Minus, Plus } from "lucide-react";
import { formatPrice, getProduct, products } from "@/data/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$handle")({
  loader: ({ params }) => {
    const product = getProduct(params.handle);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData?.product) {
      return {
        meta: [
          { title: "Piece unavailable — LaMoksh Fabrics" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.title} — LaMoksh Fabrics` },
        { name: "description", content: p.description.slice(0, 155) },
        { property: "og:title", content: `${p.title} — LaMoksh Fabrics` },
        { property: "og:description", content: p.description.slice(0, 155) },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/products/${params.handle}` },
      ],
      links: [{ rel: "canonical", href: `/products/${params.handle}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.title,
            description: p.description,
            image: p.images[0],
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: p.price,
              availability: p.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            },
          }),
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [size, setSize] = useState<string | undefined>(product.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState<string | null>("craft");
  const saved = wishlist.includes(product.handle);
  const galleryRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const scrollGallery = (direction: "left" | "right") => {
    if (galleryRef.current) {
      const container = galleryRef.current;
      const scrollAmount = container.clientWidth || 300;
      const targetScroll =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;
      container.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  };

  const handleGalleryScroll = () => {
    if (galleryRef.current && galleryRef.current.clientWidth > 0) {
      const container = galleryRef.current;
      const index = Math.round(container.scrollLeft / container.clientWidth);
      if (!isNaN(index)) {
        setActiveImageIndex(index);
      }
    }
  };

  // Include ALL other clothing products in the catalog
  const related = products.filter((p) => p.handle !== product.handle);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const amount = direction === "left" ? -340 : 340;
      carouselRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const accordions = [
    { key: "craft", title: "Craft", body: product.craft },
    { key: "dimensions", title: "Dimensions", body: product.dimensions },
    { key: "care", title: "Care", body: product.care },
    {
      key: "shipping",
      title: "Shipping & Returns",
      body: "Complimentary insured shipping across India. Made-to-order pieces dispatch in 4–6 weeks. Returns accepted within 7 days of delivery on unworn pieces.",
    },
  ];

  return (
    <div>
      <div className="container-lux grid gap-12 py-10 lg:grid-cols-2 lg:py-16">
        {/* Desktop View: Stacked Vertical Images */}
        <div className="hidden lg:grid gap-4">
          {product.images.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt={`${product.title} — view ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              className="aspect-[3/4] w-full bg-muted object-cover object-top"
            />
          ))}
        </div>

        {/* Mobile View: Horizontal Slider with Left/Right Arrows */}
        <div className="relative group overflow-hidden lg:hidden">
          <div
            ref={galleryRef}
            onScroll={handleGalleryScroll}
            className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none rounded-sm gap-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {product.images.map((src, i) => (
              <div key={src + i} className="w-full flex-shrink-0 snap-center relative">
                <img
                  src={src}
                  alt={`${product.title} — view ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="aspect-[3/4] w-full bg-muted object-cover object-top"
                />
              </div>
            ))}
          </div>

          {/* Left & Right Arrow Slider Buttons */}
          {product.images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => scrollGallery("left")}
                className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-background/90 text-foreground shadow-md transition-all hover:bg-background hover:scale-110 active:scale-95 z-20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                aria-label="Next image"
                onClick={() => scrollGallery("right")}
                className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-background/90 text-foreground shadow-md transition-all hover:bg-background hover:scale-110 active:scale-95 z-20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Slider Dots Indicator */}
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-20">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => {
                      if (galleryRef.current) {
                        galleryRef.current.scrollTo({
                          left: i * galleryRef.current.clientWidth,
                          behavior: "smooth",
                        });
                      }
                    }}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      activeImageIndex === i ? "w-6 bg-foreground" : "w-2 bg-foreground/40",
                    )}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-28 lg:h-fit">
          <nav className="flex gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link to="/clothing" className="hover:text-foreground">
              Clothing
            </Link>
          </nav>

          <p className="eyebrow mt-8">{product.type}</p>
          <h1 className="display-md mt-3">{product.title}</h1>
          <p className="mt-4 text-lg">{formatPrice(product.price)}</p>
          <p className="body-lux mt-6">{product.description}</p>

          {product.sizes?.length ? (
            <div className="mt-8">
              <p className="eyebrow">Size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={cn(
                      "border border-border px-4 py-2 text-sm transition-colors",
                      size === s && "border-foreground bg-foreground text-background",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex items-center gap-6">
            <div className="flex items-center border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="px-3 py-3"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="px-3 py-3"
                onClick={() => setQty((q) => q + 1)}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              type="button"
              className="btn-lux flex-1 justify-center disabled:opacity-40"
              disabled={!product.inStock}
              onClick={() => addToCart(product.handle, qty, size)}
            >
              {product.inStock ? "Add to bag" : "Sold out"}
            </button>
            <button
              type="button"
              aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => toggleWishlist(product.handle)}
            >
              <Heart className={cn("h-5 w-5", saved && "fill-current text-burgundy")} />
            </button>
          </div>

          <dl className="mt-10 border-t border-border">
            {accordions.map((a) => (
              <div key={a.key} className="border-b border-border">
                <dt>
                  <button
                    type="button"
                    className="nav-label flex w-full items-center justify-between py-5 text-left"
                  >
                    {a.title}
                    <span>{open === a.key ? "−" : "+"}</span>
                  </button>
                </dt>
                {open === a.key ? <dd className="body-lux pb-5 text-sm">{a.body}</dd> : null}
              </div>
            ))}
          </dl>

          <p className="mt-8 text-xs text-muted-foreground">
            {product.material} · {product.colour}
          </p>
        </div>
      </div>

      {/* Completing the Look: ALL products with Carousel Navigation Arrows */}
      {related.length ? (
        <section className="container-lux mt-24">
          <div className="flex items-end justify-between gap-4">
            <Reveal>
              <p className="eyebrow">You may also like</p>
              <h2 className="display-md mt-2">Completing the look</h2>
            </Reveal>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Previous products"
                className="grid h-11 w-11 place-items-center rounded-full border border-border bg-background transition-colors hover:bg-espresso hover:text-ivory"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Next products"
                className="grid h-11 w-11 place-items-center rounded-full border border-border bg-background transition-colors hover:bg-espresso hover:text-ivory"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="mt-10 flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none scroll-smooth"
          >
            {related.map((p) => (
              <div key={p.handle} className="w-[280px] shrink-0 sm:w-[320px] lg:w-[300px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
