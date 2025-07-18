// * This drawer is used to add a new product to the inventory

import DrawerFooterButtons from "@/components/drawer-footer-buttons";
import FormErrorComponent from "@/components/form-error-component";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "@/hooks/inventory.hook";
import { cn } from "@/lib/utils";
import { PRODUCT_UNIT } from "@/utils/global-constant";
import {
  inventoryItemBaseSchema,
  type InventoryItemFormValues,
} from "@/zod/inventory.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalendar } from "@tabler/icons-react";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";

const DEFAULT_FORM_VALUES = {
  id: 0,
  name: "",
  price: 0,
  description: "",
  unit: "",
  stockQuantity: 0,
  image64Base: "",
  sku: "",
  barcode: "",
  expirationDate: new Date(),
  deliveryDate: new Date(),
};

export default function AddProductDrawer({
  data,
  onClose,
}: {
  data: InventoryItemFormValues | null;
  onClose: () => void;
}) {
  const form = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemBaseSchema),
    defaultValues: data
      ? {
          ...data,
          expirationDate: new Date(data.expirationDate),
          deliveryDate: new Date(data.deliveryDate),
          stockQuantity: Number(data.stockQuantity),
          price: Number(data.price),
        }
      : DEFAULT_FORM_VALUES,
  });

  const onResetFormInputs = () => {
    form.reset(DEFAULT_FORM_VALUES);
  };

  const { mutate: addProductMutate, isPending: isAddingProduct } =
    useAddProductMutation(onResetFormInputs, onClose);

  const { mutate: updateProductMutate, isPending: isUpdatingProduct } =
    useUpdateProductMutation(onResetFormInputs, onClose);

  const onSubmit = (values: InventoryItemFormValues) => {
    if (data) {
      updateProductMutate(values);
    } else {
      addProductMutate(values);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        // className='h-[98%] flex flex-col justify-between'
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
                  </FormControl>
                  {/* <FormDescription>{null}</FormDescription> */}
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => {
                const { onChange, ...rest } = field;

                const onInputChangeHandler = (
                  e: React.ChangeEvent<HTMLInputElement>,
                ) => {
                  const value = Number(e.target.value);
                  onChange(value);
                };

                return (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        onChange={onInputChangeHandler}
                        placeholder="Price"
                        {...rest}
                        type="number"
                      />
                    </FormControl>
                    {/* <FormDescription>{null}</FormDescription> */}
                    {/* <FormMessage /> */}
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="mb-2 grid grid-cols-4 gap-3">
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel className="my-1">Unit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    // defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRODUCT_UNIT.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription />
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stockQuantity"
              render={({ field }) => {
                const { onChange, ...rest } = field;

                const onInputChangeHandler = (
                  e: React.ChangeEvent<HTMLInputElement>,
                ) => {
                  const value = Number(e.target.value);
                  onChange(value);
                };

                return (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        onChange={onInputChangeHandler}
                        placeholder="Quantity"
                        {...rest}
                        type="number"
                      />
                    </FormControl>
                    {/* <FormDescription>{null}</FormDescription> */}
                    {/* <FormMessage /> */}
                  </FormItem>
                );
              }}
            />
          </div>

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="SKU" {...field} />
                </FormControl>
                {/* <FormDescription>{null}</FormDescription> */}
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barcode</FormLabel>
                <FormControl>
                  <Input placeholder="Barcode" {...field} />
                </FormControl>
                {/* <FormDescription>{null}</FormDescription> */}
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />

          <div className="flex w-full items-center gap-2">
            <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => {
                const [open, setOpen] = useState(false);
                return (
                  <FormItem className="flex flex-1 flex-col">
                    <FormLabel>Expiration Date</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpen(false);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription />

                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="deliveryDate"
              render={({ field }) => {
                const [open, setOpen] = useState(false);
                return (
                  <FormItem className="flex flex-1 flex-col">
                    <FormLabel>Delivery Date</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[160px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpen(false);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
        </div>
        <FormErrorComponent errors={form.formState.errors} />
        {/* <Button type='submit'>Submit</Button> */}
        <DrawerFooterButtons isLoading={isAddingProduct || isUpdatingProduct} />
      </form>
    </Form>
  );
}
