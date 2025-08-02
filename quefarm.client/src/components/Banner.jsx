import { FaShippingFast, FaLeaf, FaPhoneAlt } from 'react-icons/fa';

function Banner() {
  // In a real application, these would come from a CMS or API
  const banners = [
    {
      id: 1,
      imageUrl: '/banner.jpg',
    },
    // Add more banner images as needed
  ];

  return (
    <div className="bg-brand-background">
      {/* Mobile/Tablet: Full width banner */}
      <div className="block lg:hidden">
        <div className="relative">
          {banners.map((banner) => (
            <div key={banner.id} className="relative">
              <img 
                src={banner.imageUrl} 
                alt="Banner" 
                className="banner-full-width w-full h-[200px] md:h-[300px]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Container responsive banner */}
      <div className="hidden lg:block">
        <div className="container-responsive py-4 md:py-8">
          <div className="banner-container">
            {banners.map((banner) => (
              <div key={banner.id} className="relative">
                <img 
                  src={banner.imageUrl} 
                  alt="Banner" 
                  className="banner-image w-full h-[400px]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
