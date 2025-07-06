import { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          phone,
          address,
          orderItems: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });
      if (!res.ok) throw new Error('Đặt hàng thất bại');
      setSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <div className="text-center py-8 text-green-600 text-xl font-bold">Đặt hàng thành công!</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Họ tên</label>
          <input value={name} onChange={e => setName(e.target.value)} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Số điện thoại</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Địa chỉ</label>
          <input value={address} onChange={e => setAddress(e.target.value)} required className="w-full border px-3 py-2 rounded" />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50">
          {loading ? 'Đang xử lý...' : 'Đặt hàng'}
        </button>
      </form>
    </div>
  );
}

export default Checkout; 