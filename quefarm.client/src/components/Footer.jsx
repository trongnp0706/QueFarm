import { FaFacebook, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-100 mt-6 md:mt-8 border-t">
      <div className="container mx-auto py-6 md:py-8 px-3 md:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-sm">
          {/* Thông tin cửa hàng */}
          <div className="space-y-2">
            <div className="font-bold text-green-700 mb-3 text-base md:text-lg">CỬA HÀNG ĐẶC SẢN QUÊ FARM</div>
            <div className="text-xs md:text-sm">Người đại diện: Đỗ Văn Yên/MST:0314080990</div>
            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-green-600 text-sm" /> 
              <span>Hotline: </span>
              <a href="tel:0835286779" className="text-green-700 font-semibold hover:underline">0835286779</a>
            </div>
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-green-600 text-sm mt-0.5 flex-shrink-0" />
              <div className="text-xs md:text-sm">
                <div>CN1: 229 Bạch Đằng, P3, Q Gò Vấp</div>
                <div className="flex items-center gap-1 text-gray-600">
                  <FaClock className="text-xs" />
                  <span>7h-21h</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-green-600 text-sm mt-0.5 flex-shrink-0" />
              <div className="text-xs md:text-sm">
                <div>CN2: 86B Nguyễn Thông, P9, Quận 3</div>
                <div className="flex items-center gap-1 text-gray-600">
                  <FaClock className="text-xs" />
                  <span>8h30-20h30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chính sách khách hàng */}
          <div className="space-y-2">
            <div className="font-bold mb-3 text-sm md:text-base">CHÍNH SÁCH KHÁCH HÀNG</div>
            <ul className="space-y-1 text-xs md:text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <a href="#" className="hover:text-green-700 transition">Chính sách bảo mật thông tin</a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <a href="#" className="hover:text-green-700 transition">Quy định và hình thức thanh toán</a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <a href="#" className="hover:text-green-700 transition">Chính sách đổi trả hàng</a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <a href="#" className="hover:text-green-700 transition">Chính sách giao nhận</a>
              </li>
            </ul>
          </div>

          {/* Kết nối */}
          <div className="space-y-3">
            <div className="font-bold mb-3 text-sm md:text-base">KẾT NỐI VỚI CHÚNG TÔI</div>
            <a href="#" className="flex items-center gap-2 bg-white border rounded-lg p-3 hover:bg-blue-50 transition w-fit">
              <FaFacebook className="text-blue-600 text-lg" /> 
              <span className="text-sm">Fanpage Facebook</span>
            </a>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-green-600 text-sm" /> 
              <a href="mailto:info@quefarm.vn" className="hover:underline text-sm">info@quefarm.vn</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="bg-amber-300 text-amber-900 text-center py-2 text-xs tracking-wide">
        Bản quyền 2025 © Quê Farm - Đặc sản vùng miền
      </div>
    </footer>
  );
}

export default Footer; 