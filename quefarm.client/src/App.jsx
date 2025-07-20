import Header from './components/Header';
import Banner from './components/Banner';
import Footer from './components/Footer';
import Breadcrumb from './components/Breadcrumb';
import { CartProvider } from './context/CartContext.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetail from './features/product/ProductDetail';
import ProductList from './features/product/ProductList';
import Cart from './features/cart/Cart';
import Checkout from './features/cart/Checkout';

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/category/:categorySlug" element={<ProductList />} />
          <Route path="/search" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold mb-4">Giới Thiệu</h1><p>Đang cập nhật...</p></div>} />
          <Route path="/contact" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold mb-4">Liên Hệ</h1><p>Đang cập nhật...</p></div>} />
          <Route path="/promotion" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold mb-4">Khuyến Mãi</h1><p>Đang cập nhật...</p></div>} />
          <Route path="/help" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold mb-4">Hỗ Trợ Mua Hàng</h1><p>Đang cập nhật...</p></div>} />
          <Route path="*" element={<div className="container mx-auto px-4 py-8 text-center"><h1 className="text-2xl font-bold mb-4">404 - Không tìm thấy trang</h1><p>Trang bạn đang tìm kiếm không tồn tại.</p></div>} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;