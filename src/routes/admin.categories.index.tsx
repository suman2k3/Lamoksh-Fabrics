import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { dbStore, Category } from "@/lib/db/store";
import {
  Plus,
  Edit,
  Trash2,
  FolderTree,
  CheckCircle,
  X,
  Save,
  Tag,
} from "lucide-react";

export const Route = createFileRoute("/admin/categories/")({
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadCategories = () => {
    setCategories(dbStore.getCategories());
  };

  useEffect(() => {
    loadCategories();
    const handleDbUpdate = () => loadCategories();
    window.addEventListener("manmayi_db_updated", handleDbUpdate);
    return () => window.removeEventListener("manmayi_db_updated", handleDbUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingCategory({
      name: "",
      slug: "",
      description: "",
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory({ ...cat });
    setIsModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name?.trim()) {
      showToast("Category name is required.");
      return;
    }

    dbStore.saveCategory({
      ...editingCategory,
      name: editingCategory.name,
    } as any);

    loadCategories();
    setIsModalOpen(false);
    setEditingCategory(null);
    showToast(`Category "${editingCategory.name}" saved!`);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      dbStore.deleteCategory(id);
      loadCategories();
      showToast(`Category "${name}" deleted.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917] text-white px-5 py-3 shadow-xl border-l-4 border-[#6B1D2F] flex items-center space-x-3 text-sm">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 border border-[#E7E5E4] shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-light text-[#1C1917]">
            Category Taxonomy
          </h1>
          <p className="text-xs text-[#78716C] mt-1 font-sans">
            Organize customer navigation menus and product taxonomy trees.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-5 py-2 bg-[#6B1D2F] text-white hover:bg-[#521624] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Category Table */}
      <div className="bg-white border border-[#E7E5E4] shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#E7E5E4] text-[11px] uppercase tracking-wider font-semibold text-[#78716C]">
              <th className="p-4">Category Name & Slug</th>
              <th className="p-4">Description</th>
              <th className="p-4">Display Order</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E5E4] text-xs text-[#1C1917]">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    {cat.imageUrl && (
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="w-10 h-10 object-cover border border-[#E7E5E4] bg-[#FAF8F5]"
                      />
                    )}
                    <div>
                      <span className="font-medium text-[#1C1917]">{cat.name}</span>
                      <div className="text-[11px] text-[#78716C] font-mono mt-0.5">
                        /{cat.slug}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-4 max-w-xs text-[#57534E]">
                  {cat.description || "No description provided."}
                </td>

                <td className="p-4 font-semibold text-[#1C1917]">
                  #{cat.displayOrder}
                </td>

                <td className="p-4">
                  {cat.isActive ? (
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200">
                      Hidden
                    </span>
                  )}
                </td>

                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-1.5 text-[#78716C] hover:text-[#6B1D2F] hover:bg-[#FAF8F5]"
                    title="Edit Category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1.5 text-[#78716C] hover:text-rose-700 hover:bg-rose-50"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E5E4] max-w-md w-full shadow-2xl p-6 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
              <h2 className="text-lg font-serif text-[#1C1917]">
                {editingCategory.id ? "Edit Category" : "Add Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#78716C] hover:text-[#1C1917]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  placeholder="e.g., Banarasi Zari Silks"
                  className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={editingCategory.slug || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, slug: e.target.value })
                  }
                  placeholder="banarasi-zari-silks"
                  className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingCategory.displayOrder || 1}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      displayOrder: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Thumbnail Image URL
                </label>
                <input
                  type="text"
                  value={editingCategory.imageUrl || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  placeholder="Category overview..."
                  className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <label className="flex items-center space-x-2 text-xs text-[#1C1917] cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={editingCategory.isActive ?? true}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, isActive: e.target.checked })
                  }
                  className="accent-[#6B1D2F]"
                />
                <span className="font-medium">Category is Active</span>
              </label>

              <div className="pt-4 border-t border-[#E7E5E4] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E7E5E4] text-[#1C1917] text-xs uppercase tracking-wider font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6B1D2F] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#521624]"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
