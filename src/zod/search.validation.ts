import * as z from 'zod';

export const searchBaseSchema = z.object({
  page: z.number().catch(1),
  limit: z.number().catch(10),
  filter: z.string().catch(''),
});
