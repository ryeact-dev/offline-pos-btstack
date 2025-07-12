import * as z from 'zod';

export const userBaseSchema = z.object({
  fullName: z.string().min(6, 'Full Name is required'),
  username: z.string().min(6, 'Username must be at least 6 characters'),
  role: z.string().default('staff'),
});

export type UserFormValues = z.infer<typeof userBaseSchema>;
