export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  menuItemPrice: number;
  quantity: number;
}

export interface ParticipantOrder {
  id: string;
  participantName: string;
  items: OrderItem[];
  createdAt: string;
}

export interface GroupOrder {
  id: string;
  restaurantName: string;
  initiatorName: string;
  deadline: string;
  status: 'active' | 'ended';
  menu: MenuItem[];
  participants: ParticipantOrder[];
  createdAt: string;
}

export interface SummaryItem {
  menuItemId: string;
  name: string;
  price: number;
  totalQuantity: number;
  subtotal: number;
}

export interface OrderSummary {
  items: SummaryItem[];
  totalAmount: number;
  totalQuantity: number;
  participantCount: number;
}
