import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, MenuOutlined, SearchOutlined, PhoneOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Input, Badge, Dropdown, Space, Drawer } from 'antd';
import { useState } from 'react';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { key: 'home', label: <Link to="/" onClick={() => setMobileMenuOpen(false)}>Trang chủ</Link> },
    { key: 'about', label: <a href="#" onClick={() => setMobileMenuOpen(false)}>Giới thiệu</a> },
    { key: 'guide', label: <a href="#" onClick={() => setMobileMenuOpen(false)}>Hướng dẫn mua hàng</a> },
    { key: 'news', label: <a href="#" onClick={() => setMobileMenuOpen(false)}>Tin tức đặc sản</a> },
    { key: 'contact', label: <a href="#" onClick={() => setMobileMenuOpen(false)}>Liên hệ</a> },
  ];

  const categoryItems = [
    { key: '1', label: 'Rau củ quả' },
    { key: '2', label: 'Thịt tươi' },
    { key: '3', label: 'Hải sản' },
    { key: '4', label: 'Gia vị' },
    { key: '5', label: 'Đồ khô' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-amber-300 text-amber-900 py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 md:gap-4">
              <span className="flex items-center gap-1 text-xs md:text-sm">
                <PhoneOutlined />
                <span className="hidden sm:inline">Hotline: 0835286779</span>
                <span className="sm:hidden">0835286779</span>
              </span>
              <span className="hidden md:inline">Miễn phí vận chuyển cho đơn hàng từ 500k</span>
              <span className="md:hidden text-xs">Freeship từ 500k</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <a href="/admin/login" className="hover:text-green-200 transition">Đăng nhập</a>
              <a href="#" className="hover:text-green-200 transition">Đăng ký</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3">
            <img src="/logo.png" alt="Logo Quê Farm" className="w-10 h-10 md:w-14 md:h-14 object-contain rounded-full border-2 border-green-500 bg-white shadow" />
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-green-700">Quê Farm</h1>
              <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Đặc sản vùng miền</p>
            </div>
          </div>

          {/* Search bar - hidden on mobile */}
          <div className="flex-1 max-w-2xl mx-4 hidden lg:block">
            <Input
              size="large"
              placeholder="Tìm kiếm sản phẩm..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className="rounded-full"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/cart">
              <Badge count={0} size="small">
                <Button 
                  type="primary" 
                  icon={<ShoppingCartOutlined />}
                  className="bg-green-600 border-green-600 hover:bg-green-700"
                  size="middle"
                >
                  <span className="hidden sm:inline">Giỏ hàng</span>
                </Button>
              </Badge>
            </Link>
            
            {/* Mobile menu button */}
            <Button 
              type="text" 
              icon={<MenuOutlined />}
              size="large"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Category dropdown */}
            <Dropdown
              menu={{ items: categoryItems }}
              placement="bottomLeft"
              trigger={['click']}
            >
              <Button 
                type="primary" 
                icon={<MenuOutlined />}
                size="large"
                className="bg-amber-300 border-amber-300 hover:bg-amber-400 hover:border-amber-400 text-orange-900 text-xs md:text-sm"
              >
                <span className="hidden sm:inline">DANH MỤC SẢN PHẨM</span>
                <span className="sm:hidden">DANH MỤC</span>
              </Button>
            </Dropdown>

            {/* Navigation menu - hidden on mobile */}
            <nav className="hidden md:flex items-center gap-6">
              {menuItems.map(item => (
                <div key={item.key} className="py-4">
                  {item.label}
                </div>
              ))}
            </nav>

            {/* Spacer for mobile */}
            <div className="md:hidden w-8"></div>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="lg:hidden bg-white border-t border-gray-100 p-3">
        <Input
          size="large"
          placeholder="Tìm kiếm sản phẩm..."
          prefix={<SearchOutlined className="text-gray-400" />}
          className="rounded-full"
        />
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo Quê Farm" className="w-8 h-8 object-contain rounded-full border-2 border-green-500" />
            <span className="text-lg font-bold text-green-700">Quê Farm</span>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        closeIcon={<CloseOutlined />}
      >
        <div className="space-y-4">
          {/* User actions */}
          <div className="flex gap-2 mb-6">
            <Button type="primary" icon={<UserOutlined />} className="flex-1 bg-green-600 border-green-600">
              Đăng nhập
            </Button>
            <Button className="flex-1">Đăng ký</Button>
          </div>

          {/* Navigation menu */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 mb-3">Menu chính</h3>
            {menuItems.map(item => (
              <div key={item.key} className="py-2 border-b border-gray-100">
                {item.label}
              </div>
            ))}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 mb-3">Danh mục sản phẩm</h3>
            {categoryItems.map(item => (
              <div key={item.key} className="py-2 border-b border-gray-100">
                <a href="#" className="text-gray-700 hover:text-green-600">{item.label}</a>
              </div>
            ))}
          </div>

          {/* Contact info */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Liên hệ</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Hotline: 0835286779</p>
              <p>Freeship từ 500k</p>
            </div>
          </div>
        </div>
      </Drawer>
    </header>
  );
}

export default Header; 