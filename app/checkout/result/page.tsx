"use client";

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function CheckoutResultPage() {
  const { clearCart } = useCart();
  const [status] = useState<string | null>(() =>
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('status') : null,
  );
  const [tranId] = useState<string | null>(() =>
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('tran_id') : null,
  );

  const success = status === 'success';

  useEffect(() => {
    if (success) {
      clearCart();
    }
  }, [success, clearCart]);
  const cancelled = status === 'cancelled';

  if (success) {
    clearCart();
  }

  return (
    <div className="min-h-screen bg-[#fff0f5] font-nunito flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-[28px] border border-[#f3d4e0] shadow-sm p-8 text-center">
        <div className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center bg-[#f8bbd0]/30">
          {success ? (
            <CheckCircle2 className="w-12 h-12 text-[#c2185b]" />
          ) : (
            <XCircle className="w-12 h-12 text-[#ad1457]" />
          )}
        </div>

        <h1 className="font-playfair text-3xl font-extrabold text-[#2d1a24] mb-4">
          {success ? 'Payment Successful' : cancelled ? 'Payment Cancelled' : 'Payment Failed'}
        </h1>

        <p className="text-sm text-[#6d1b3b]/75 mb-6">
          {success
            ? 'Your payment was completed successfully. Your order is now being verified by SSLCommerz.'
            : cancelled
            ? 'You cancelled the payment. If you want to continue shopping, return to the store.'
            : 'The payment did not complete. Please try again or contact support if the issue continues.'}
        </p>

        {tranId ? (
          <div className="mb-6 rounded-2xl bg-[#fff0f5] border border-[#fce4ec] p-4 text-left text-sm text-[#2d1a24]/80">
            <div className="font-semibold text-[#2d1a24] mb-1">Reference ID</div>
            <div className="break-all">{tranId}</div>
          </div>
        ) : null}

        <div className="space-y-3">
          <Link
            href="/"
            className="block rounded-full bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white py-3 font-semibold transition hover:shadow-lg"
          >
            Continue Shopping
          </Link>
          {success ? (
            <p className="text-xs text-[#6d1b3b]/60">
              Your order may take a few minutes to appear in the dashboard while SSLCommerz confirms the payment.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
