import { Button } from "@/components/ui/button";
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import type { InventoryItemFormValues } from "@/zod/inventory.validation";

interface CartItemProps {
  item: InventoryItemFormValues;
  onUpdateQuantity: (
    id: number,
    updatedFields: Partial<InventoryItemFormValues>,
  ) => void;
  onRemoveItem: (productId: number) => void;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemProps) {
  return (
    <div className="hover:bg-accent-foreground/5 mb-2 flex items-center gap-4 rounded-md border px-4 py-2">
      {/* <div className="h-16 w-16 rounded-md overflow-hidden border">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div> */}

      <div className="min-w-0 flex-1">
        <h4 className="mb-1 truncate font-medium">
          {item.name} - <span className="capitalize">{item.unit}</span>{" "}
        </h4>
        <p className="text-muted-foreground -mt-1 mb-1 text-sm">
          P{Number(item.price).toFixed(2)}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() =>
              onUpdateQuantity(item.id, {
                stockQuantity: item.stockQuantity - 1,
              })
            }
          >
            <IconMinus className="h-3 w-3" />
          </Button>
          <span className="w-6 text-center text-sm">{item.stockQuantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() =>
              onUpdateQuantity(item.id, {
                stockQuantity: item.stockQuantity + 1,
              })
            }
          >
            <IconPlus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="font-medium">
          P{(Number(item.price) * item.stockQuantity).toFixed(2)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive h-6 w-6"
          onClick={() => onRemoveItem(item.id)}
        >
          <IconTrash className="size-5" />
        </Button>
      </div>
    </div>
  );
}
