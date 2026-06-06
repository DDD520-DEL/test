import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, UtensilsCrossed } from 'lucide-react';
import Blackboard from '@/components/Blackboard';
import ChalkButton from '@/components/ChalkButton';
import OrderCard from '@/components/OrderCard';
import { useOrderStore } from '@/store/useOrderStore';
import { getTodayChinese } from '@/utils/time';

export default function OrderListPage() {
  const { orders, checkAndEndExpired } = useOrderStore();

  useEffect(() => {
    checkAndEndExpired();
    const timer = setInterval(checkAndEndExpired, 30000);
    return () => clearInterval(timer);
  }, [checkAndEndExpired]);

  const activeOrders = orders.filter((o) => o.status === 'active');
  const endedOrders = orders.filter((o) => o.status === 'ended');

  return (
    <Blackboard>
      <div className="mb-8 text-center">
        <div className="inline-block relative">
          <div className="absolute -top-3 -right-12 rotate-6 bg-sticky-yellow px-3 py-1 text-wood-dark font-hand text-sm shadow-sticky">
            {getTodayChinese()}
          </div>
          <h1 className="font-chalk text-4xl sm:text-5xl chalk-text text-chalk mb-2 flex items-center justify-center gap-3">
            <UtensilsCrossed size={36} className="text-chalk-orange" />
            工地盒饭拼单小黑板
            <UtensilsCrossed size={36} className="text-chalk-orange" />
          </h1>
          <p className="font-hand text-chalk/70 text-lg">工友们，中午一起凑单吃盒饭咯 🍱</p>
        </div>
      </div>

      <div className="mb-6 flex justify-center">
        <Link to="/create">
          <ChalkButton variant="primary" className="text-xl hover:animate-shake">
            <Plus size={22} className="inline mr-2" />
            发起拼单
          </ChalkButton>
        </Link>
      </div>

      {activeOrders.length > 0 && (
        <div className="mb-10">
          <h2 className="font-chalk text-2xl chalk-text text-chalk-green mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-chalk-green animate-pulse" />
            进行中的拼单
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {activeOrders.map((order, idx) => (
              <div
                key={order.id}
                className="animate-chalk-write"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        </div>
      )}

      {endedOrders.length > 0 && (
        <div>
          <h2 className="font-chalk text-2xl chalk-text text-chalk/60 mb-4">
            已结束的拼单
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 opacity-75">
            {endedOrders.slice(0, 6).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🍱</div>
          <p className="font-chalk text-2xl text-chalk/70 chalk-text mb-2">
            还没有拼单哦
          </p>
          <p className="font-hand text-chalk/50">
            点击上方按钮，发起今天的第一份拼单吧！
          </p>
        </div>
      )}
    </Blackboard>
  );
}
