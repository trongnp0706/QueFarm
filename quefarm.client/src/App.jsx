import Header from './components/Header';
import Banner from './components/Banner';
import Footer from './components/Footer';
import Breadcrumb from './components/Breadcrumb';
import { CartProvider } from './context/CartContext.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetail from './features/product/ProductDetail';
import Cart from './features/cart/Cart';
import Checkout from './features/cart/Checkout';

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<><Breadcrumb /><ProductDetail /></>} />
          <Route path="/cart" element={<><Breadcrumb /><Cart /></>} />
          <Route path="/checkout" element={<><Breadcrumb /><Checkout /></>} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;