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
    </header>
  );
}

export default Header; 