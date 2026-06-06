import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ChefHat, User, Clock, ClipboardList } from 'lucide-react';
import Blackboard from '@/components/Blackboard';
import ChalkButton from '@/components/ChalkButton';
import ChalkInput from '@/components/ChalkInput';
import { useOrderStore } from '@/store/useOrderStore';
import { getDefaultDeadline } from '@/utils/time';
import { generateId } from '@/utils/id';

interface MenuItemForm {
  id: string;
  name: string;
  price: string;
}

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const createOrder = useOrderStore((s) => s.createOrder);

  const [restaurantName, setRestaurantName] = useState('');
  const [initiatorName, setInitiatorName] = useState('');
  const [deadline, setDeadline] = useState(() => {
    const d = new Date(getDefaultDeadline());
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  });

  const [menuItems, setMenuItems] = useState<MenuItemForm[]>([
    { id: generateId(), name: '', price: '' },
    { id: generateId(), name: '', price: '' },
    { id: generateId(), name: '', price: '' },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addMenuItem = () => {
    setMenuItems([...menuItems, { id: generateId(), name: '', price: '' }]);
  };

  const removeMenuItem = (id: string) => {
    if (menuItems.length <= 1) return;
    setMenuItems(menuItems.filter((m) => m.id !== id));
  };

  const updateMenuItem = (id: string, field: 'name' | 'price', value: string) => {
    setMenuItems(
      menuItems.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!restaurantName.trim()) newErrors.restaurantName = '请填写餐馆名称';
    if (!initiatorName.trim()) newErrors.initiatorName = '请填写你的名字';
    if (!deadline) {
      newErrors.deadline = '请选择截止时间';
    } else if (new Date(deadline).getTime() <= Date.now()) {
      newErrors.deadline = '截止时间必须在当前时间之后';
    }

    const validMenu = menuItems.filter((m) => m.name.trim() && m.price.trim());
    if (validMenu.length === 0) {
      newErrors.menu = '至少添加一道菜品';
    }

    validMenu.forEach((m) => {
      const p = parseFloat(m.price);
      if (isNaN(p) || p <= 0) {
        newErrors[`price_${m.id}`] = '价格必须是正数';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const validMenu = menuItems
      .filter((m) => m.name.trim() && m.price.trim())
      .map((m) => ({
        name: m.name.trim(),
        price: parseFloat(m.price),
      }));

    const orderId = createOrder({
      restaurantName: restaurantName.trim(),
      initiatorName: initiatorName.trim(),
      deadline: new Date(deadline).toISOString(),
      menu: validMenu,
    });

    navigate(`/order/${orderId}`);
  };

  return (
    <Blackboard>
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-1 text-chalk/70 hover:text-chalk font-hand transition-colors">
          <ArrowLeft size={18} />
          返回拼单列表
        </Link>
      </div>

      <h1 className="font-chalk text-3xl sm:text-4xl chalk-text text-chalk mb-8 flex items-center gap-2">
        <ClipboardList size={32} className="text-chalk-orange" />
        发起新拼单
      </h1>

      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="chalk-border rounded-lg p-5 space-y-5">
          <h2 className="font-chalk text-xl chalk-text text-chalk-yellow flex items-center gap-2">
            <ChefHat size={22} />
            拼单信息
          </h2>

          <div>
            <ChalkInput
              label="🍱 餐馆名称"
              placeholder="例如：老王家盒饭"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
            />
            {errors.restaurantName && (
              <p className="text-chalk-orange text-sm font-hand mt-1">{errors.restaurantName}</p>
            )}
          </div>

          <div>
            <ChalkInput
              label="👷 发起人姓名"
              placeholder="你的大名"
              value={initiatorName}
              onChange={(e) => setInitiatorName(e.target.value)}
            />
            {errors.initiatorName && (
              <p className="text-chalk-orange text-sm font-hand mt-1">{errors.initiatorName}</p>
            )}
          </div>

          <div>
            <label className="block font-chalk text-chalk/80 text-base chalk-text mb-1 flex items-center gap-2">
              <Clock size={18} />
              ⏰ 截止时间
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="input-chalk"
              style={{ colorScheme: 'dark' }}
            />
            {errors.deadline && (
              <p className="text-chalk-orange text-sm font-hand mt-1">{errors.deadline}</p>
            )}
          </div>
        </div>

        <div className="chalk-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-chalk text-xl chalk-text text-chalk-yellow flex items-center gap-2">
              📋 菜单菜品
            </h2>
            <ChalkButton onClick={addMenuItem} className="!py-1.5 !px-4 !text-base">
              <Plus size={16} className="inline mr-1" />
              添加一道菜
            </ChalkButton>
          </div>

          {errors.menu && (
            <p className="text-chalk-orange text-sm font-hand mb-3">{errors.menu}</p>
          )}

          <div className="space-y-3">
            {menuItems.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-3 animate-chalk-write">
                <span className="font-chalk text-chalk/60 w-6 text-right">{idx + 1}.</span>
                <input
                  type="text"
                  placeholder="菜名，如红烧肉饭"
                  value={item.name}
                  onChange={(e) => updateMenuItem(item.id, 'name', e.target.value)}
                  className="input-chalk flex-1"
                />
                <div className="relative flex items-center">
                  <span className="text-chalk/60 font-chalk mr-1">¥</span>
                  <input
                    type="number"
                    placeholder="价格"
                    min="0"
                    step="0.5"
                    value={item.price}
                    onChange={(e) => updateMenuItem(item.id, 'price', e.target.value)}
                    className="input-chalk !w-24"
                  />
                </div>
                <button
                  onClick={() => removeMenuItem(item.id)}
                  disabled={menuItems.length <= 1}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-chalk/60 hover:text-chalk-orange hover:bg-chalk-orange/10 transition-all disabled:opacity-30 disabled:hover:text-chalk/60 disabled:hover:bg-transparent"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {menuItems.length > 0 && (
            <div className="mt-5 pt-4 border-t border-chalk/20">
              <p className="font-hand text-chalk/60 text-sm">
                提示：菜名和价格都填写了才算有效菜品
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center pt-4">
          <ChalkButton variant="primary" onClick={handleSubmit} className="text-xl !px-10">
            ✅ 确认发起拼单
          </ChalkButton>
        </div>
      </div>
    </Blackboard>
  );
}
