import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { dbStore, CollectionItem } from "@/lib/db/store";
import {
  Plus,
  Edit,
  Trash2,
  Folder,
  Layers,
  CheckCircle,
  Eye,
  ArrowUp,
  ArrowDown,
  X,
  Save,
} from "lucide-react";

export const Route = createFileRoute("/admin/collections/")({
  component: AdminCollectionsPage,
});

function AdminCollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Partial<CollectionItem> | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadCollections = () => {
    setCollections(dbStore.getCollections());
  };

  useEffect(() => {
    loadCollections();
    const handleDbUpdate = () => loadCollections();
    window.addEventListener("manmayi_db_updated", handleDbUpdate);
    return () => window.removeEventListener("manmayi_db_updated", handleDbUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingCollection({
      title: "",
      editorialTitle: "",
      handle: "",
      group: "clothing",
      description: "",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
      displayOrder: collections.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (col: CollectionItem) => {
    setEditingCollection({ ...col });
    setIsModalOpen(true);
  };

  const handleSaveCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollection?.title?.trim()) {
      showToast("Collection title is required.");
      return;
    }

    const handle =
      editingCollection.handle ||
      editingCollection.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    dbStore.saveCollection({
      ...editingCollection,
      title: editingCollection.title,
      handle,
    } as any);

    loadCollections();
    setIsModalOpen(false);
    setEditingCollection(null);
    showToast(`Collection "${editingCollection.title}" saved successfully!`);
  };

  const handleDeleteCollection = (handle: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete collection "${title}"?`)) {
      dbStore.deleteCollection(handle);
      loadCollections();
      showToast(`Collection "${title}" deleted.`);
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
            Collections Management
          </h1>
          <p className="text-xs text-[#78716C] mt-1 font-sans">
            Curate thematic fashion groupings, seasonal lookbooks, and homepage highlights.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-5 py-2 bg-[#6B1D2F] text-white hover:bg-[#521624] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Collection</span>
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((col) => {
          const productsCount = dbStore
            .getProducts()
            .filter((p) => p.collections?.includes(col.handle)).length;

          return (
            <div
              key={col.handle}
              className="bg-white border border-[#E7E5E4] shadow-sm flex flex-col group hover:border-[#6B1D2F]/50 transition-colors"
            >
              <div className="relative h-44 bg-[#FAF8F5] overflow-hidden border-b border-[#E7E5E4]">
                <img
                  src={col.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800"}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 text-white text-[10px] uppercase font-semibold tracking-wider">
                  Order #{col.displayOrder}
                </span>
                <span
                  className={`absolute top-3 right-3 px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider border ${
                    col.isActive
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-stone-100 text-stone-600 border-stone-200"
                  }`}
                >
                  {col.isActive ? "Active" : "Hidden"}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[11px] text-[#6B1D2F] font-semibold uppercase tracking-wider">
                    {col.group}
                  </div>
                  <h3 className="text-lg font-serif font-medium text-[#1C1917] mt-0.5">
                    {col.editorialTitle || col.title}
                  </h3>
                  <p className="text-xs text-[#78716C] mt-2 line-clamp-2 leading-relaxed">
                    {col.description || "No description provided."}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E7E5E4] flex items-center justify-between text-xs">
                  <span className="text-[#57534E] font-medium">
                    {productsCount} Assigned Products
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(col)}
                      className="p-1.5 text-[#78716C] hover:text-[#6B1D2F] hover:bg-[#FAF8F5]"
                      title="Edit Collection"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCollection(col.handle, col.title)}
                      className="p-1.5 text-[#78716C] hover:text-rose-700 hover:bg-rose-50"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit/Create Collection Modal */}
      {isModalOpen && editingCollection && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E5E4] max-w-lg w-full shadow-2xl p-6 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
              <h2 className="text-lg font-serif text-[#1C1917]">
                {editingCollection.handle ? "Edit Collection" : "Create New Collection"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#78716C] hover:text-[#1C1917]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCollection} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Collection Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingCollection.title || ""}
                  onChange={(e) =>
                    setEditingCollection({ ...editingCollection, title: e.target.value })
                  }
                  placeholder="e.g., Royal Chanderi Heritage"
                  className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Editorial Subtitle
                </label>
                <input
                  type="text"
                  value={editingCollection.editorialTitle || ""}
                  onChange={(e) =>
                    setEditingCollection({
                      ...editingCollection,
                      editorialTitle: e.target.value,
                    })
                  }
                  placeholder="e.g., Timeless Craftsmanship for Royal Celebrations"
                  className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                    Group / Category
                  </label>
                  <select
                    value={editingCollection.group || "clothing"}
                    onChange={(e) =>
                      setEditingCollection({ ...editingCollection, group: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
                  >
                    <option value="clothing">Clothing</option>
                    <option value="jewellery">Jewellery</option>
                    <option value="festive">Festive / Bridal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingCollection.displayOrder || 1}
                    onChange={(e) =>
                      setEditingCollection({
                        ...editingCollection,
                        displayOrder: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={editingCollection.image || ""}
                  onChange={(e) =>
                    setEditingCollection({ ...editingCollection, image: e.target.value })
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
                  value={editingCollection.description || ""}
                  onChange={(e) =>
                    setEditingCollection({ ...editingCollection, description: e.target.value })
                  }
                  placeholder="Collection story..."
                  className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <label className="flex items-center space-x-2 text-xs text-[#1C1917] cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={editingCollection.isActive ?? true}
                  onChange={(e) =>
                    setEditingCollection({ ...editingCollection, isActive: e.target.checked })
                  }
                  className="accent-[#6B1D2F]"
                />
                <span className="font-medium">Collection is Active & Published</span>
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
                  Save Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
