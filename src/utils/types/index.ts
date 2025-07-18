import type { InventoryItemFormValues } from "@/zod/inventory.validation";
import type { Decimal } from "@prisma/client/runtime/library";
import type React from "react";

// export interface QueryParams {
//   filter: string
//   page: number
//   limit: number
//   eventId?: string
//   competitionId?: string
//   refetchInterval?: number
//   user?: CurrentUser | null
// }

// Add this type to match the omitted fields
// export type SafeUser = Omit<User, 'email' | 'createdAt' | 'password'>;
// export type CandidateNoCreatedAt = Omit<Candidate, 'createdAt'>

// export interface CandidatesWithScoresheet extends Candidate {
//   scoresheet: Array<Scoresheet>
//   event: UserEvent
// }

// export interface CompetitionLink {
//   id: string
//   name: string
//   number: number
//   isActive: boolean
// }

// export interface UserCompetition {
//   id?: string
//   eventId?: string
//   number: number
//   name: string
//   multiplier: Decimal | number
//   isFinalist: boolean
//   finalists: number
//   isActive: boolean
//   criteria: Array<CriteriaItem>
// }

// export interface SingleCandidateWithScoresheet {
//   userId: string
//   candidate: Candidate
//   candidateScoresheet: Scoresheet | null
//   competition: UserCompetition
// }

// export interface CriteriaItem {
//   criteriaTitle: string
//   percent: number
//   score: number
// }

// interface UserEvent {
//   id: string
//   name: string
// }

// export interface CurrentUser
//   extends Omit<User, 'email' | 'createdAt' | 'password' | 'eventId'> {
//   event: UserEvent | null
//   competitionIds?: Array<string>
// }

// export interface UserWithEventAndCompetitions
//   extends Omit<User, 'createdAt' | 'eventId'> {
//   event: UserEvent
//   competitionIds?: Array<string>
//   competitions?: Array<UserCompetition>
// }

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
