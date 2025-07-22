<<<<<<< HEAD
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined, MenuOutlined, SearchOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Input, Dropdown, Modal, Form, Checkbox } from 'antd';
import { useState } from 'react';
import { message } from 'antd';
import CategoryMenu from '../features/category/CategoryMenu';

function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate();

  // categories đã được fetch trong CategoryMenu

  const menuItems = [
    { key: 'home', label: <Link to="/">TRANG CHỦ</Link> },
    { key: 'about', label: <Link to="#">GIỚI THIỆU</Link> },
    { key: 'products', label: <Link to="#">SẢN PHẨM</Link> },
    { key: 'jobs', label: <Link to="#">TUYỂN DỤNG</Link> },
    { key: 'news', label: <Link to="#">TIN TỨC</Link> },
    { key: 'contact', label: <Link to="#">LIÊN HỆ</Link> },
  ];

  const handleLogin = async (values) => {
    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });
      if (!res.ok) throw new Error('Tài khoản hoặc mật khẩu không đúng!');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      message.success('Đăng nhập thành công!');
      setLoginOpen(false);
      navigate('/admin');
    } catch (err) {
      message.error(err.message || 'Đăng nhập thất bại!');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      {/* Top main bar */}
      <div className="w-full flex items-center justify-between px-4 py-3 md:py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-3 min-w-[180px]">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain rounded-full bg-white border-2 border-green-600" />
          <span className="text-2xl font-bold text-green-700 tracking-tight">Quê Farm</span>
        </div>
        {/* Search bar */}
        <div className="flex-1 max-w-xl mx-4">
          <Input.Search
            size="large"
            placeholder="Tìm kiếm..."
            enterButton={<SearchOutlined />}
            className="rounded-lg"
          />
        </div>
        {/* Hotline, Cart, User */}
        <div className="flex items-center gap-4 min-w-[340px] justify-end">
          <div className="flex items-center gap-2">
            <div className="bg-green-50 rounded-full p-2">
              <PhoneOutlined className="text-green-600 text-lg" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-gray-500">Hỗ trợ khách hàng</span>
              <span className="text-green-700 font-bold text-base">0988382xxx</span>
            </div>
          </div>
          <Link to="/cart">
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              className="bg-green-600 border-green-600 hover:bg-green-700 font-semibold flex items-center"
              size="large"
            >
              GIỎ HÀNG
            </Button>
          </Link>
          <Button
            icon={<UserOutlined />}
            className="bg-green-600 border-green-600 hover:bg-green-700 text-white font-semibold flex items-center px-5"
            size="large"
            onClick={() => setLoginOpen(true)}
          >
            ĐĂNG NHẬP
          </Button>
        </div>
      </div>
      {/* Green menu bar */}
      <nav className="w-full bg-green-600">
        <div className="max-w-7xl mx-auto flex items-center">
          {/* Danh mục sản phẩm dropdown - hover để hiện */}
          <div className="relative group h-12 flex items-center px-0">
            {/* Nút menu */}
            <div className="h-12 flex items-center px-5 text-white font-semibold text-base hover:bg-green-700 cursor-pointer transition-all uppercase select-none w-[240px]">
              <MenuOutlined className="mr-2 text-lg" />
              Danh mục sản phẩm
            </div>
            {/* Dropdown chỉ hiện khi hover */}
            <div className="absolute left-0 top-full z-50 hidden group-hover:block min-w-full">
              <CategoryMenu onSelect={id => { if (id) navigate(`/category/${id}`); }} />
            </div>
          </div>
          {/* Main menu */}
          <div className="flex-1 flex items-center h-12">
            {menuItems.map(item => (
              <div key={item.key} className="h-full flex items-center px-5 text-white font-semibold text-base hover:bg-green-700 cursor-pointer transition-all uppercase">
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </nav>
      {/* Login Modal */}
      <Modal
        open={loginOpen}
        onCancel={() => setLoginOpen(false)}
        footer={null}
        centered
        width={500}
        bodyStyle={{ padding: 32 }}
        title={<span className="text-2xl font-bold text-gray-700">ĐĂNG NHẬP</span>}
      >
        <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
          <Form.Item label="Tên tài khoản hoặc địa chỉ email *" name="username" rules={[{ required: true, message: 'Vui lòng nhập tài khoản hoặc email!' }]}> 
            <Input size="large" autoFocus />
          </Form.Item>
          <Form.Item label="Mật khẩu *" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}> 
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" className="mb-2">
            <Checkbox>Ghi nhớ mật khẩu</Checkbox>
          </Form.Item>
          <Form.Item className="mb-2">
            <Button type="primary" htmlType="submit" loading={loginLoading} className="bg-green-700 border-green-700 hover:bg-green-800 w-full h-11 text-base font-bold">
              ĐĂNG NHẬP
            </Button>
          </Form.Item>
          <div className="flex justify-between items-center">
            <Link to="#" className="text-green-700 hover:underline text-sm">Quên mật khẩu?</Link>
          </div>
        </Form>
      </Modal>
=======
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch } from 'react-icons/fi';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function Header() {
  const { cart } = useContext(CartContext);
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <header className="bg-green-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        {/* Logo, Search, and Cart */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Viet Specialties" className="h-24 w-24" />
          </Link>
          
          <div className="flex-1 mx-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-green-700 text-white border border-green-600 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-green-300"
              />
              <button className="absolute right-0 top-0 h-full bg-transparent px-4 text-white">
                <FiSearch className="text-xl" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <Link to="/account" className="text-white mr-4 flex items-center">
              <FiUser className="text-xl mr-1" />
              <span className="hidden md:inline">Tài khoản</span>
            </Link>
            
            <Link to="/cart" className="text-white flex items-center">
              <div className="relative">
                <FiShoppingCart className="text-2xl" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-xs text-green-900 font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="ml-2 hidden md:block">
                <div className="text-xs text-green-300">CART / 0₫</div>
                <div className="font-semibold">{totalItems} sản phẩm</div>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex flex-wrap mt-2">
          <Link to="/" className="text-white font-medium py-2 px-4 border-r border-green-700 hover:bg-green-700">
            ĐẶC SẢN VÙNG MIỀN VIỆT NAM
          </Link>
          <Link to="/products" className="text-white font-medium py-2 px-4 border-r border-green-700 hover:bg-green-700">
            TẤT CẢ SẢN PHẨM
          </Link>
          <Link to="/about" className="text-white font-medium py-2 px-4 border-r border-green-700 hover:bg-green-700">
            GIỚI THIỆU
          </Link>
          <Link to="/promotion" className="text-white font-medium py-2 px-4 border-r border-green-700 hover:bg-green-700">
            KHUYẾN MÃI
          </Link>
          <Link to="/help" className="text-white font-medium py-2 px-4 border-r border-green-700 hover:bg-green-700">
            HỖ TRỢ MUA HÀNG
          </Link>
          <Link to="/contact" className="text-white font-medium py-2 px-4 hover:bg-green-700">
            LIÊN HỆ
          </Link>
        </nav>
      </div>
>>>>>>> dev-base
    </header>
  );
}

export default Header; 