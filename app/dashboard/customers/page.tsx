"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface CustomersResponse {
  customers: Customer[];
  total: number;
  page: number;
  totalPages: number;
}

interface CustomerStats {
  total: number;
  active: number;
  newThisMonth: number;
}

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["customers", page, search],
    queryFn: () =>
      apiRequest<CustomersResponse>(
        `/customers?page=${page}&limit=15${search ? `&search=${encodeURIComponent(search)}` : ""}`
      ),
  });

  const { data: stats } = useQuery({
    queryKey: ["customers-stats"],
    queryFn: () => apiRequest<CustomerStats>("/customers/stats"),
  });

  const toggleActive = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/customers/${id}/toggle-active`, { method: "PUT" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers-stats"] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-pink-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-pink-100 p-6 h-24 animate-pulse" />
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-pink-100 p-6 h-96 animate-pulse" />
      </div>
    );
  }

  const customers = data?.customers || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Customers</h1>
        <p className="text-sm text-[#6d1b3b]/60 mt-1">Manage your customer base</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-pink-100 p-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👥</span>
            <div>
              <p className="text-xs text-[#6d1b3b]/60 font-medium">Total Customers</p>
              <p className="text-xl font-bold text-[#2d1a24]">{stats?.total || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-pink-100 p-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-xs text-[#6d1b3b]/60 font-medium">Active</p>
              <p className="text-xl font-bold text-[#2d1a24]">{stats?.active || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-pink-100 p-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🆕</span>
            <div>
              <p className="text-xs text-[#6d1b3b]/60 font-medium">New This Month</p>
              <p className="text-xl font-bold text-[#2d1a24]">{stats?.newThisMonth || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-pink-100 p-4">
        <div className="flex items-center gap-3 bg-pink-50 rounded-xl px-4 py-2.5 max-w-md">
          <span className="text-[#ad1457]/50">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="bg-transparent border-none outline-none text-sm text-[#2d1a24] placeholder:text-[#ad1457]/40 w-full"
          />
        </div>
      </div>

      {/* Customers Table */}
      {customers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-pink-100 p-12 text-center">
          <span className="text-4xl mb-4 block">👥</span>
          <h3 className="text-lg font-semibold text-[#2d1a24] mb-2">No customers found</h3>
          <p className="text-sm text-[#6d1b3b]/50">
            {search ? "Try adjusting your search" : "Customers will appear here once they register"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-pink-100 bg-pink-50/50">
                  <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-5 py-3">Name</th>
                  <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-5 py-3">Email</th>
                  <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-5 py-3">Phone</th>
                  <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-5 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-5 py-3">Joined</th>
                  <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id} className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-[#2d1a24]">{customer.name}</td>
                    <td className="px-5 py-3.5 text-sm text-[#6d1b3b]/70">{customer.email}</td>
                    <td className="px-5 py-3.5 text-sm text-[#6d1b3b]/70">{customer.phone || "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 capitalize">
                        {customer.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          customer.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {customer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#6d1b3b]/60">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleActive.mutate(customer._id)}
                        disabled={toggleActive.isPending}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                          customer.isActive
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {customer.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
