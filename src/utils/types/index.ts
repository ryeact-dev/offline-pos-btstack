import type { Sales, SoldItems } from "@/generated/prisma/client";
import type { InventoryItemFormValues } from "@/zod/inventory.validation";
import type { Decimal } from "@prisma/client/runtime/library";
import type React from "react";

// Modal Props
// Create a union type of all possible modal data types
export interface DefaultDataModalObject {
  id: string | number;
  name: string;

  // to user role if manager or not ( on admin can update a manager account )
  role?: string;

  // For resetting user password
  password?: string;
  username?: string;
}

export interface CartItem extends InventoryItemFormValues {
  quantity: number;
  productId: number;
  total: number;
}

export interface OrderDetails {
  id: number;
  items: CartItem[];
  subTotal: number;
  tax: number;
  totalWithTax: number;
  paymentMethod: string;
  customerName: string;
  status: string;
}

export interface AddProductModalData {
  cart: OrderDetails | null;
  item: CartItem;
}

export interface TransactionDetails extends Sales {
  soldItems: SoldItems;
  user: string;
}

export type ModalData =
  // | { type: 'delete-user'; data: DefaultDataModalObject }
  // | { type: 'delete-candidate'; data: DefaultDataModalObject }
  // | { type: 'delete-competition'; data: DefaultDataModalObject }
  // | { type: 'password-reset'; data: DefaultDataModalObject }
  // | { type: 'event'; data: Event | null }
  // | { type: 'manager'; data: UserWithEventAndCompetitions | null }
  // | { type: 'user'; data: UserWithEventAndCompetitions | null }
  // | { type: 'competition'; data: UserCompetition | null }
  // | { type: 'candidate'; data: CandidateNoCreatedAt | null }
  | { type: "checkout-order"; data: OrderDetails }
  | { type: "clear-cart"; data: DefaultDataModalObject }
  | { type: "delete-product"; data: DefaultDataModalObject }
  | { type: "add-product"; data: AddProductModalData | null }
  | { type: string; data: Record<string, unknown> };

// export type ModalSize =
//   | 'md'
//   | 'xs'
//   | 'sm'
//   | 'lg'
//   | 'xl'
//   | '2xl'
//   | '3xl'
//   | '4xl'
//   | '5xl'
//   | 'full';

export interface ModalProps {
  isModalOpen?: boolean;
  isSheetOpen?: boolean;
  title?: React.ReactNode;
  // size: ModalSize;
  data: ModalData;
}

// API Response
export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface ErrorWithDataResponse extends Error {
  data: ApiResponse;
}

// export interface UserApiResponse extends ApiResponse {
//   user: CurrentUser | null
// }

// export interface EventWithUsers extends Event {
//   user: Array<Omit<CurrentUser, 'event'>>
// }
// export interface EventApiResponse extends ApiResponse {
//   event: EventWithUsers | null
// }
