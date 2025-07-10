import * as z from 'zod';

export const userBaseSchema = z.object({
  fullName: z.string().min(6, 'Full Name is required'),
  username: z.string().min(6, 'Username must be at least 6 characters'),
  role: z.string().default('staff'),
});

export type UserFormValues = z.infer<typeof userBaseSchema>;

export const productBaseSchema = z.object({
  name: z.string().min(6, 'Name is required'),
  price: z.number().min(1, 'Price is required'),
  description: z.string().min(6, 'Description is required'),
  category: z.string().min(6, 'Category is required'),
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

export type ProductFormValues = z.infer<typeof productBaseSchema>;
