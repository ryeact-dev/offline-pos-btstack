import { Button } from "@/components/ui/button";
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { toastNotification } from "./toastTotification";
import type { CartItem, OrderDetails } from "@/utils/types";
import type { UpdateOrderItemValues } from "@/zod/products.validation";
import { computeItemTotal } from "@/helpers/client/compute-item-total";
import { pesoPriceFormat } from "@/helpers/client/price-formats";

interface CartItemProps {
  cart: OrderDetails;
  onUpdateQuantity: (data: UpdateOrderItemValues) => void;
  onClearCartHandler: () => void;
}

export default function CartItems({
  cart,
  onUpdateQuantity,
  onClearCartHandler,
}: CartItemProps) {
  const onMinusClick = (item: CartItem, quantity: number) => {
    // if (item.stockQuantity - quantity < 0) {
    //   toastNotification({
    //     toastType: "warning",
    //     title: "Ordering Item",
    //     description: `Quantity ordered for ${item.name} was exceeded`,
    //   });
    //   return;
    // }

    const { subTotal, tax, totalWithTax } = computeItemTotal(
      Number(item.price),
      quantity,
    );

    const newItemStockQuantity = item.quantity - quantity;

    const total = newItemStockQuantity <= 0 ? 1 : Number(item.total) - subTotal;
    const itemQuantity =
      newItemStockQuantity <= 0 ? 1 : Number(item.quantity) - quantity;

    const orderDetails = {
      id: cart.id,
      subTotal: Number(cart.subTotal) - subTotal,
      tax: Number(cart.tax) - tax,
      totalWithTax: Number(cart.totalWithTax) - totalWithTax,
      action: newItemStockQuantity <= 0 ? "remove" : "update",

      item: {
        ...item,
        price: Number(item.price),
        quantity: itemQuantity,
        total,
        itemStockQuantity: item.stockQuantity + quantity,
      },
    };

    if (newItemStockQuantity <= 0 && cart.items.length === 1) {
      onClearCartHandler();
    } else {
      onUpdateQuantity(orderDetails);
    }
  };

  const onPlusClick = (item: CartItem, quantity: number) => {
    if (item.quantity + quantity > item.stockQuantity) {
      toastNotification({
        toastType: "warning",
        title: "Ordering Item",
        description: `Quantity ordered for ${item.name} was exceeded`,
      });
      return;
    }

    const { subTotal, tax, totalWithTax } = computeItemTotal(
      Number(item.price),
      quantity,
    );

    const orderDetails = {
      id: cart.id,
      subTotal: Number(cart.subTotal) + subTotal,
      tax: Number(cart.tax) + tax,
      totalWithTax: Number(cart.totalWithTax) + totalWithTax,
      action: "update",

      item: {
        ...item,
        price: Number(item.price),
        quantity: Number(item.quantity) + quantity,
        total: Number(item.total) + subTotal,
        itemStockQuantity: item.stockQuantity - quantity,
      },
    };

    onUpdateQuantity(orderDetails);
  };

  const onRemoveItemHandler = (item: CartItem) => {
    if (!item.id) return;

    const { subTotal, tax, totalWithTax } = computeItemTotal(
      Number(item.price),
      item.quantity,
    );

    const orderDetails = {
      id: item.id,
      subTotal: Number(cart.subTotal) - subTotal,
      tax: Number(cart.tax) - tax,
      totalWithTax: Number(cart.totalWithTax) - totalWithTax,
      action: "remove",

      item: {
        ...item,
        price: Number(item.price),
        quantity: item.quantity,
        total: subTotal,
        itemStockQuantity: item.stockQuantity + item.quantity,
      },
    };

    if (cart.items.length === 1) {
      onClearCartHandler();
    } else {
      console.log(orderDetails);
      // onUpdateQuantity(orderDetails);
    }
  };

  return cart.items.map((item) => (
    <div
      key={item.id}
      className="hover:bg-accent-foreground/5 mb-2 flex items-center gap-4 rounded-md border px-4 py-2"
    >
      {/* <div className="h-16 w-16 rounded-md overflow-hidden border">
     <img
       src={item.image}
       alt={item.name}
       className="h-full w-full object-cover"
     />
   </div> */}

      <div className="min-w-0 flex-1">
        <h4 className="mb-1 truncate font-medium">
          {item.name} - <span className="capitalize">{item.unit}</span>{" "}
        </h4>
        <p className="text-muted-foreground -mt-1 mb-1 text-sm">
          {pesoPriceFormat(Number(item.price).toFixed(2))}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => onMinusClick(item, 1)}
          >
            <IconMinus className="h-3 w-3" />
          </Button>
          <span className="w-6 text-center text-sm">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => onPlusClick(item, 1)}
          >
            <IconPlus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="font-medium">
          P{(Number(item.price) * item.quantity).toFixed(2)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive h-6 w-6"
          // TODO: FIX USER NAME
          onClick={() => onRemoveItemHandler(item)}
        >
          <IconTrash className="size-5" />
        </Button>
      </div>
    </div>
  ));
}
