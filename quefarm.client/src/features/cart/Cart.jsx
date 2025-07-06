import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { Link } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  if (cart.length === 0) {
    return <div className="text-center py-8">Giỏ hàng của bạn đang trống.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>
      <div className="mb-4 flex justify-end">
        <button onClick={clearCart} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Xóa tất cả</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row items-center gap-4">
            <img src={item.imageUrl} alt={item.name} className="w-32 h-24 object-cover rounded" />
            <div className="flex-1">
              <h2 className="font-semibold text-lg mb-1">{item.name}</h2>
              <p className="text-gray-600 mb-2">{item.price.toLocaleString()} đ</p>
              <p className="text-gray-500">Số lượng: {item.quantity}</p>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-600">Xóa</button>
          </div>
        ))}
      </div>
      <div className="mt-8 text-right">
        <Link to="/checkout" className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700">Thanh toán</Link>
      </div>
    </div>
  );
}

export default Cart; 