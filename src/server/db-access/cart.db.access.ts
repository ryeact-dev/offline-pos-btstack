import { replacer } from "@/helpers/server/value-replacer";
import prisma from "@/lib/prisma";
import { TEMP_USER_ID } from "@/utils/global-constant";
import type {
  AddOrderItemValues,
  GetIncompleteOrderValues,
  UpdateOrderItemValues,
} from "@/zod/products.validation";

export async function getAllSalesDb() {
  try {
    const sales = await prisma.sales.findMany();

    return {
      success: false,
      message: "Fetching sales failed",
      sales,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Fetching sales failed",
      sales: null,
    };
  }
}

export async function getUserOrderListDb(data: GetIncompleteOrderValues) {
  try {
    const userOrderList = await prisma.sales.findFirst({
      where: {
        AND: [{ userId: data.id }, { status: data.status }],
      },
      include: {
        SoldItems: {
          include: {
            product: {
              select: {
                stockQuantity: true,
                name: true,
                unit: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!userOrderList) {
      return {
        success: false,
        message: "Fetching sales",
        userOrderList: null,
      };
    }

    const { SoldItems, ...rest } = userOrderList;
    const cartList = {
      ...rest,
      items:
        SoldItems.map((item) => {
          const { product, ...rest } = item;
          return {
            ...rest,
            stockQuantity: product.stockQuantity,
            name: product.name,
            unit: product.unit,
          };
        }) || [],
    };

    const json = JSON.stringify(cartList, replacer);

    return {
      success: false,
      message: "Fetching sales",
      userOrderList: json,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Fetching sales failed",
      userOrderList: null,
    };
  }
}

export async function createCartDb(data: Omit<AddOrderItemValues, "id">) {
  try {
    await prisma.$transaction(async (tx) => {
      const salesOrder = await tx.sales.create({
        data: {
          tax: data.tax,
          subTotal: data.subTotal,
          totalWithTax: data.totalWithTax,
          userId: TEMP_USER_ID,
        },
      });

      await tx.soldItems.create({
        data: {
          quantity: data.item.quantity,
          price: data.item.price,
          productId: data.item.productId,
          total: data.item.total,
          saleId: salesOrder.id,
        },
      });

      await tx.products.update({
        where: {
          id: data.item.productId,
        },
        data: {
          stockQuantity: data.item.itemStockQuantity,
        },
      });
    });

    return {
      success: true,
      message: "Sales added successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Adding sales failed",
    };
  }
}

export async function updateCartDb(data: UpdateOrderItemValues) {
  try {
    await prisma.$transaction(async (tx) => {
      const salesOrder = await tx.sales.update({
        where: {
          id: data.id,
        },
        data: {
          tax: data.tax,
          subTotal: data.subTotal,
          totalWithTax: data.totalWithTax,
        },
        include: {
          SoldItems: true,
        },
      });

      if (data.action === "remove") {
        await tx.soldItems.delete({
          where: {
            id: data.item.id,
          },
        });
      } else {
        const itemToUpdate = salesOrder.SoldItems.find(
          (item) => item.productId === data.item.productId,
        );

        if (!itemToUpdate) {
          // If Item not found in the cart, create a new item
          await tx.soldItems.create({
            data: {
              quantity: data.item.quantity,
              price: data.item.price,
              total: data.item.total,
              productId: data.item.productId,
              saleId: salesOrder.id,
            },
          });
        } else {
          await tx.soldItems.update({
            where: {
              id: itemToUpdate.id,
            },
            data: {
              ...itemToUpdate,
              quantity: data.item.quantity,
              price: data.item.price,
              total: data.item.total,
            },
          });
        }
      }

      await tx.products.update({
        where: {
          id: data.item.productId,
        },
        data: {
          stockQuantity: data.item.itemStockQuantity,
        },
      });
    });

    return {
      success: true,
      message: "Sales updated successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Updating sales failed",
    };
  }
}

export async function checkOutCartsDb(id: number, name: string) {
  try {
    await prisma.sales.update({
      where: {
        id,
      },
      data: {
        status: "completed",
      },
    });

    return {
      success: true,
      message: `Order checked out successfully by ${name}`,
    };
  } catch (err) {
    console.log(err);

    return {
      success: false,
      message: "Checkout order failed",
    };
  }
}

export async function deleteCartItemDb(id: number, name: string) {
  try {
    await prisma.soldItems.delete({
      where: {
        id,
      },
    });

    console.log(`Cart item removed successfully by ${name}`);

    return {
      success: true,
      message: `Cart item removed successfully by ${name}`,
    };
  } catch (err) {
    console.log(err);

    return {
      success: false,
      message: "Cart item remove failed",
    };
  }
}

export async function deleteCartListDb(id: number, name: string) {
  try {
    const cartItems = await prisma.soldItems.findMany({
      where: {
        saleId: id,
      },
      include: {
        product: {
          select: {
            stockQuantity: true,
          },
        },
      },
    });

    const newCartItems = cartItems.map((item) => {
      return {
        ...item,
        stockQuantity: item.product.stockQuantity,
      };
    });

    if (cartItems.length > 0) {
      await Promise.all(
        newCartItems.map((item) =>
          prisma.products.update({
            where: {
              id: item.productId,
            },
            data: {
              stockQuantity: item.stockQuantity + item.quantity,
            },
          }),
        ),
      );
    }

    const deletedSales = await prisma.sales.delete({
      where: {
        id,
      },
    });

    console.log(
      `Cart list with status ${deletedSales.status} deleted successfully by ${name}`,
    );

    return {
      success: true,
      message: `Cart list with status ${deletedSales.status} deleted successfully by ${name}`,
    };
  } catch (err) {
    console.log(err);

    return {
      success: false,
      message: "Cart list delete failed",
    };
  }
}
