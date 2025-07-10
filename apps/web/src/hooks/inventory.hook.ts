import { toastNotification } from '@/components/toastTotification';
import {
  addProductServerFn,
  getAllProductsServerFn,
} from '@/server/functions/inventory.serverfn';
import type { ApiResponse, ErrorWithDataResponse } from '@/utils/types';
import type { InventoryItemFormValues } from '@/zod/inventory.validation';
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

export const productsQueries = {
  all: ['products'] as const,
  list: () =>
    queryOptions<Array<InventoryItemFormValues>>({
      queryKey: [...productsQueries.all, 'list'],
      queryFn: () => getAllProductsServerFn(),
      placeholderData: (previewData) => previewData,
      retry: 1,
    }),
};

export function useAddProductMutation(reset: () => void, onClose: () => void) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    ErrorWithDataResponse,
    InventoryItemFormValues
  >({
    mutationFn: (data) => addProductServerFn({ data }),

    onError: ({ data }) => {
      return toastNotification({
        toastType: 'error',
        title: 'Add product',
        description: data.message,
      });
    },
    onSuccess: (data) => {
      if (!data.success) {
        return toastNotification({
          toastType: 'error',
          title: 'Add competition',
          description: data.message,
        });
      }

      toastNotification({
        toastType: 'success',
        title: 'Add competition',
        description: data.message,
      });

      queryClient.invalidateQueries({
        queryKey: [...productsQueries.all, 'list'],
      });

      // Reset form values
      reset();
      // onClose();
    },
  });
}
