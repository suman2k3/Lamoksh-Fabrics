import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/data/catalog";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — LaMoksh Fabrics" },
      {
        name: "description",
        content:
          "Search the LaMoksh Fabrics catalogue of handcrafted suit sets and handwoven clothing.",
      },
      { property: "og:title", content: "Search — LaMoksh Fabrics" },
      { property: "og:description", content: "Find a piece by name, craft or material." },
      { property: "og:url", content: "/search" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/search" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products.filter((p) =>
      [p.title, p.type, p.material, p.colour, p.description].join(" ").toLowerCase().includes(term),
    );
  }, [q]);

  return (
    <div>
      <PageHeader
        eyebrow="Catalogue"
        title="Search"
        intro="Search by name, craft, material or occasion."
      />
      <div className="container-lux py-16">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Kundan, Banarasi, jhumka…"
          aria-label="Search the catalogue"
          className="w-full max-w-xl border-b border-border bg-transparent py-3 font-display text-2xl outline-none focus:border-foreground"
        />
        {q ? (
          <p className="mt-6 text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "piece" : "pieces"}
          </p>
        ) : null}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
