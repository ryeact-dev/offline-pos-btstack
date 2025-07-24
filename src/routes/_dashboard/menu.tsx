import CartOrderList from "@/components/cart-order-list";
import DataTable from "@/components/data-table";
import Loader from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { productsQueries } from "@/hooks/inventory.hook";
import { useDialogStore } from "@/store/dialog-store";
import { TEMP_USER_ID } from "@/utils/global-constant";
import type { InventoryItemFormValues } from "@/zod/inventory.validation";
import { searchBaseSchema } from "@/zod/search.validation";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { format } from "date-fns";
import { useCallback, useMemo } from "react";
import { pesoPriceFormat } from "@/helpers/client/price-formats";
import { cartQueries } from "@/hooks/cart.hooks";

export const Route = createFileRoute("/_dashboard/menu")({
  validateSearch: (search) =>
    searchBaseSchema.pick({ filter: true }).parse(search),
  loaderDeps: ({ search: { filter } }) => ({ filter }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(productsQueries.list());
    await context.queryClient.ensureQueryData(cartQueries.single(TEMP_USER_ID));
  },
  component: RouteComponent,
  ssr: false,
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
  // Getters
  const { data, isLoading } = useQuery(productsQueries.list());
  const { data: cart, isLoading: isLoadingOrderList } = useQuery(
    cartQueries.single(TEMP_USER_ID),
  );

  const { openModal } = useDialogStore();
  const navigate = useNavigate();
  const { filter } = Route.useSearch();

  const onClear = useCallback(() => {
    navigate({ to: ".", search: (prev) => ({ ...prev, filter: "" }) });
  }, []);

  const onFilterChange = (value?: string) => {
    if (value) {
      navigate({
        to: ".",
        search: (prev) => ({ ...prev, filter: value }),
      });
    } else {
      onClear();
    }
  };

  const onAddCartButtonHandler = (item: InventoryItemFormValues) => {
    openModal({
      data: {
        type: "add-order",
        data: { cart, item: { ...item, productId: item.id } },
      },
      isModalOpen: true,
      title: "Add Order",
    });
  };

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddCartButtonHandler(row.original)}
            disabled={Number(row.original.stockQuantity) <= 0}
          >
            <IconPlus />
            <span className="hidden lg:inline">Add</span>
          </Button>
        ),
      },
    ],
    [data],
  );

  if (isLoading) return <Loader />;

  // console.log("menu page", cart);

  return (
    <div className="@container/main relative -mt-1 flex">
      <div className="flex-2 py-4">
        <DataTable
          inputPlacerHolder="Filter by product name"
          data={data}
          columns={columns}
          columnFilter="unit"
          inputFilter={"name"}
          filter={filter}
          onFilterChange={onFilterChange}
          onClear={onClear}
          isNeedToAdd={false}
          isNeedColumnFilter={false}
          isNeedRowPerPage={false}
          pageSize={PAGE_LIMIT}
          isHideZeroQuantity={true}
          route="inventory"
        />
      </div>

      <div className="mt-6 max-h-[865px] flex-1 shrink-0 pr-6 md:w-80 lg:w-96">
        <CartOrderList cart={cart} isLoadingOrderList={isLoadingOrderList} />
      </div>
    </div>
  );
}
