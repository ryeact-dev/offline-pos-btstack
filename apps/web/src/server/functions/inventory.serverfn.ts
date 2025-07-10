import { createServerFn } from '@tanstack/react-start';
import {
  addProductDb,
  getAllProductsDb,
} from '../db-access/inventory.db.access';
import { inventoryItemBaseSchema } from '@/zod/inventory.validation';

export const getAllProductsServerFn = createServerFn({ method: 'GET' })
  //   .middleware([authenticatedMiddleware])
  //   .validator(getAllCompetitionsSchema)
  .handler(async ({ data }) => {
    const res = await getAllProductsDb();
    // Parse the JSON string from server response into an array of objects
    return JSON.parse(res.products || '');
  });

export const addProductServerFn = createServerFn({ method: 'POST' })
  //   .middleware([authenticatedMiddleware])
  .validator(inventoryItemBaseSchema)
  .handler(async ({ data }) => {
    return await addProductDb(data);
  });
