import { useState } from 'react';
import CategoryAdmin from '../features/admin/CategoryAdmin';
import ProductAdmin from '../features/admin/ProductAdmin';
import AdminLayout from './AdminLayout';

function StatisticsAdmin() {
  return (
    <div className="text-center py-12 text-gray-500">Chức năng thống kê sẽ sớm có!</div>
  );
}

function OrderAdmin() {
  return (
    <div className="text-center py-12 text-gray-500">Chức năng quản lý đơn hàng sẽ sớm có!</div>
  );
}

function RatingAdmin() {
  return (
    <div className="text-center py-12 text-gray-500">Chức năng quản lý đánh giá sẽ sớm có!</div>
  );
}

function FeedbackAdmin() {
  return (
    <div className="text-center py-12 text-gray-500">Chức năng quản lý phản hồi sẽ sớm có!</div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState('statistics');
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = '/admin/login';
    return null;
  }
  return (
    <AdminLayout tab={tab} setTab={setTab}>
      {tab === 'statistics' && <StatisticsAdmin />}
      {tab === 'order' && <OrderAdmin />}
      {tab === 'category' && <CategoryAdmin />}
      {tab === 'product' && <ProductAdmin />}
      {tab === 'rating' && <RatingAdmin />}
      {tab === 'feedback' && <FeedbackAdmin />}
    </AdminLayout>
  );
} 