import Header from './components/Header';
import Banner from './components/Banner';
import Footer from './components/Footer';
import Breadcrumb from './components/Breadcrumb';
import FloatingActionButton from './components/FloatingActionButton';
import { CartProvider } from './context/CartContext.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetail from './features/product/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import ProductList from './features/product/ProductList';
import Cart from './features/cart/Cart';
import Checkout from './features/cart/Checkout';
import AdminLogin from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './features/admin/Dashboard';
import ProductManagement from './features/admin/product/ProductManagement';
import CategoryManagement from './features/admin/category/CategoryManagement';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products/*" element={<ProductManagement />} />
            <Route path="categories/*" element={<CategoryManagement />} />
            <Route path="*" element={<div>Page not found in Admin</div>} />
          </Route>
          
          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Header />
              <HomePage />
              <Footer />
              <FloatingActionButton />
            </>
          } />
          <Route path="/homepage" element={
            <>
              <Header />
              <HomePage />
              <Footer />
              <FloatingActionButton />
            </>
          } />
          <Route path="/products" element={
            <>
              <Header />
              <Breadcrumb />
              <ProductList />
              <Footer />
              <FloatingActionButton />
            </>
          } />
          <Route path="/category/:categorySlug" element={
            <>
              <Header />
              <Breadcrumb />
              <CategoryPage />
              <Footer />
              <FloatingActionButton />
            </>
          } />
          <Route path="/search" element={
            <>
              <Header />
              <Breadcrumb />
              <ProductList />
              <Footer />
              <FloatingActionButton />
            </>
          } />
          <Route path="/product/:id" element={
            <>
              <Header />
              <Breadcrumb />
              <ProductDetail />
              <Footer />
              <FloatingActionButton />
            </>
          } />
          <Route path="/cart" element={
            <>
              <Header />
              <Breadcrumb />
              <Cart />
              <Footer />
              <FloatingActionButton />
            </>
          } />
          <Route path="/checkout" element={
            <>
              <Header />
              <Breadcrumb />
              <Checkout />
              <Footer />
              <FloatingActionButton />
            </>
          } />
          
          {/* Static Pages */}
          <Route path="/about" element={
            <>
              <Header />
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Giới Thiệu</h1>
                <p>Đang cập nhật...</p>
              </div>
              <Footer />
              <FloatingActionButton />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Header />
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Liên Hệ</h1>
                <p>Đang cập nhật...</p>
              </div>
              <Footer />
              <FloatingActionButton />
            </>
          } />
          <Route path="/promotion" element={
            <>
              <Header />
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Khuyến Mãi</h1>
                <p>Đang cập nhật...</p>
              </div>
              <Footer />
              <FloatingActionButton />
            </>
          } />
          <Route path="/help" element={
            <>
              <Header />
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Hỗ Trợ Mua Hàng</h1>
                <p>Đang cập nhật...</p>
              </div>
              <Footer />
              <FloatingActionButton />
            </>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={
            <>
              <Header />
              <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">404 - Không tìm thấy trang</h1>
                <p>Trang bạn đang tìm kiếm không tồn tại.</p>
              </div>
              <Footer />
              <FloatingActionButton />
            </>
          } />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;