import { FaShippingFast, FaLeaf, FaPhoneAlt } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function Banner() {
  // In a real application, these would come from a CMS or API
  const banners = [
    {
      id: 1,
      imageUrl: '/banner.jpg',
      title: 'Những sản phẩm kẹo bánh mang cả "hồn trời tuổi thơ" của chúng ta'
    },
    // Add more banner images as needed
  ];

  return (
<<<<<<< HEAD
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
=======
    <div className="bg-green-800">
      {/* Carousel Banner */}
      <div className="relative">
        {banners.map((banner) => (
          <div key={banner.id} className="relative">
            <img 
              src={banner.imageUrl} 
              alt="Banner" 
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-8 py-4 bg-yellow-500/80 rounded-lg shadow-lg backdrop-blur-sm max-w-2xl">
                <h2 className="text-4xl font-bold text-white text-shadow drop-shadow-lg leading-tight">
                  {banner.title}
                </h2>
              </div>
            </div>
            
            {/* Navigation dots */}
            <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
              <button className="w-3 h-3 rounded-full bg-white"></button>
              <button className="w-3 h-3 rounded-full bg-white/50"></button>
              <button className="w-3 h-3 rounded-full bg-white/50"></button>
            </div>
          </div>
        ))}
        
        {/* Previous/Next buttons */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50">
          &lt;
        </button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50">
          &gt;
        </button>
      </div>
      
      {/* Feature boxes */}
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-700 rounded-lg p-4 flex items-center text-white">
          <FaShippingFast className="text-4xl mr-4 text-yellow-300" />
          <div>
            <h3 className="font-semibold">Giao hàng Siêu tốc</h3>
            <p className="text-sm text-green-200">Nhanh chóng & tiện lợi</p>
          </div>
        </div>
        
        <div className="bg-green-700 rounded-lg p-4 flex items-center text-white">
          <FaLeaf className="text-4xl mr-4 text-yellow-300" />
          <div>
            <h3 className="font-semibold">Sản phẩm đặc sản 3 miền</h3>
            <p className="text-sm text-green-200">Đảm bảo chất lượng</p>
          </div>
        </div>
        
        <div className="bg-green-700 rounded-lg p-4 flex items-center text-white">
          <FaPhoneAlt className="text-4xl mr-4 text-yellow-300" />
          <div>
            <h3 className="font-semibold">Hotline: 0909 10 9595</h3>
            <p className="text-sm text-green-200">Hỗ trợ 24/7</p>
>>>>>>> dev-base
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner; 