import React, { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { dbStore, Product } from "@/lib/db/store";
import {
  Search,
  Plus,
  Filter,
  Download,
  Trash2,
  Edit,
  ExternalLink,
  CheckSquare,
  Square,
  AlertTriangle,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Archive,
} from "lucide-react";

export const Route = createFileRoute("/admin/products/")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"title" | "price" | "stock">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadProducts = () => {
    const list = dbStore.getProducts();
    setProducts([...list]);
  };

  useEffect(() => {
    loadProducts();
    const handleDbUpdate = () => loadProducts();
    window.addEventListener("manmayi_db_updated", handleDbUpdate);
    return () => window.removeEventListener("manmayi_db_updated", handleDbUpdate);
  }, []);

  // Filtering & Sorting
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.material && product.material.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.type && product.type.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    const stock = (product as any).stockQuantity ?? (product.inStock ? 10 : 0);
    const matchesStock =
      selectedStockStatus === "all"
        ? true
        : selectedStockStatus === "in_stock"
        ? stock > 5
        : selectedStockStatus === "low_stock"
        ? stock > 0 && stock <= 5
        : stock === 0;

    const status = (product as any).status || "active";
    const matchesStatus = selectedStatus === "all" || status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStock && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "title") {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    if (sortBy === "price") {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    }
    if (sortBy === "stock") {
      const stockA = (a as any).stockQuantity ?? (a.inStock ? 10 : 0);
      const stockB = (b as any).stockQuantity ?? (b.inStock ? 10 : 0);
      return sortOrder === "asc" ? stockA - stockB : stockB - stockA;
    }
    return 0;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === sortedProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedProducts.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteProduct = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete product "${title}"?`)) {
      dbStore.deleteProduct(id);
      loadProducts();
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      showToast(`Product "${title}" deleted successfully.`);
    }
  };

  const handleBulkStatusChange = (status: "active" | "draft" | "archived") => {
    if (selectedIds.length === 0) return;
    dbStore.bulkUpdateProductStatus(selectedIds, status);
    loadProducts();
    showToast(`Updated ${selectedIds.length} products to ${status}.`);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected products?`)) {
      dbStore.bulkDeleteProducts(selectedIds);
      loadProducts();
      setSelectedIds([]);
      showToast(`Deleted ${selectedIds.length} products.`);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Title",
      "Handle",
      "Price (INR)",
      "Compare Price",
      "Category",
      "Type",
      "Material",
      "Color",
      "Stock",
      "Status",
    ];
    const rows = sortedProducts.map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.handle,
      p.price,
      (p as any).compareAtPrice || "",
      p.category,
      `"${p.type || ""}"`,
      `"${p.material || ""}"`,
      `"${p.colour || ""}"`,
      (p as any).stockQuantity ?? (p.inStock ? 10 : 0),
      (p as any).status || "active",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `manmayi_products_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV export generated and downloaded.");
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917] text-white px-5 py-3 rounded-none shadow-xl border-l-4 border-[#6B1D2F] flex items-center space-x-3 text-sm animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 border border-[#E7E5E4] shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-light text-[#1C1917]">
            Product Catalog Management
          </h1>
          <p className="text-xs text-[#78716C] mt-1 font-sans">
            Manage clothing ensembles, fine jewellery items, inventory stock levels & pricing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 border border-[#E7E5E4] text-[#1C1917] bg-white hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <Download className="w-4 h-4 text-[#6B1D2F]" />
            <span>Export CSV</span>
          </button>

          <Link
            to="/admin/products/new"
            className="flex items-center space-x-2 px-5 py-2 bg-[#6B1D2F] text-white hover:bg-[#521624] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-6 border border-[#E7E5E4] shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
            <input
              type="text"
              placeholder="Search title, material, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2 px-3 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
          >
            <option value="all">All Categories (Clothing & Jewellery)</option>
            <option value="clothing">Clothing Ensembles</option>
            <option value="jewellery">Fine Jewellery</option>
          </select>

          {/* Stock Filter */}
          <select
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value)}
            className="py-2 px-3 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">In Stock (&gt; 5)</option>
            <option value="low_stock">Low Stock (1 - 5)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-2 px-3 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
          >
            <option value="all">All Publishing Statuses</option>
            <option value="active">Active / Published</option>
            <option value="draft">Draft / Hidden</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-[#FAF8F5] p-3 border border-[#6B1D2F]/20 text-xs">
            <span className="font-medium text-[#1C1917]">
              {selectedIds.length} item(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkStatusChange("active")}
                className="px-3 py-1 bg-emerald-700 text-white hover:bg-emerald-800 text-[11px] uppercase tracking-wider font-semibold"
              >
                Set Active
              </button>
              <button
                onClick={() => handleBulkStatusChange("draft")}
                className="px-3 py-1 bg-[#78716C] text-white hover:bg-[#57534E] text-[11px] uppercase tracking-wider font-semibold"
              >
                Set Draft
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-rose-700 text-white hover:bg-rose-800 text-[11px] uppercase tracking-wider font-semibold flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Table */}
      <div className="bg-white border border-[#E7E5E4] shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#E7E5E4] text-[11px] uppercase tracking-wider font-semibold text-[#78716C]">
              <th className="p-4 w-10 text-center">
                <button onClick={toggleSelectAll} className="focus:outline-none">
                  {selectedIds.length === sortedProducts.length && sortedProducts.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-[#6B1D2F]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#A8A29E]" />
                  )}
                </button>
              </th>
              <th className="p-4">Product Details</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price (INR)</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E5E4] text-xs text-[#1C1917]">
            {sortedProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#78716C]">
                  No products found matching your search or filters.
                </td>
              </tr>
            ) : (
              sortedProducts.map((product) => {
                const stock = (product as any).stockQuantity ?? (product.inStock ? 12 : 0);
                const isSelected = selectedIds.includes(product.id);
                const status = (product as any).status || "active";

                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-[#FAF8F5]/60 transition-colors ${
                      isSelected ? "bg-[#FAF8F5]" : ""
                    }`}
                  >
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleSelectOne(product.id)}
                        className="focus:outline-none"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#6B1D2F]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#A8A29E]" />
                        )}
                      </button>
                    </td>

                    {/* Product Details Column */}
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.images[0] || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=200"}
                          alt={product.title}
                          className="w-12 h-16 object-cover border border-[#E7E5E4] bg-[#FAF8F5]"
                        />
                        <div>
                          <Link
                            to={`/admin/products/$id` as any}
                            params={{ id: product.id } as any}
                            className="font-medium text-[#1C1917] hover:text-[#6B1D2F] transition-colors"
                          >
                            {product.title}
                          </Link>
                          <div className="text-[11px] text-[#78716C] mt-0.5">
                            SKU: {product.handle} • {product.material || "Crafted"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="p-4">
                      <span className="capitalize px-2.5 py-1 bg-[#FAF8F5] border border-[#E7E5E4] text-[11px] text-[#57534E]">
                        {product.category === "jewellery" ? "Fine Jewellery" : "Clothing"}
                      </span>
                    </td>

                    {/* Price Column */}
                    <td className="p-4 font-semibold text-[#1C1917]">
                      ₹{product.price.toLocaleString("en-IN")}
                      {(product as any).compareAtPrice && (
                        <div className="text-[11px] text-[#A8A29E] line-through font-normal">
                          ₹{(product as any).compareAtPrice.toLocaleString("en-IN")}
                        </div>
                      )}
                    </td>

                    {/* Stock Column */}
                    <td className="p-4">
                      {stock > 5 ? (
                        <span className="text-emerald-700 font-medium">
                          {stock} in stock
                        </span>
                      ) : stock > 0 ? (
                        <span className="text-amber-700 font-medium flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Low ({stock})</span>
                        </span>
                      ) : (
                        <span className="text-rose-700 font-medium">Out of stock</span>
                      )}
                    </td>

                    {/* Status Column */}
                    <td className="p-4">
                      {status === "active" ? (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Active
                        </span>
                      ) : status === "draft" ? (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                          Draft
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200">
                          Archived
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="p-4 text-right space-x-2">
                      <a
                        href={`/products/${product.handle}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block p-1.5 text-[#78716C] hover:text-[#6B1D2F] hover:bg-[#FAF8F5] transition-colors"
                        title="Preview on Storefront"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => navigate({ to: `/admin/products/${product.id}` as any })}
                        className="p-1.5 text-[#78716C] hover:text-[#6B1D2F] hover:bg-[#FAF8F5] transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product.id, product.title)}
                        className="p-1.5 text-[#78716C] hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
