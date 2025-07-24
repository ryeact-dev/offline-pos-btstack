import { createServerFn } from "@tanstack/react-start";
import {
  checkOutCartsDb,
  createCartDb,
  deleteCartItemDb,
  deleteCartListDb,
  getUserOrderListDb,
  updateCartDb,
} from "../db-access/cart.db.access";
import { userBaseSchema } from "@/zod/user.validation";
import {
  addOrderItemSchema,
  checkOutOrderSchema,
  getIncompleteOrderSchema,
  updateOrderItemSchema,
} from "@/zod/products.validation";

// export const getAllSalesServerFn = createServerFn({ method: 'GET' })
//   //   .middleware([authenticatedMiddleware])
//   //   .validator(getAllCompetitionsSchema)
//   .handler(async ({ data }) => {
//     const res = await getAllProductsDb();
//     // Parse the JSON string from server response into an array of objects
//     return JSON.parse(res.products || '');
//   });

export const getUserOrderServerFn = createServerFn({ method: "GET" })
  //   .middleware([authenticatedMiddleware])
  .validator(getIncompleteOrderSchema)
  .handler(async ({ data }) => {
    const res = await getUserOrderListDb(data);

    if (!res.userOrderList) {
      return null;
    }

    // Parse the JSON string from server response into an array of objects
    return JSON.parse(res.userOrderList || "");
  });

export const createCartServerFn = createServerFn({ method: "POST" })
  //   .middleware([authenticatedMiddleware])
  .validator(addOrderItemSchema)
  .handler(async ({ data }) => {
    return await createCartDb(data);
  });

export const updateCartServerFn = createServerFn({ method: "POST" })
  //   .middleware([authenticatedMiddleware])
  .validator(updateOrderItemSchema)
  .handler(async ({ data }) => {
    return await updateCartDb(data);
  });

export const checkoutCartServerFn = createServerFn({ method: "POST" })
  //   .middleware([authenticatedMiddleware])
  .validator(checkOutOrderSchema)
  .handler(async ({ data }) => {
    return await checkOutCartsDb(data);
  });

export const deleteCartItemServerFn = createServerFn({ method: "POST" })
  //   .middleware([authenticatedMiddleware])
  .validator(updateOrderItemSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    return await deleteCartItemDb(data.id, "Admin");
  });

export const deleteCartSListerverFn = createServerFn({ method: "POST" })
  //   .middleware([authenticatedMiddleware])
  .validator(updateOrderItemSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    return await deleteCartListDb(data.id, "Admin");
  });
