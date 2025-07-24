import * as React from "react";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { addMonths, format } from "date-fns";
import { IconCalendar } from "@tabler/icons-react";

export function DateRangePicker() {
  const id = React.useId();

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: addMonths(new Date(), -3),
    to: new Date(),
  });

  const onDateRangeChange = (dateRange: DateRange) => {
    console.log(dateRange);

    setDateRange(dateRange);
  };

  return (
    <div>
      <div className="*:not-first:mt-2">
        {/* <Label htmlFor={id}>Date range picker</Label> */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant="outline"
              className="group bg-background hover:bg-background border-input w-full min-w-36 justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
            >
              <span
                className={cn(
                  "truncate",
                  !dateRange && "text-muted-foreground",
                )}
              >
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Pick a date range"
                )}
              </span>
              <IconCalendar
                size={16}
                className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
                aria-hidden="true"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
              required
              // className="rounded-lg border shadow-sm"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
