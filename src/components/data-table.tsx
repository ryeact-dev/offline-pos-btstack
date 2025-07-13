import * as React from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconCircleX,
  IconFilter,
  IconFilter2,
  IconLayoutColumns,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import PaginationTable from "./pagination-table";
import { useDebouncedValue } from "@tanstack/react-pacer";
import TableControlsInventory from "./table-controls/inventory";

export default function DataTable({
  data,
  columns,
  buttonName = "Not set",
  onAddNew,
  columnFilter,
  inputFilter,
  filter,
  onFilterChange,
  onClear,
  isNeedToAdd,
  pageSize = 10,
  isNeedRowPerPage = true,
}: {
  columns: ColumnDef<any>[];
  data: any;
  buttonName?: string;
  onAddNew?: () => void;
  inputFilter: string;
  columnFilter: string;
  filter: string;
  onFilterChange: (value?: string) => void;
  onClear: () => void;
  isNeedToAdd: boolean;
  pageSize?: number;
  isNeedRowPerPage: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [debounceValue, debouncer] = useDebouncedValue(filter, {
    wait: 500, // Wait 500ms after last change
  });

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Get unique status values
  const uniqueStatusValues = React.useMemo(() => {
    const statusColumn = table.getColumn(columnFilter);

    if (!statusColumn) return [];

    const values = Array.from(statusColumn.getFacetedUniqueValues().keys());

    return values.sort();
  }, [table.getColumn(columnFilter)?.getFacetedUniqueValues()]);

  // Get counts for each status
  const statusCounts = React.useMemo(() => {
    const statusColumn = table.getColumn(columnFilter);
    if (!statusColumn) return new Map();
    return statusColumn.getFacetedUniqueValues();
  }, [table.getColumn(columnFilter)?.getFacetedUniqueValues()]);

  const selectedStatuses = React.useMemo(() => {
    const filterValue = table
      .getColumn(columnFilter)
      ?.getFilterValue() as string[];

    return filterValue ?? [];
  }, [table.getColumn(columnFilter)?.getFilterValue()]);

  const onColumnFilterChange = (checked: boolean, value: string) => {
    const filterValue = table
      .getColumn(columnFilter)
      ?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table
      .getColumn(columnFilter)
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  React.useEffect(() => {
    table.getColumn(inputFilter)?.setFilterValue(debounceValue);
  }, [debounceValue]);

  const onClearInputFilter = () => {
    onClear();
    table.getColumn(inputFilter)?.setFilterValue("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full flex-col justify-start gap-6 overflow-auto">
      <div className="flex items-center justify-between gap-4 px-2 lg:px-6">
        <TableControlsInventory
          columnFilter={columnFilter}
          selectedStatuses={selectedStatuses}
          uniqueStatusValues={uniqueStatusValues}
          onColumnFilterChange={onColumnFilterChange}
          statusCounts={statusCounts}
          filter={filter}
          onFilterChange={onFilterChange}
          onClearInputFilter={onClearInputFilter}
        />

        {isNeedToAdd && (
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Customize Columns</span>
                  <span className="lg:hidden">Columns</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide(),
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.columnDef.header as string}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={onAddNew}>
              <IconPlus />
              <span className="hidden lg:inline">{buttonName}</span>
            </Button>
          </div>
        )}
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 py-6 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/50">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          "relative h-10 border-t select-none",
                          header.id === "actions" ? "" : "min-w-44 shrink-0",
                        )}
                        aria-sort={
                          header.column.getIsSorted() === "asc"
                            ? "ascending"
                            : header.column.getIsSorted() === "desc"
                              ? "descending"
                              : "none"
                        }
                      >
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                          <div
                            className={cn(
                              header.column.getCanSort() &&
                                "flex h-full cursor-pointer items-center justify-between gap-2 select-none",
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                            onKeyDown={(e) => {
                              // Enhanced keyboard handling for sorting
                              if (
                                header.column.getCanSort() &&
                                (e.key === "Enter" || e.key === " ")
                              ) {
                                e.preventDefault();
                                header.column.getToggleSortingHandler()?.(e);
                              }
                            }}
                            tabIndex={
                              header.column.getCanSort() ? 0 : undefined
                            }
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: (
                                <IconChevronUp
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  aria-hidden="true"
                                />
                              ),
                              desc: (
                                <IconChevronDown
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  aria-hidden="true"
                                />
                              ),
                            }[header.column.getIsSorted() as string] ?? (
                              <span className="size-4" aria-hidden="true" />
                            )}
                          </div>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <PaginationTable table={table} isNeedRowPerPage={isNeedRowPerPage} />
      </div>
    </div>
  );
}
