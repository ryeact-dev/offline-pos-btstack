import { useCallback, useState } from "react";
import { toastNotification } from "./toastTotification";
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
import CartItem from "./cart-item";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";

export default function CartOrderList() {
  const [isOrderCheckedOut, setIsOrderCheckedOut] = useState(false);

  // Cart Getters
  const cart = useCartStore((state) => state.cartItems);
  const cartTotal = useCartStore((state) => state.cartTotal());
  const cartTax = useCartStore((state) => state.cartTax());
  const cartTotalWithTax = useCartStore((state) => state.cartTotalWithTax());
  const itemCount = useCartStore((state) => state.itemCount());

  // Cart Mutations
  // TODO: BEFORE UPDATING IT SHOULD CHECK FIRST IF THE QUANTITY IS MORE THAN THE ITEM QUANTITY
  const updateQuantity = useCartStore((state) => state.updateCartItem);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleCheckout = useCallback(() => {
    // setShowCheckoutDialog(false);

    const orderDetails = {
      items: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.stockQuantity,
      })),
      subtotal: cartTotal,
      tax: cartTax,
      total: cartTotalWithTax,
      date: new Date().toLocaleString(),
    };

    // setLastOrderDetails(orderDetails);
    setIsOrderCheckedOut(true);

    toastNotification({
      title: "Order placed successfully!",
      description: `Total amount: $${cartTotalWithTax.toFixed(2)}`,
    });
  }, [cart, cartTotal, cartTax, cartTotalWithTax]);

  const handleClearCart = useCallback(() => {
    clearCart();
    setIsOrderCheckedOut(false);
    // setLastOrderDetails(null);
  }, []);

  // const cart = [];

  return (
    <Card className="sticky top-20 flex h-full flex-col justify-between">
      <div className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <IconShoppingCart className="h-5 w-5" />
            Order List
            <span className="text-muted-foreground ml-1 text-sm">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="-mt-2">
          {cart.length > 0 ? (
            <>
              <div className="-mr-2 h-full max-h-[600px] min-h-[600px] overflow-auto pr-2">
                <div className="">
                  {cart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemoveItem={removeFromCart}
                    />
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>P{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax (10%)</span>
                  <span>P{cartTax.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>P{cartTotalWithTax.toFixed(2)}</span>
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
        </CardContent>
      </div>
      <CardFooter className="flex flex-col gap-3 pt-0">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleClearCart}
            disabled={isOrderCheckedOut || cart.length === 0}
          >
            <IconTrash className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Button
            size="sm"
            className="flex-1"
            // onClick={handleCheckout}
            disabled={isOrderCheckedOut || cart.length === 0}
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
