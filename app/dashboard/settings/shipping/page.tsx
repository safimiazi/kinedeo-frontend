"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import { calcShipping } from "@/lib/hooks/use-shipping-settings";
import {
  Truck,
  Zap,
  Gift,
  Save,
  CheckCircle,
  ShoppingCart,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

interface ShippingSettings {
  standardCost: number;
  expressCost: number;
  freeShippingThreshold: number;
  freeShippingEnabled: boolean;
  expressEnabled: boolean;
  standardLabel: string;
  expressLabel: string;
}

// ─── Toggle Component ─────────────────────────────────────────────────────────

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        enabled ? "bg-[#e91e8c]" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ─── Number Input ──────────────────────────────────────────────────────────────

function CostInput({
  label,
  hint,
  value,
  onChange,
  prefix = "৳",
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#2d1a24] mb-1">{label}</label>
      {hint && <p className="text-xs text-[#6d1b3b]/55 mb-2">{hint}</p>}
      <div className="flex items-center border border-pink-200 rounded-xl overflow-hidden focus-within:border-[#e91e8c] focus-within:ring-2 focus-within:ring-[#e91e8c]/10 transition-all">
        <span className="bg-pink-50 px-3 py-2.5 text-sm font-bold text-[#ad1457] border-r border-pink-200">
          {prefix}
        </span>
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className="flex-1 px-3 py-2.5 text-sm text-[#2d1a24] outline-none bg-white"
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShippingSettingsPage() {
  const queryClient = useQueryClient();

  const { data: saved, isLoading } = useQuery<ShippingSettings>({
    queryKey: ["shipping-settings"],
    queryFn: () => apiRequest<ShippingSettings>("/shipping-settings", { auth: false }),
  });

  const [form, setForm] = useState<ShippingSettings>({
    standardCost: 99,
    expressCost: 120,
    freeShippingThreshold: 999,
    freeShippingEnabled: true,
    expressEnabled: true,
    standardLabel: "Standard Delivery (3-5 days)",
    expressLabel: "Express Delivery (1-2 days)",
  });

  // Sync saved data into form when loaded
  useEffect(() => {
    if (saved) setForm(saved);
  }, [saved]);

  const update = useMutation({
    mutationFn: (dto: Partial<ShippingSettings>) => {
      // Strip MongoDB metadata fields before sending — backend's ValidationPipe
      // rejects _id, createdAt, updatedAt, __v with forbidNonWhitelisted: true
      const { standardCost, expressCost, freeShippingThreshold,
              freeShippingEnabled, expressEnabled, standardLabel, expressLabel } = dto;
      return apiRequest<ShippingSettings>("/shipping-settings", {
        method: "PUT",
        body: { standardCost, expressCost, freeShippingThreshold,
                freeShippingEnabled, expressEnabled, standardLabel, expressLabel },
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["shipping-settings"], data);
      toast.success("Shipping settings saved!");
    },
    onError: () => toast.error("Failed to save settings"),
  });

  const set = <K extends keyof ShippingSettings>(key: K, val: ShippingSettings[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  // Live preview amounts
  const previewAmounts = [0, 300, 700, 999, 1500];

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl animate-pulse">
        <div className="h-8 w-56 bg-pink-100 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-pink-100 h-32" />
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-pink-100 h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair flex items-center gap-2">
          <Truck className="w-6 h-6 text-[#e91e8c]" />
          Shipping Settings
        </h1>
        <p className="text-sm text-[#6d1b3b]/60 mt-1">
          Manage delivery costs and rules. Changes apply immediately — no deployment needed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Form ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Standard Delivery */}
          <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-bold text-[#2d1a24]">Standard Delivery</h2>
                  <p className="text-xs text-[#6d1b3b]/55">Default delivery method for all orders</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CostInput
                label="Delivery Cost"
                hint="Charged when free shipping threshold is not met"
                value={form.standardCost}
                onChange={(v) => set("standardCost", v)}
              />
              <div>
                <label className="block text-sm font-semibold text-[#2d1a24] mb-1">
                  Label shown to customers
                </label>
                <p className="text-xs text-[#6d1b3b]/55 mb-2">Shown on checkout delivery selection</p>
                <input
                  type="text"
                  value={form.standardLabel}
                  onChange={(e) => set("standardLabel", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Free Shipping */}
          <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <Gift className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h2 className="font-bold text-[#2d1a24]">Free Shipping</h2>
                  <p className="text-xs text-[#6d1b3b]/55">Standard delivery becomes free above the threshold</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#6d1b3b]/60">
                  {form.freeShippingEnabled ? "Enabled" : "Disabled"}
                </span>
                <Toggle
                  enabled={form.freeShippingEnabled}
                  onChange={(v) => set("freeShippingEnabled", v)}
                />
              </div>
            </div>

            <div
              className={`transition-all ${
                form.freeShippingEnabled ? "opacity-100" : "opacity-40 pointer-events-none"
              }`}
            >
              <CostInput
                label="Free Shipping Threshold"
                hint="Orders at or above this amount get free standard delivery"
                value={form.freeShippingThreshold}
                onChange={(v) => set("freeShippingThreshold", v)}
              />

              {form.freeShippingEnabled && (
                <div className="mt-3 flex items-start gap-2 bg-green-50 rounded-xl px-4 py-3 border border-green-100">
                  <Info className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-green-700">
                    Customers will see a nudge in the cart: <em>"Add ৳X more for free shipping!"</em>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Express Delivery */}
          <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-bold text-[#2d1a24]">Express Delivery</h2>
                  <p className="text-xs text-[#6d1b3b]/55">Fast delivery option — always charged, no free shipping</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#6d1b3b]/60">
                  {form.expressEnabled ? "Enabled" : "Disabled"}
                </span>
                <Toggle
                  enabled={form.expressEnabled}
                  onChange={(v) => set("expressEnabled", v)}
                />
              </div>
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all ${
                form.expressEnabled ? "opacity-100" : "opacity-40 pointer-events-none"
              }`}
            >
              <CostInput
                label="Express Delivery Cost"
                hint="Always charged — no free shipping applies"
                value={form.expressCost}
                onChange={(v) => set("expressCost", v)}
              />
              <div>
                <label className="block text-sm font-semibold text-[#2d1a24] mb-1">
                  Label shown to customers
                </label>
                <p className="text-xs text-[#6d1b3b]/55 mb-2">Shown on checkout delivery selection</p>
                <input
                  type="text"
                  value={form.expressLabel}
                  onChange={(e) => set("expressLabel", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Save */}
          <button
            onClick={() => update.mutate(form)}
            disabled={update.isPending}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white py-3.5 rounded-2xl font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/30 transition-all disabled:opacity-60"
          >
            {update.isPending ? (
              <>Saving...</>
            ) : update.isSuccess ? (
              <><CheckCircle className="w-4 h-4" /> Saved!</>
            ) : (
              <><Save className="w-4 h-4" /> Save Shipping Settings</>
            )}
          </button>
        </div>

        {/* ── Right: Live Preview ── */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-4 h-4 text-[#e91e8c]" />
              <h3 className="font-bold text-[#2d1a24] text-sm">Live Preview</h3>
            </div>
            <p className="text-xs text-[#6d1b3b]/55 mb-4">
              What customers see for various cart amounts
            </p>

            {/* Standard delivery preview */}
            <div className="space-y-2 mb-5">
              <p className="text-xs font-semibold text-[#6d1b3b]/70 uppercase tracking-wide">Standard</p>
              {previewAmounts.map((amount) => {
                const cost = calcShipping(form, amount, "standard");
                return (
                  <div
                    key={amount}
                    className={`flex items-center justify-between text-sm px-3 py-2 rounded-lg ${
                      cost === 0 ? "bg-green-50 border border-green-100" : "bg-pink-50/50"
                    }`}
                  >
                    <span className="text-[#6d1b3b]/70">Cart ৳{amount.toLocaleString()}</span>
                    <span
                      className={`font-bold ${cost === 0 ? "text-green-600" : "text-[#2d1a24]"}`}
                    >
                      {cost === 0 ? "FREE 🎉" : `৳${cost}`}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Express delivery preview */}
            {form.expressEnabled && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#6d1b3b]/70 uppercase tracking-wide">Express</p>
                <div className="flex items-center justify-between text-sm px-3 py-2 rounded-lg bg-amber-50 border border-amber-100">
                  <span className="text-[#6d1b3b]/70">Any cart amount</span>
                  <span className="font-bold text-amber-700">৳{form.expressCost}</span>
                </div>
                <p className="text-[10px] text-[#6d1b3b]/40 px-1">Express never qualifies for free shipping</p>
              </div>
            )}

            {/* Threshold note */}
            {form.freeShippingEnabled && (
              <div className="mt-4 pt-4 border-t border-pink-100">
                <p className="text-xs text-[#6d1b3b]/60 text-center">
                  Free shipping threshold: <strong className="text-[#e91e8c]">৳{form.freeShippingThreshold.toLocaleString()}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
