import * as z from 'zod';

export const inventoryItemBaseSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(6, 'Name is required'),
  price: z.number().min(1, 'Price is required'),
  description: z.string().optional(),
  category: z.string().min(2, 'Category is required'),
  stockQuantity: z.number().min(1, 'Stock Quantity is required'),
  image64Base: z.string().base64('Image64 Base is required').optional(),
  sku: z.string().min(5, 'SKU is required'),
  barcode: z.string().min(6, 'Barcode is required'),
  expirationDate: z
    .date()
    .min(new Date('2024-01-01'), 'Expiration Date is required'),
  deliveryDate: z
    .date()
    .min(new Date('2024-01-01'), 'Delivery Date is required'),
});

const inventoryTableSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  stockQuantity: z.string(),
  image64Base: z.string(),
  sku: z.string(),
  barcode: z.string(),
  expirationDate: z.string(),
  deliveryDate: z.string(),
});

export type InventoryItemFormValues = z.infer<typeof inventoryItemBaseSchema>;
export type InventoryTableValues = z.infer<typeof inventoryTableSchema>;
