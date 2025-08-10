import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import ImageFallback from '../../components/ImageFallback';

function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);

  const handleStepQuantity = (product, change) => {
    const newQty = product.quantity + change;
    updateQuantity(product.id, newQty);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-lg shadow-sm p-12 max-w-lg mx-auto">
          <div className="text-8xl text-green-300 flex justify-center mb-4">
            <FaShoppingCart />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Giỏ hàng của bạn đang trống</h2>
          <p className="text-gray-600 mb-8">Hãy thêm sản phẩm vào giỏ hàng để tiến hành mua hàng</p>
          <Link to="/" className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg text-lg font-medium">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
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
                  <ImageFallback 
                    src={item.imageUrl} 
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded"
                    imgStyle={{ objectFit: 'cover', width: '80px', height: '80px', borderRadius: '0.25rem' }}
                    fallbackSrc="/images/placeholder.svg"
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
                      onClick={() => handleStepQuantity(item, -1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="px-3 py-1 border-l border-r border-gray-300 min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => handleStepQuantity(item, 1)}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart; 