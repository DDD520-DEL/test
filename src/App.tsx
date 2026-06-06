import { Routes, Route, Navigate } from 'react-router-dom';
import OrderListPage from '@/pages/OrderListPage';
import CreateOrderPage from '@/pages/CreateOrderPage';
import OrderDetailPage from '@/pages/OrderDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<OrderListPage />} />
      <Route path="/create" element={<CreateOrderPage />} />
      <Route path="/order/:id" element={<OrderDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
