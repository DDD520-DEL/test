## 1. 架构设计

```mermaid
flowchart LR
    subgraph "前端 (React + TypeScript)"
        A["拼单列表页"] --> B["状态管理层 (Zustand)"]
        C["发起拼单页"] --> B
        D["拼单详情页"] --> B
        B --> E["本地存储 (LocalStorage)"]
        F["路由层 (React Router)"] --> A
        F --> C
        F --> D
    end
    subgraph "UI 层"
        G["Tailwind CSS 样式"]
        H["粉笔/黑板风格组件"]
    end
    A --> G
    C --> G
    D --> G
    G --> H
```

纯前端单页应用，无需后端服务，数据持久化通过浏览器 LocalStorage 实现。

## 2. 技术描述

- **前端框架**：React@18 + TypeScript
- **构建工具**：Vite@5
- **样式方案**：Tailwind CSS@3（自定义黑板/粉笔主题配置）
- **状态管理**：Zustand（轻量级store，管理拼单数据、参团数据）
- **路由管理**：React Router DOM@6
- **图标库**：Lucide React
- **数据存储**：浏览器 LocalStorage（JSON序列化存储拼单和订单数据）
- **项目模板**：react-ts（纯前端项目，无后端）

## 3. 路由定义

| 路由路径 | 页面组件 | 页面用途 |
|----------|----------|----------|
| `/` | OrderListPage | 拼单列表首页，展示所有拼单 |
| `/create` | CreateOrderPage | 发起新拼单表单页 |
| `/order/:id` | OrderDetailPage | 拼单详情页，参团点单、查看汇总 |
| `*` | OrderListPage | 404重定向到首页 |

## 4. 数据模型

### 4.1 数据模型定义

```mermaid
erDiagram
    GROUP_ORDER {
        string id PK "拼单ID"
        string restaurantName "餐馆名称"
        string initiatorName "发起人姓名"
        datetime deadline "截止时间"
        string status "状态: active/ended"
        datetime createdAt "创建时间"
    }
    
    MENU_ITEM {
        string id PK "菜品ID"
        string groupOrderId FK "所属拼单ID"
        string name "菜名"
        number price "价格(元)"
    }
    
    PARTICIPANT_ORDER {
        string id PK "参团订单ID"
        string groupOrderId FK "所属拼单ID"
        string participantName "参团人姓名"
        datetime createdAt "参团时间"
    }
    
    ORDER_ITEM {
        string id PK "订单项ID"
        string participantOrderId FK "所属参团订单ID"
        string menuItemId FK "菜品ID"
        string menuItemName "菜品名称快照"
        number menuItemPrice "菜品价格快照"
        number quantity "数量"
    }
    
    GROUP_ORDER ||--o{ MENU_ITEM : "包含"
    GROUP_ORDER ||--o{ PARTICIPANT_ORDER : "有多个参团"
    PARTICIPANT_ORDER ||--o{ ORDER_ITEM : "包含多个菜品"
```

### 4.2 TypeScript 类型定义

```typescript
interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  menuItemPrice: number;
  quantity: number;
}

interface ParticipantOrder {
  id: string;
  participantName: string;
  items: OrderItem[];
  createdAt: string;
}

interface GroupOrder {
  id: string;
  restaurantName: string;
  initiatorName: string;
  deadline: string;
  status: 'active' | 'ended';
  menu: MenuItem[];
  participants: ParticipantOrder[];
  createdAt: string;
}

interface GroupOrderStore {
  orders: GroupOrder[];
  createOrder: (data: Omit<GroupOrder, 'id' | 'status' | 'participants' | 'createdAt'>) => string;
  addParticipant: (orderId: string, participant: Omit<ParticipantOrder, 'id' | 'createdAt'>) => void;
  endOrder: (orderId: string) => void;
  getOrderById: (id: string) => GroupOrder | undefined;
}
```

## 5. 目录结构

```
src/
├── components/           # 可复用组件
│   ├── Blackboard.tsx        # 黑板容器组件
│   ├── ChalkButton.tsx       # 粉笔风格按钮
│   ├── ChalkInput.tsx        # 粉笔输入框
│   ├── CountdownTimer.tsx    # 倒计时组件
│   ├── OrderCard.tsx         # 拼单卡片
│   ├── StickyNote.tsx        # 便签纸组件
│   └── MenuItemSelector.tsx  # 菜品选择器
├── pages/                # 页面组件
│   ├── OrderListPage.tsx     # 拼单列表页
│   ├── CreateOrderPage.tsx   # 发起拼单页
│   └── OrderDetailPage.tsx   # 拼单详情页
├── store/                # 状态管理
│   └── useOrderStore.ts      # Zustand store
├── types/                # TypeScript类型
│   └── index.ts
├── utils/                # 工具函数
│   ├── id.ts                 # ID生成器
│   ├── storage.ts            # LocalStorage封装
│   └── time.ts               # 时间格式化
├── App.tsx               # 根组件（路由配置）
├── main.tsx              # 入口文件
└── index.css             # 全局样式（Tailwind + 粉笔主题）
```
