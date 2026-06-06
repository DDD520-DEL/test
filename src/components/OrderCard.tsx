import { Link } from 'react-router-dom';
import { Users, Clock, ChefHat } from 'lucide-react';
import type { GroupOrder } from '@/types';
import CountdownTimer from './CountdownTimer';
import { formatTime } from '@/utils/time';

interface OrderCardProps {
  order: GroupOrder;
}

export default function OrderCard({ order }: OrderCardProps) {
  const isActive = order.status === 'active';
  const statusColor = isActive ? 'bg-chalk-green/20 text-chalk-green border-chalk-green/40' : 'bg-chalk/10 text-chalk/50 border-chalk/20';
  const statusText = isActive ? '进行中' : '已结束';

  return (
    <Link
      to={`/order/${order.id}`}
      className="relative block p-5 rounded-lg chalk-border hover:border-chalk/70 transition-all duration-200 hover:-translate-y-1 group bg-blackboard-light/30"
    >
      <div className="tape" />
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-chalk text-2xl chalk-text text-chalk mb-1 flex items-center gap-2">
            <ChefHat size={22} className="text-chalk-orange" />
            {order.restaurantName}
          </h3>
          <p className="font-hand text-chalk/70 text-base">发起人：{order.initiatorName}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-hand border ${statusColor}`}>
          {statusText}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-chalk/80">
          <Clock size={16} />
          <span className="font-hand text-base">截止时间：{formatTime(order.deadline)}</span>
        </div>
        <div className="flex items-center gap-2 text-chalk/80">
          <Users size={16} />
          <span className="font-hand text-base">已参团：{order.participants.length} 人</span>
        </div>
      </div>

      {isActive && (
        <div className="pt-3 border-t border-chalk/20">
          <CountdownTimer deadline={order.deadline} size="sm" />
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {order.menu.slice(0, 4).map((item) => (
          <span
            key={item.id}
            className="px-2 py-0.5 text-xs font-hand rounded bg-chalk/10 text-chalk/80"
          >
            {item.name}
          </span>
        ))}
        {order.menu.length > 4 && (
          <span className="px-2 py-0.5 text-xs font-hand text-chalk/60">
            +{order.menu.length - 4} 道菜
          </span>
        )}
      </div>
    </Link>
  );
}
