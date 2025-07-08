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
import Cart from './features/cart/Cart';
import Checkout from './features/cart/Checkout';
import AdminLogin from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
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
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;