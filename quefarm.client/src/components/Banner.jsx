import { FaShippingFast, FaUserShield, FaPhoneAlt } from 'react-icons/fa';

function Banner() {
  return (
    <section className="w-full">
      <div className="w-full">
        <img 
          src="/banner.jpg" 
          alt="Banner" 
          className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-cover" 
        />
      </div>
      <div className="bg-white py-4 md:py-6 px-3 md:px-0 flex flex-col items-center">
        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 mb-4 text-center drop-shadow leading-tight">
          Đặc sản vùng miền - Giao hàng siêu tốc
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl">
          <div className="flex flex-col items-center text-center">
            <FaShippingFast className="text-green-600 text-2xl md:text-4xl mb-1" />
            <div className="text-green-700 font-semibold text-sm md:text-base">Giao hàng Siêu tốc</div>
            <div className="text-xs text-gray-500">Nhanh gọn - Tiện lợi</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaUserShield className="text-yellow-600 text-2xl md:text-4xl mb-1" />
            <div className="text-yellow-700 font-semibold text-sm md:text-base">Sản phẩm chính gốc</div>
            <div className="text-xs text-gray-500">Cam kết chất lượng</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaPhoneAlt className="text-green-600 text-2xl md:text-4xl mb-1" />
            <div className="text-green-700 font-semibold text-sm md:text-base">Đặt hàng nhanh</div>
            <div className="text-xs text-gray-500">Gọi 0835286779</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner; 