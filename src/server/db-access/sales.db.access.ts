// import { replacer } from "@/helpers/server/value-replacer";
// import prisma from "@/lib/prisma";
// import { TEMP_USER_ID } from "@/utils/global-constant";
// import type {
//   AddOrderItemValues,
//   GetIncompleteOrderValues,
//   UpdateOrderItemValues,
// } from "@/zod/products.validation";

// export async function getAllSalesDb() {
//   try {
//     const sales = await prisma.sales.findMany();

//     return {
//       success: false,
//       message: "Fetching sales failed",
//       sales,
//     };
//   } catch (err) {
//     return {
//       success: false,
//       message: "Fetching sales failed",
//       sales: null,
//     };
//   }
// }

// export async function getUserOrderListDb(data: GetIncompleteOrderValues) {
//   try {
//     const userOrderList = await prisma.sales.findFirst({
//       where: {
//         AND: [{ userId: data.id }, { status: data.status }],
//       },
//       include: {
//         SoldItems: {
//           include: {
//             product: {
//               select: {
//                 stockQuantity: true,
//                 name: true,
//                 unit: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!userOrderList) {
//       return {
//         success: false,
//         message: "Fetching sales",
//         userOrderList: null,
//       };
//     }

//     const itemMap =
//       userOrderList?.SoldItems.map((item) => {
//         return {
//           ...item,
//           stockQuantity: item.product.stockQuantity,
//           name: item.product.name,
//           unit: item.product.unit,
//         };
//       }) || [];

//     userOrderList.SoldItems = itemMap;

//     const json = JSON.stringify(userOrderList, replacer);

//     return {
//       success: false,
//       message: "Fetching sales",
//       userOrderList: json,
//     };
//   } catch (err) {
//     return {
//       success: false,
//       message: "Fetching sales failed",
//       userOrderList: null,
//     };
//   }
// }

// export async function addSalesDb(data: Omit<AddOrderItemValues, "id">) {
//   try {
//     await prisma.$transaction(async (tx) => {
//       const salesOrder = await tx.sales.create({
//         data: {
//           tax: data.tax,
//           subTotal: data.subTotal,
//           totalWithTax: data.totalWithTax,
//           userId: TEMP_USER_ID,
//         },
//       });

//       await tx.soldItems.create({
//         data: {
//           quantity: data.item.quantity,
//           price: data.item.price,
//           productId: data.item.productId,
//           total: data.item.total,
//           saleId: salesOrder.id,
//         },
//       });
//     });

//     return {
//       success: true,
//       message: "Sales added successfully",
//     };
//   } catch (err) {
//     return {
//       success: false,
//       message: "Adding sales failed",
//     };
//   }
// }

// export async function updateSalesDb(data: UpdateOrderItemValues) {
//   try {
//     await prisma.$transaction(async (tx) => {
//       const salesOrder = await tx.sales.update({
//         where: {
//           id: data.id,
//         },
//         data: {
//           tax: data.tax,
//           subTotal: data.subTotal,
//           totalWithTax: data.totalWithTax,
//           userId: TEMP_USER_ID,
//         },
//         include: {
//           SoldItems: true,
//         },
//       });

//       const itemToUpdate = salesOrder.SoldItems.find(
//         (item) => item.id === data.item.id,
//       );

//       if (!itemToUpdate) {
//         await tx.soldItems.create({
//           data: {
//             quantity: data.item.quantity,
//             price: data.item.price,
//             total: data.item.total,
//             productId: data.item.productId,
//             saleId: salesOrder.id,
//           },
//         });
//       } else {
//         await tx.soldItems.update({
//           where: {
//             id: itemToUpdate.id,
//           },
//           data: {
//             quantity: itemToUpdate.quantity + data.item.quantity,
//             price: itemToUpdate.quantity + data.item.price,
//             total: Number(itemToUpdate.total) + data.item.total,
//           },
//         });
//       }
//     });

//     return {
//       success: true,
//       message: "Sales updated successfully",
//     };
//   } catch (err) {
//     return {
//       success: false,
//       message: "Updating sales failed",
//     };
//   }
// }

// export async function checkOutSalesDb(id: number, name: string) {
//   try {
//     await prisma.sales.update({
//       where: {
//         id,
//       },
//       data: {
//         status: "completed",
//       },
//     });

//     return {
//       success: true,
//       message: `Order checked out successfully by ${name}`,
//     };
//   } catch (err) {
//     return {
//       success: false,
//       message: "Checkout order failed",
//     };
//   }
// }

// export async function deleteSalesDb(id: number, name: string) {
//   try {
//     const deletedSales = await prisma.sales.delete({
//       where: {
//         id,
//       },
//     });

//     return {
//       success: true,
//       message: `Sales with status ${deletedSales.status} deleted successfully by ${name}`,
//     };
//   } catch (err) {
//     return {
//       success: false,
//       message: "Delete sales failed",
//     };
//   }
// }
