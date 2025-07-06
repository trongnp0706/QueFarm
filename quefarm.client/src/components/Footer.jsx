import { FaFacebook, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-100 mt-8 border-t">
      <div className="container mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="font-bold text-green-700 mb-2 text-lg">CỬA HÀNG ĐẶC SẢN QUÊ FARM</div>
          <div>Người đại diện: Đỗ Văn Yên/MST:0314080990</div>
          <div className="flex items-center gap-2 mt-1"><FaPhoneAlt className="text-green-600" /> Hotline: <a href="tel:0835286779" className="text-green-700 font-semibold hover:underline">0835286779</a></div>
          <div>CN1: 229 Bạch Đằng, P3, Q Gò Vấp (7h-21h)</div>
          <div>CN2: 86B Nguyễn Thông, P9, Quận 3 (8h30-20h30)</div>
        </div>
        <div>
          <div className="font-bold mb-2 text-base">CHÍNH SÁCH KHÁCH HÀNG</div>
          <ul className="list-disc ml-4 space-y-1">
            <li><a href="#" className="hover:text-green-700 transition">Chính sách bảo mật thông tin</a></li>
            <li><a href="#" className="hover:text-green-700 transition">Quy định và hình thức thanh toán</a></li>
            <li><a href="#" className="hover:text-green-700 transition">Chính sách đổi trả hàng</a></li>
            <li><a href="#" className="hover:text-green-700 transition">Chính sách giao nhận</a></li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2 text-base">KẾT NỐI FACEBOOK</div>
          <a href="#" className="flex items-center gap-2 bg-white border rounded p-2 hover:bg-blue-50 transition">
            <FaFacebook className="text-blue-600 text-xl" /> Fanpage Facebook
          </a>
          <div className="flex items-center gap-2 mt-2">
            <FaEnvelope className="text-green-600" /> <a href="mailto:info@quefarm.vn" className="hover:underline">info@quefarm.vn</a>
          </div>
        </div>
      </div>
      <div className="bg-green-700 text-white text-center py-2 text-xs tracking-wide">Bản quyền 2022 © Quê Farm</div>
    </footer>
  );
}

export default Footer; 