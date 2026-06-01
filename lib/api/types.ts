/**
 * Shared API types — used across all API modules and hooks.
 */

// ─── Auth Types ─────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface OtpResponse {
  message: string;
  expiresInSeconds: number;
  otp?: string; // Only in development
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isActive: boolean;
  addresses: Address[];
  favoriteProducts?: string[];
  createdAt: string;
}

export interface Address {
  id?: string;
  label?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

// ─── Product Types ──────────────────────────────────────────────────────────────

export interface ProductVariant {
  _id: string;
  sku: string;
  attributes?: Record<string, string>;
  priceOverride?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  images?: string[];
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  basePrice: number;
  originalPrice?: number;
  categoryId: string;
  images: string[];
  variants: ProductVariant[];
  badge?: string;
  averageRating: number;
  reviewCount: number;
  salesCount: number;
  isDeleted: boolean;
  flashSalePrice?: number;
  flashSaleEndTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Flash Sale Types ───────────────────────────────────────────────────────────

export interface FlashSaleProduct {
  productId: string;
  originalPrice: number;
  salePrice: number;
}

export interface FlashSale {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
  products: FlashSaleProduct[];
  isActive: boolean;
  createdAt: string;
}

export interface Announcement {
  _id: string;
  message: string;
  isActive: boolean;
  priority: number;
  startsAt?: string;
  endsAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeaturedReview {
  _id: string;
  userId: { _id: string; name: string };
  productId: { _id: string; name: string; images: string[] };
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface PaginatedAnnouncements {
  announcements: Announcement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Pagination ─────────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
}
