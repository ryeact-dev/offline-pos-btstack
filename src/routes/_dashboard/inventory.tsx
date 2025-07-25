import DataTable from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { pesoPriceFormat } from "@/helpers/client/price-formats";
import { productsQueries } from "@/hooks/inventory.hook";
import { useDialogStore } from "@/store/dialog-store";
import type { InventoryItemFormValues } from "@/zod/inventory.validation";
import { searchBaseSchema } from "@/zod/search.validation";
import { IconDotsVertical } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { format } from "date-fns";
import { useCallback, useMemo } from "react";

export const Route = createFileRoute("/_dashboard/inventory")({
  validateSearch: (search) =>
    searchBaseSchema.pick({ filter: true }).parse(search),
  loaderDeps: ({ search: { filter } }) => ({ filter }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(productsQueries.list());
  },
  component: RouteComponent,
});

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<InventoryItemFormValues> = (
  row,
  columnId,
  filterValue,
) => {
  const searchableRowContent = `${row.original.name}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();

  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<InventoryItemFormValues> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

const PAGE_LIMIT = 15;

function RouteComponent() {
  const { openSheet, openModal } = useDialogStore();

  const navigate = useNavigate();
  const { data } = useSuspenseQuery(productsQueries.list());
  const { filter } = Route.useSearch();

  const onClear = useCallback(() => {
    navigate({ to: ".", search: (prev) => ({ ...prev, filter: "" }) });
  }, []);

  const onFilterChange = useCallback((value?: string) => {
    if (value) {
      navigate({
        to: ".",
        search: (prev) => ({ ...prev, filter: value }),
      });
    } else {
      onClear();
    }
  }, []);

  const onAddNewProduct = useCallback(() => {
    openSheet({
      title: "Product Details",
      data: {
        type: "add-product",
        data: null,
      },
      isSheetOpen: true,
    });
  }, []);

  const onEditProduct = useCallback((data: InventoryItemFormValues) => {
    openSheet({
      title: "Product Details",
      data: {
        type: "add-product",
        data: data,
      },
      isSheetOpen: true,
    });
  }, []);

  const onDeleteProductHandler = useCallback(
    (product: InventoryItemFormValues) => {
      openModal({
        data: {
          type: "delete-product",
          data: { id: product.id, name: product.name },
        },
        isModalOpen: true,
        title: "Delete Product",
        // size: 'md',
      });
    },
    [],
  );

  const columns = useMemo<ColumnDef<InventoryItemFormValues>[]>(
    () => [
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
        accessorKey: "name",
        header: "Product Name",
        cell: ({ row }) => {
          return (
            <div className="text-foreground w-fit px-0 text-left">
              {row.getValue("name")}
            </div>
          );
        },
        filterFn: multiColumnFilterFn,
        enableHiding: false,
      },
      {
        accessorKey: "unit",
        header: "Unit",
        cell: ({ row }) => (
          <div className="w-32">
            <Badge
              variant="outline"
              className="text-muted-foreground px-1.5 capitalize"
            >
              {row.original.unit}
            </Badge>
          </div>
        ),
        filterFn: statusFilterFn,
      },
      {
        accessorKey: "stockQuantity",
        header: "Quantity",
        cell: ({ row }) => <p> {row.original.stockQuantity}</p>,
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
          const priceString = Number(row.original.price).toFixed(2);
          return <p>{pesoPriceFormat(priceString)}</p>;
        },
      },
      {
        accessorKey: "deliveryDate",
        header: "Delivery Date",
        cell: ({ row }) => (
          <p> {format(new Date(row.original.deliveryDate), "MMM dd, yyyy")}</p>
        ),
      },

      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground float-right flex size-8"
                size="icon"
              >
                <IconDotsVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => onEditProduct(row.original)}>
                Edit
                {/* <TableCellViewer item={row.original} /> */}
              </DropdownMenuItem>
              <DropdownMenuItem>Make a copy</DropdownMenuItem>
              <DropdownMenuItem>Favorite</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDeleteProductHandler(row.original)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  );

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4">
        <DataTable
          data={data}
          columns={columns}
          inputPlacerHolder="Filter by product name"
          buttonName="Add Product"
          columnFilter="unit"
          inputFilter={"name"}
          onAddNew={onAddNewProduct}
          filter={filter}
          onFilterChange={onFilterChange}
          onClear={onClear}
          isNeedToAdd={true}
          isNeedColumnFilter={true}
          isNeedRowPerPage={false}
          pageSize={PAGE_LIMIT}
          isHideZeroQuantity={false}
          route="inventory"
        />
      </div>
    </div>
  );
}
