import TableHeaderControlsInventory from "./inventory";
import TableHeaderControlsTransactions from "./transactions";

interface TableHeaderControlsProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  onClearInputFilter: () => void;
  columnFilter: string;
  selectedStatuses: string[];
  uniqueStatusValues: string[];
  onColumnFilterChange: (checked: boolean, value: string) => void;
  statusCounts: Map<string, number>;
  inputPlacerHolder: string;
  route: string;
}

export default function TableHeaderControls(props: TableHeaderControlsProps) {
  switch (props.route) {
    case "inventory":
      return <TableHeaderControlsInventory {...props} />;

    case "transactions":
      return <TableHeaderControlsTransactions {...props} />;

    default:
      return <div></div>;
  }
}
