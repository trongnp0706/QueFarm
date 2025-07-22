import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { Button, InputNumber, Divider } from 'antd';

function Cart() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);
=======
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';

function Cart() {
  const { cart, addToCart, removeFromCart, clearCart } = useContext(CartContext);

  const updateQuantity = (product, change) => {
    const newQty = product.quantity + change;
    if (newQty <= 0) {
      removeFromCart(product.id);
    } else {
      addToCart({ ...product, quantity: newQty });
    }
  };
>>>>>>> dev-base

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (cart.length === 0) {
    return (
<<<<<<< HEAD
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
=======
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-lg shadow-sm p-12 max-w-lg mx-auto">
          <div className="text-8xl text-green-300 flex justify-center mb-4">
            <FaShoppingCart />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Giỏ hàng của bạn đang trống</h2>
          <p className="text-gray-600 mb-8">Hãy thêm sản phẩm vào giỏ hàng để tiến hành mua hàng</p>
          <Link to="/" className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg text-lg font-medium">
>>>>>>> dev-base
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 border-b pb-2">Giỏ hàng của bạn</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="hidden md:flex border-b pb-2 mb-4 text-sm font-medium text-gray-500">
              <div className="w-2/5">Sản phẩm</div>
              <div className="w-1/5 text-center">Đơn giá</div>
              <div className="w-1/5 text-center">Số lượng</div>
              <div className="w-1/5 text-right">Thành tiền</div>
            </div>
            
            {cart.map(item => (
              <div key={item.id} className="border-b last:border-b-0 py-4 flex flex-wrap md:flex-nowrap items-center">
                {/* Product info */}
                <div className="w-full md:w-2/5 flex gap-4 mb-4 md:mb-0">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded" 
                  />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    {item.discount && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded mt-1">
                        Giảm {item.discount}%
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Price */}
                <div className="w-1/3 md:w-1/5 text-center md:text-center mb-4 md:mb-0">
                  <div className="text-gray-800 font-medium">{item.price.toLocaleString()}₫</div>
                  {item.originalPrice && (
                    <div className="text-gray-500 line-through text-sm">{item.originalPrice.toLocaleString()}₫</div>
                  )}
                </div>
                
                {/* Quantity */}
                <div className="w-1/3 md:w-1/5 flex justify-center mb-4 md:mb-0">
                  <div className="border border-gray-300 rounded flex items-center">
                    <button 
                      onClick={() => updateQuantity(item, -1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="px-3 py-1 border-l border-r border-gray-300 min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item, 1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>
                
                {/* Subtotal & remove */}
                <div className="w-1/3 md:w-1/5 text-right flex flex-col items-end">
                  <div className="font-semibold text-green-800">
                    {(item.price * item.quantity).toLocaleString()}₫
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 mt-2 flex items-center text-sm"
                  >
                    <FaTrash size={12} className="mr-1" /> Xóa
                  </button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between mt-4 pt-2">
              <button 
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 flex items-center"
              >
                <FaTrash className="mr-1" /> Xóa giỏ hàng
              </button>
              
              <Link to="/" className="text-green-700 hover:text-green-900">
                Tiếp tục mua hàng
              </Link>
            </div>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b">Thông tin đơn hàng</h2>
            
            <div className="mb-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium">{calculateTotal().toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-medium">Tính khi thanh toán</span>
              </div>
            </div>
            
            <div className="border-t pt-2 mb-6">
              <div className="flex justify-between py-2">
                <span className="font-semibold">Tổng tiền:</span>
                <span className="text-xl font-bold text-red-600">{calculateTotal().toLocaleString()}₫</span>
              </div>
              <div className="text-gray-500 text-sm text-right">(Đã bao gồm VAT)</div>
            </div>
            
            <Link 
              to="/checkout" 
              className="block text-center bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded w-full"
            >
              TIẾN HÀNH THANH TOÁN
            </Link>
>>>>>>> dev-base
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart; 