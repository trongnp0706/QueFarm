import { FaFacebook, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

function Footer() {
  return (
    <footer className="bg-brand-green-500 text-white mt-8 border-t-4 border-brand-green-600">
      <div className="container mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Contact Info */}
        <div className="lg:col-span-1">
          <h3 className="font-bold text-xl mb-4 border-b-2 border-brand-green-400 pb-2 text-white">THÔNG TIN LIÊN HỆ</h3>
          <p className="mb-2 font-semibold text-white">Quê Farm - Đặc sản vùng miền</p>
          <p className="flex items-start mb-2">
            <FaMapMarkerAlt className="mr-3 mt-1 text-brand-yellow-400 flex-shrink-0" /> 
            <span className="text-gray-200">110B Đường 339, P. Phước Long, Thủ Đức, TP.HCM</span>
          </p>
          <p className="flex items-center mb-2">
            <FaPhoneAlt className="mr-3 text-brand-yellow-400" /> 
            Hotline: <a href="tel:0325005386" className="ml-1 hover:text-brand-yellow-300 transition-colors">0325.005.386</a>
          </p>
          <p className="flex items-center mb-2">
            <SiZalo className="mr-3 text-brand-yellow-400" /> 
            Zalo: <a href="https://zalo.me/0708238869" target="_blank" rel="noopener noreferrer" className="ml-1 hover:text-brand-yellow-300 transition-colors">070.823.88.69</a>
          </p>
          <p className="flex items-center mb-2">
            <FaEnvelope className="mr-3 text-brand-yellow-400" /> 
            Email: <a href="mailto:quefarmfood@gmail.com" className="ml-1 hover:text-brand-yellow-300 transition-colors break-all">quefarmfood@gmail.com</a>
          </p>
          <p className="flex items-center">
            <FaFacebook className="mr-3 text-brand-yellow-400" /> 
            Facebook: <a href="https://www.facebook.com/quefarmfood" target="_blank" rel="noopener noreferrer" className="ml-1 hover:text-brand-yellow-300 transition-colors">Đặc sản vùng miền </a>
          </p>
          <p className="mt-2">
            Website: <a href="https://quefarm.page" className="hover:text-brand-yellow-300 transition-colors">quefarm.page</a>
          </p>
        </div>
        
        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-xl mb-4 border-b-2 border-brand-green-400 pb-2 text-white">LIÊN KẾT NHANH</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-200 hover:text-brand-yellow-300 flex items-center transition-colors">› <span className="ml-2">Đặc sản miền Nam</span></a></li>
            <li><a href="#" className="text-gray-200 hover:text-brand-yellow-300 flex items-center transition-colors">› <span className="ml-2">Đặc sản miền Trung</span></a></li>
            <li><a href="#" className="text-gray-200 hover:text-brand-yellow-300 flex items-center transition-colors">› <span className="ml-2">Đặc sản miền Bắc</span></a></li>
            <li><a href="#" className="text-gray-200 hover:text-brand-yellow-300 flex items-center transition-colors">› <span className="ml-2">Combo Quà Tặng</span></a></li>
          </ul>
        </div>
        
        {/* Recent Posts */}
        <div>
          <h3 className="font-bold text-xl mb-4 border-b-2 border-brand-green-400 pb-2 text-white">MÓN NGON</h3>
          <div className="grid grid-cols-1 gap-4">
            <a href="#" className="flex items-start group">
              <div className="bg-brand-green-600 text-center text-xs p-1 w-14 h-14 flex flex-col justify-center items-center mr-3 rounded-md flex-shrink-0 group-hover:bg-brand-yellow-500 group-hover:text-brand-brown-900 transition-colors">
                <div className="font-bold text-lg">25</div>
                <div className="leading-tight">Th4</div>
              </div>
              <div>
                <h4 className="font-semibold group-hover:text-brand-yellow-300 transition-colors">LẠP XƯỞNG TƯƠI: NGUỒN GỐC, CÁCH LÀM & MUA Ở ĐÂU NGON</h4>
              </div>
            </a>
            
            <a href="#" className="flex items-start group">
              <div className="bg-brand-green-600 text-center text-xs p-1 w-14 h-14 flex flex-col justify-center items-center mr-3 rounded-md flex-shrink-0 group-hover:bg-brand-yellow-500 group-hover:text-brand-brown-900 transition-colors">
                <div className="font-bold text-lg">08</div>
                <div className="leading-tight">Th1</div>
              </div>
              <div>
                <h4 className="font-semibold group-hover:text-brand-yellow-300 transition-colors">Cơm cháy Chà bông VIỆT SPECIAL – Sạch Ngon khó cưỡng</h4>
              </div>
            </a>
            
            <a href="#" className="flex items-start group">
              <div className="bg-brand-green-600 text-center text-xs p-1 w-14 h-14 flex flex-col justify-center items-center mr-3 rounded-md flex-shrink-0 group-hover:bg-brand-yellow-500 group-hover:text-brand-brown-900 transition-colors">
                <div className="font-bold text-lg">08</div>
                <div className="leading-tight">Th1</div>
              </div>
              <div>
                <h4 className="font-semibold group-hover:text-brand-yellow-300 transition-colors">HOÀNG MỸ GIA – Đặc sản vùng miền – Cung ứng sỉ lẻ</h4>
              </div>
            </a>
          </div>
        </div>

        {/* Facebook Fanpage */}
        <div>
           <h3 className="font-bold text-xl mb-4 border-b-2 border-brand-green-400 pb-2 text-white">FANPAGE</h3>
           <div className="bg-white p-2 rounded-lg">
             {/* Replace with your actual Facebook Page Plugin embed code */}
             <iframe 
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fquefarmfood&tabs=timeline&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId" 
                width="100%" 
                height="130" 
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no" 
                frameBorder="0" 
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
            </iframe>
           </div>
        </div>

      </div>
      <div className="bg-brand-green-600 text-center py-4 px-4">
        <p className="text-sm text-gray-200">&copy; {new Date().getFullYear()}  </p>
        <p className="text-xs text-gray-300 mt-1">Website designed by trongnp</p>
      </div>
    </footer>
  );
}

export default Footer;
