import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { dbStore, Product } from "@/lib/db/store";
import {
  Save,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Check,
  Eye,
  DollarSign,
  Package,
  Layers,
  Truck,
  Globe,
  Tag,
  Sparkles,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface ProductEditorFormProps {
  productId?: string;
}

export function ProductEditorForm({ productId }: ProductEditorFormProps) {
  const navigate = useNavigate();
  const isEditing = Boolean(productId && productId !== "new");

  const [activeTab, setActiveTab] = useState<
    "basic" | "pricing" | "media" | "inventory" | "variants" | "shipping" | "seo" | "publishing"
  >("basic");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newSize, setNewSize] = useState("");

  // Form State
  const [form, setForm] = useState<Partial<Product>>({
    title: "",
    handle: "",
    price: 9500,
    compareAtPrice: 12000,
    costPrice: 4000,
    category: "clothing",
    type: "Handloom Suit Sets",
    material: "Pure Mulmul Cotton",
    colour: "Deep Crimson & Ivory",
    inStock: true,
    stockQuantity: 15,
    lowStockThreshold: 3,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    ],
    description:
      "Handcrafted ensemble woven by master artisans, blending centuries-old weaving heritage with modern silhouette elegance.",
    craft: "Hand block printed and hand embroidered.",
    dimensions: "3-Piece Set (Kurta, Dupatta, Trousers)",
    care: "Dry clean only to maintain rich fabric luster.",
    sizes: ["XS", "S", "M", "L", "XL"],
    collections: ["new-arrivals", "bestsellers"],
    status: "active",
    seoTitle: "",
    seoDescription: "",
    sku: "",
    barcode: "",
    weightKg: 0.8,
    hsCode: "6204",
    countryOfOrigin: "India",
  });

  useEffect(() => {
    if (isEditing && productId) {
      const existing = dbStore.getProductById(productId);
      if (existing) {
        setForm({
          ...existing,
          stockQuantity: (existing as any).stockQuantity ?? 12,
          compareAtPrice: (existing as any).compareAtPrice ?? Math.round(existing.price * 1.2),
          costPrice: (existing as any).costPrice ?? Math.round(existing.price * 0.4),
          status: (existing as any).status || "active",
        });
      }
    }
  }, [productId, isEditing]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTitleChange = (val: string) => {
    const handle = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setForm((prev) => ({
      ...prev,
      title: val,
      handle: prev.handle && isEditing ? prev.handle : handle,
      seoTitle: prev.seoTitle || val,
    }));
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), newImageUrl.trim()],
    }));
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddSize = () => {
    if (!newSize.trim()) return;
    if (!(form.sizes || []).includes(newSize.trim())) {
      setForm((prev) => ({
        ...prev,
        sizes: [...(prev.sizes || []), newSize.trim()],
      }));
    }
    setNewSize("");
  };

  const handleRemoveSize = (sz: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: (prev.sizes || []).filter((s) => s !== sz),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) {
      showToast("Product title is required.");
      return;
    }

    const saved = dbStore.saveProduct({
      ...form,
      id: isEditing ? productId : undefined,
    } as any);

    showToast(`Product "${saved.title}" saved successfully!`);
    setTimeout(() => {
      navigate({ to: "/admin/products" as any });
    }, 1000);
  };

  // Profit Margin Calculation
  const priceNum = Number(form.price || 0);
  const costNum = Number((form as any).costPrice || 0);
  const profitMargin = priceNum > 0 ? (((priceNum - costNum) / priceNum) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917] text-white px-5 py-3 shadow-xl border-l-4 border-[#6B1D2F] flex items-center space-x-3 text-sm">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 border border-[#E7E5E4] shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate({ to: "/admin/products" as any })}
            className="p-2 border border-[#E7E5E4] bg-white hover:bg-[#FAF8F5] text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-light text-[#1C1917]">
              {isEditing ? `Edit: ${form.title}` : "Add New Product"}
            </h1>
            <p className="text-xs text-[#78716C] mt-0.5 font-sans">
              {isEditing ? `ID: ${productId}` : "Create a new luxury clothing or fine jewellery piece"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/products" as any })}
            className="px-4 py-2 border border-[#E7E5E4] text-[#1C1917] bg-white hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-2 bg-[#6B1D2F] text-white hover:bg-[#521624] text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Product</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (A - H) */}
      <div className="bg-white border border-[#E7E5E4] shadow-sm overflow-x-auto">
        <nav className="flex divide-x divide-[#E7E5E4] text-xs font-semibold uppercase tracking-wider text-[#78716C]">
          {[
            { id: "basic", label: "A. Basic Info", icon: Package },
            { id: "pricing", label: "B. Pricing (INR)", icon: DollarSign },
            { id: "media", label: "C. Media Gallery", icon: Upload },
            { id: "inventory", label: "D. Inventory", icon: Layers },
            { id: "variants", label: "E. Variants", icon: Tag },
            { id: "shipping", label: "F. Shipping", icon: Truck },
            { id: "seo", label: "G. SEO", icon: Globe },
            { id: "publishing", label: "H. Publishing", icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-5 py-3.5 whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? "border-[#6B1D2F] text-[#6B1D2F] bg-[#FAF8F5]/80 font-bold"
                    : "border-transparent hover:text-[#1C1917] hover:bg-[#FAF8F5]/40"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Form Tab Panels */}
      <form onSubmit={handleSave} className="bg-white border border-[#E7E5E4] p-8 shadow-sm">
        {/* TAB A: BASIC INFO */}
        {activeTab === "basic" && (
          <div className="space-y-6">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4]">
              Basic Product Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title || ""}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Silk Handloom Suit Set in Deep Crimson"
                  className="w-full px-4 py-2.5 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-sm focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Product Handle / URL Slug
                </label>
                <input
                  type="text"
                  value={form.handle || ""}
                  onChange={(e) => setForm({ ...form, handle: e.target.value })}
                  placeholder="silk-handloom-suit-set-deep-crimson"
                  className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-xs text-[#57534E] focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Category Type *
                </label>
                <select
                  value={form.category || "clothing"}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-xs text-[#1C1917] focus:outline-none focus:border-[#6B1D2F]"
                >
                  <option value="clothing">Clothing Ensembles</option>
                  <option value="jewellery">Fine Jewellery</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Sub-type / Collection Group
                </label>
                <input
                  type="text"
                  value={form.type || ""}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  placeholder="Handloom Suit Sets / Polki Necklaces / Sarees"
                  className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Material / Fabric Composition
                </label>
                <input
                  type="text"
                  value={form.material || ""}
                  onChange={(e) => setForm({ ...form, material: e.target.value })}
                  placeholder="Pure Chanderi Silk / 22K Gold Plated Brass"
                  className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Primary Shade / Colour
                </label>
                <input
                  type="text"
                  value={form.colour || ""}
                  onChange={(e) => setForm({ ...form, colour: e.target.value })}
                  placeholder="Crimson Burgundy / Emerald Green"
                  className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Artisan Craftsmanship Details
                </label>
                <input
                  type="text"
                  value={form.craft || ""}
                  onChange={(e) => setForm({ ...form, craft: e.target.value })}
                  placeholder="Hand zardozi embroidery with kundan embellishments"
                  className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Product Description
                </label>
                <textarea
                  rows={4}
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed editorial description for customer catalog..."
                  className="w-full px-4 py-2.5 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-xs leading-relaxed focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB B: PRICING (INR) */}
        {activeTab === "pricing" && (
          <div className="space-y-6">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4]">
              Pricing & Cost Analysis (INR)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Selling Price (₹ INR) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.price || ""}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-sm font-semibold text-[#1C1917] focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Compare At Price (MSRP ₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={(form as any).compareAtPrice || ""}
                  onChange={(e) =>
                    setForm({ ...form, compareAtPrice: Number(e.target.value) } as any)
                  }
                  className="w-full px-4 py-2.5 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Cost Per Item (Raw Material ₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={(form as any).costPrice || ""}
                  onChange={(e) =>
                    setForm({ ...form, costPrice: Number(e.target.value) } as any)
                  }
                  className="w-full px-4 py-2.5 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>
            </div>

            {/* Profit Margin Widget */}
            <div className="bg-[#FAF8F5] p-5 border border-[#E7E5E4] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                  Estimated Profit Margin
                </span>
                <div className="text-xl font-serif font-medium text-[#6B1D2F] mt-0.5">
                  ₹{(priceNum - costNum).toLocaleString("en-IN")} ({profitMargin}%)
                </div>
              </div>

              <div className="text-xs text-[#78716C]">
                GST tax automatically calculated at checkout according to Indian e-commerce norms.
              </div>
            </div>
          </div>
        )}

        {/* TAB C: MEDIA GALLERY */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4]">
              High-Resolution Media Gallery
            </h2>

            {/* Image URL input */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter image CDN URL or path (e.g. https://images.unsplash.com/...)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-5 py-2 bg-[#6B1D2F] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#521624]"
              >
                Add Image
              </button>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(form.images || []).map((imgUrl, idx) => (
                <div key={idx} className="relative group border border-[#E7E5E4] bg-[#FAF8F5]">
                  <img
                    src={imgUrl}
                    alt={`Product preview ${idx + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-[#6B1D2F] text-white text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider">
                      Primary Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 bg-rose-700 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB D: INVENTORY */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4]">
              Inventory Stock Tracking
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Current Units in Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  value={(form as any).stockQuantity ?? 12}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stockQuantity: Number(e.target.value),
                      inStock: Number(e.target.value) > 0,
                    } as any)
                  }
                  className="w-full px-4 py-2.5 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-sm font-semibold focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Low Stock Alert Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  value={(form as any).lowStockThreshold ?? 3}
                  onChange={(e) =>
                    setForm({ ...form, lowStockThreshold: Number(e.target.value) } as any)
                  }
                  className="w-full px-4 py-2.5 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  value={(form as any).sku || form.handle || ""}
                  onChange={(e) => setForm({ ...form, sku: e.target.value } as any)}
                  placeholder="MN-SUIT-CRIMSON-2026"
                  className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Barcode / EAN
                </label>
                <input
                  type="text"
                  value={(form as any).barcode || ""}
                  onChange={(e) => setForm({ ...form, barcode: e.target.value } as any)}
                  placeholder="890123456789"
                  className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:bg-white text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB E: VARIANTS */}
        {activeTab === "variants" && (
          <div className="space-y-6">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4]">
              Product Variants & Sizes
            </h2>

            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                Available Sizes
              </label>

              <div className="flex flex-wrap gap-2">
                {(form.sizes || []).map((sz) => (
                  <span
                    key={sz}
                    className="inline-flex items-center space-x-2 px-3 py-1.5 bg-[#FAF8F5] border border-[#E7E5E4] text-xs font-semibold text-[#1C1917]"
                  >
                    <span>{sz}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(sz)}
                      className="text-[#78716C] hover:text-rose-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 max-w-xs">
                <input
                  type="text"
                  placeholder="Add size (e.g. 3XL, Free Size)"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  className="px-3 py-1.5 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
                <button
                  type="button"
                  onClick={handleAddSize}
                  className="px-4 py-1.5 bg-[#1C1917] text-white text-xs font-semibold uppercase"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB F: SHIPPING */}
        {activeTab === "shipping" && (
          <div className="space-y-6">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4]">
              Shipping & Custom Declarations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Weight (Kilograms)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={(form as any).weightKg || 0.8}
                  onChange={(e) => setForm({ ...form, weightKg: Number(e.target.value) } as any)}
                  className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  HS Tariff Code
                </label>
                <input
                  type="text"
                  value={(form as any).hsCode || "6204"}
                  onChange={(e) => setForm({ ...form, hsCode: e.target.value } as any)}
                  className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Country of Origin
                </label>
                <input
                  type="text"
                  value={(form as any).countryOfOrigin || "India"}
                  onChange={(e) => setForm({ ...form, countryOfOrigin: e.target.value } as any)}
                  className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB G: SEO */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4]">
              Search Engine Optimization (SEO)
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={form.seoTitle || form.title || ""}
                  onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                  placeholder="Meta title for Google search results..."
                  className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={form.seoDescription || form.description || ""}
                  onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                  placeholder="Meta description summary..."
                  className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              {/* SERP Preview */}
              <div className="bg-[#FAF8F5] p-4 border border-[#E7E5E4]">
                <div className="text-[11px] text-[#78716C] font-mono">
                  https://manmayi.in/products/{form.handle || "product-url"}
                </div>
                <div className="text-sm text-[#1A0DAB] font-medium hover:underline cursor-pointer mt-0.5">
                  {form.seoTitle || form.title || "Product Title"} - Manmayi India
                </div>
                <div className="text-xs text-[#4D5156] mt-1 line-clamp-2">
                  {form.seoDescription || form.description || "Product description preview..."}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB H: PUBLISHING */}
        {activeTab === "publishing" && (
          <div className="space-y-6">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4]">
              Publishing Visibility & Collections
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Product Status
                </label>
                <select
                  value={(form as any).status || "active"}
                  onChange={(e) => setForm({ ...form, status: e.target.value } as any)}
                  className="w-full px-4 py-2.5 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
                >
                  <option value="active">Active (Visible on storefront catalog)</option>
                  <option value="draft">Draft (Hidden from storefront)</option>
                  <option value="archived">Archived (Discontinued)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Assigned Collections
                </label>
                <div className="space-y-2">
                  {["new-arrivals", "bestsellers", "festive-curation", "royal-jewellery"].map(
                    (col) => {
                      const isAssigned = (form.collections || []).includes(col);
                      return (
                        <label key={col} className="flex items-center space-x-2 text-xs text-[#1C1917] capitalize cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            onChange={(e) => {
                              const cur = form.collections || [];
                              if (e.target.checked) {
                                setForm({ ...form, collections: [...cur, col] });
                              } else {
                                setForm({ ...form, collections: cur.filter((c) => c !== col) });
                              }
                            }}
                            className="accent-[#6B1D2F]"
                          />
                          <span>{col.replace(/-/g, " ")}</span>
                        </label>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Bottom Actions */}
        <div className="mt-8 pt-6 border-t border-[#E7E5E4] flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/products" as any })}
            className="px-5 py-2.5 border border-[#E7E5E4] text-[#1C1917] bg-white hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 px-8 py-2.5 bg-[#6B1D2F] text-white hover:bg-[#521624] text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? "Update Product" : "Create & Publish Product"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
