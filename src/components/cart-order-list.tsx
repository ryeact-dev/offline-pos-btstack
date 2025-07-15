import { useCallback } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  IconCreditCard,
  IconShoppingCart,
  IconTrash,
} from "@tabler/icons-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useDialogStore } from "@/store/dialog-store";
import Loader from "./loader";
import type { OrderDetails } from "@/utils/types";
import CartItems from "./cart-items";
import {
  useDeleteCartItemMutation,
  useUpdateCartMutation,
} from "@/hooks/cart.hooks";

export default function CartOrderList({
  cart,
  isLoadingOrderList,
}: {
  cart: OrderDetails | undefined;
  isLoadingOrderList: boolean;
}) {
  const openModal = useDialogStore((s) => s.openModal);

  // Mutations
  const { mutate: updateCartMutate } = useUpdateCartMutation();
  const { mutate: deleteCartItemMutate } = useDeleteCartItemMutation();

  const onCheckoutHandler = useCallback(() => {
    // setShowCheckoutDialog(false);
    // const orderDetails = {
    //   items: cart.map((item) => ({
    //     id: item.id,
    //     price: Number(item.price),
    //     quantity: Number(item.orderQuantity),
    //     total: Number(item.price) * Number(item.orderQuantity),
    //   })),
    //   subtotal: Number(cartTotal),
    //   tax: Number(cartTax),
    //   totalWithTax: Number(cartTotalWithTax),
    // };
    // openModal({
    //   data: {
    //     type: "checkout-order",
    //     data: orderDetails,
    //   },
    //   isModalOpen: true,
    //   title: "Confirmation",
    // });
  }, [cart]);

  const onClearCartHandler = useCallback(() => {
    if (!cart) return;

    openModal({
      data: {
        type: "clear-cart",
        data: { id: cart.id, name: "Admin" },
      },
      isModalOpen: true,
      title: "Add Order",
    });
  }, [cart]);

  const itemCount = useCallback(() => {
    const items = cart?.items;
    return !items ? 0 : items.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // const cart = [];

  return (
    <Card className="sticky top-20 flex h-full flex-col justify-between">
      <div className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <IconShoppingCart className="h-5 w-5" />
            Order List
            <span className="text-muted-foreground ml-1 text-sm">
              ({itemCount()} {itemCount() === 1 ? "item" : "items"})
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="-mt-2">
          {isLoadingOrderList ? (
            <div className="-mr-2 flex h-full max-h-[600px] min-h-[600px] items-center justify-center pr-2">
              <Loader />
            </div>
          ) : (
            <>
              {cart && cart.items.length > 0 ? (
                <>
                  <div className="-mr-2 h-full max-h-[600px] min-h-[600px] overflow-auto pr-2">
                    <div className="">
                      <CartItems
                        cart={cart}
                        onUpdateQuantity={updateCartMutate}
                        onClearCartHandler={onClearCartHandler}
                      />
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span>P{Number(cart.subTotal).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tax (10%)</span>
                      <span>P{Number(cart.tax).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-medium">
                      <span>Total</span>
                      <span>P{Number(cart.totalWithTax).toFixed(2)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full max-h-[725px] min-h-[725px] flex-col items-center justify-center py-8 text-center">
                  <IconShoppingCart className="text-muted-foreground mb-4 h-12 w-12" />
                  <h3 className="mb-1 text-lg font-medium">
                    Your order list is empty
                  </h3>
                  <p className="text-muted-foreground mb-8 text-center">
                    Add some products to your order list to continue with your
                    purchase
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </div>
      <CardFooter className="flex flex-col gap-3 pt-0">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onClearCartHandler}
            disabled={!cart}
          >
            <IconTrash className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={onCheckoutHandler}
            disabled={!cart}
          >
            <IconCreditCard className="mr-2 h-4 w-4" />
            Checkout
          </Button>
        </div>
        {/* <Button
          variant='secondary'
          size='sm'
          className='w-full bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-200'
          onClick={handlePrintReceipt}
          disabled={!isOrderCheckedOut}
          >
          <IconPrinter className='h-4 w-4 mr-2' />
          Print Receipt
        </Button> */}
      </CardFooter>
    </Card>
  );
}
