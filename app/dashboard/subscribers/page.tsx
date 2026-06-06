"use client";

import { useState } from "react";
import {
  Mail,
  Search,
  Users,
  Globe,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { newsletterAdminApi } from "@/lib/api/newsletter-admin";

const LIMIT = 20;

export default function SubscribersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["newsletter-subscribers", page],
    queryFn: () => newsletterAdminApi.getSubscribers(page, LIMIT),
  });

  const subscribers = data?.subscribers ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  // Client-side search filter (search across current page)
  const filtered = search
    ? subscribers.filter((s) =>
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        (s.source ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : subscribers;

  const handleExportCSV = () => {
    if (!subscribers.length) return;
    const rows = [
      ["Email", "Source", "Subscribed At"],
      ...subscribers.map((s) => [
        s.email,
        s.source ?? "—",
        new Date(s.createdAt).toLocaleDateString(),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-page-${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-52 bg-pink-100 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-pink-50 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-pink-100 p-6 h-28 animate-pulse" />
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-pink-100 p-6 h-96 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair flex items-center gap-2">
            <Mail className="w-6 h-6 text-[#e91e8c]" />
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-[#6d1b3b]/60 mt-1">
            Manage Kine Deo Club subscribers
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={!subscribers.length}
          className="inline-flex items-center gap-2 bg-white border border-pink-200 text-[#e91e8c] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-pink-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed w-fit"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl border border-pink-100 p-5 hover:shadow-md hover:shadow-pink-100/50 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e91e8c]/10 to-[#c2185b]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#e91e8c]" />
            </div>
            <div>
              <p className="text-xs text-[#6d1b3b]/60 font-medium uppercase tracking-wide">
                Total Subscribers
              </p>
              <p className="text-2xl font-bold text-[#2d1a24]">{total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl border border-pink-100 p-5 hover:shadow-md hover:shadow-pink-100/50 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-[#6d1b3b]/60 font-medium uppercase tracking-wide">
                This Page
              </p>
              <p className="text-2xl font-bold text-[#2d1a24]">{subscribers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-pink-100 p-4">
        <div className="flex items-center gap-3 bg-gradient-to-r from-pink-50 to-white rounded-xl px-4 py-2.5 max-w-md border border-pink-100">
          <Search className="w-4 h-4 text-[#ad1457]/50 shrink-0" />
          <input
            type="text"
            placeholder="Filter by email or source..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-[#2d1a24] placeholder:text-[#ad1457]/40 w-full"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-[#ad1457]/50 hover:text-[#ad1457] text-xs font-bold shrink-0"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-pink-100 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
            <Mail className="w-10 h-10 text-[#ad1457]/40" />
          </div>
          <h3 className="text-lg font-semibold text-[#2d1a24] mb-2">
            {search ? "No matching subscribers" : "No subscribers yet"}
          </h3>
          <p className="text-sm text-[#6d1b3b]/50">
            {search
              ? "Try a different search term"
              : "Subscribers will appear here once users join the Kine Deo Club"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-pink-100 bg-gradient-to-r from-pink-50 to-white">
                  <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-5 py-3">
                    #
                  </th>
                  <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-5 py-3">
                    Email Address
                  </th>
                  <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-5 py-3">
                    Source
                  </th>
                  <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-5 py-3">
                    Subscribed At
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub, idx) => (
                  <tr
                    key={sub.email}
                    className={`border-b border-pink-50 hover:bg-pink-50/30 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-pink-50/20"
                    }`}
                  >
                    <td className="px-5 py-3.5 text-xs text-[#6d1b3b]/40 font-mono">
                      {(page - 1) * LIMIT + idx + 1}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#e91e8c]/10 to-[#c2185b]/10 flex items-center justify-center shrink-0">
                          <Mail className="w-3.5 h-3.5 text-[#e91e8c]" />
                        </div>
                        <span className="text-sm font-medium text-[#2d1a24]">
                          {sub.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                        <Globe className="w-3 h-3" />
                        {sub.source ?? "homepage"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-[#6d1b3b]/60">
                        <Calendar className="w-3 h-3" />
                        {new Date(sub.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-5 py-3 border-t border-pink-50 bg-pink-50/30 flex items-center justify-between">
            <p className="text-xs text-[#6d1b3b]/50">
              Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total} subscribers
            </p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-pink-200 text-sm text-[#6d1b3b] disabled:opacity-40 hover:bg-pink-50 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    page === pageNum
                      ? "bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white shadow-md"
                      : "text-[#6d1b3b] hover:bg-pink-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-pink-200 text-sm text-[#6d1b3b] disabled:opacity-40 hover:bg-pink-50 transition-all"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
