import { CartProvider } from './context/CartContext.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Main Pages
import HomePage from './pages/HomePage';
import ProductDetail from './features/product/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import ProductList from './features/product/ProductList';
import Cart from './features/cart/Cart';
import Checkout from './features/cart/Checkout';

// Admin Pages
import AdminLogin from './pages/LoginPage';
import Dashboard from './features/admin/Dashboard';
import ProductManagement from './features/admin/product/ProductManagement';
import CategoryManagement from './features/admin/category/CategoryManagement';

// Static Pages
const StaticPage = ({ title }) => (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p>Đang cập nhật...</p>
    </div>
);

const NotFoundPage = () => (
    <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">404 - Không tìm thấy trang</h1>
        <p>Trang bạn đang tìm kiếm không tồn tại.</p>
    </div>
);


function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="homepage" element={<HomePage />} />
            <Route path="products" element={<ProductList />} />
            <Route path="category/:categorySlug" element={<CategoryPage />} />
            <Route path="search" element={<ProductList />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            
            {/* Static Pages */}
            <Route path="about" element={<StaticPage title="Giới Thiệu" />} />
            <Route path="contact" element={<StaticPage title="Liên Hệ" />} />
            <Route path="promotion" element={<StaticPage title="Khuyến Mãi" />} />
            <Route path="help" element={<StaticPage title="Hỗ Trợ Mua Hàng" />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products/*" element={<ProductManagement />} />
            <Route path="categories/*" element={<CategoryManagement />} />
            <Route path="*" element={<div>Page not found in Admin</div>} />
          </Route>
          
          {/* Admin Login Route (no layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
