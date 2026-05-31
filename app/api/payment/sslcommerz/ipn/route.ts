import { NextResponse } from 'next/server';
import { validateSslCommerzIPN } from '@/lib/sslcommerz';
import { markOrderPaid } from '@/lib/order-store';

export async function POST(request: Request) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData.entries()) as Record<string, string>;
  const valId = body.val_id ?? body.valId;
  const tranId = body.tran_id ?? body.tranId;

  if (!valId || !tranId) {
    return NextResponse.json({ status: 'failed', message: 'Missing val_id or tran_id.' }, { status: 400 });
  }

  try {
    const validation = await validateSslCommerzIPN(valId);
    const order = await markOrderPaid(tranId, validation);

    if (!order) {
      return NextResponse.json({ status: 'failed', message: 'Order not found for transaction ID.' }, { status: 404 });
    }

    console.log(`[SSLCommerz IPN] Payment confirmed for order ${tranId}`);
    return NextResponse.json({ status: 'success' });
  } catch (error: unknown) {
    console.error('[SSLCommerz IPN] validation error:', error);
    return NextResponse.json({ status: 'failed', message: error instanceof Error ? error.message : 'Validation failed.' }, { status: 400 });
  }
}
