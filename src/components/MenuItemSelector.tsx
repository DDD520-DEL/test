import { Minus, Plus } from 'lucide-react';
import type { MenuItem } from '@/types';

interface MenuItemSelectorProps {
  item: MenuItem;
  quantity: number;
  onQuantityChange: (menuItemId: string, quantity: number) => void;
  disabled?: boolean;
}

export default function MenuItemSelector({
  item,
  quantity,
  onQuantityChange,
  disabled = false,
}: MenuItemSelectorProps) {
  const isSelected = quantity > 0;

  return (
    <div className={`menu-item-card ${isSelected ? 'selected' : ''} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-hand text-xl text-chalk chalk-text">{item.name}</h4>
          <p className="font-chalk text-chalk-orange text-lg">¥{item.price}</p>
        </div>

        {isSelected ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuantityChange(item.id, Math.max(0, quantity - 1))}
              className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-chalk/50 text-chalk hover:border-chalk hover:bg-chalk/10 transition-all"
              disabled={disabled}
            >
              <Minus size={18} />
            </button>
            <span className="w-8 text-center font-chalk text-xl chalk-text text-chalk-orange">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(item.id, quantity + 1)}
              className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-chalk-orange/60 text-chalk-orange hover:border-chalk-orange hover:bg-chalk-orange/10 transition-all"
              disabled={disabled}
            >
              <Plus size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onQuantityChange(item.id, 1)}
            className="px-4 py-2 rounded border-2 border-chalk/40 text-chalk font-hand hover:border-chalk-orange/60 hover:text-chalk-orange transition-all"
            disabled={disabled}
          >
            选一份
          </button>
        )}
      </div>
    </div>
  );
}
