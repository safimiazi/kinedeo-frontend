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
} from './use-auth';

// Product hooks
export {
  useProducts,
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
