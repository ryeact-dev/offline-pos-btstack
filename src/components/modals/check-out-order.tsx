import type { OrderDetails } from "@/utils/types";
import ModalFooterButtons from "../modal-footer-buttons";
import { Separator } from "../ui/separator";
import { pesoPriceFormat } from "@/helpers/client/price-formats";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  checkOutOrderSchema,
  type CheckOutOrderValues,
} from "@/zod/products.validation";
import { useCheckOutSalesMutation } from "@/hooks/cart.hooks";
// import { useCheckOutSalesMutation } from "@/hooks/cart.hooks";

const DEFAULT_FORM_VALUES = {
  id: 0,
  customerName: "",
  userName: "",
};

export default function CheckOutOrder({
  data: item,
  onClose,
}: {
  data: OrderDetails;
  onClose: () => void;
}) {
  const form = useForm<CheckOutOrderValues>({
    resolver: zodResolver(checkOutOrderSchema),
    defaultValues: item ? item : DEFAULT_FORM_VALUES,
  });

  const { mutate: checkOutMutate, isPending } =
    useCheckOutSalesMutation(onClose);

  const onSubmit = (values: CheckOutOrderValues) => {
    console.log(values);
    checkOutMutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        // className='h-[98%] flex flex-col justify-between'
        className="space-y-6"
      >
        <div className="space-y-4">
          <div>
            <h2 className="mb-1 text-xl font-medium">
              {/* Check out {itemCount} items? */}
            </h2>
            {/* <Separator className="my-3" /> */}
            <p>Subtotal: {pesoPriceFormat(item.subTotal.toString())}</p>
            <p>Tax: {pesoPriceFormat(Number(item.tax).toFixed(2))}</p>
            <Separator className="my-3" />
            <p className="text-lg font-semibold tracking-wider">
              Total: {pesoPriceFormat(item.totalWithTax.toString())}
            </p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input placeholder="Product Name" {...field} />
              </FormControl>
              {/* <FormDescription>{null}</FormDescription> */}
              <div className="h-6">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <ModalFooterButtons isLoading={isPending} />
      </form>
    </Form>
  );
}
