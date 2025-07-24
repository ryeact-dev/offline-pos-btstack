import { toastNotification } from "@/components/toastTotification";
import {
  checkoutCartServerFn,
  createCartServerFn,
  deleteCartItemServerFn,
  deleteCartSListerverFn,
  getUserOrderServerFn,
  updateCartServerFn,
} from "@/server/functions/cart.serverfn";
import type {
  ApiResponse,
  ErrorWithDataResponse,
  OrderDetails,
} from "@/utils/types";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { productsQueries } from "./inventory.hook";
import type {
  AddOrderItemValues,
  CheckOutOrderValues,
  UpdateOrderItemValues,
} from "@/zod/products.validation";

export const cartQueries = {
  all: ["cart"] as const,
  // list: () =>
  //   queryOptions<OrderDetails[]>({
  //     queryKey: [...productsQueries.all, 'list'],
  //     queryFn: () => getAllProductsServerFn(),
  //     placeholderData: (previewData) => previewData,
  //     retry: 1,
  //   }),
  single: (userId: string, status: string = "incomplete") =>
    queryOptions<OrderDetails>({
      queryKey: [...cartQueries.all, "single"],
      queryFn: () => getUserOrderServerFn({ data: { id: userId, status } }),
      placeholderData: (previewData) => previewData,
      retry: 1,
    }),
};

export function useCreateCartMutation(onClose: () => void) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ErrorWithDataResponse, AddOrderItemValues>({
    mutationFn: (data) => createCartServerFn({ data }),

    onError: ({ data }) => {
      return toastNotification({
        toastType: "error",
        title: "Create Order",
        description: data.message,
      });
    },
    onSuccess: (data) => {
      if (!data.success) {
        return toastNotification({
          toastType: "error",
          title: "Create Order",
          description: data.message,
        });
      }

      toastNotification({
        toastType: "success",
        title: "Create Order",
        description: data.message,
      });

      queryClient.invalidateQueries({
        queryKey: [...productsQueries.all, "list"],
      });

      queryClient.invalidateQueries({
        queryKey: [...cartQueries.all, "single"],
      });

      onClose();
    },
  });
}

export function useUpdateCartMutation(onClose?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ErrorWithDataResponse, UpdateOrderItemValues>(
    {
      mutationFn: (data) => updateCartServerFn({ data }),

      onError: ({ data }) => {
        return toastNotification({
          toastType: "error",
          title: "Update Order",
          description: data.message,
        });
      },
      onSuccess: (data) => {
        if (!data.success) {
          return toastNotification({
            toastType: "error",
            title: "Update Order",
            description: data.message,
          });
        }

        toastNotification({
          toastType: "success",
          title: "Update Order",
          description: data.message,
        });

        queryClient.invalidateQueries({
          queryKey: [...productsQueries.all, "list"],
        });

        queryClient.invalidateQueries({
          queryKey: [...cartQueries.all, "single"],
        });

        onClose && onClose();
      },
    },
  );
}

export function useCheckOutSalesMutation(onClose: () => void) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ErrorWithDataResponse, CheckOutOrderValues>({
    mutationFn: (data) => checkoutCartServerFn({ data }),

    onError: ({ data }) => {
      return toastNotification({
        toastType: "error",
        title: "Update Order",
        description: data.message,
      });
    },
    onSuccess: (data) => {
      if (!data.success) {
        return toastNotification({
          toastType: "error",
          title: "Update Order",
          description: data.message,
        });
      }

      toastNotification({
        toastType: "success",
        title: "Update Order",
        description: data.message,
      });

      queryClient.invalidateQueries({
        queryKey: [...productsQueries.all, "list"],
      });

      queryClient.invalidateQueries({
        queryKey: [...cartQueries.all, "single"],
      });

      onClose();
    },
  });
}

export function useDeleteCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    ErrorWithDataResponse,
    { id: number; name: string }
  >({
    mutationFn: (data) => deleteCartItemServerFn({ data }),

    onError: ({ data }) => {
      return toastNotification({
        toastType: "error",
        title: "Update Order",
        description: data.message,
      });
    },
    onSuccess: (data) => {
      if (!data.success) {
        return toastNotification({
          toastType: "error",
          title: "Update Order",
          description: data.message,
        });
      }

      toastNotification({
        toastType: "success",
        title: "Update Order",
        description: data.message,
      });

      queryClient.invalidateQueries({
        queryKey: [...productsQueries.all, "list"],
      });

      queryClient.invalidateQueries({
        queryKey: [...cartQueries.all, "single"],
      });
    },
  });
}

export function useDeleteCartListMutation(onClose: () => void) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    ErrorWithDataResponse,
    { id: number; name: string }
  >({
    mutationFn: (data) => deleteCartSListerverFn({ data }),

    onError: ({ data }) => {
      return toastNotification({
        toastType: "error",
        title: "Update Order",
        description: data.message,
      });
    },
    onSuccess: (data) => {
      if (!data.success) {
        return toastNotification({
          toastType: "error",
          title: "Update Order",
          description: data.message,
        });
      }

      toastNotification({
        toastType: "success",
        title: "Update Order",
        description: data.message,
      });

      queryClient.invalidateQueries({
        queryKey: [...productsQueries.all, "list"],
      });

      queryClient.invalidateQueries({
        queryKey: [...cartQueries.all, "single"],
      });

      onClose();
    },
  });
}
