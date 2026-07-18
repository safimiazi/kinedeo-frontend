'use client';

/**
 * ProductDetailClient — interactive shell for the product detail page.
 *
 * Receives pre-fetched product data from the Server Component (page.tsx).
 * Handles: variant selection, quantity, add-to-cart, reviews, image gallery.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { apiRequest } from '@/lib/api/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Product } from '@/lib/api/types';

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const router = useRouter();
  const { addItem, updateQty, items, itemCount } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = product.variants?.[selectedVariant];
  const currentPrice = product.flashSalePrice ?? variant?.priceOverride ?? product.basePrice;
  const discount = product.originalPrice
    ? Math.round((1 - currentPrice / product.originalPrice) * 100)
    : 0;
  const inStock = variant ? variant.stockQuantity > 0 : true;
  const availableQty = variant?.stockQuantity ?? 99;

  const cartItem = items.find(
    (item) =>
      item.productId === product._id &&
      (item.variantId || 'default') === (variant?._id || 'default'),
  );
  const currentQty = cartItem ? cartItem.qty : qty;

  const handleAddToCart = () => {
    if (cartItem) {
      updateQty(product._id, currentQty, variant?._id);
    } else {
      addItem(
        {
          productId: product._id,
          variantId: variant?._id,
          name: product.name,
          image: product.images?.[0] || '',
          price: currentPrice,
          originalPrice: product.originalPrice,
          sku: variant?.sku,
          variantLabel: variant?.attributes
            ? Object.values(variant.attributes).join(' / ')
            : undefined,
        },
        qty,
      );
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] font-nunito">
      <Navbar cartCount={itemCount} onCartOpen={() => router.push('/cart')} />

      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-2 text-xs font-bold text-[#ad1457] uppercase tracking-wider">
        <Link className="hover:text-[#e91e8c] transition-colors" href="/">
          Home
        </Link>
        <span className="text-[#ad1457]/50">›</span>
        <span className="text-[#2d1a24]">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 mb-24">
        {/* Image Gallery */}
        <div className="md:col-span-7 flex flex-col gap-5">
          <div className="aspect-4/5 rounded-2xl overflow-hidden bg-pink-50 border border-pink-100 flex items-center justify-center relative">
            {product.images?.length > 0 ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 58vw"
                className="object-contain"
                priority
              />
            ) : (
              <span className="text-[120px]">📦</span>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative ${
                    selectedImage === i
                      ? 'border-[#e91e8c] shadow-lg shadow-[#e91e8c]/20'
                      : 'border-pink-100 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill sizes="120px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="md:col-span-5 flex flex-col">
          {product.badge && (
            <span className="inline-block px-3 py-1 bg-[#e91e8c] text-white font-nunito text-[10px] font-extrabold rounded-full w-fit mb-4 uppercase tracking-widest">
              {product.badge}
            </span>
          )}
          <h1 className="font-playfair text-3xl md:text-4xl font-extrabold text-[#2d1a24] mb-2">
            {product.name}
          </h1>
          <p className="font-nunito text-sm text-[#6d1b3b]/70 mb-4">{product.shortDescription}</p>

          {/* Rating */}
          {product.averageRating > 0 && (
            <div className="flex items-center gap-3 mb-5">
              <div className="flex text-[#ff9800] text-base">
                {'★'.repeat(Math.round(product.averageRating))}
              </div>
              <span className="font-nunito text-sm text-[#ad1457]">
                {product.averageRating} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-playfair text-3xl font-extrabold text-[#e91e8c]">
              ৳{currentPrice.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > currentPrice && (
              <>
                <span className="font-nunito text-base text-[#ad1457] line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
                <span className="font-nunito text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Flash sale */}
          {product.flashSalePrice && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <span className="text-sm font-bold text-red-600">
                🔥 Flash Sale: ৳{product.flashSalePrice}
              </span>
            </div>
          )}

          {/* Description */}
          <p className="font-nunito text-sm text-[#6d1b3b] leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Variants */}
          {product.variants?.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#2d1a24] mb-2">
                Select Variant
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={v._id}
                    onClick={() => setSelectedVariant(i)}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      selectedVariant === i
                        ? 'border-[#e91e8c] bg-[#e91e8c]/5 text-[#e91e8c]'
                        : 'border-pink-200 text-[#2d1a24] hover:border-[#e91e8c]'
                    } ${v.stockQuantity === 0 ? 'opacity-40 line-through' : ''}`}
                    disabled={v.stockQuantity === 0}
                  >
                    {v.attributes ? Object.values(v.attributes).join(' / ') : v.sku}
                    {v.priceOverride ? ` — ৳${v.priceOverride}` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock info */}
          <div className="mb-6">
            {inStock ? (
              <span className="text-sm text-green-600 font-medium">
                ✓ In Stock ({variant?.stockQuantity} available)
              </span>
            ) : (
              <span className="text-sm text-red-500 font-medium">✕ Out of Stock</span>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-pink-200 rounded-xl overflow-hidden">
              <button
                onClick={() => {
                  const nextQty = Math.max(1, currentQty - 1);
                  if (cartItem) updateQty(product._id, nextQty, variant?._id);
                  else setQty(nextQty);
                }}
                className="px-4 py-3 text-[#e91e8c] font-bold hover:bg-pink-50 transition-colors"
              >
                −
              </button>
              <span className="px-4 py-3 font-bold text-sm text-[#2d1a24] min-w-10 text-center">
                {currentQty}
              </span>
              <button
                onClick={() => {
                  const nextQty = Math.min(availableQty, currentQty + 1);
                  if (cartItem) updateQty(product._id, nextQty, variant?._id);
                  else setQty(nextQty);
                }}
                disabled={!inStock || currentQty >= availableQty}
                className="px-4 py-3 text-[#e91e8c] font-bold hover:bg-pink-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 py-3.5 bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {added ? '✓ Added!' : 'Add to Cart'}
            </button>
          </div>

          {/* Buy Now */}
          <button
            onClick={() => {
              handleAddToCart();
              router.push('/checkout');
            }}
            disabled={!inStock}
            className="w-full py-3.5 border-2 border-[#e91e8c] text-[#e91e8c] font-bold text-sm rounded-xl hover:bg-[#e91e8c] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-8"
          >
            Buy Now
          </button>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-pink-100">
            {[
              ['🚚', 'Free Shipping'],
              ['↩️', '7-Day Return'],
              ['🛡️', 'Genuine Product'],
            ].map(([icon, label]) => (
              <div key={label} className="text-center">
                <span className="text-xl block mb-1">{icon}</span>
                <span className="text-[10px] font-bold text-[#ad1457] uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection productId={product._id} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <h2 className="font-playfair text-2xl font-extrabold text-[#2d1a24] mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <Link
                key={p._id}
                href={`/product/${p._id}`}
                className="bg-white rounded-2xl overflow-hidden border border-pink-100 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-100/50 transition-all"
              >
                <div className="aspect-square bg-pink-50 flex items-center justify-center overflow-hidden relative">
                  {p.images?.[0] ? (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-5xl">📦</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-nunito text-sm font-bold text-[#2d1a24] line-clamp-1">
                    {p.name}
                  </h3>
                  <span className="font-playfair text-base font-extrabold text-[#e91e8c]">
                    ৳{p.basePrice.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

// ─── Reviews Section ──────────────────────────────────────────────────────────

interface Review {
  _id: string;
  userId: string | { _id: string; name: string };
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
}

function ReviewsSection({ productId }: { productId: string }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () =>
      apiRequest<ReviewsResponse>(`/reviews/product/${productId}?limit=10`),
  });

  const submitReview = useMutation({
    mutationFn: (payload: { productId: string; rating: number; comment: string }) =>
      apiRequest('/reviews', { method: 'POST', body: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      setShowForm(false);
      setComment('');
      setRating(5);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    submitReview.mutate({ productId, rating, comment: comment.trim() });
  };

  const reviews = data?.reviews || [];
  const total = data?.total || 0;

  const getReviewerName = (userId: Review['userId']) => {
    if (typeof userId === 'object' && userId !== null) return userId.name;
    return 'Customer';
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-playfair text-2xl font-extrabold text-[#2d1a24]">
          Customer Reviews{' '}
          {total > 0 && (
            <span className="text-base font-normal text-[#6d1b3b]/50">({total})</span>
          )}
        </h2>
        {isAuthenticated && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Write Review Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-pink-100 p-6 mb-6">
          <h3 className="font-playfair text-lg font-bold text-[#2d1a24] mb-4">
            Write Your Review
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2d1a24] mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="text-3xl transition-transform hover:scale-110"
                  >
                    {star <= (hoverRating || rating) ? '★' : '☆'}
                  </button>
                ))}
                <span className="text-sm text-[#6d1b3b]/60 self-center ml-2">{rating}/5</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">
                Your Review
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl border border-pink-200 text-sm font-semibold text-[#6d1b3b] hover:bg-pink-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitReview.isPending || !comment.trim()}
                className="px-5 py-2.5 bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-50"
              >
                {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
            {submitReview.isError && (
              <p className="text-sm text-red-500">
                {submitReview.error instanceof Error
                  ? submitReview.error.message
                  : 'Failed to submit review'}
              </p>
            )}
          </form>
        </div>
      )}

      {/* Login prompt */}
      {!isAuthenticated && (
        <div className="bg-pink-50 rounded-xl px-5 py-4 mb-6 flex items-center justify-between">
          <p className="text-sm text-[#6d1b3b]/70">Login to write a review</p>
          <Link href="/login" className="text-sm font-semibold text-[#e91e8c] hover:underline">
            Login →
          </Link>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-pink-100 p-5 h-28 animate-pulse"
            />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-pink-100 p-10 text-center">
          <span className="text-4xl block mb-3">⭐</span>
          <p className="text-sm text-[#6d1b3b]/50">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-2xl border border-pink-100 p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-[#2d1a24]">
                      {getReviewerName(review.userId)}
                    </span>
                    {review.isVerifiedPurchase && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-xs text-[#6d1b3b]/40 ml-2">
                      {new Date(review.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              {review.title && (
                <h4 className="text-sm font-bold text-[#2d1a24] mb-1">{review.title}</h4>
              )}
              <p className="text-sm text-[#6d1b3b]/80 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
