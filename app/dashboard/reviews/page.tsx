"use client";

import { useState } from "react";
import {
  Star,
  CheckCircle,
  Clock,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Package,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Shield,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";

interface Review {
  _id: string;
  userId: { _id: string; name: string; email: string } | string;
  productId: { _id: string; name: string; images: string[] } | string;
  rating: number;
  title?: string;
  comment: string;
  isApproved: boolean;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
}

type FilterTab = "all" | "approved" | "pending";

const TABS: { key: FilterTab; label: string; icon: React.ReactNode; color: string }[] = [
  { key: "all", label: "All Reviews", icon: <MessageSquare className="w-3.5 h-3.5" />, color: "" },
  { key: "approved", label: "Approved", icon: <CheckCircle className="w-3.5 h-3.5" />, color: "text-green-600" },
  { key: "pending", label: "Pending", icon: <Clock className="w-3.5 h-3.5" />, color: "text-yellow-600" },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
      <span className="text-xs text-[#6d1b3b]/50 ml-1">{rating}/5</span>
    </div>
  );
}

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-pink-100 shadow-xl p-6 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-[#2d1a24] text-sm">Confirm Action</h3>
            <p className="text-xs text-[#6d1b3b]/60 mt-0.5">{message}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-[#6d1b3b] hover:bg-pink-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const filterParam =
    filter === "approved" ? "&isApproved=true" : filter === "pending" ? "&isApproved=false" : "";

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", page, filter],
    queryFn: () =>
      apiRequest<ReviewsResponse>(`/reviews/admin/all?page=${page}&limit=10${filterParam}`),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/reviews/admin/${id}/approve`, { method: "PUT" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/reviews/admin/${id}/reject`, { method: "PUT" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/reviews/admin/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setDeleteTarget(null);
    },
  });

  const getName = (u: Review["userId"]) =>
    typeof u === "object" && u ? u.name : "Unknown";

  const getProduct = (p: Review["productId"]) =>
    typeof p === "object" && p ? p : null;

  const reviews = data?.reviews ?? [];
  const totalPages = data?.totalPages ?? 1;

  // Stats
  const total = data?.total ?? 0;
  const approvedCount = filter === "approved" ? total : undefined;
  const pendingCount = filter === "pending" ? total : undefined;

  return (
    <>
      {deleteTarget && (
        <ConfirmDialog
          message="This review will be permanently deleted and cannot be recovered."
          onConfirm={() => deleteMutation.mutate(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#e91e8c]" />
              Reviews
            </h1>
            <p className="text-sm text-[#6d1b3b]/60 mt-1 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Approved reviews appear on the home page
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#2d1a24]">{total}</p>
            <p className="text-xs text-[#6d1b3b]/50">
              {filter === "all" ? "total reviews" : filter === "approved" ? "approved" : "pending"}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl border border-pink-100 p-1.5 inline-flex gap-1 shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setFilter(tab.key); setPage(1); }}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === tab.key
                  ? "bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white shadow-md"
                  : `text-[#6d1b3b]/60 hover:bg-pink-50 ${tab.color}`
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-pink-100 p-5 h-36 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && reviews.length === 0 && (
          <div className="bg-white rounded-2xl border border-pink-100 p-14 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
              <Star className="w-10 h-10 text-[#ad1457]/30" />
            </div>
            <h3 className="text-lg font-semibold text-[#2d1a24] mb-2">No reviews found</h3>
            <p className="text-sm text-[#6d1b3b]/50">
              {filter !== "all" ? "Try a different filter" : "Reviews will appear here once customers submit them"}
            </p>
          </div>
        )}

        {/* Reviews List */}
        {!isLoading && reviews.length > 0 && (
          <div className="space-y-3">
            {reviews.map((review) => {
              const product = getProduct(review.productId);
              const name = getName(review.userId);
              const isExpanded = expandedId === review._id;
              const isLong = review.comment.length > 120;

              return (
                <div
                  key={review._id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    review.isApproved
                      ? "border-green-100 hover:border-green-200"
                      : "border-yellow-100 hover:border-yellow-200"
                  } hover:shadow-md`}
                >
                  {/* Status stripe */}
                  <div
                    className={`h-1 w-full ${
                      review.isApproved
                        ? "bg-gradient-to-r from-green-400 to-emerald-400"
                        : "bg-gradient-to-r from-yellow-400 to-amber-400"
                    }`}
                  />

                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Left: content */}
                      <div className="flex-1 min-w-0">
                        {/* Top row */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                          {/* Avatar + name */}
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#f48fb1] to-[#e91e8c] flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-semibold text-[#2d1a24]">{name}</span>
                          </div>

                          <span className="text-[#6d1b3b]/20">•</span>

                          {/* Product */}
                          <div className="flex items-center gap-1.5 min-w-0">
                            {product?.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-5 h-5 rounded object-cover shrink-0"
                              />
                            ) : (
                              <Package className="w-3.5 h-3.5 text-[#ad1457]/40 shrink-0" />
                            )}
                            <span className="text-sm text-[#6d1b3b]/70 truncate max-w-[160px]">
                              {product?.name ?? "Unknown Product"}
                            </span>
                          </div>

                          <span className="text-[#6d1b3b]/20">•</span>

                          {/* Date */}
                          <div className="flex items-center gap-1 text-[11px] text-[#6d1b3b]/40">
                            <Calendar className="w-3 h-3" />
                            {new Date(review.createdAt).toLocaleDateString("en-BD", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="mb-2">
                          <StarRow rating={review.rating} />
                        </div>

                        {/* Title */}
                        {review.title && (
                          <p className="font-semibold text-sm text-[#2d1a24] mb-1">{review.title}</p>
                        )}

                        {/* Comment */}
                        <p className="text-sm text-[#2d1a24]/75 leading-relaxed">
                          {isLong && !isExpanded
                            ? `${review.comment.slice(0, 120)}...`
                            : review.comment}
                        </p>
                        {isLong && (
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : review._id)}
                            className="text-xs text-[#e91e8c] font-semibold mt-1 hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            {isExpanded ? "Show less" : "Read more"}
                          </button>
                        )}

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              review.isApproved
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {review.isApproved ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            {review.isApproved ? "Approved — visible on home page" : "Pending approval"}
                          </span>

                          {review.isVerifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                              <CheckCircle className="w-3 h-3" />
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: actions */}
                      <div className="flex sm:flex-col items-center gap-2 shrink-0">
                        {!review.isApproved ? (
                          <button
                            onClick={() => approveMutation.mutate(review._id)}
                            disabled={approveMutation.isPending}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-all disabled:opacity-50 w-full sm:w-auto justify-center"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => rejectMutation.mutate(review._id)}
                            disabled={rejectMutation.isPending}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 transition-all disabled:opacity-50 w-full sm:w-auto justify-center"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        )}

                        <button
                          onClick={() => setDeleteTarget(review._id)}
                          disabled={deleteMutation.isPending}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all disabled:opacity-50 w-full sm:w-auto justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-pink-200 text-sm font-semibold text-[#6d1b3b] disabled:opacity-40 hover:bg-pink-50 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                      page === p
                        ? "bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white shadow-md"
                        : "text-[#6d1b3b]/60 hover:bg-pink-50 border border-pink-100"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <span className="text-sm text-[#6d1b3b]/40 px-1">... {totalPages}</span>
              )}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-pink-200 text-sm font-semibold text-[#6d1b3b] disabled:opacity-40 hover:bg-pink-50 transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
