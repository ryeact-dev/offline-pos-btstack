import React, { useEffect, useState } from "react";
import { DateRangePicker } from "../date-range-picker";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { Input } from "../ui/input";
import {
  IconChevronDown,
  IconCircleX,
  IconFilter,
  IconFilter2,
} from "@tabler/icons-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export default function TableHeaderControlsTransactions({
  filter,
  onFilterChange,
  onClearInputFilter,
  columnFilter,
  selectedStatuses,
  uniqueStatusValues,
  onColumnFilterChange,
  statusCounts,
  inputPlacerHolder,
}: {
  filter: string;
  onFilterChange: (filter: string) => void;
  onClearInputFilter: () => void;
  columnFilter: string;
  selectedStatuses: string[];
  uniqueStatusValues: string[];
  onColumnFilterChange: (checked: boolean, value: string) => void;
  statusCounts: Map<string, number>;
  inputPlacerHolder: string;
}) {
  const id = React.useId();

  const [searchFilter, setSearchFilter] = useState(filter);

  const [debounceValue, debouncer] = useDebouncedValue(searchFilter, {
    wait: 500, // Wait 500ms after last change
  });

  const onSearchFilterChange = (value: string) => {
    setSearchFilter(value);
  };

  useEffect(() => {
    onFilterChange(debounceValue);
  }, [debounceValue]);

  return (
    <>
      <div className="flex w-[50%] items-center gap-4">
        {/* Filter by name or email */}
        <div className="relative w-full">
          <Input
            id={`${id}-input`}
            className="peer h-8 min-w-60 ps-9 pe-9"
            value={searchFilter}
            onChange={(e) => {
              onSearchFilterChange(e.target.value);
              // table.getColumn(inputFilter)?.setFilterValue(e.target.value);
            }}
            placeholder={inputPlacerHolder}
            type="text"
            aria-label="Filter by product name"
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <IconFilter2 size={16} aria-hidden="true" />
          </div>
          {Boolean(filter) && (
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Clear filter"
              onClick={onClearInputFilter}
            >
              <IconCircleX size={16} aria-hidden="true" />
            </button>
          )}
        </div>
        {/* Filter by status */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="min-w-36 capitalize"
              size={"sm"}
            >
              <IconFilter
                className="-ms-1 opacity-60"
                size={16}
                aria-hidden="true"
              />
              {columnFilter}
              {selectedStatuses.length > 0 && (
                <span className="bg-background text-muted-foreground/70 -me-1 inline-flex items-center rounded border px-1 font-[inherit] font-medium">
                  {selectedStatuses.length}
                </span>
              )}
              <IconChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto min-w-36 p-3" align="center">
            <div className="space-y-3">
              <div className="text-muted-foreground text-xs font-medium">
                Filters
              </div>
              <div className="space-y-3">
                {uniqueStatusValues.map((value, i) => (
                  <div key={value} className="flex items-center gap-2">
                    <Checkbox
                      id={`${id}-${i}`}
                      checked={selectedStatuses.includes(value)}
                      onCheckedChange={(checked: boolean) =>
                        onColumnFilterChange(checked, value)
                      }
                    />
                    <Label
                      htmlFor={`${id}-${i}`}
                      className="flex grow justify-between gap-2 font-normal capitalize"
                    >
                      {value}{" "}
                      <span className="text-muted-foreground ms-2 text-xs">
                        {statusCounts.get(value)}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>{" "}
      <div>
        <DateRangePicker />
      </div>
    </>
  );
}
