import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Your Order — LaMoksh Fabrics" },
      {
        name: "description",
        content: "Follow your LaMoksh Fabrics order from the atelier bench to your door.",
      },
      { property: "og:title", content: "Track Your Order — LaMoksh Fabrics" },
      {
        property: "og:description",
        content: "Enter your order reference to see its current status.",
      },
      { property: "og:url", content: "/track-order" },
    ],
    links: [{ rel: "canonical", href: "/track-order" }],
  }),
  component: TrackOrder,
});

function TrackOrder() {
  const [ref, setRef] = useState("");
  const [checked, setChecked] = useState(false);

  return (
    <div>
      <PageHeader
        eyebrow="Client Care"
        title="Track Order"
        intro="Enter the reference from your confirmation email."
      />
      <div className="container-lux max-w-xl py-16">
        <form
          className="grid gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            setChecked(true);
          }}
        >
          <label className="grid gap-2">
            <span className="eyebrow">Order reference</span>
            <input
              required
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder="LM-000000"
              className="border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
            />
          </label>
          <button type="submit" className="btn-lux justify-self-start">
            Track
          </button>
        </form>

        {checked ? (
          <div className="mt-12 border-t border-border pt-8">
            <p className="eyebrow">Order {ref}</p>
            <ol className="mt-6 space-y-5 text-sm">
              {[
                "Order confirmed",
                "At the atelier bench",
                "Quality check",
                "Dispatched",
                "Delivered",
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span
                    className="mt-1 h-2 w-2 shrink-0 rounded-full bg-foreground"
                    style={{ opacity: i < 2 ? 1 : 0.25 }}
                  />
                  <span className={i < 2 ? "" : "text-muted-foreground"}>{step}</span>
                </li>
              ))}
            </ol>
            <p className="body-lux mt-8 text-sm">
              For a precise update, write to care@lamoksh.in quoting your reference.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
