import { TAX } from "@/utils/global-constant";

export const computeItemTotal = (itemPrice: number, quantity: number) => {
  const subTotal = itemPrice * quantity;
  const tax = subTotal * TAX;
  const totalWithTax = subTotal + tax;

  return {
    subTotal,
    tax,
    totalWithTax,
  };
};
