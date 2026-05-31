import { NextResponse } from 'next/server';
import { createSslCommerzSession, getBaseUrlFromRequest } from '@/lib/sslcommerz';
import { savePendingOrder } from '@/lib/order-store';

export async function POST(request: Request) {
  const payload = await request.json();
  const { items, customerInfo, subtotal, shipping, total } = payload;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ success: false, message: 'Cart is empty.' }, { status: 400 });
  }

  if (!customerInfo?.name || !customerInfo?.email || !customerInfo?.phone || !customerInfo?.address || !customerInfo?.city) {
    return NextResponse.json({ success: false, message: 'Customer information is incomplete.' }, { status: 400 });
  }

  const tranId = `hovi-${Date.now()}-${Math.floor(Math.random() * 900000 + 100000)}`;
  const orderNumber = `HOVI-${Date.now()}`;
  const baseUrl = getBaseUrlFromRequest(request);
  const productName = items.length === 1 ? items[0].name : `${items.length} items from HOVI`;

  const order = await savePendingOrder({
    id: tranId,
    orderNumber,
    tranId,
    items,
    shippingAddress: {
      name: customerInfo.name,
      phone: customerInfo.phone,
      street: customerInfo.address,
      city: customerInfo.city,
      note: customerInfo.note,
    },
    paymentMethod: 'sslcommerz',
    subtotal,
    shippingCost: shipping,
    total,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  try {
    const session = await createSslCommerzSession({
      tranId: order.tranId,
      orderNumber: order.orderNumber,
      totalAmount: order.total,
      currency: 'BDT',
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
      },
      productName,
      baseUrl,
    });

    return NextResponse.json({ success: true, redirectUrl: session.GatewayPageURL });
  } catch (error: unknown) {
    console.error('SSLCommerz init error:', error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unable to initiate payment.' }, { status: 500 });
  }
}
