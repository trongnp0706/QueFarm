import { Link } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiSearch } from 'react-icons/fi';

function Header() {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-2 px-4">
        {/* Logo và hotline */}
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="h-14 w-14 object-contain rounded-full border-2 border-green-500 bg-white shadow" />
          <div className="hidden md:block">
            <div className="font-bold text-green-700 text-xl tracking-wide">Quê Farm</div>
            <div className="text-xs text-green-600 font-medium">Đặc sản vùng miền</div>
          </div>
        </div>
        {/* Menu ngang */}
        <nav className="flex-1 flex justify-center gap-6 text-gray-700 text-base font-medium">
          <Link to="/" className="hover:text-green-700 transition">Trang chủ</Link>
          <a href="#" className="hover:text-green-700 transition">Giới Thiệu</a>
          <a href="#" className="hover:text-green-700 transition">Hướng dẫn mua hàng</a>
          <a href="#" className="hover:text-green-700 transition">Tin Tức Đặc Sản</a>
          <a href="#" className="hover:text-green-700 transition">Liên Hệ</a>
        </nav>
        {/* Hotline và giỏ hàng */}
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <div className="text-right">
            <div className="text-xs text-gray-500">Đặt hàng</div>
            <div className="text-green-700 font-bold text-lg">0835286779</div>
          </div>
          <Link to="/cart" className="border border-green-600 text-green-700 px-3 py-1 rounded flex items-center gap-1 hover:bg-green-50 transition">
            <FiShoppingCart className="text-xl" /> Giỏ hàng
          </Link>
        </div>
      </div>
      {/* Thanh tìm kiếm và danh mục */}
      <div className="bg-green-100 py-2 border-t border-green-200">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-4 px-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 shadow hover:bg-green-700 transition">
            <FiMenu className="text-lg" /> DANH MỤC SẢN PHẨM
          </button>
          <div className="flex-1 flex items-center gap-2">
            <input type="text" placeholder="Tìm kiếm sản phẩm" className="flex-1 border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition" />
            <button className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">
              <FiSearch className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 