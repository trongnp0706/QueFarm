import { FaShippingFast, FaLeaf, FaPhoneAlt } from 'react-icons/fa';

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner; 