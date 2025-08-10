import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch, FiMenu } from 'react-icons/fi'; // Added FiMenu
import { useContext, useState } from 'react'; // Added useState
import { CartContext } from '../context/CartContext';
import AdminLoginModal from './AdminLoginModal';

function Header() {
  const { cart } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Function to check if a link is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleAccountClick = () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin');
    } else {
      setShowLogin(true);
    }
  };

  return (
    <header className="header-container text-white sticky top-0 z-50 shadow-lg border-b-2 border-brand-green-600">
      <div className="container mx-auto px-4 py-3">
        {/* Logo, Search, and Cart */}
        <div className="flex items-center justify-between">
          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="header-action-btn">
              <FiMenu className="text-2xl" />
            </button>
          </div>

          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Quê Farm" className="h-16 w-16 md:h-20 md:w-20 rounded-full border-2 border-brand-green-400 shadow-lg" />
          </Link>

          <div className="hidden md:flex flex-1 mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full bg-white text-gray-800 border-2 border-brand-green-400 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow-400 placeholder-gray-500 transition-all"
              />
              <button className="absolute right-0 top-0 h-full bg-transparent px-4 text-brand-green-600 hover:text-brand-green-700 transition-colors">
                <FiSearch className="text-xl" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={handleAccountClick} className="header-action-btn">
              <FiUser className="text-xl md:mr-2" />
              <span className="hidden md:inline font-medium">Tài khoản</span>
            </button>

            <Link to="/cart" className="header-action-btn">
              <div className="relative">
                <FiShoppingCart className="text-2xl" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-yellow-500 text-brand-brown-900 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="ml-2 hidden lg:block">
                <div className="text-xs text-gray-200">GIỎ HÀNG</div>
                <div className="font-semibold">{totalItems} sản phẩm</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className={`flex-col md:flex-row md:flex flex-wrap justify-center mt-3 pt-2 border-t border-brand-green-400/30 ${isMenuOpen ? 'flex' : 'hidden'}`}>
          <Link 
            to="/" 
            className={`header-nav-link w-full md:w-auto ${isActive('/') ? 'active' : ''}`}
          >
            ĐẶC SẢN VÙNG MIỀN VIỆT NAM
          </Link>
          <Link 
            to="/products" 
            className={`header-nav-link w-full md:w-auto ${isActive('/products') ? 'active' : ''}`}
          >
            TẤT CẢ SẢN PHẨM
          </Link>
          <Link 
            to="/about" 
            className={`header-nav-link w-full md:w-auto ${isActive('/about') ? 'active' : ''}`}
          >
            GIỚI THIỆU
          </Link>
          <Link 
            to="/promotion" 
            className={`header-nav-link w-full md:w-auto ${isActive('/promotion') ? 'active' : ''}`}
          >
            KHUYẾN MÃI
          </Link>
          <Link 
            to="/help" 
            className={`header-nav-link w-full md:w-auto ${isActive('/help') ? 'active' : ''}`}
          >
            HỖ TRỢ MUA HÀNG
          </Link>
          <Link 
            to="/contact" 
            className={`header-nav-link w-full md:w-auto ${isActive('/contact') ? 'active' : ''}`}
          >
            LIÊN HỆ
          </Link>
        </nav>
        
        {/* Search bar for mobile */}
        <div className="md:hidden mt-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full bg-white text-gray-800 border-2 border-brand-green-400 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow-400 placeholder-gray-500 transition-all"
              />
              <button className="absolute right-0 top-0 h-full bg-transparent px-4 text-brand-green-600 hover:text-brand-green-700 transition-colors">
                <FiSearch className="text-xl" />
              </button>
            </div>
          </div>
      </div>
      <AdminLoginModal open={showLogin} onClose={() => setShowLogin(false)} onSuccess={() => navigate('/admin')} />
    </header>
  );
}

export default Header;
