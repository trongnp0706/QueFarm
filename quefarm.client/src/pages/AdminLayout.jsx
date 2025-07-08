import { useState } from 'react';
import { ShoppingCartOutlined, AppstoreOutlined, ReloadOutlined, StarOutlined, MessageOutlined, LogoutOutlined, BarChartOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SearchOutlined } from '@ant-design/icons';

const MENU = [
  { key: 'statistics', label: 'Thống kê', icon: <BarChartOutlined /> },
  { key: 'order', label: 'Đơn hàng', icon: <ShoppingCartOutlined /> },
  { key: 'category', label: 'Danh mục', icon: <AppstoreOutlined /> },
  { key: 'product', label: 'Sản phẩm', icon: <ReloadOutlined /> },
  { key: 'rating', label: 'Đánh giá', icon: <StarOutlined /> },
  { key: 'feedback', label: 'Phản hồi', icon: <MessageOutlined /> },
];

export default function AdminLayout({ tab, setTab, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen flex bg-amber-50">
      <aside className={`bg-white shadow-lg flex flex-col py-6 transition-all duration-300 relative ${collapsed ? 'w-16 px-2' : 'w-56 px-4'}`}>
        {/* Nút thu gọn ở trên cùng, căn giữa */}
        <div className={`flex justify-center ${collapsed ? 'mb-2' : 'mb-4'}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition"
            title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            style={{ marginTop: 0 }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>
        {/* Logo */}
        <div className={`mb-8 flex items-center gap-2 ${collapsed ? 'justify-center' : ''} mt-2`} style={{ marginTop: collapsed ? 0 : 8 }}>
          <img src="/logo.png" alt="Logo" className="w-10 h-10 flex-shrink-0" />
          {!collapsed && <span className="font-bold text-green-700 text-xl">Quê Farm</span>}
        </div>
        <nav className="flex flex-col gap-2">
          {MENU.map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-base transition text-left
                ${tab === item.key ? 'bg-amber-400 text-orange-900 shadow' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
              title={collapsed ? item.label : ''}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
          }}
          className="mt-auto flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-base transition text-left bg-red-100 text-red-700 hover:bg-red-200"
          title={collapsed ? 'Đăng xuất' : ''}
        >
          <span className="text-lg flex-shrink-0"><LogoutOutlined /></span>
          {!collapsed && <span>Đăng xuất</span>}
        </button>
        {!collapsed && <div className="mt-4 pt-4 text-xs text-gray-400 text-center border-t">© Quê Farm Admin</div>}
      </aside>
      <main className="flex-1 p-0 md:p-0 bg-amber-50">
        {/* Top bar full width */}
        <div className="w-full h-14 flex items-center justify-center bg-white shadow-sm border-b border-amber-100 mb-6 sticky top-0 z-20">
          <div className="w-full max-w-2xl px-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 text-lg"><SearchOutlined /></span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-amber-200 bg-white shadow focus:ring-2 focus:ring-amber-300 outline-none text-base"
                placeholder="Tìm kiếm..."
              />
            </div>
          </div>
        </div>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
} 