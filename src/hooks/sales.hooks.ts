// import { toastNotification } from "@/components/toastTotification";
// import {
//   addSalesServerFn,
//   checkoutSalesServerFn,
//   deleteSalesServerFn,
//   getUserOrderServerFn,
//   updateSalesServerFn,
// } from "@/server/functions/sales.serverfn";
// import type {
//   ApiResponse,
//   ErrorWithDataResponse,
//   OrderDetails,
// } from "@/utils/types";
// import {
//   queryOptions,
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query";
// import { productsQueries } from "./inventory.hook";
// import type {
//   AddOrderItemValues,
//   UpdateOrderItemValues,
// } from "@/zod/products.validation";

// export const salesQueries = {
//   all: ["sales"] as const,
//   // list: () =>
//   //   queryOptions<OrderDetails[]>({
//   //     queryKey: [...productsQueries.all, 'list'],
//   //     queryFn: () => getAllProductsServerFn(),
//   //     placeholderData: (previewData) => previewData,
//   //     retry: 1,
//   //   }),
//   single: (userId: string, status: string = "incomplete") =>
//     queryOptions<OrderDetails>({
//       queryKey: [...salesQueries.all, "single"],
//       queryFn: () => getUserOrderServerFn({ data: { id: userId, status } }),
//       placeholderData: (previewData) => previewData,
//       retry: 1,
//     }),
// };

// export function useCreateCartMutation(onClose: () => void) {
//   const queryClient = useQueryClient();

//   return useMutation<ApiResponse, ErrorWithDataResponse, AddOrderItemValues>({
//     mutationFn: (data) => addSalesServerFn({ data }),

//     onError: ({ data }) => {
//       return toastNotification({
//         toastType: "error",
//         title: "Create Order",
//         description: data.message,
//       });
//     },
//     onSuccess: (data) => {
//       if (!data.success) {
//         return toastNotification({
//           toastType: "error",
//           title: "Create Order",
//           description: data.message,
//         });
//       }

//       toastNotification({
//         toastType: "success",
//         title: "Create Order",
//         description: data.message,
//       });

//       queryClient.invalidateQueries({
//         queryKey: [...productsQueries.all, "list"],
//       });

//       queryClient.invalidateQueries({
//         queryKey: [...salesQueries.all, "list"],
//       });

//       onClose();
//     },
//   });
// }

// export function useUpdateCartMutation(onClose: () => void) {
//   const queryClient = useQueryClient();

//   return useMutation<ApiResponse, ErrorWithDataResponse, UpdateOrderItemValues>(
//     {
//       mutationFn: (data) => updateSalesServerFn({ data }),

//       onError: ({ data }) => {
//         return toastNotification({
//           toastType: "error",
//           title: "Update Order",
//           description: data.message,
//         });
//       },
//       onSuccess: (data) => {
//         if (!data.success) {
//           return toastNotification({
//             toastType: "error",
//             title: "Update Order",
//             description: data.message,
//           });
//         }

//         toastNotification({
//           toastType: "success",
//           title: "Update Order",
//           description: data.message,
//         });

//         queryClient.invalidateQueries({
//           queryKey: [...productsQueries.all, "list"],
//         });

//         queryClient.invalidateQueries({
//           queryKey: [...salesQueries.all, "list"],
//         });

//         onClose();
//       },
//     },
//   );
// }

// export function useCheckOutSalesMutation(onClose: () => void) {
//   const queryClient = useQueryClient();

//   return useMutation<
//     ApiResponse,
//     ErrorWithDataResponse,
//     { id: number; name: string }
//   >({
//     mutationFn: (data) => checkoutSalesServerFn({ data }),

//     onError: ({ data }) => {
//       return toastNotification({
//         toastType: "error",
//         title: "Update Order",
//         description: data.message,
//       });
//     },
//     onSuccess: (data) => {
//       if (!data.success) {
//         return toastNotification({
//           toastType: "error",
//           title: "Update Order",
//           description: data.message,
//         });
//       }

//       toastNotification({
//         toastType: "success",
//         title: "Update Order",
//         description: data.message,
//       });

//       queryClient.invalidateQueries({
//         queryKey: [...productsQueries.all, "list"],
//       });

//       queryClient.invalidateQueries({
//         queryKey: [...salesQueries.all, "list"],
//       });

//       onClose();
//     },
//   });
// }

// export function useDeleteSalesMutation(onClose: () => void) {
//   const queryClient = useQueryClient();

//   return useMutation<
//     ApiResponse,
//     ErrorWithDataResponse,
//     { id: number; name: string }
//   >({
//     mutationFn: (data) => deleteSalesServerFn({ data }),

//     onError: ({ data }) => {
//       return toastNotification({
//         toastType: "error",
//         title: "Update Order",
//         description: data.message,
//       });
//     },
//     onSuccess: (data) => {
//       if (!data.success) {
//         return toastNotification({
//           toastType: "error",
//           title: "Update Order",
//           description: data.message,
//         });
//       }

//       toastNotification({
//         toastType: "success",
//         title: "Update Order",
//         description: data.message,
//       });

//       queryClient.invalidateQueries({
//         queryKey: [...productsQueries.all, "list"],
//       });

//       queryClient.invalidateQueries({
//         queryKey: [...salesQueries.all, "list"],
//       });

//       onClose();
//     },
//   });
// }
