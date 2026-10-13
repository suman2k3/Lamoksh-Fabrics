import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { dbStore, BlogPost } from "@/lib/db/store";
import { Save, ArrowLeft, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/admin/blogs/new")({
  component: AdminNewBlogPage,
});

function AdminNewBlogPage() {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "Manmayi Editorial Desk",
    coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    status: "published",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setForm((prev) => ({ ...prev, title: val, slug }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) {
      showToast("Article title is required.");
      return;
    }

    dbStore.saveBlogPost(form as any);
    showToast("Blog article saved and published!");
    setTimeout(() => {
      navigate({ to: "/admin/blogs" as any });
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917] text-white px-5 py-3 shadow-xl border-l-4 border-[#6B1D2F] flex items-center space-x-3 text-sm">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex items-center space-x-4 bg-white p-6 border border-[#E7E5E4] shadow-sm">
        <button
          onClick={() => navigate({ to: "/admin/blogs" as any })}
          className="p-2 border border-[#E7E5E4] bg-white hover:bg-[#FAF8F5] text-[#1C1917]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-light text-[#1C1917]">
            Write Journal Article
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Create brand story content for the Manmayi Journal storefront page.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-[#E7E5E4] p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
            Article Title *
          </label>
          <input
            type="text"
            required
            value={form.title || ""}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g., The Heritage of Chanderi Silk: Centuries of Indian Artisanry"
            className="w-full px-4 py-2.5 border border-[#E7E5E4] bg-[#FAF8F5] text-sm focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
              URL Slug
            </label>
            <input
              type="text"
              value={form.slug || ""}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
              Author Name
            </label>
            <input
              type="text"
              value={form.author || ""}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
            Cover Image URL
          </label>
          <input
            type="text"
            value={form.coverImage || ""}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
            Article Short Excerpt
          </label>
          <textarea
            rows={2}
            value={form.excerpt || ""}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            placeholder="Brief intro for post cards..."
            className="w-full px-4 py-2 border border-[#E7E5E4] bg-[#FAF8F5] text-xs focus:outline-none focus:border-[#6B1D2F]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
            Full Article Body Text
          </label>
          <textarea
            rows={10}
            value={form.content || ""}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Write full article here..."
            className="w-full px-4 py-3 border border-[#E7E5E4] bg-[#FAF8F5] text-xs leading-relaxed focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
          />
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-[#E7E5E4]">
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/blogs" as any })}
            className="px-5 py-2.5 border border-[#E7E5E4] text-[#1C1917] text-xs uppercase font-semibold"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex items-center space-x-2 px-8 py-2.5 bg-[#6B1D2F] text-white text-xs uppercase font-semibold hover:bg-[#521624] transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Publish Article</span>
          </button>
        </div>
      </form>
    </div>
  );
}
