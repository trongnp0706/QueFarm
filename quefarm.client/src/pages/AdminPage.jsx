import { useState } from 'react';
import CategoryAdmin from '../features/admin/CategoryAdmin';
import ProductAdmin from '../features/admin/ProductAdmin';
import { UserOutlined, ReloadOutlined } from '@ant-design/icons';

function AccountAdmin() {
  return (
    <div className="text-center py-12 text-gray-500">Chức năng quản lý tài khoản sẽ sớm có!</div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState('category');
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = '/admin/login';
    return null;
  }
  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex gap-6 mb-6 bg-yellow-400 rounded px-6 py-3 items-center">
        <button
          onClick={() => setTab('category')}
          className={`flex items-center gap-2 px-3 py-1 rounded font-semibold text-base transition focus-visible:!outline-white ${tab === 'account' ? 'text-white' : 'text-white/80'}`}
        >
          <UserOutlined className="text-lg" />
          Danh mục
        </button>
        <button
          onClick={() => setTab('product')}
          className={`flex items-center gap-2 px-3 py-1 rounded font-semibold text-base transition focus-visible:!outline-white ${tab === 'product' ? 'text-white' : 'text-white/80'}`}
        >
          <ReloadOutlined className="text-lg" />
          Sản phẩm
        </button>
      </div>
      <div>
        {tab === 'category' && <CategoryAdmin />}
        {tab === 'product' && <ProductAdmin />}
      </div>
    </div>
  );
} 