import { FiTag, FiGift, FiClock } from 'react-icons/fi';

function PromotionCard({ title, desc, badge }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg text-brand-brown-900">{title}</h3>
        {badge && <span className="text-xs px-2 py-1 rounded bg-brand-green-100 text-brand-green-800">{badge}</span>}
      </div>
      <p className="text-sm text-brand-brown-600">{desc}</p>
    </div>
  );
}

function PromotionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-brand-brown-900 mb-3">Khuyến mãi</h1>
        <p className="text-brand-brown-600">Nhận ưu đãi hấp dẫn mỗi tuần. Áp dụng cho số lượng có hạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <FiTag className="text-brand-green-700 text-3xl mb-3" />
          <h3 className="font-semibold text-lg mb-2">Mua 2 giảm 10%</h3>
          <p className="text-sm text-brand-brown-600">Áp dụng cho nhóm bánh kẹo đặc sản miền Tây.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <FiGift className="text-brand-green-700 text-3xl mb-3" />
          <h3 className="font-semibold text-lg mb-2">Đơn từ 499k</h3>
          <p className="text-sm text-brand-brown-600">Tặng quà lưu niệm Quê Farm (số lượng có hạn).</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <FiClock className="text-brand-green-700 text-3xl mb-3" />
          <h3 className="font-semibold text-lg mb-2">Flash sale cuối tuần</h3>
          <p className="text-sm text-brand-brown-600">Giảm sâu nhiều sản phẩm, theo dõi banner trang chủ.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PromotionCard title="Miễn phí vận chuyển" desc="Cho đơn từ 699k tại HN & HCM." badge="HOT" />
        <PromotionCard title="Combo quà biếu" desc="Tiết kiệm đến 15% khi mua theo set." />
      </div>
    </div>
  );
}

export default PromotionPage;


