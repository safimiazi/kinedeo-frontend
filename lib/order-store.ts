import fs from 'fs/promises';
import path from 'path';

export type OrderStatus = 'pending' | 'paid' | 'failed';
export type PaymentMethod = 'sslcommerz';

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  image?: string;
  price: number;
  qty: number;
  sku?: string;
  variantLabel?: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  area?: string;
  note?: string;
}

export interface LocalOrder {
  id: string;
  orderNumber: string;
  tranId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  couponCode?: string;
  discountAmount?: number;
  createdAt: string;
  updatedAt: string;
  paymentVerifiedAt?: string;
  validationResponse?: unknown;
}

const filePath = path.join(process.cwd(), 'data', 'sslcommerz-orders.json');
let fallbackOrders: LocalOrder[] = [];

async function readOrdersFile() {
  try {
    const file = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(file) as LocalOrder[];
  } catch {
    return fallbackOrders;
  }
}

async function writeOrdersFile(orders: LocalOrder[]) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(orders, null, 2), 'utf-8');
    fallbackOrders = orders;
  } catch {
    fallbackOrders = orders;
  }
}

export async function getOrderByTranId(tranId: string) {
  const orders = await readOrdersFile();
  return orders.find((order) => order.tranId === tranId) ?? null;
}

export async function savePendingOrder(order: LocalOrder) {
  const orders = await readOrdersFile();
  orders.push(order);
  await writeOrdersFile(orders);
  return order;
}

export async function markOrderPaid(tranId: string, validationResponse: unknown) {
  const orders = await readOrdersFile();
  const index = orders.findIndex((order) => order.tranId === tranId);
  if (index === -1) {
    return null;
  }

  orders[index] = {
    ...orders[index],
    status: 'paid',
    paymentVerifiedAt: new Date().toISOString(),
    validationResponse,
    updatedAt: new Date().toISOString(),
  };

  await writeOrdersFile(orders);
  return orders[index];
}
