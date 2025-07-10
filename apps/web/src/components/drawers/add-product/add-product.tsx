// * This drawer is used to add a new product to the inventory

import DrawerFooterButtons from '@/components/draw-footer-buttons';
import FormErrorComponent from '@/components/form-error-component';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { PRODUCT_CATEGORY } from '@/utils/global-constant';
import {
  productBaseSchema,
  type ProductFormValues,
} from '@/zod/form.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconCalendar } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const DEFAULT_FORM_VALUES = {
  name: '',
  price: 0,
  description: '',
  category: '',
  stockQuantity: 0,
  image64Base: '',
  sku: '',
  barcode: '',
  expirationDate: new Date(),
  deliveryDate: new Date(),
};

export default function AddProductDrawer({
  data,
}: {
  data: ProductFormValues | null;
}) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productBaseSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const onResetFormInputs = () => {
    form.reset(DEFAULT_FORM_VALUES);
  };

  const onSubmit = (values: ProductFormValues) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    // onResetFormInputs();
  };

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        // className='h-[98%] flex flex-col justify-between'
        className='space-y-6'
      >
        <div className='space-y-4'>
          <div className='grid grid-cols-4 gap-3'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='col-span-3'>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Product Name' {...field} />
                  </FormControl>
                  {/* <FormDescription>{null}</FormDescription> */}
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => {
                const { onChange, ...rest } = field;

                const onInputChangeHandler = (
                  e: React.ChangeEvent<HTMLInputElement>
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
                        placeholder='Price'
                        {...rest}
                        type='number'
                      />
                    </FormControl>
                    {/* <FormDescription>{null}</FormDescription> */}
                    {/* <FormMessage /> */}
                  </FormItem>
                );
              }}
            />
          </div>

          <div className='grid grid-cols-4 gap-3 mb-2'>
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem className='col-span-3'>
                  <FormLabel className='my-1'>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    // defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRODUCT_CATEGORY.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
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
              name='stockQuantity'
              render={({ field }) => {
                const { onChange, ...rest } = field;

                const onInputChangeHandler = (
                  e: React.ChangeEvent<HTMLInputElement>
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
                        placeholder='Quantity'
                        {...rest}
                        type='number'
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
            name='sku'
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder='SKU' {...field} />
                </FormControl>
                {/* <FormDescription>{null}</FormDescription> */}
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='barcode'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barcode</FormLabel>
                <FormControl>
                  <Input placeholder='Barcode' {...field} />
                </FormControl>
                {/* <FormDescription>{null}</FormDescription> */}
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />

          <div className='flex gap-2 items-center w-full'>
            <FormField
              control={form.control}
              name='expirationDate'
              render={({ field }) => {
                const [open, setOpen] = useState(false);
                return (
                  <FormItem className='flex-1 flex flex-col'>
                    <FormLabel>Expiration Date</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <IconCalendar className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpen(false);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          captionLayout='dropdown'
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
              name='deliveryDate'
              render={({ field }) => {
                const [open, setOpen] = useState(false);
                return (
                  <FormItem className='flex-1 flex flex-col'>
                    <FormLabel>Delivery Date</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[160px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <IconCalendar className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpen(false);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          captionLayout='dropdown'
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
        <DrawerFooterButtons />
      </form>
    </Form>
  );
}
