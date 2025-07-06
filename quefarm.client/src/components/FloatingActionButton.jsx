import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, PhoneOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Badge, Button } from 'antd';
import { CartContext } from '../context/CartContext';

function FloatingActionButton() {
  const { cart } = useContext(CartContext);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3">
      {/* Scroll to top button */}
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<ArrowUpOutlined />}
        onClick={scrollToTop}
        className="bg-gray-600 border-gray-600 hover:bg-gray-700 shadow-lg"
      />
      
      {/* Phone button */}
      <a href="tel:0835286779">
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<PhoneOutlined />}
          className="bg-green-600 border-green-600 hover:bg-green-700 shadow-lg"
        />
      </a>
      
      {/* Cart button */}
      <Link to="/cart">
        <Badge count={cartItemCount} size="small">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<ShoppingCartOutlined />}
            className="bg-orange-500 border-orange-500 hover:bg-orange-600 shadow-lg"
          />
        </Badge>
      </Link>
    </div>
  );
}

export default FloatingActionButton; 