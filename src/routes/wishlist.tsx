import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { getProduct, images } from "@/data/catalog";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "Your saved handcrafted suit sets, Banarasi silks, and fine textiles at LaMoksh Fabrics.",
      },
      { property: "og:title", content: "Your Wishlist — LaMoksh Fabrics" },
      { property: "og:description", content: "Your saved pieces, kept for your return." },
      { property: "og:url", content: "/wishlist" },
    ],
    links: [{ rel: "canonical", href: "/wishlist" }],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useShop();

  const savedProducts = useMemo(() => {
    return wishlist
      .map((handle) => getProduct(handle))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [wishlist]);

  return (
    <div>
      {/* Relatable Campaign Hero Banner */}
      <section className="relative flex min-h-[420px] items-center overflow-hidden border-b border-border md:min-h-[480px]">
        <img
          src={images.heroCampaign}
          alt="LaMoksh Fabrics campaign — Saved Wishlist Pieces"
          className="absolute inset-0 h-full w-full object-cover object-top md:object-[center_15%]"
        />
        <div className="absolute inset-0 bg-espresso/45 backdrop-brightness-90" />
        <div className="container-lux relative z-10 py-16 text-ivory">
          <Reveal>
            <nav className="flex gap-2 text-xs text-ivory/80">
              <Link to="/" className="hover:text-ivory hover:underline">
                Home
              </Link>
              <span>/</span>
              <span className="font-medium text-ivory">Wishlist</span>
            </nav>
            <p className="eyebrow mt-6 text-ivory/80">Saved Pieces</p>
            <h1 className="display-lg mt-3 text-ivory">Your Wishlist</h1>
            <p className="body-lux mt-4 max-w-xl text-ivory/90">
              A private edit of the pieces you are considering — saved to return to whenever you are
              ready.
            </p>
            <p className="eyebrow mt-6 text-ivory/80">{savedProducts.length} pieces saved</p>
          </Reveal>
        </div>
      </section>

      {/* Main Wishlist Products Showcase Grid */}
      <section className="container-lux py-16 md:py-24">
        {savedProducts.length > 0 ? (
          <div>
            <div className="mb-10 flex items-center justify-between border-b border-border pb-4">
              <Reveal>
                <h2 className="display-md">Saved Collection</h2>
              </Reveal>
              <p className="eyebrow">{savedProducts.length} items</p>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
              {savedProducts.map((p, i) => (
                <Reveal key={p.handle} delay={(i % 4) * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-md py-16 text-center">
            <Reveal>
              <p className="eyebrow">Your wishlist is empty</p>
              <h2 className="display-md mt-4">No saved pieces yet</h2>
              <p className="body-lux mt-4 text-muted-foreground">
                As you browse the collection, tap the heart button on any piece to save it here for
                later.
              </p>
              <div className="mt-8">
                <Link to="/clothing" className="btn-lux inline-flex">
                  Explore Clothing Collection
                </Link>
              </div>
            </Reveal>
          </div>
        )}
      </section>
    </div>
  );
}
