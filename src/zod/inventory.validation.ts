import * as z from "zod";

export const inventoryItemBaseSchema = z.object({
  id: z.number(),
  name: z.string().min(6, "Name is required"),
  price: z.number().min(1, "Price is required"),
  description: z.string().optional(),
  unit: z.string().min(2, "Unit is required"),
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

export type InventoryItemFormValues = z.infer<typeof inventoryItemBaseSchema>;
