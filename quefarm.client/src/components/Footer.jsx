import { FaFacebook, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-green-800 text-white mt-8">
      <div className="container mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-xl mb-4">THÔNG TIN LIÊN HỆ</h3>
          <p className="mb-2">Công ty TNHH TM XNK Hoàng Mỹ Gia</p>
          <p className="flex items-center mb-2">
            <FaMapMarkerAlt className="mr-2 text-green-300" /> 
            584/36/2 Tân Kỳ Tân Quý, P. Bình Hưng Hòa, Q. Bình Tân, TP.HCM
          </p>
          <p className="flex items-center mb-2">
            <FaPhoneAlt className="mr-2 text-green-300" /> 
            Hotline: <a href="tel:0909109595" className="ml-1 hover:underline">0909 10 9595</a>
          </p>
          <p className="flex items-center mb-2">
            <FaEnvelope className="mr-2 text-green-300" /> 
            Email: <a href="mailto:saladmin@hoangmygia.com" className="ml-1 hover:underline">saladmin@hoangmygia.com</a>
          </p>
          <p className="flex items-center">
            <FaFacebook className="mr-2 text-green-300" /> 
            Facebook: <a href="#" className="ml-1 hover:underline">Đặc sản vùng miền ngon</a>
          </p>
          <p className="mt-2">
            Website: <a href="#" className="hover:underline">quefarm.com</a>
          </p>
        </div>
        
        <div>
          <h3 className="font-bold text-xl mb-4">LIÊN KẾT NHANH</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-green-300 flex items-center">
              <span className="mr-2">›</span> Đặc sản 3 miền
            </a></li>
            <li><a href="#" className="hover:text-green-300 flex items-center">
              <span className="mr-2">›</span> Đặc sản Tây Ninh
            </a></li>
            <li><a href="#" className="hover:text-green-300 flex items-center">
              <span className="mr-2">›</span> Đặc sản miền Nam
            </a></li>
            <li><a href="#" className="hover:text-green-300 flex items-center">
              <span className="mr-2">›</span> Đặc sản miền Trung
            </a></li>
            <li><a href="#" className="hover:text-green-300 flex items-center">
              <span className="mr-2">›</span> Đặc sản miền Nam
            </a></li>
            <li><a href="#" className="hover:text-green-300 flex items-center">
              <span className="mr-2">›</span> Đặc sản Combo
            </a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold text-xl mb-4">MÓN NGON</h3>
          <div className="grid grid-cols-1 gap-4">
            <a href="#" className="flex items-start hover:bg-green-700 p-2 rounded-lg transition-colors">
              <div className="bg-green-700 text-center text-xs p-1 w-12 h-12 flex flex-col justify-center mr-2">
                <div className="font-bold">25</div>
                <div>Th4</div>
              </div>
              <div>
                <h4 className="font-semibold">LAP XƯỞNG TƯƠI: NGUỒN GỐC LAP XƯỞNG TƯƠI NGON & MUA LAP XƯỞNG TƯƠI</h4>
              </div>
            </a>
            
            <a href="#" className="flex items-start hover:bg-green-700 p-2 rounded-lg transition-colors">
              <div className="bg-green-700 text-center text-xs p-1 w-12 h-12 flex flex-col justify-center mr-2">
                <div className="font-bold">08</div>
                <div>Th1</div>
              </div>
              <div>
                <h4 className="font-semibold">Cơm cháy Chà bông VIỆT SPECIAL – Sạch Ngon khó cưỡng</h4>
              </div>
            </a>
            
            <a href="#" className="flex items-start hover:bg-green-700 p-2 rounded-lg transition-colors">
              <div className="bg-green-700 text-center text-xs p-1 w-12 h-12 flex flex-col justify-center mr-2">
                <div className="font-bold">08</div>
                <div>Th1</div>
              </div>
              <div>
                <h4 className="font-semibold">HOÀNG MỸ GIA – Đặc sản vùng miền – Cung ứng sỉ lẻ</h4>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 