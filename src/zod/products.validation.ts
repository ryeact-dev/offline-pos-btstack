import * as z from "zod";

export const productBaseSchema = z.object({
  name: z.string().min(6, "Name is required"),
  price: z.number().min(1, "Price is required"),
  description: z.string().optional(),
  category: z.string().min(2, "Category is required"),
  stockQuantity: z.number().min(1, "Stock Quantity is required"),
  image64Base: z.string().base64("Image64 Base is required").optional(),
  sku: z.string().min(5, "SKU is required"),
  barcode: z.string().min(6, "Barcode is required"),
  expirationDate: z
    .date()
    .min(new Date("2024-01-01"), "Expiration Date is required"),
  deliveryDate: z
    .date()
    .min(new Date("2024-01-01"), "Delivery Date is required"),
});

export type ProductFormValues = z.infer<typeof productBaseSchema>;

const orderItemBaseSchema = z.object({
  id: z.number().nonnegative("Sold Item ID is required"),
  productId: z.number().min(1, "Product ID is required"),
  price: z.number().min(1, "Price is required"),
  quantity: z.number().nonnegative("Quantity is required"),
  itemStockQuantity: z.number().nonnegative("Item Stock Quantity is required"),
  total: z.number().min(1, "Quantity is required"),
});

const addOrderItemBaseSchema = z.object({
  subTotal: z.number().nonnegative("Subtotal is required"),
  tax: z.number().positive("Tax is must be above 0"),
  totalWithTax: z.number().positive("Total with tax is must be above 0"),
});

export const addOrderItemSchema = addOrderItemBaseSchema.extend({
  item: orderItemBaseSchema.omit({ id: true }),
});

export const updateOrderItemSchema = addOrderItemBaseSchema.extend({
  id: z.number().positive("Cart Id is required"),
  action: z.string().min(1, "Action is required"),
  item: orderItemBaseSchema,
});

export const getIncompleteOrderSchema = z.object({
  id: z.string().min(1, "ID is required"),
  status: z.string().min(1, "Status is required"),
});

export type AddOrderItemValues = z.infer<typeof addOrderItemSchema>;
export type UpdateOrderItemValues = z.infer<typeof updateOrderItemSchema>;
export type GetIncompleteOrderValues = z.infer<typeof getIncompleteOrderSchema>;
