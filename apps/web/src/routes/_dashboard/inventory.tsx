import DataTable from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { productsQueries } from '@/hooks/inventory.hook';
import { openModal, openSheet } from '@/store';
import type { InventoryItemFormValues } from '@/zod/inventory.validation';
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
} from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const Route = createFileRoute('/_dashboard/inventory')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(productsQueries.list());
  },
  component: RouteComponent,
});

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

const onDeleteProductHandler = (product: InventoryItemFormValues) => {
  openModal({
    data: {
      type: 'delete-product',
      data: { id: product.id, name: product.name },
    },
    isModalOpen: true,
    title: 'Delete Product',
    // size: 'md',
  });
};
const columns: ColumnDef<InventoryItemFormValues>[] = [
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
    cell: ({ row }) => <p> {row.original.price}</p>,
  },
  {
    accessorKey: 'stockQuantity',
    header: 'Quantity',
    cell: ({ row }) => <p> {row.original.stockQuantity}</p>,
  },
  {
    accessorKey: 'deliveryDate',
    header: 'Delivery Date',
    cell: ({ row }) => (
      <p> {format(new Date(row.original.deliveryDate), 'dd/MM/yyyy')}</p>
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
          <DropdownMenuItem
            variant='destructive'
            onClick={() => onDeleteProductHandler(row.original)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

function RouteComponent() {
  const { data } = useSuspenseQuery(productsQueries.list());

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
