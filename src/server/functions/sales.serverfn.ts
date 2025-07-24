import { createServerFn } from "@tanstack/react-start";

import { userBaseSchema } from "@/zod/user.validation";
import {
  addOrderItemSchema,
  getIncompleteOrderSchema,
  updateOrderItemSchema,
} from "@/zod/products.validation";
import { getAllSalesDb } from "../db-access/sales.db.access";

export const getAllSalesServerFn = createServerFn({ method: "GET" })
  //   .middleware([authenticatedMiddleware])
  //   .validator(getAllCompetitionsSchema)
  .handler(async ({ data }) => {
    const res = await getAllSalesDb();
    // Parse the JSON string from server response into an array of objects
    return JSON.parse(res.sales || "");
  });

// export const getUserOrderServerFn = createServerFn({ method: "GET" })
//   //   .middleware([authenticatedMiddleware])
//   .validator(getIncompleteOrderSchema)
//   .handler(async ({ data }) => {
//     const res = await getUserOrderListDb(data);

//     if (!res.userOrderList) {
//       return null;
//     }

//     // Parse the JSON string from server response into an array of objects
//     return JSON.parse(res.userOrderList || "");
//   });

// export const addSalesServerFn = createServerFn({ method: "POST" })
//   //   .middleware([authenticatedMiddleware])
//   .validator(addOrderItemSchema)
//   .handler(async ({ data }) => {
//     return await addSalesDb(data);
//   });

// export const updateSalesServerFn = createServerFn({ method: "POST" })
//   //   .middleware([authenticatedMiddleware])
//   .validator(updateOrderItemSchema)
//   .handler(async ({ data }) => {
//     return await updateSalesDb(data);
//   });

// export const checkoutSalesServerFn = createServerFn({ method: "POST" })
//   //   .middleware([authenticatedMiddleware])
//   .validator(updateOrderItemSchema.pick({ id: true }))
//   .handler(async ({ data }) => {
//     return await checkOutSalesDb(data.id, "Admin");
//   });

// export const deleteSalesServerFn = createServerFn({ method: "POST" })
//   //   .middleware([authenticatedMiddleware])
//   .validator(updateOrderItemSchema.pick({ id: true }))
//   .handler(async ({ data }) => {
//     return await deleteSalesDb(data.id, "Admin");
//   });
