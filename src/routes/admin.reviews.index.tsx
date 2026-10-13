import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { dbStore, ProductReview } from "@/lib/db/store";
import { Star, CheckCircle, XCircle, Trash2, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/admin/reviews/")({
  component: AdminReviewsPage,
});

function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadReviews = () => {
    setReviews(dbStore.getProductReviews());
  };

  useEffect(() => {
    loadReviews();
    const handleDbUpdate = () => loadReviews();
    window.addEventListener("manmayi_db_updated", handleDbUpdate);
    return () => window.removeEventListener("manmayi_db_updated", handleDbUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateStatus = (id: string, status: "approved" | "rejected") => {
    dbStore.moderateReview(id, status);
    loadReviews();
    showToast(`Review status updated to ${status}.`);
  };

  const filteredReviews = reviews.filter(
    (r) => selectedStatus === "all" || r.status === selectedStatus
  );

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
            Product Reviews Moderation
          </h1>
          <p className="text-xs text-[#78716C] mt-1 font-sans">
            Approve verified client feedback to display on storefront product pages.
          </p>
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="py-2 px-3 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:outline-none focus:border-[#6B1D2F]"
        >
          <option value="all">All Moderation Statuses</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved & Live</option>
          <option value="rejected">Rejected / Hidden</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white p-8 text-center border border-[#E7E5E4] text-[#78716C] text-xs">
            No product reviews found matching filter.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-[#E7E5E4] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-xs text-[#1C1917]">
                    {rev.reviewerName}
                  </span>
                  {rev.isVerifiedPurchase && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 uppercase font-semibold">
                      Verified Purchase
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#6B1D2F] font-medium">
                  Product: {rev.productTitle}
                </div>

                <p className="text-xs text-[#57534E] leading-relaxed italic">
                  "{rev.comment}"
                </p>

                <div className="text-[10px] text-[#A8A29E]">
                  Submitted on {new Date(rev.createdAt).toLocaleDateString("en-IN")}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-3 md:pt-0 border-t md:border-t-0 border-[#E7E5E4]">
                {rev.status !== "approved" && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, "approved")}
                    className="px-3 py-1.5 bg-emerald-700 text-white hover:bg-emerald-800 text-xs uppercase tracking-wider font-semibold"
                  >
                    Approve
                  </button>
                )}

                {rev.status !== "rejected" && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, "rejected")}
                    className="px-3 py-1.5 bg-rose-700 text-white hover:bg-rose-800 text-xs uppercase tracking-wider font-semibold"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
