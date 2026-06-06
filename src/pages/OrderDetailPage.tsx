import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChefHat, User, Users, Receipt, PartyPopper, AlertTriangle } from 'lucide-react';
import Blackboard from '@/components/Blackboard';
import ChalkButton from '@/components/ChalkButton';
import ChalkInput from '@/components/ChalkInput';
import CountdownTimer from '@/components/CountdownTimer';
import MenuItemSelector from '@/components/MenuItemSelector';
import StickyNote from '@/components/StickyNote';
import { useOrderStore } from '@/store/useOrderStore';
import { formatTime, formatDate } from '@/utils/time';
import type { OrderItem } from '@/types';
import { generateId } from '@/utils/id';

const stickyColors: Array<'yellow' | 'pink' | 'blue' | 'green'> = ['yellow', 'pink', 'blue', 'green'];
const stickyRotations = [-2, 1, -1, 2, -3, 3];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const getOrderById = useOrderStore((s) => s.getOrderById);
  const addParticipant = useOrderStore((s) => s.addParticipant);
  const endOrder = useOrderStore((s) => s.endOrder);
  const getOrderSummary = useOrderStore((s) => s.getOrderSummary);
  const checkAndEndExpired = useOrderStore((s) => s.checkAndEndExpired);
  const orders = useOrderStore((s) => s.orders);

  const order = useMemo(() => (id ? getOrderById(id) : undefined), [id, getOrderById, orders]);
  const summary = useMemo(() => (id ? getOrderSummary(id) : null), [id, getOrderSummary, orders]);

  const [participantName, setParticipantName] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    checkAndEndExpired();
  }, [checkAndEndExpired]);

  if (!order) {
    return (
      <Blackboard>
        <div className="text-center py-20">
          <AlertTriangle size={64} className="mx-auto text-chalk-orange mb-4" />
          <h2 className="font-chalk text-3xl chalk-text text-chalk mb-3">拼单不存在</h2>
          <p className="font-hand text-chalk/60 mb-6">这个拼单可能已经被删除了</p>
          <Link to="/">
            <ChalkButton>返回首页</ChalkButton>
          </Link>
        </div>
      </Blackboard>
    );
  }

  const isActive = order.status === 'active';
  const totalSelected = Object.values(quantities).reduce((sum, q) => sum + q, 0);
  const selectedAmount = order.menu.reduce((sum, item) => {
    const q = quantities[item.id] || 0;
    return sum + q * item.price;
  }, 0);

  const handleQuantityChange = (menuItemId: string, quantity: number) => {
    setQuantities((prev) => {
      if (quantity <= 0) {
        const next = { ...prev };
        delete next[menuItemId];
        return next;
      }
      return { ...prev, [menuItemId]: quantity };
    });
  };

  const handleSubmit = () => {
    setSubmitError('');

    if (!participantName.trim()) {
      setSubmitError('请输入你的名字');
      return;
    }
    if (totalSelected === 0) {
      setSubmitError('请至少选择一份菜品');
      return;
    }

    const items: OrderItem[] = order.menu
      .filter((m) => (quantities[m.id] || 0) > 0)
      .map((m) => ({
        id: generateId(),
        menuItemId: m.id,
        menuItemName: m.name,
        menuItemPrice: m.price,
        quantity: quantities[m.id],
      }));

    addParticipant(order.id, {
      participantName: participantName.trim(),
      items,
    });

    setParticipantName('');
    setQuantities({});
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const handleExpire = () => {
    if (isActive) endOrder(order.id);
  };

  return (
    <Blackboard>
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-1 text-chalk/70 hover:text-chalk font-hand transition-colors">
          <ArrowLeft size={18} />
          返回拼单列表
        </Link>
      </div>

      {showSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-chalk-write">
          <div className="bg-chalk-green/20 border-2 border-chalk-green/60 text-chalk-green px-6 py-3 rounded-lg font-chalk text-xl chalk-text">
            ✅ 参团成功！开饭咯～
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="font-chalk text-3xl sm:text-4xl chalk-text text-chalk flex items-center gap-3 mb-2">
              <ChefHat size={32} className="text-chalk-orange" />
              {order.restaurantName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-chalk/80 font-hand">
              <span className="flex items-center gap-1">
                <User size={16} />
                发起人：{order.initiatorName}
              </span>
              <span className="flex items-center gap-1">
                📅 {formatDate(order.createdAt)} 截止 {formatTime(order.deadline)}
              </span>
            </div>
          </div>
          <span
            className={`px-4 py-1.5 rounded-full font-hand text-base border ${
              isActive
                ? 'bg-chalk-green/20 text-chalk-green border-chalk-green/40'
                : 'bg-chalk/10 text-chalk/60 border-chalk/20'
            }`}
          >
            {isActive ? '🟢 进行中' : '⚫ 已结束'}
          </span>
        </div>

        <div className="chalk-border rounded-lg p-4 bg-blackboard-light/30">
          {isActive ? (
            <CountdownTimer deadline={order.deadline} onExpire={handleExpire} size="lg" />
          ) : (
            <div className="flex items-center gap-2 text-chalk-orange font-chalk text-xl">
              <PartyPopper size={24} />
              拼单已截止，看看大家都点了啥 👀
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {isActive && (
            <div className="chalk-border rounded-lg p-5">
              <h2 className="font-chalk text-xl chalk-text text-chalk-yellow mb-4 flex items-center gap-2">
                ✏️ 我要参团
              </h2>

              <div className="mb-5">
                <ChalkInput
                  label="👷 你的名字"
                  placeholder="工友，怎么称呼你？"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                />
              </div>

              <h3 className="font-chalk text-lg chalk-text text-chalk mb-3">选择你想吃的 🍱</h3>
              <div className="grid gap-3 mb-5">
                {order.menu.map((item) => (
                  <MenuItemSelector
                    key={item.id}
                    item={item}
                    quantity={quantities[item.id] || 0}
                    onQuantityChange={handleQuantityChange}
                  />
                ))}
              </div>

              {submitError && (
                <p className="text-chalk-orange font-hand mb-3">{submitError}</p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-chalk/20">
                <div className="font-hand text-chalk/80">
                  {totalSelected > 0 ? (
                    <>
                      共 <span className="text-chalk-orange font-chalk text-xl">{totalSelected}</span> 份，
                      合计 <span className="text-chalk-orange font-chalk text-xl">¥{selectedAmount.toFixed(1)}</span>
                    </>
                  ) : (
                    <span className="text-chalk/50">还没选菜呢～</span>
                  )}
                </div>
                <ChalkButton variant="primary" onClick={handleSubmit}>
                  确认参团！
                </ChalkButton>
              </div>
            </div>
          )}

          <div className="chalk-border rounded-lg p-5">
            <h2 className="font-chalk text-xl chalk-text text-chalk-yellow mb-4 flex items-center gap-2">
              <Users size={22} />
              已参团工友 ({order.participants.length} 人)
            </h2>

            {order.participants.length === 0 ? (
              <p className="font-hand text-chalk/50 text-center py-6">
                还没有人参团，快来当第一个吧！
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {order.participants.map((p, idx) => {
                  const total = p.items.reduce((s, i) => s + i.quantity * i.menuItemPrice, 0);
                  return (
                    <StickyNote
                      key={p.id}
                      color={stickyColors[idx % stickyColors.length]}
                      rotate={stickyRotations[idx % stickyRotations.length]}
                      className="animate-chalk-write"
                    >
                      <div className="font-chalk text-xl text-wood-dark mb-2">
                        👷 {p.participantName}
                      </div>
                      <div className="space-y-1 mb-2">
                        {p.items.map((item) => (
                          <div key={item.id} className="font-hand text-wood-dark/80 text-sm flex justify-between">
                            <span>
                              {item.menuItemName} ×{item.quantity}
                            </span>
                            <span>¥{(item.quantity * item.menuItemPrice).toFixed(1)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-wood-dark/20 font-chalk text-wood-dark flex justify-between">
                        <span>小计</span>
                        <span className="text-chalk-orange">¥{total.toFixed(1)}</span>
                      </div>
                    </StickyNote>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="chalk-border rounded-lg p-5 sticky top-4">
            <h2 className="font-chalk text-2xl chalk-text text-chalk-orange mb-4 flex items-center gap-2">
              <Receipt size={24} />
              📊 订单汇总
            </h2>

            {summary && summary.participantCount > 0 ? (
              <>
                <div className="space-y-2 mb-5">
                  {summary.items
                    .filter((i) => i.totalQuantity > 0)
                    .map((item) => (
                      <div
                        key={item.menuItemId}
                        className="flex items-center justify-between font-hand text-chalk pb-2 border-b border-chalk/10 last:border-0 animate-count-up"
                      >
                        <span>
                          {item.name}
                          <span className="text-chalk-orange font-chalk ml-2">×{item.totalQuantity}</span>
                        </span>
                        <span className="text-chalk-yellow font-chalk">¥{item.subtotal.toFixed(1)}</span>
                      </div>
                    ))}
                </div>

                <div className="space-y-2 pt-4 border-t-2 border-chalk/30">
                  <div className="flex justify-between font-hand text-chalk/80">
                    <span>参团人数</span>
                    <span className="font-chalk text-chalk-green">{summary.participantCount} 人</span>
                  </div>
                  <div className="flex justify-between font-hand text-chalk/80">
                    <span>菜品总份数</span>
                    <span className="font-chalk">{summary.totalQuantity} 份</span>
                  </div>
                  <div className="flex justify-between pt-2 mt-2 border-t border-chalk/20">
                    <span className="font-chalk text-xl chalk-text text-chalk">合计金额</span>
                    <span className="font-chalk text-3xl chalk-text text-chalk-orange">
                      ¥{summary.totalAmount.toFixed(1)}
                    </span>
                  </div>
                </div>

                {!isActive && summary.participantCount > 0 && (
                  <div className="mt-5 p-3 rounded bg-chalk-orange/15 border border-chalk-orange/30">
                    <p className="font-hand text-chalk-yellow text-sm">
                      🍱 可以拿着这个汇总去餐馆下单啦！
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <div className="text-5xl mb-3">📝</div>
                <p className="font-hand text-chalk/50">
                  还没有订单数据，等工友们参团后这里会自动汇总
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Blackboard>
  );
}
