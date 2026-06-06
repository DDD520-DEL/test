import type { GroupOrder } from '@/types';

const STORAGE_KEY = 'lunch_blackboard_orders';

export function loadOrders(): GroupOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GroupOrder[];
  } catch {
    return [];
  }
}

export function saveOrders(orders: GroupOrder[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    console.error('Failed to save orders');
  }
}
