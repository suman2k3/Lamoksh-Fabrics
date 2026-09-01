import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import {
  X,
  Plus,
  Minus,
  Search,
  Heart,
  User,
  Mail,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import { collections } from "@/data/catalog";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { setSearchOpen } = useShop();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const toggleCategory = (cat: string) => {
    setExpandedCategory((prev) => (prev === cat ? null : cat));
  };

  const handleLinkClick = () => {
    onClose();
  };

  const handleSearchClick = () => {
    onClose();
    setSearchOpen(true);
  };

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999990] flex"
      style={{ height: "100dvh", width: "100vw" }}
      aria-modal="true"
      role="dialog"
      aria-label="Mobile Navigation"
    >
      {/* Translucent Backdrop Overlay Covering Viewport */}
      <div
        className={cn(
          "fixed inset-0 z-[999990] bg-black/55 transition-opacity duration-300 ease-out",
          animateIn ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      {/* Side Navigation Drawer (Left Aligned, 82vw max 340px) */}
      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 z-[999999] flex flex-col bg-[#FAF8F5] text-[#28201C] shadow-2xl transition-transform duration-300 ease-out",
          animateIn ? "translate-x-0" : "-translate-x-full",
        )}
        style={{
          width: "min(82vw, 340px)",
          height: "100dvh",
          backgroundColor: "#FAF8F5",
        }}
      >
        {/* Dark Espresso Drawer Header */}
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between bg-espresso px-5 text-ivory">
          <span className="font-serif text-lg font-semibold uppercase tracking-wider text-ivory">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center text-ivory transition-opacity hover:opacity-75"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Drawer Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {/* Main Navigation List */}
          <div className="space-y-1 divide-y divide-[#28201C]/12 border-b border-[#28201C]/12 pb-6">
            {/* CLOTHING ACCORDION */}
            <div className="py-2">
              <button
                type="button"
                onClick={() => toggleCategory("clothing")}
                aria-expanded={expandedCategory === "clothing"}
                className="flex w-full items-center justify-between py-2 text-left font-sans text-base font-semibold uppercase tracking-[0.18em] text-[#28201C]"
              >
                <span>CLOTHING</span>
                {expandedCategory === "clothing" ? (
                  <Minus className="h-5 w-5 text-[#28201C]/70" />
                ) : (
                  <Plus className="h-5 w-5 text-[#28201C]/70" />
                )}
              </button>
              {expandedCategory === "clothing" ? (
                <div className="mt-2 space-y-2.5 pb-2 pl-3 text-sm">
                  <Link
                    to="/clothing"
                    onClick={handleLinkClick}
                    className="block font-medium text-[#28201C] hover:text-black"
                  >
                    All Clothing
                  </Link>
                  {collections
                    .filter((c) => c.group === "clothing")
                    .map((c) => (
                      <Link
                        key={c.handle}
                        to="/collections/$handle"
                        params={{ handle: c.handle }}
                        onClick={handleLinkClick}
                        className="block text-[#28201C]/80 hover:text-[#28201C]"
                      >
                        {c.title}
                      </Link>
                    ))}
                </div>
              ) : null}
            </div>

            {/* NEW IN */}
            <div className="py-2">
              <Link
                to="/new-arrivals"
                onClick={handleLinkClick}
                className="block py-2 font-sans text-base font-semibold uppercase tracking-[0.18em] text-[#28201C]"
              >
                NEW IN
              </Link>
            </div>

            {/* MOST LOVED */}
            <div className="py-2">
              <Link
                to="/bestsellers"
                onClick={handleLinkClick}
                className="block py-2 font-sans text-base font-semibold uppercase tracking-[0.18em] text-[#28201C]"
              >
                MOST LOVED
              </Link>
            </div>

            {/* CONTACT */}
            <div className="py-2">
              <Link
                to="/contact"
                onClick={handleLinkClick}
                className="block py-2 font-sans text-base font-semibold uppercase tracking-[0.18em] text-[#28201C]"
              >
                CONTACT
              </Link>
            </div>
          </div>

          {/* Secondary Navigation */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-b border-[#28201C]/12 pb-6">
            <Link
              to="/wishlist"
              onClick={handleLinkClick}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#28201C]"
            >
              <Heart className="h-4 w-4 text-[#28201C]/70" />
              <span>Wishlist</span>
            </Link>
            <Link
              to="/account"
              onClick={handleLinkClick}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#28201C]"
            >
              <User className="h-4 w-4 text-[#28201C]/70" />
              <span>Account</span>
            </Link>
            <button
              type="button"
              onClick={handleSearchClick}
              className="flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wider text-[#28201C]"
            >
              <Search className="h-4 w-4 text-[#28201C]/70" />
              <span>Search</span>
            </button>
            <Link
              to="/contact"
              onClick={handleLinkClick}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#28201C]"
            >
              <Mail className="h-4 w-4 text-[#28201C]/70" />
              <span>Client Care</span>
            </Link>
          </div>

          {/* Footer Socials & Shipping Note */}
          <div className="mt-6 space-y-4 pt-2 pb-6">
            <div className="flex items-center gap-5 text-[#28201C]/80">
              <a
                href="https://www.instagram.com/lamokshfabrics"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:text-[#28201C]"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/LamokshFabrics/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="hover:text-[#28201C]"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.youtube.com/@lamoksh_fabrics"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="hover:text-[#28201C]"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
            <p className="text-[0.7rem] tracking-wider text-[#28201C]/60">
              Complimentary shipping across India · Handcrafted to order
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
