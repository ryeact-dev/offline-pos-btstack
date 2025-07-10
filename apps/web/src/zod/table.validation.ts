import * as z from 'zod';

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
