"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import { Bell, CheckCircle, Edit, Plus, Save, Trash2, Clock, Pin } from "lucide-react";
import toast from "react-hot-toast";
import type { Announcement } from "@/lib/api/types";

const defaultForm = {
  message: "",
  isActive: true,
  priority: 0,
  startsAt: "",
  endsAt: "",
};

export default function AnnouncementsPage() {
  const [formData, setFormData] = useState(defaultForm);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => apiRequest<{ announcements: Announcement[]; total: number; page: number; totalPages: number }>(`/announcements?page=1&limit=20`, {}),
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => apiRequest<Announcement>("/announcements", { method: "POST", body: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setFormData(defaultForm);
      setEditingAnnouncement(null);
      toast.success("Announcement saved successfully!");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to save announcement"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      apiRequest<Announcement>(`/announcements/${id}`, { method: "PUT", body: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setFormData(defaultForm);
      setEditingAnnouncement(null);
      toast.success("Announcement updated successfully!");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to update announcement"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/announcements/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Announcement deactivated");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to deactivate announcement"),
  });

  const openCreate = () => {
    setFormData(defaultForm);
    setEditingAnnouncement(null);
    setError("");
  };

  const openEdit = (announcement: Announcement) => {
    setFormData({
      message: announcement.message,
      isActive: announcement.isActive,
      priority: announcement.priority,
      startsAt: announcement.startsAt ? announcement.startsAt.slice(0, 16) : "",
      endsAt: announcement.endsAt ? announcement.endsAt.slice(0, 16) : "",
    });
    setEditingAnnouncement(announcement);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.message.trim()) {
      setError("Announcement message is required.");
      return;
    }

    const startsAtDate = formData.startsAt ? new Date(formData.startsAt) : undefined;
    const endsAtDate = formData.endsAt ? new Date(formData.endsAt) : undefined;
    const now = new Date();

    if (startsAtDate && endsAtDate && startsAtDate >= endsAtDate) {
      setError('Start time must be before end time.');
      return;
    }

    if (endsAtDate && endsAtDate <= now) {
      setError('End time must be in the future or left blank for always-active announcements.');
      return;
    }

    const payload = {
      message: formData.message.trim(),
      isActive: formData.isActive,
      priority: Number(formData.priority),
      startsAt: startsAtDate ? startsAtDate.toISOString() : undefined,
      endsAt: endsAtDate ? endsAtDate.toISOString() : undefined,
    };

    try {
      if (editingAnnouncement) {
        await updateMutation.mutateAsync({ id: editingAnnouncement._id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save announcement.");
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this announcement?")) return;
    deleteMutation.mutate(id);
  };

  const announcements = data?.announcements || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Announcements</h1>
          <p className="text-sm text-[#6d1b3b]/60 mt-1">Manage messages that appear in the homepage announcement bar.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Announcement
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="bg-white rounded-2xl border border-pink-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#fce4ec] flex items-center justify-center text-[#e91e8c]">
              <Save className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#2d1a24]">{editingAnnouncement ? "Edit Announcement" : "New Announcement"}</h2>
              <p className="text-sm text-[#6d1b3b]/60">Create or update the message shown on the homepage banner.</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[#2d1a24] mb-2">Message</label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                className="w-full rounded-2xl border border-pink-200 px-4 py-3 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all resize-none"
                placeholder="✨ FREE SHIPPING ON ORDERS ABOVE ৳999 | USE CODE KINEDEO20 FOR 20% OFF ✨"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#2d1a24] mb-2">
                  <Pin className="w-4 h-4 text-[#ad1457]/70" />
                  Priority
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.priority}
                  onChange={(e) => setFormData((prev) => ({ ...prev, priority: Number(e.target.value) }))}
                  className="w-full rounded-2xl border border-pink-200 px-4 py-3 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#2d1a24] mb-2">
                  <CheckCircle className="w-4 h-4 text-[#ad1457]/70" />
                  Active
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-[#e91e8c] border-pink-200 rounded"
                  />
                  <span className="text-sm text-[#6d1b3b]">Show this announcement</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#2d1a24] mb-2">
                  <Clock className="w-4 h-4 text-[#ad1457]/70" />
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.startsAt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startsAt: e.target.value }))}
                  className="w-full rounded-2xl border border-pink-200 px-4 py-3 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                />
                <p className="mt-2 text-xs text-[#6d1b3b]/70">Leave blank for always-active announcements.</p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#2d1a24] mb-2">
                  <Clock className="w-4 h-4 text-[#ad1457]/70" />
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.endsAt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endsAt: e.target.value }))}
                  className="w-full rounded-2xl border border-pink-200 px-4 py-3 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                />
                <p className="mt-2 text-xs text-[#6d1b3b]/70">Times are local and converted to UTC for scheduling.</p>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#e91e8c] text-white px-5 py-3 rounded-2xl text-sm font-semibold hover:bg-[#c2185b] transition-all"
            >
              <Save className="w-4 h-4" />
              {editingAnnouncement ? "Update Announcement" : "Save Announcement"}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-pink-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#fce4ec] flex items-center justify-center text-[#e91e8c]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#2d1a24]">Active Announcements</h2>
                <p className="text-sm text-[#6d1b3b]/60">Messages shown on the homepage banner.</p>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-16 rounded-2xl bg-pink-50 animate-pulse" />
                ))}
              </div>
            ) : announcements.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-pink-200 p-8 text-center text-sm text-[#6d1b3b]/70">
                No announcements yet. Add one to make the homepage banner dynamic.
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement._id} className="rounded-2xl border border-pink-100 p-4 bg-[#fff0f5]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-[#2d1a24] leading-relaxed">{announcement.message}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#6d1b3b]/70">
                          <span className="inline-flex items-center gap-1">Priority: {announcement.priority}</span>
                          <span className="inline-flex items-center gap-1">Status: {announcement.isActive ? "Active" : "Inactive"}</span>
                          {announcement.startsAt && <span>Starts: {new Date(announcement.startsAt).toLocaleString()}</span>}
                          {announcement.endsAt && <span>Ends: {new Date(announcement.endsAt).toLocaleString()}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(announcement)}
                          className="inline-flex items-center gap-2 rounded-xl border border-pink-200 px-3 py-2 text-xs font-medium text-[#ad1457] hover:bg-pink-50 transition-all"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeactivate(announcement._id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Deactivate
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
