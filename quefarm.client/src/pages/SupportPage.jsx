import { useState } from 'react';
import { FiHelpCircle, FiPhone, FiMail } from 'react-icons/fi';
import PageBanner from '../components/PageBanner';

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <button className="w-full text-left font-medium text-brand-brown-900" onClick={() => setOpen(!open)}>
        {q}
      </button>
      {open && <p className="mt-2 text-sm text-brand-brown-600">{a}</p>}
    </div>
  );
}

function SupportPage() {
  return (
    <div>
      <PageBanner 
        title="HỖ TRỢ MUA HÀNG" 
        imageUrl="/la.jpg" 
        subtitle="Giải đáp thắc mắc và hướng dẫn đặt hàng nhanh chóng." 
      />
      <div className="container mx-auto px-4 py-8">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <FiHelpCircle className="text-brand-green-700 text-3xl mb-3" />
          <h3 className="font-semibold mb-2">Câu hỏi thường gặp</h3>
          <p className="text-sm text-brand-brown-600">Các vấn đề phổ biến khi đặt hàng, vận chuyển, đổi trả.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <FiPhone className="text-brand-green-700 text-3xl mb-3" />
          <h3 className="font-semibold mb-2">Hotline</h3>
          <p className="text-sm text-brand-brown-600">Gọi ngay: 070.823.88.69, 0325.005.386 (7:00 - 21:00)</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <FiMail className="text-brand-green-700 text-3xl mb-3" />
          <h3 className="font-semibold mb-2">Email</h3>
          <p className="text-sm text-brand-brown-600">quefarmfood@gmail.com</p>
        </div>
      </div>

      <div className="space-y-3">
        <FAQItem q="Làm sao để đặt hàng?" a="Chọn sản phẩm, thêm vào giỏ, điền thông tin và xác nhận đơn hàng." />
        <FAQItem q="Thời gian giao hàng?" a="Nội thành 1-2 ngày, tỉnh thành khác 2-5 ngày tùy khu vực." />
        <FAQItem q="Chính sách đổi trả?" a="Đổi trả trong 7 ngày nếu sản phẩm lỗi do nhà sản xuất." />
      </div>
    </div>
  </div>
  );
}

export default SupportPage;


