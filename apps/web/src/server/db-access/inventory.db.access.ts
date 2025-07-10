import { replacer } from '@/helpers/server/value-replacer';
import prisma from '@/lib/prisma';
import type { InventoryItemFormValues } from '@/zod/inventory.validation';

const TEMP_USER_ID = '75a7fd35-2358-4b09-a983-06b7d2b557fa';

export async function getAllProductsDb() {
  try {
    const products = await prisma.products.findMany({
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });

    const json = JSON.stringify(products, replacer);

    return {
      success: true,
      message: 'Products successfully fetched',
      products: json,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: 'Error fetching products',
      products: null,
    };
  }
}

export async function addProductDb(product: InventoryItemFormValues) {
  try {
    const productWithSameDeliverDate = await prisma.products.findMany({
      where: {
        AND: [{ deliveryDate: product.deliveryDate, name: product.name }],
      },
    });

    if (productWithSameDeliverDate.length > 0) {
      return {
        success: false,
        message: `Product ${product.name} and deilivery date already exists`,
      };
    }

    const { id, ...productWithoutId } = product;
    await prisma.products.create({
      data: {
        ...productWithoutId,
        userId: TEMP_USER_ID,
      },
    });

    return {
      success: true,
      message: 'Product successfully added',
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: 'Error adding product',
    };
  }
}
