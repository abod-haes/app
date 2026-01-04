import { PaginationResponse } from './common';

export enum OrderStatus {
  Pending = 0,
  Processing = 1,
  Shipped = 2,
  Delivered = 3,
  Cancelled = 4,
}

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'قيد الانتظار',
  [OrderStatus.Processing]: 'قيد المعالجة',
  [OrderStatus.Shipped]: 'تم الشحن',
  [OrderStatus.Delivered]: 'تم التسليم',
  [OrderStatus.Cancelled]: 'ملغي',
};

export interface OrderItem {
  productId: string;
  productName: string;
  productImagePath: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  userId: string;
  userLocation: string;
  userLatitude: number;
  userLongitude: number;
  userFirstName: string;
  userLastName: string;
  userPhoneNumber: string;
  deliveryPersonId?: string;
  deliveryPersonName?: string;
  acceptedAt?: string;
  deliveredAt?: string;
}

export type OrdersResponse = PaginationResponse<Order>;

