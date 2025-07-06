import { FaShippingFast, FaUserShield, FaPhoneAlt } from 'react-icons/fa';

function Banner() {
  return (
    <section className="bg-white">
      <div className="container mx-auto py-3 md:py-4 px-3 md:px-4">
        <div className="rounded-lg overflow-hidden shadow flex flex-col lg:flex-row items-center bg-green-50">
          {/* Ảnh banner */}
          <div className="w-full lg:w-2/3">
            <img 
              src="/banner.jpg" 
              alt="Banner" 
              className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-cover" 
            />
          </div>
          
          {/* Slogan và icon dịch vụ */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4 md:gap-6 p-4 md:p-6 w-full">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 mb-2 text-center drop-shadow leading-tight">
              Đặc sản vùng miền - Giao hàng siêu tốc
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full">
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
        </div>
      </div>
    </section>
  );
}

export default Banner; 