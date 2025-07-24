import DataTable from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { pesoPriceFormat } from "@/helpers/client/price-formats";
import { salesQueries } from "@/hooks/sales.hooks";
import { useDialogStore } from "@/store/dialog-store";
import type { TransactionDetails } from "@/utils/types";
import { searchBaseSchema } from "@/zod/search.validation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { format } from "date-fns";
import { useCallback, useMemo } from "react";

export const Route = createFileRoute("/_dashboard/transactions")({
  validateSearch: (search) =>
    searchBaseSchema.pick({ filter: true }).parse(search),
  loaderDeps: ({ search: { filter } }) => ({ filter }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(salesQueries.list());
  },
  component: RouteComponent,
});

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<TransactionDetails> = (
  row,
  columnId,
  filterValue,
) => {
  const searchableRowContent =
    `${row.original.customerName} ${row.original.user} `.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();

  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<TransactionDetails> = (
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
  const { data, isLoading } = useSuspenseQuery(salesQueries.list());

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

  // const onAddCartButtonHandler = (item: TransactionDetails) => {
  //   openModal({
  //     data: {
  //       type: "add-order",
  //       data: { cart, item: { ...item, productId: item.id } },
  //     },
  //     isModalOpen: true,
  //     title: "Add Order",
  //   });
  // };

  const columns = useMemo<ColumnDef<TransactionDetails>[]>(
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
        accessorKey: "id",
        header: "Transaction #",
        cell: ({ row }) => {
          return (
            <div className="text-foreground w-fit px-0 text-left">
              {`#${row.getValue("id")}`}
            </div>
          );
        },
        // filterFn: multiColumnFilterFn,
        enableHiding: false,
      },

      {
        accessorKey: "subTotal",
        header: "Subtotal",
        cell: ({ row }) => {
          const subTotalString = Number(row.original.subTotal).toFixed(2);
          return <p>{pesoPriceFormat(subTotalString)}</p>;
        },
      },
      {
        accessorKey: "tax",
        header: "Tax",
        cell: ({ row }) => {
          const taxString = Number(row.original.tax).toFixed(2);
          return <p>{pesoPriceFormat(taxString)}</p>;
        },
      },
      {
        accessorKey: "totalWithTax",
        header: "Total",
        cell: ({ row }) => {
          const totalWithTaxString = Number(row.original.totalWithTax).toFixed(
            2,
          );
          return <p>{pesoPriceFormat(totalWithTaxString)}</p>;
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Transaction Date",
        cell: ({ row }) => (
          <p> {format(new Date(row.original.updatedAt), "MMM dd, yyyy")}</p>
        ),
      },
      {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => <p> {row.original.user}</p>,
        // filterFn: statusFilterFn,
      },
      {
        accessorKey: "customerName",
        header: "Customer Name",
        cell: ({ row }) => <p> {row.original.customerName}</p>,
        // filterFn: statusFilterFn,
      },
      {
        accessorKey: "paymentMethod",
        header: "Payment Method",
        cell: ({ row }) => (
          <p className="capitalize"> {row.original.paymentMethod}</p>
        ),
        // filterFn: statusFilterFn,
      },

      // {
      //   id: "actions",
      //   cell: ({ row }) => (
      //     <Button
      //       variant="outline"
      //       size="sm"
      //       onClick={() => onAddCartButtonHandler(row.original)}
      //       disabled={Number(row.original.stockQuantity) <= 0}
      //     >
      //       <IconPlus />
      //       <span className="hidden lg:inline">Add</span>
      //     </Button>
      //   ),
      // },
    ],
    [data],
  );

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4">
        <DataTable
          inputPlacerHolder="Filter by customer name"
          data={data}
          columns={columns}
          columnFilter="user"
          inputFilter={"customerName"}
          filter={filter}
          onFilterChange={onFilterChange}
          onClear={onClear}
          isNeedToAdd={false}
          isNeedColumnFilter={false}
          isNeedRowPerPage={false}
          pageSize={PAGE_LIMIT}
          isHideZeroQuantity={false}
          route="transactions"
        />
      </div>
    </div>
  );
}
