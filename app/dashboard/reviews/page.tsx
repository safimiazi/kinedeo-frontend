"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";

interface Review {
  _id: string;
  userId: string | { _id: string; name: string; email: string };
  productId: string | { _id: string; name: string };
  rating: number;
  comment: string;
  isApproved: boolean;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
}

type FilterTab = "all" | "approved" | "pending";

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterTab>("all");
  const queryClient = useQueryClient();

  const getFilterParam = () => {
    if (filter === "approved") return "&isApproved=true";
    if (filter === "pending") return "&isApproved=false";
    return "";
  };

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", page, filter],
    queryFn: () =>
      apiRequest<ReviewsResponse>(
        `/reviews/admin/all?page=${page}&limit=10${getFilterParam()}`
      ),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/reviews/admin/${id}/approve`, { method: "PUT" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/reviews/admin/${id}/reject`, { method: "PUT" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/reviews/admin/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });

  const getCustomerName = (userId: Review["userId"]) => {
    if (typeof userId === "object" && userId !== null) return userId.name;
    return userId || "Unknown";
  };

  const getProductName = (productId: Review["productId"]) => {
    if (typeof productId === "object" && productId !== null) return productId.name;
    return productId || "Unknown Product";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-200"}>
        ★
      </span>
    ));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-pink-100 rounded-lg animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-pink-100 p-6 h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const reviews = data?.reviews || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Reviews</h1>
        <p className="text-sm text-[#6d1b3b]/60 mt-1">
          {data?.total || 0} reviews total
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-pink-100 p-2 inline-flex gap-1">
        {(["all", "approved", "pending"] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setFilter(tab);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
              filter === tab
                ? "bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white shadow-md shadow-pink-200"
                : "text-[#6d1b3b]/60 hover:bg-pink-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-pink-100 p-12 text-center">
          <span className="text-4xl mb-4 block">⭐</span>
          <h3 className="text-lg font-semibold text-[#2d1a24] mb-2">No reviews found</h3>
          <p className="text-sm text-[#6d1b3b]/50">
            {filter !== "all" ? "Try a different filter" : "Reviews will appear here once customers leave them"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-2xl border border-pink-100 p-5 hover:shadow-md hover:shadow-pink-100/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-[#2d1a24]">
                      {getCustomerName(review.userId)}
                    </span>
                    <span className="text-xs text-[#6d1b3b]/40">→</span>
                    <span className="text-sm text-[#6d1b3b]/70">
                      {getProductName(review.productId)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">{renderStars(review.rating)}</span>
                    <span className="text-xs text-[#6d1b3b]/50">({review.rating}/5)</span>
                  </div>
                  <p className="text-sm text-[#2d1a24]/80 mb-3">{review.comment}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {review.isVerifiedPurchase && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        ✓ Verified Purchase
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        review.isApproved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {review.isApproved ? "Approved" : "Pending"}
                    </span>
                    <span className="text-[10px] text-[#6d1b3b]/40">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {!review.isApproved && (
                    <button
                      onClick={() => approveMutation.mutate(review._id)}
                      disabled={approveMutation.isPending}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all"
                    >
                      Approve
                    </button>
                  )}
                  {review.isApproved && (
                    <button
                      onClick={() => rejectMutation.mutate(review._id)}
                      disabled={rejectMutation.isPending}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-all"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this review?")) {
                        deleteMutation.mutate(review._id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-lg border border-pink-200 text-sm text-[#6d1b3b] disabled:opacity-40 hover:bg-pink-50 transition-all"
          >
            ← Prev
          </button>
          <span className="text-sm text-[#6d1b3b]/60 px-3">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 rounded-lg border border-pink-200 text-sm text-[#6d1b3b] disabled:opacity-40 hover:bg-pink-50 transition-all"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
