import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { Button, InputNumber, Divider } from 'antd';

function Cart() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-3 md:px-4 py-8 md:py-12">
        <div className="text-center">
          <FaShoppingCart className="text-gray-300 text-6xl mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            <FaArrowLeft />
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Giỏ hàng ({cart.length} sản phẩm)</h1>
          <Button 
            danger 
            icon={<FaTrash />}
            onClick={clearCart}
            className="text-sm"
          >
            Xóa tất cả
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              {cart.map(item => (
                <div key={item.id} className="p-4 md:p-6 border-b border-gray-100 last:border-b-0">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg" 
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-red-600 font-bold text-sm md:text-base mb-2">
                        {item.price.toLocaleString()} đ
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">Số lượng:</span>
                          <InputNumber
                            min={1}
                            max={99}
                            value={item.quantity}
                            onChange={(value) => updateQuantity(item.id, value)}
                            size="small"
                            className="w-16"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Tổng: {(item.price * item.quantity).toLocaleString()} đ
                          </span>
                          <Button 
                            type="text" 
                            danger 
                            size="small"
                            icon={<FaTrash />}
                            onClick={() => removeFromCart(item.id)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính:</span>
                  <span>{calculateTotal().toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển:</span>
                  <span className={calculateTotal() >= 500000 ? 'text-green-600' : 'text-gray-600'}>
                    {calculateTotal() >= 500000 ? 'Miễn phí' : '30.000 đ'}
                  </span>
                </div>
                <Divider />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-red-600">
                    {calculateTotal() >= 500000 
                      ? calculateTotal().toLocaleString() 
                      : (calculateTotal() + 30000).toLocaleString()
                    } đ
                  </span>
                </div>
              </div>

              {calculateTotal() < 500000 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-700">
                    Mua thêm {(500000 - calculateTotal()).toLocaleString()} đ để được miễn phí vận chuyển!
                  </p>
                </div>
              )}

              <Link to="/checkout">
                <Button 
                  type="primary" 
                  size="large" 
                  className="w-full bg-green-600 border-green-600 hover:bg-green-700"
                >
                  Tiến hành thanh toán
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart; 