import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import logo from "@/assets/logo.png";
import { collections } from "@/data/catalog";
import { MobileMenu } from "@/components/site/MobileMenu";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

const clothing = collections.filter((c) => c.group === "clothing");

type MenuKey = "clothing" | null;

export function Header() {
  const { cartCount, setCartOpen, setSearchOpen, wishlist } = useShop();
  const [open, setOpen] = useState<MenuKey>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur transition-shadow",
        scrolled && "shadow-[0_1px_0_0_var(--border)]",
      )}
      onMouseLeave={() => setOpen(null)}
    >
      <p className="nav-label bg-espresso py-2 text-center text-ivory">
        Complimentary shipping across India · Handcrafted to order
      </p>

      <div className="container-lux flex h-16 items-center justify-between gap-6 md:h-20">
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="lg:hidden p-2 -ml-2 text-foreground focus:outline-none"
            aria-label="Open menu"
            aria-expanded={mobile}
            onClick={() => setMobile(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <nav className="hidden items-center gap-7 lg:flex">
            <div onMouseEnter={() => setOpen("clothing")}>
              <Link to="/clothing" className="nav-label link-underline">
                Clothing
              </Link>
            </div>
            <Link
              to="/new-arrivals"
              className="nav-label link-underline"
              onMouseEnter={() => setOpen(null)}
            >
              New In
            </Link>
            <Link
              to="/bestsellers"
              className="nav-label link-underline"
              onMouseEnter={() => setOpen(null)}
            >
              Most Loved
            </Link>
          </nav>
        </div>

        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center py-1 max-w-[55%] sm:max-w-none"
        >
          <img
            src={logo}
            alt="LaMoksh Fabrics"
            className="h-10 w-auto max-w-[180px] object-contain sm:h-12 sm:max-w-[320px] md:h-14 md:max-w-[480px]"
          />
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/wishlist" className="hidden md:flex nav-label link-underline items-center">
            Wishlist {wishlist.length > 0 ? `(${wishlist.length})` : ""}
          </Link>
          <nav className="hidden items-center gap-7 xl:flex">
            <Link to="/contact" className="nav-label link-underline">
              Contact
            </Link>
          </nav>
          <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search className="h-[1.15rem] w-[1.15rem]" />
          </button>
          <Link to="/account" aria-label="Account">
            <User className="h-[1.15rem] w-[1.15rem]" />
          </Link>
          <button
            type="button"
            aria-label="Open bag"
            className="relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="h-[1.15rem] w-[1.15rem]" />
            {cartCount > 0 ? (
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-espresso text-[0.6rem] text-ivory">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {/* Mega menu */}
      {open === "clothing" ? (
        <div className="hidden border-t border-border bg-background lg:block">
          <div className="container-lux grid grid-cols-4 gap-10 py-10">
            <div>
              <p className="eyebrow">Clothing</p>
              <p className="body-lux mt-3 max-w-[16rem] text-sm">
                Hand-finished suit sets and fine textiles made in limited numbers by our weavers.
              </p>
            </div>
            <div className="col-span-2 flex flex-col gap-2">
              <p className="eyebrow">Subcategories</p>
              <div className="grid grid-flow-col grid-rows-5 gap-x-12 gap-y-2.5">
                {clothing.map((c) => (
                  <Link
                    key={c.handle}
                    to="/collections/$handle"
                    params={{ handle: c.handle }}
                    className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow">House Highlight</p>
              <p className="body-lux mt-3 text-sm text-muted-foreground">
                Banarasi silks, Maheshwari weaves, handcrafted suit sets and fine-count cottons.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Full-Screen Mobile Navigation Drawer */}
      <MobileMenu isOpen={mobile} onClose={() => setMobile(false)} />
    </header>
  );
}
