export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export type {
  Booking,
  BookingStatus,
  Contact,
  Review,
  Role,
  Service,
  User,
} from "@g/prisma/client";
