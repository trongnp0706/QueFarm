import Header from './components/Header';
import Banner from './components/Banner';
import Footer from './components/Footer';
import Breadcrumb from './components/Breadcrumb';
import FloatingActionButton from './components/FloatingActionButton';
import { CartProvider } from './context/CartContext.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetail from './features/product/ProductDetail';
<<<<<<< HEAD
import CategoryPage from './pages/CategoryPage';
import Cart from './features/cart/Cart';
import Checkout from './features/cart/Checkout';
import AdminLogin from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
=======
import ProductList from './features/product/ProductList';
import Cart from './features/cart/Cart';
import Checkout from './features/cart/Checkout';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './features/admin/Dashboard';
import ProductManagement from './features/admin/product/ProductManagement';
import CategoryManagement from './features/admin/category/CategoryManagement';
import TestAPI from './debug/TestAPI';
>>>>>>> dev-base

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
<<<<<<< HEAD
          {/* Layout cho user */}
          <Route
            path="/*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/homepage" element={<HomePage />} />
                  <Route path="/category/:id" element={<><Breadcrumb /><CategoryPage /></>} />
                  <Route path="/product/:id" element={<><Breadcrumb /><ProductDetail /></>} />
                  <Route path="/cart" element={<><Breadcrumb /><Cart /></>} />
                  <Route path="/checkout" element={<><Breadcrumb /><Checkout /></>} />
                </Routes>
                <Footer />
                <FloatingActionButton />
              </>
            }
          />
          {/* Layout riêng cho admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminPage />} />
=======
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products/*" element={<ProductManagement />} />
            <Route path="categories/*" element={<CategoryManagement />} />
            <Route path="*" element={<div>Page not found in Admin</div>} />
          </Route>
          
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Header />
              <HomePage />
              <Footer />
            </>
          } />
          <Route path="/products" element={
            <>
              <Header />
              <ProductList />
              <Footer />
            </>
          } />
          <Route path="/category/:categorySlug" element={
            <>
              <Header />
              <ProductList />
              <Footer />
            </>
          } />
          <Route path="/search" element={
            <>
              <Header />
              <ProductList />
              <Footer />
            </>
          } />
          <Route path="/product/:id" element={
            <>
              <Header />
              <ProductDetail />
              <Footer />
            </>
          } />
          <Route path="/cart" element={
            <>
              <Header />
              <Cart />
              <Footer />
            </>
          } />
          <Route path="/checkout" element={
            <>
              <Header />
              <Checkout />
              <Footer />
            </>
          } />
          {/* Debug Route - Remove in production */}
          <Route path="/debug/api" element={<TestAPI />} />
          <Route path="/about" element={
            <>
              <Header />
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Giới Thiệu</h1>
                <p>Đang cập nhật...</p>
              </div>
              <Footer />
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
            </>
          } />
          <Route path="*" element={
            <>
              <Header />
              <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">404 - Không tìm thấy trang</h1>
                <p>Trang bạn đang tìm kiếm không tồn tại.</p>
              </div>
              <Footer />
            </>
          } />
>>>>>>> dev-base
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;