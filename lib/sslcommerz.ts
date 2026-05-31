export interface SslCommerzSessionPayload {
  tranId: string;
  orderNumber: string;
  totalAmount: number;
  currency: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  productName: string;
  baseUrl: string;
}

export interface SslCommerzSessionResponse {
  status: string;
  GatewayPageURL?: string;
  failedreason?: string;
  [key: string]: unknown;
}

export interface SslCommerzValidationResponse {
  status: string;
  tran_date?: string;
  val_id?: string;
  amount?: string;
  store_amount?: string;
  currency?: string;
  currency_type?: string;
  [key: string]: unknown;
}

const STORE_ID = process.env.SSL_COMMERZ_STORE_ID;
const STORE_PASSWORD = process.env.SSL_COMMERZ_STORE_PASSWORD;
const ENVIRONMENT = process.env.SSL_COMMERZ_ENVIRONMENT === 'live' ? 'live' : 'sandbox';

function getGatewayUrl() {
  return ENVIRONMENT === 'live'
    ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
    : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
}

function getValidationUrl(valId: string) {
  const base =
    ENVIRONMENT === 'live'
      ? 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php'
      : 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';
  return `${base}?val_id=${encodeURIComponent(valId)}&store_id=${encodeURIComponent(
    STORE_ID ?? '',
  )}&store_passwd=${encodeURIComponent(STORE_PASSWORD ?? '')}&v=1&format=json`;
}

export function getBaseUrlFromRequest(request: Request) {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '');
  }

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  if (!host) {
    return 'http://localhost:3000';
  }
  return `${proto}://${host}`;
}

export async function createSslCommerzSession(payload: SslCommerzSessionPayload) {
  if (!STORE_ID || !STORE_PASSWORD) {
    throw new Error('SSLCommerz credentials are not configured. Set SSL_COMMERZ_STORE_ID and SSL_COMMERZ_STORE_PASSWORD.');
  }

  const form = new URLSearchParams();
  form.append('store_id', STORE_ID);
  form.append('store_passwd', STORE_PASSWORD);
  form.append('total_amount', String(payload.totalAmount));
  form.append('currency', payload.currency);
  form.append('tran_id', payload.tranId);
  form.append('success_url', `${payload.baseUrl}/checkout/result?status=success&tran_id=${encodeURIComponent(payload.tranId)}`);
  form.append('fail_url', `${payload.baseUrl}/checkout/result?status=failed&tran_id=${encodeURIComponent(payload.tranId)}`);
  form.append('cancel_url', `${payload.baseUrl}/checkout/result?status=cancelled&tran_id=${encodeURIComponent(payload.tranId)}`);
  form.append('ipn_url', `${payload.baseUrl}/api/payment/sslcommerz/ipn`);
  form.append('cus_name', payload.customerInfo.name);
  form.append('cus_email', payload.customerInfo.email);
  form.append('cus_phone', payload.customerInfo.phone);
  form.append('cus_add1', payload.customerInfo.address);
  form.append('cus_city', payload.customerInfo.city);
  form.append('cus_country', 'Bangladesh');
  form.append('shipping_method', 'Courier');
  form.append('product_name', payload.productName);
  form.append('product_category', 'Ecommerce');
  form.append('product_profile', 'general');
  form.append('value_a', payload.orderNumber);
  form.append('value_b', payload.customerInfo.email);
  form.append('value_c', payload.customerInfo.phone);
  form.append('value_d', 'hovi-frontend');

  const response = await fetch(getGatewayUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`SSLCommerz initialization failed: ${message}`);
  }

  const data = (await response.json()) as SslCommerzSessionResponse;
  if (data.status !== 'SUCCESS' || !data.GatewayPageURL) {
    throw new Error(data.failedreason ? String(data.failedreason) : 'SSLCommerz did not return a payment URL.');
  }

  return data;
}

export async function validateSslCommerzIPN(valId: string) {
  if (!STORE_ID || !STORE_PASSWORD) {
    throw new Error('SSLCommerz credentials are not configured. Set SSL_COMMERZ_STORE_ID and SSL_COMMERZ_STORE_PASSWORD.');
  }

  const response = await fetch(getValidationUrl(valId));
  if (!response.ok) {
    throw new Error(`SSLCommerz validation request failed with status ${response.status}`);
  }

  const data = (await response.json()) as SslCommerzValidationResponse;
  if (data.status !== 'VALID' && data.status !== 'VALIDATED') {
    throw new Error(`SSLCommerz validation failed: ${data.status}`);
  }

  return data;
}
