import { create } from 'zustand';
import type { GroupOrder, ParticipantOrder, OrderSummary, SummaryItem } from '@/types';
import { loadOrders, saveOrders } from '@/utils/storage';
import { generateId } from '@/utils/id';

interface OrderStore {
  orders: GroupOrder[];
  createOrder: (data: {
    restaurantName: string;
    initiatorName: string;
    deadline: string;
    menu: { name: string; price: number }[];
  }) => string;
  addParticipant: (orderId: string, participant: Omit<ParticipantOrder, 'id' | 'createdAt'>) => void;
  endOrder: (orderId: string) => void;
  getOrderById: (id: string) => GroupOrder | undefined;
  getOrderSummary: (orderId: string) => OrderSummary | null;
  checkAndEndExpired: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: loadOrders(),

  createOrder: (data) => {
    const newOrder: GroupOrder = {
      id: generateId(),
      restaurantName: data.restaurantName,
      initiatorName: data.initiatorName,
      deadline: data.deadline,
      status: 'active',
      menu: data.menu.map((item) => ({
        id: generateId(),
        name: item.name,
        price: item.price,
      })),
      participants: [],
      createdAt: new Date().toISOString(),
    };
    const orders = [newOrder, ...get().orders];
    saveOrders(orders);
    set({ orders });
    return newOrder.id;
  },

  addParticipant: (orderId, participant) => {
    const orders = get().orders.map((order) => {
      if (order.id !== orderId || order.status !== 'active') return order;
      const newParticipant: ParticipantOrder = {
        ...participant,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      return {
        ...order,
        participants: [...order.participants, newParticipant],
      };
    });
    saveOrders(orders);
    set({ orders });
  },

  endOrder: (orderId) => {
    const orders = get().orders.map((order) => {
      if (order.id !== orderId) return order;
      return { ...order, status: 'ended' as const };
    });
    saveOrders(orders);
    set({ orders });
  },

  getOrderById: (id) => {
    return get().orders.find((o) => o.id === id);
  },

  getOrderSummary: (orderId) => {
    const order = get().getOrderById(orderId);
    if (!order) return null;

    const itemMap = new Map<string, SummaryItem>();

    order.menu.forEach((menuItem) => {
      itemMap.set(menuItem.id, {
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        totalQuantity: 0,
        subtotal: 0,
      });
    });

    order.participants.forEach((p) => {
      p.items.forEach((item) => {
        const summary = itemMap.get(item.menuItemId);
        if (summary) {
          summary.totalQuantity += item.quantity;
          summary.subtotal += item.quantity * item.menuItemPrice;
        }
      });
    });

    const items = Array.from(itemMap.values());
    const totalAmount = items.reduce((sum, i) => sum + i.subtotal, 0);
    const totalQuantity = items.reduce((sum, i) => sum + i.totalQuantity, 0);

    return {
      items,
      totalAmount,
      totalQuantity,
      participantCount: order.participants.length,
    };
  },

  checkAndEndExpired: () => {
    const now = Date.now();
    let changed = false;
    const orders = get().orders.map((order) => {
      if (order.status === 'active' && new Date(order.deadline).getTime() <= now) {
        changed = true;
        return { ...order, status: 'ended' as const };
      }
      return order;
    });
    if (changed) {
      saveOrders(orders);
      set({ orders });
    }
  },
}));
