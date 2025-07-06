import { FaShippingFast, FaUserShield, FaPhoneAlt } from 'react-icons/fa';

function Banner() {
  return (
    <section className="bg-white">
      <div className="container mx-auto py-4 px-4">
        <div className="rounded-lg overflow-hidden shadow flex flex-col md:flex-row items-center bg-green-50">
          {/* Ảnh banner */}
          <img src="/banner.jpg" alt="Banner" className="w-full md:w-2/3 h-64 object-cover" />
          {/* Slogan và icon dịch vụ */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
            <div className="text-3xl font-bold text-green-700 mb-2 text-center drop-shadow">Đặc sản vùng miền - Giao hàng siêu tốc</div>
            <div className="flex gap-8 flex-wrap justify-center">
              <div className="flex flex-col items-center">
                <FaShippingFast className="text-green-600 text-4xl mb-1" />
                <div className="text-green-700 font-semibold text-base">Giao hàng Siêu tốc</div>
                <div className="text-xs text-gray-500">Nhanh gọn - Tiện lợi</div>
              </div>
              <div className="flex flex-col items-center">
                <FaUserShield className="text-yellow-600 text-4xl mb-1" />
                <div className="text-yellow-700 font-semibold text-base">Sản phẩm chính gốc Bắc</div>
                <div className="text-xs text-gray-500">Cam kết sản phẩm chính gốc Bắc</div>
              </div>
              <div className="flex flex-col items-center">
                <FaPhoneAlt className="text-green-600 text-4xl mb-1" />
                <div className="text-green-700 font-semibold text-base">Đặt hàng nhanh chóng</div>
                <div className="text-xs text-gray-500">Gọi ngay 0835286779 để đặt hàng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner; 