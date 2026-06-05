/**
 * Hooks barrel export — single import point for all custom hooks.
 */

export { queryKeys } from './query-keys';

// Auth hooks
export {
  useProfile,
  useSendOtp,
  useVerifyOtp,
  useLogin,
  useRegister,
  useAdminLogin,
  useUpdateProfile,
  useLogout,
  useLogoutAll,
  useFavorites,
  useToggleFavorite,
} from './use-auth';

// Product hooks
export {
  useProducts,
  useInfiniteProducts,
  useProduct,
  useActiveFlashSales,
  useAllFlashSales,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useAddVariant,
  useUpdateVariant,
  useCreateFlashSale,
  useUpdateFlashSale,
} from './use-products';

// Category hooks
export {
  useCategories,
  useCategoriesAdmin,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from './use-categories';

// Bundle hooks
export {
  useActiveBundle,
  useBundle,
  useAllBundles,
  useCreateBundle,
  useUpdateBundle,
  useDeleteBundle,
} from './use-bundles';

// Shipping settings hooks
export {
  useShippingSettings,
  calcShipping,
  DEFAULT_SHIPPING_SETTINGS,
} from './use-shipping-settings';
export type { ShippingSettings } from './use-shipping-settings';
