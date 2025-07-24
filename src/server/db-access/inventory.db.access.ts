import { replacer } from "@/helpers/server/value-replacer";
import prisma from "@/lib/prisma";
import { TEMP_USER_ID } from "@/utils/global-constant";
import type { InventoryItemFormValues } from "@/zod/inventory.validation";

export async function getAllProductsDb() {
  try {
    const products = await prisma.products.findMany({
      orderBy: [{ name: "asc" }, { deliveryDate: "asc" }],
    });

    const json = JSON.stringify(products, replacer);

    return {
      success: true,
      message: "Products successfully fetched",
      products: json,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Error fetching products",
      products: null,
    };
  }
}

export async function addProductDb(
  product: Omit<InventoryItemFormValues, "id">,
) {
  try {
    const productWithSameDeliverDate = await prisma.products.findFirst({
      where: {
        AND: [{ deliveryDate: product.deliveryDate, name: product.name }],
      },
    });

    if (productWithSameDeliverDate) {
      return {
        success: false,
        message: `Product ${product.name} and delivery date already exists`,
      };
    }

    await prisma.products.create({
      data: {
        ...product,
        userId: TEMP_USER_ID,
      },
    });

    return {
      success: true,
      message: "Product successfully added",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Error adding product",
    };
  }
}

export async function updateProductDb(product: InventoryItemFormValues) {
  try {
    const productWithSameDeliverDatePromise = await prisma.products.findFirst({
      where: {
        AND: [
          { deliveryDate: product.deliveryDate, name: product.name.trim() },
        ],
      },
    });

    const searchProductUsingIdPromise = prisma.products.findFirst({
      where: {
        id: product.id,
      },
      omit: {
        id: true,
      },
    });

    const [productWithSameDeliverDate, foundProductById] = await Promise.all([
      productWithSameDeliverDatePromise,
      searchProductUsingIdPromise,
    ]);

    if (
      productWithSameDeliverDate &&
      productWithSameDeliverDate.id !== product.id
    ) {
      return {
        success: false,
        message: `Product ${product.name} and delivery date already exists`,
      };
    }

    // Create a copy of the old product in the product history table
    const productHistoryPromise = prisma.productHistory.create({
      data: {
        ...foundProductById,
        userId: TEMP_USER_ID,
        productId: product.id,
      },
    });

    // Update with new product data
    const productUpdatePromise = prisma.products.update({
      where: {
        id: product.id,
      },
      data: {
        ...product,
        userId: TEMP_USER_ID,
      },
    });

    await prisma.$transaction([productHistoryPromise, productUpdatePromise]);

    return {
      success: true,
      message: "Product successfully updated",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Error updating product",
    };
  }
}

export async function deleteProductDb(productId: number) {
  try {
    const deletedProduct = await prisma.products.delete({
      where: {
        id: productId,
      },
    });

    return {
      success: true,
      message: `Product ${deletedProduct.name} deleted successfully`,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Error deleting product",
    };
  }
}
