import z from 'zod';

const dashboardTableSchema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
  // text: z.string(),
});

export type DashboardTable = z.infer<typeof dashboardTableSchema>;

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

export type InventoryTable = z.infer<typeof inventoryTableSchema>;
