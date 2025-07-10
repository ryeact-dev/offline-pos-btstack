import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { openSheet } from '@/store';
import type { InventoryTable } from '@/zod/table.validation';
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
} from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';

export const Route = createFileRoute('/_dashboard/inventory')({
  component: RouteComponent,
});

const columns: ColumnDef<InventoryTable>[] = [
  // {
  //   id: 'drag',
  //   header: () => null,
  //   cell: ({ row }) => <DragHandle id={row.original.id} />,
  // },
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <div className='flex items-center justify-center'>
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && 'indeterminate')
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label='Select all'
  //       />
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <div className='flex items-center justify-center'>
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label='Select row'
  //       />
  //     </div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'name',
    header: 'Product Name',
    cell: ({ row }) => {
      return (
        <div className='text-foreground w-fit px-0 text-left'>
          {row.original.name}
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <div className='w-32'>
        <Badge variant='outline' className='text-muted-foreground px-1.5'>
          {row.original.category}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => (
      <div className='w-32'>
        <Badge variant='outline' className='text-muted-foreground px-1.5'>
          {row.original.price}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'stockQuantity',
    header: 'Quantity',
    cell: ({ row }) => (
      <Badge variant='outline' className='text-muted-foreground px-1.5'>
        {row.original.stockQuantity}
      </Badge>
    ),
  },
  {
    accessorKey: 'deliveryDate',
    header: 'Delivery Date',
    cell: ({ row }) => (
      <Badge variant='outline' className='text-muted-foreground px-1.5'>
        {row.original.deliveryDate}
      </Badge>
    ),
  },

  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted text-muted-foreground flex size-8 float-right'
            size='icon'
          >
            <IconDotsVertical />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-32'>
          <DropdownMenuItem>
            Edit
            {/* <TableCellViewer item={row.original} /> */}
          </DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive'>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const data = [
  {
    id: 1,
    name: 'Cover page',
    category: 'Cover page',
    price: 18.5,
    stockQuantity: 10,
    deliveryDate: new Date().toDateString(),
  },
  {
    id: 2,
    name: 'Table of contents',
    category: 'Table of contents',
    price: 11.25,
    stockQuantity: 16,
    deliveryDate: new Date().toDateString(),
  },
  {
    id: 3,
    name: 'Executive summary',
    category: 'Narrative',
    price: 10,
    stockQuantity: 5,
    deliveryDate: new Date().toDateString(),
  },
  {
    id: 4,
    name: 'Technical approach',
    category: 'Narrative',
    price: 20.1,
    stockQuantity: 30,
    deliveryDate: new Date().toDateString(),
  },
];

const onAddNewProduct = () => {
  openSheet({
    title: 'Product Details',
    data: {
      type: 'add-product',
      data: null,
    },
    isSheetOpen: true,
  });
};

function RouteComponent() {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <DataTable
            data={data}
            columns={columns}
            buttonName='Add Product'
            onAddNew={onAddNewProduct}
          />
        </div>
      </div>
    </div>
  );
}
