import { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import ImageFallback from '../../components/ImageFallback';

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [voucher, setVoucher] = useState(''); 
  const [appliedVouchers, setAppliedVouchers] = useState([]); // applied codes (UPPERCASE)
  const [pricing, setPricing] = useState(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [showItems, setShowItems] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const voucherCodeForApi = useMemo(
    () => (appliedVouchers.length ? appliedVouchers.join(',') : ''),
    [appliedVouchers]
  );

  useEffect(() => {
    const priceCart = async () => {
      if (!cart || cart.length === 0) {
        setPricing(null);
        return;
      }
      setPricingLoading(true);
      try {
        const res = await fetch('/api/order/price-cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
            voucherCode: voucherCodeForApi || undefined,
          })
        });
        if (!res.ok) throw new Error(`Không thể định giá giỏ hàng (${res.status})`);
        const ct = res.headers.get('content-type') || '';
        const data = ct.includes('application/json') ? await res.json().catch(()=> null) : null;
        if (!data) throw new Error('Phản hồi không hợp lệ từ server');
        setPricing(data);
      } catch {
        setPricing(null);
      } finally {
        setPricingLoading(false);
      }
    };
    priceCart();
  }, [cart, voucherCodeForApi]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          phone,
          email: email || undefined,
          address,
          voucherCode: voucherCodeForApi || undefined,
          orderItems: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
          }))
        })
      });
      if (!res.ok) {
        const text = await res.text().catch(()=> '');
        throw new Error(`Đặt hàng thất bại (${res.status}). ${text}`);
      }
      setSuccess(true);
      clearCart();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isCartEmpty = !cart || cart.length === 0;

  const parseVoucherCodes = (raw) =>
    String(raw || '')
      .trim()
      .split(/[,+;\s]+/g)
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

  const applyVoucher = () => {
    const codes = parseVoucherCodes(voucher);
    if (!codes.length) return;
    setAppliedVouchers((prev) => Array.from(new Set([...prev, ...codes])));
    setVoucher(''); // clear input after apply
  };

  const removeVoucher = (code) => {
    const c = String(code || '').toUpperCase();
    setAppliedVouchers((prev) => prev.filter((v) => v !== c));
  };
  const clearAllVouchers = () => setAppliedVouchers([]);
  const itemsToShow = useMemo(() => (
    pricing?.items?.length
      ? pricing.items
      : cart.map(i => ({
          productId: i.id,
          productName: i.name,
          imageUrl: i.imageUrl,
          unitPrice: i.price,
          quantity: i.quantity,
          lineTotal: (Number(i.price) || 0) * (Number(i.quantity) || 0)
        }))
  ), [pricing, cart]);

  if (success) {
    return <div className="text-center py-8 text-green-600 text-xl font-bold">Đặt hàng thành công!</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form sections */}
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-2">
          {/* Contact */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center">1</div>
              <h2 className="font-semibold">Thông tin liên hệ</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Họ tên</label>
                <input value={name} onChange={e => setName(e.target.value)} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Số điện thoại</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Email (không bắt buộc)</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full border px-3 py-2 rounded" />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center">2</div>
              <h2 className="font-semibold">Địa chỉ giao hàng</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 font-medium">Địa chỉ</label>
                <input value={address} onChange={e => setAddress(e.target.value)} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Ghi chú (không bắt buộc)</label>
                <textarea rows={3} className="w-full border px-3 py-2 rounded" placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..." />
              </div>
            </div>
          </div>

          {/* Voucher */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center">3</div>
              <h2 className="font-semibold">Mã giảm giá</h2>
            </div>
            <div className="flex gap-2">
              <input
                value={voucher}
                onChange={e => setVoucher(e.target.value)}
                placeholder="Nhập mã"
                className="flex-1 border px-3 py-2 rounded"
              />
              <button
                type="button"
                onClick={applyVoucher}
                disabled={pricingLoading || !voucher.trim()}
                className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
              >
                Áp dụng
              </button>
            </div>
            {appliedVouchers.length > 0 && (
              <div className="mt-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-700">
                    Đang áp dụng: <span className="font-semibold">{appliedVouchers.join(', ')}</span>
                  </span>
                  <button type="button" onClick={clearAllVouchers} className="text-red-600 hover:text-red-700">
                    Xóa tất cả
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {appliedVouchers.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => removeVoucher(code)}
                      className="px-2 py-1 rounded-full border text-xs text-gray-700 hover:bg-gray-50"
                      title="Bấm để xóa mã này"
                    >
                      {code} ×
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-2 text-sm">
              {pricingLoading && <span className="text-gray-500">Đang áp dụng mã...</span>}
              {!pricingLoading && pricing?.message && <span className="text-green-600">{pricing.message}</span>}
            </div>
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <div className="flex items-center justify-end">
            <button type="submit" disabled={loading || isCartEmpty} className="bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700 disabled:opacity-50">
              {loading ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
          </div>
        </form>

        {/* Right: Summary */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4 lg:sticky lg:top-20">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Đơn hàng của bạn</h2>
              <button type="button" onClick={() => setShowItems(v => !v)} className="text-sm text-green-700 hover:text-green-800">
                {showItems ? 'Thu gọn' : 'Xem chi tiết'}
              </button>
            </div>
            <div className="mb-2">
              <Link to="/cart" className="text-green-700 hover:text-green-800 text-sm">Sửa giỏ hàng</Link>
            </div>
            {showItems && (
              <div className="divide-y">
                {itemsToShow.map((item) => (
                  <div key={item.productId} className="py-2 flex items-center gap-3">
                    {item.imageUrl && (
                      <ImageFallback src={item.imageUrl} alt={item.productName} width={48} height={48} className="rounded object-cover" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 line-clamp-1">{item.productName}</div>
                      <div className="text-sm text-gray-500">{Number(item.unitPrice).toLocaleString()}₫ × {item.quantity}</div>
                    </div>
                    <div className="font-semibold text-gray-900">{Number(item.lineTotal).toLocaleString()}₫</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 border-t pt-3 space-y-1 text-sm">
              {pricingLoading ? (
                <div className="text-gray-500">Đang tính toán...</div>
              ) : pricing ? (
                <>
                  <div className="flex justify-between"><span>Tạm tính</span><span>{pricing.subtotal?.toLocaleString()}₫</span></div>
                  <div className="flex justify-between"><span>Giảm giá</span><span>-{pricing.discountTotal?.toLocaleString()}₫</span></div>
                  <div className="flex justify-between"><span>Phí vận chuyển</span><span>{pricing.shipping?.toLocaleString()}₫</span></div>
                  <div className="flex justify-between font-semibold text-base"><span>Tổng</span><span>{pricing.total?.toLocaleString()}₫</span></div>
                </>
              ) : (
                <>
                  <div className="flex justify-between"><span>Tạm tính</span><span>{itemsToShow.reduce((s,i)=>s+Number(i.lineTotal||0),0).toLocaleString()}₫</span></div>
                  <div className="flex justify-between"><span>Giảm giá</span><span>-0₫</span></div>
                  <div className="flex justify-between"><span>Phí vận chuyển</span><span>—</span></div>
                  <div className="flex justify-between font-semibold text-base"><span>Tổng</span><span>{itemsToShow.reduce((s,i)=>s+Number(i.lineTotal||0),0).toLocaleString()}₫</span></div>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Checkout; 