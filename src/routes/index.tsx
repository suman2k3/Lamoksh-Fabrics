import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { images, products, type Product } from "@/data/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LaMoksh Fabrics — Handcrafted Luxury Clothing" },
      {
        name: "description",
        content:
          "A contemporary Indian luxury house of handwoven clothing. Banarasi sarees, Maheshwari silks, handpaint suit sets and wedding edits.",
      },
      { property: "og:title", content: "LaMoksh Fabrics — Handcrafted Luxury Clothing" },
      {
        property: "og:description",
        content:
          "Handwoven clothing and handcrafted textiles, made in small numbers for the occasions you remember.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: ClothingHomePage,
});

type Sort = "featured" | "price-asc" | "price-desc" | "new";

export function ClothingHomePage() {
  const allClothing = useMemo(() => products.filter((p) => p.category === "clothing"), []);

  const [sort, setSort] = useState<Sort>("featured");
  const [material, setMaterial] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState(false);

  const materials = useMemo(
    () => Array.from(new Set(allClothing.map((p) => p.material))).sort(),
    [allClothing],
  );

  const filtered = useMemo(() => {
    let list = allClothing.filter(
      (p) => (material === "all" || p.material === material) && (!inStockOnly || p.inStock),
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "new") list = [...list].reverse();
    return list;
  }, [allClothing, material, inStockOnly, sort]);

  return (
    <div>
      {/* Home Page Campaign Hero Banner */}
      <section className="relative">
        <img
          src={images.heroCampaign}
          alt="LaMoksh Fabrics campaign — handcrafted clothing in a haveli courtyard"
          className="h-[78vh] min-h-[520px] w-full object-cover object-top md:object-[center_15%]"
        />
        <div className="absolute inset-0 bg-espresso/25" />
        <div className="container-lux absolute inset-x-0 bottom-14">
          <Reveal>
            <p className="eyebrow text-ivory/80">Autumn Celebration 2026</p>
            <h1 className="display-xl mt-4 max-w-3xl text-ivory">
              Rooted in craft. Made for celebration.
            </h1>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#clothing-catalog" className="btn-lux bg-ivory text-espresso">
                Explore Clothing Collection ({allClothing.length} pieces)
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* House Statement */}

      {/* Main Interactive Clothing Catalog Showcase */}
      <section id="clothing-catalog" className="mt-24 pt-8">
        <div className="container-lux mb-8 flex flex-col items-center justify-center text-center">
          <Reveal>
            <p className="eyebrow">Clothing Collection</p>
            <h2 className="display-lg mt-2">All Clothing Pieces</h2>
          </Reveal>
          <p className="eyebrow mt-4">{filtered.length} pieces</p>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-[118px] z-30 border-y border-ivory/20 bg-espresso text-ivory shadow-md md:top-[112px]">
          <div className="container-lux flex flex-wrap items-center gap-x-6 gap-y-2.5 py-3.5">
            <label className="nav-label flex items-center gap-2 text-[0.7rem] text-ivory/90">
              Material
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="nav-label border-b border-ivory/40 bg-espresso py-0.5 text-[0.7rem] text-ivory outline-none focus:border-ivory"
              >
                <option value="all" className="bg-espresso text-ivory">
                  All
                </option>
                {materials.map((m) => (
                  <option key={m} value={m} className="bg-espresso text-ivory">
                    {m}
                  </option>
                ))}
              </select>
            </label>

            <label className="nav-label flex items-center gap-2 text-[0.7rem] text-ivory/90">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="nav-label border-b border-ivory/40 bg-espresso py-0.5 text-[0.7rem] text-ivory outline-none focus:border-ivory"
              >
                <option value="featured" className="bg-espresso text-ivory">
                  Featured
                </option>
                <option value="new" className="bg-espresso text-ivory">
                  Newest
                </option>
                <option value="price-asc" className="bg-espresso text-ivory">
                  Price: low to high
                </option>
                <option value="price-desc" className="bg-espresso text-ivory">
                  Price: high to low
                </option>
              </select>
            </label>

            <label className="nav-label flex cursor-pointer items-center gap-1.5 text-[0.7rem] text-ivory/90">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-3 w-3 accent-ivory"
              />
              In stock only
            </label>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="container-lux py-14">
          {filtered.length ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
              {filtered.map((p, i) => (
                <Reveal key={p.handle} delay={(i % 4) * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="body-lux py-20 text-center">
              No clothing pieces match these filters. Try widening your selection.
            </p>
          )}
        </div>
      </section>

      {/* Atelier Craft Section */}
      <section className="container-lux mt-16 grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="media-zoom">
          <img
            src={images.brandStory}
            alt="Handloom weaving on pit looms"
            loading="lazy"
            className="aspect-[16/10] max-h-[380px] w-full object-cover object-top"
          />
        </Reveal>
        <Reveal>
          <p className="eyebrow">Atelier</p>
          <h2 className="display-lg mt-4">Woven by hand, thread by thread</h2>
          <p className="body-lux mt-6">
            Every LaMoksh Fabrics garment begins on a master weaver's loom. Zari threads are
            interlaced in Varanasi and Maheshwar, hand-painted motifs are rendered in natural
            pigments, and each piece is completed by the hands that made it.
          </p>
        </Reveal>
      </section>

      {/* Service Pillars */}
      <section className="container-lux mt-28">
        <div className="rounded-sm bg-espresso px-8 py-12 text-ivory md:px-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                t: "Made to order",
                d: "Most pieces are woven after you order them, in four to six weeks.",
              },
              {
                t: "Complimentary shipping",
                d: "Insured delivery across India, and worldwide on request.",
              },
              {
                t: "Care for life",
                d: "Finishing, refolding and repair for every LaMoksh Fabrics garment.",
              },
            ].map((p) => (
              <Reveal key={p.t}>
                <p className="font-display text-xl text-ivory">{p.t}</p>
                <p className="body-lux mt-3 text-sm text-ivory/80">{p.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
