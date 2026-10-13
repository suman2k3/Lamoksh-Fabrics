import React, { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { dbStore, BlogPost } from "@/lib/db/store";
import { Plus, Edit, Trash2, BookOpen, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/admin/blogs/")({
  component: AdminBlogsPage,
});

function AdminBlogsPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadBlogs = () => {
    setBlogs(dbStore.getBlogPosts());
  };

  useEffect(() => {
    loadBlogs();
    const handleDbUpdate = () => loadBlogs();
    window.addEventListener("manmayi_db_updated", handleDbUpdate);
    return () => window.removeEventListener("manmayi_db_updated", handleDbUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete article "${title}"?`)) {
      dbStore.deleteBlogPost(id);
      loadBlogs();
      showToast(`Article "${title}" deleted.`);
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
            Journal & Atelier Blog Posts
          </h1>
          <p className="text-xs text-[#78716C] mt-1 font-sans">
            Publish fashion stories, artisan craftsmanship profiles, and styling guides.
          </p>
        </div>

        <Link
          to="/admin/blogs/new"
          className="flex items-center space-x-2 px-5 py-2 bg-[#6B1D2F] text-white hover:bg-[#521624] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-[#E7E5E4] shadow-sm flex flex-col group"
          >
            <img
              src={post.coverImage || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800"}
              alt={post.title}
              className="w-full h-44 object-cover border-b border-[#E7E5E4]"
            />
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B1D2F]">
                    {post.author}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase font-semibold border ${
                      post.status === "published"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <h3 className="text-base font-serif font-medium text-[#1C1917] mt-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-[#78716C] mt-1 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E7E5E4] flex items-center justify-between text-xs">
                <span className="text-[#A8A29E] text-[11px]">
                  {new Date(post.publishedAt).toLocaleDateString("en-IN")}
                </span>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  className="p-1.5 text-[#78716C] hover:text-rose-700"
                  title="Delete Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
