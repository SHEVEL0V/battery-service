export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface Booking {
  id: string
  name: string
  phone: string
  email: string
  carModel: string
  year: number
  message?: string
  status: BookingStatus
  createdAt: Date
  updatedAt: Date
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface Service {
  id: string
  slug: string
  titleUk: string
  titleEn: string
  descUk: string
  descEn: string
  price: number
  duration: string
  isActive: boolean
  order: number
}

export interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  message: string
  createdAt: Date
}

export interface Review {
  id: string
  author: string
  rating: number
  textUk: string
  textEn: string
  carModel: string
  isVisible: boolean
  createdAt: Date
}

export interface User {
  id: string
  email: string
  role: Role
}

export type Role = 'ADMIN' | 'SUPERADMIN'
