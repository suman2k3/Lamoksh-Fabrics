import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <footer className="mt-28 border-t border-border bg-background">
      <div className="container-lux grid gap-14 py-20 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="inline-block">
            <img
              src={logo}
              alt="LaMoksh Fabrics"
              className="h-14 w-auto object-contain object-left md:h-16"
            />
          </Link>
          <p className="body-lux mt-6 max-w-sm">
            An Indian house of handwoven clothing — made in small numbers, by named hands, for the
            occasions you remember.
          </p>
          <div className="mt-5 space-y-1 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Atelier & Store Location:</p>
            <p>
              LG 3, LG 4 & LG 8, HRC Shopping Complex, Vaibhav Khand, Indirapuram, Ghaziabad, Uttar
              Pradesh 201014
            </p>
            <p className="pt-1 font-semibold text-foreground">
              Contact:{" "}
              <a href="tel:+919999875605" className="hover:underline">
                +91 99998 75605
              </a>
            </p>
          </div>
          <div className="mt-6 flex gap-5 text-muted-foreground">
            <a
              href="https://www.instagram.com/lamokshfabrics"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-foreground"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.facebook.com/LamokshFabrics/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-foreground"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://www.youtube.com/@lamoksh_fabrics"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="hover:text-foreground"
            >
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>

        <FooterCol
          title="Shop"
          links={[
            { to: "/clothing", label: "Clothing" },
            { to: "/new-arrivals", label: "New Arrivals" },
            { to: "/bestsellers", label: "Most Loved" },
            { to: "/wishlist", label: "Wishlist" },
            { to: "/clothing", label: "All Clothing" },
          ]}
        />
        <FooterCol
          title="Help"
          links={[
            { to: "/contact", label: "Contact Us" },
            { to: "/faq", label: "FAQ" },
          ]}
        />
        <FooterCol
          title="Client Care"
          links={[
            { to: "/shipping", label: "Shipping" },
            { to: "/returns", label: "Returns & Exchanges" },
            { to: "/track-order", label: "Track Order" },
            { to: "/account", label: "Account" },
            { to: "/privacy", label: "Privacy Policy" },
            { to: "/terms", label: "Terms of Service" },
          ]}
        />
      </div>

      <div className="border-t border-border">
        <div className="container-lux flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <p className="eyebrow">The LaMoksh Letter</p>
            <p className="body-lux mt-2 text-sm">
              New collection arrivals, handloom notes and private previews. No noise.
            </p>
          </div>
          <form
            className="flex w-full max-w-md items-center border-b border-foreground/40"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
              setEmail("");
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              aria-label="Email address"
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" className="nav-label whitespace-nowrap pl-4">
              {done ? "Thank you" : "Subscribe"}
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-lux flex flex-col gap-2 py-6 text-xs text-muted-foreground md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} LaMoksh Fabrics. All rights reserved.</p>
          <p>Handcrafted in India · Shipped worldwide</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-5 space-y-2.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
