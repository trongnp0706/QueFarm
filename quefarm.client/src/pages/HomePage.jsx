import Banner from '../components/Banner';
import ImageFallback from '../components/ImageFallback';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { getFeaturedProducts, getAllProducts, generateImageUrl } from '../services/productService';

function ProductSection({ title, products, viewAllLink, loading = false }) {
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-brand-brown-900 relative inline-block px-4">
          <span className="relative z-10">{title}</span>
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-brand-green-500/80"></span>
        </h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 product-grid">
        {loading ? (
          [...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden border border-brand-cream-300 shadow-sm product-card">
              <div className="product-image-container">
                <div className="bg-brand-cream-200 animate-pulse w-full h-full"></div>
              </div>
              <div className="product-content">
                <div className="h-4 bg-brand-cream-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-brand-cream-200 rounded animate-pulse w-3/4 mb-3"></div>
                <div className="flex justify-between items-center mb-3">
                  <div className="h-3 bg-brand-cream-200 rounded animate-pulse w-16"></div>
                  <div className="h-6 bg-brand-cream-200 rounded animate-pulse w-12"></div>
                </div>
                <div className="h-10 bg-brand-cream-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))
        ) : (
          products.map(product => (
            <div key={product.id} className="group relative">
              {product.discountPercentage > 0 && (
                <div className="discount-badge">
                  -{Math.round(product.discountPercentage)}%
                </div>
              )}
              <div className="bg-white rounded-xl overflow-hidden border border-brand-cream-300 hover:border-brand-green-500 hover:shadow-xl transition-all duration-300 shadow-sm product-card">
                <Link to={`/product/${product.id}`} className="block overflow-hidden">
                  <div className="product-image-container">
                    <ImageFallback 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="product-image"
                      fallbackSrc="/images/placeholder.svg"
                    />
                  </div>
                </Link>
                <div className="product-content">
                  <h3 className="product-title group-hover:text-brand-green-700 transition-colors line-clamp-2 leading-tight">
                    <Link to={`/product/${product.id}`} className="hover:text-brand-green-700">
                      {product.name}
                    </Link>
                  </h3>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col">
                      {product.originalPrice && (
                        <span className="product-original-price">
                          {product.originalPrice.toLocaleString()}₫
                        </span>
                      )}
                      <span className="product-price">
                        {product.price.toLocaleString()}₫
                      </span>
                    </div>
                  </div>
                  <Link 
                    to={`/product/${product.id}`}
                    className="btn-primary text-center mt-auto"
                  >
                    MUA NGAY
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {viewAllLink && !loading && (
        <div className="text-center mt-8">
          <Link to={viewAllLink} className="inline-flex items-center text-brand-green-700 font-semibold hover:text-brand-green-800 transition-colors text-lg">
            Xem tất cả <FiArrowRight className="ml-2" />
          </Link>
        </div>
      )}
    </div>
  );
}

function NewsSection({ news }) {
  return (
    <div className="my-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-brand-brown-900 relative inline-block px-4">
          <span className="relative z-10">TIN TỨC & BÀI VIẾT</span>
           <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-brand-green-500/80"></span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item, index) => (
          <Link key={index} to={item.link} className="block group bg-brand-cream-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative">
              <div className="absolute top-0 left-0 bg-brand-green-700 text-brand-cream-50 text-center w-16 py-2 z-10 rounded-br-lg shadow-lg">
                <div className="font-bold text-2xl">{item.date.day}</div>
                <div className="text-xs uppercase">Th{item.date.month}</div>
              </div>
              <div className="w-full h-56 overflow-hidden">
                <ImageFallback 
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  fallbackSrc="/banner.jpg"
                />
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg mb-2 text-brand-brown-900 group-hover:text-brand-green-700 transition-colors">
                {item.title}
              </h3>
              <p className="text-brand-brown-600 text-sm line-clamp-3">{item.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function HomePage() {
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [regionalProducts, setRegionalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mockNews = [
    {
      title: "LAP XƯỞNG TƯƠI: NGUỒN GỐC, CÁCH LÀM & MUA Ở ĐÂU NGON",
      excerpt: "XUẤT XỨ LAP XƯỞNG TƯƠI & MUA LAP XƯỞNG TƯƠI NGON ✓ Trong không khí Tết, món lạp xưởng tươi luôn là một phần không thể thiếu trong bữa ăn của nhiều gia đình Việt...",
      imageUrl: "/images/news/lap-xuong.jpg",
      link: "/news/1",
      date: { day: 25, month: 4 }
    },
    {
      title: "Cơm cháy Chà bông VIỆT SPECIAL – Sạch Ngon khó cưỡng",
      excerpt: "LỊCH SỬ 100 NĂM CƠM CHÁY CHÀ BÔNG. Bạn có biết Cơm cháy chà bông là một trong những món ăn vặt có tuổi đời lâu nhất tại Việt Nam?...",
      imageUrl: "/images/news/com-chay.jpg",
      link: "/news/2",
      date: { day: 8, month: 1 }
    },
    {
      title: "HOÀNG MỸ GIA – Đặc sản vùng miền – Cung ứng sỉ lẻ",
      excerpt: "Hoàng Mỹ Gia là đơn vị phân phối các sản phẩm bánh kẹo đặc sản ba miền, mang hương vị quê hương đến mọi nhà. Chúng tôi cam kết chất lượng và giá cả tốt nhất.",
      imageUrl: "/images/news/hoang-my-gia.jpg",
      link: "/news/3",
      date: { day: 8, month: 1 }
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [featuredResponse, allProductsResponse] = await Promise.all([
          getFeaturedProducts(10), // fetch more for variety
          getAllProducts(1, 20)
        ]);
        
        const featuredProducts = featuredResponse || [];
        const allProducts = allProductsResponse.items || [];
        
        const processProduct = product => {
            let finalImageUrl = '/images/placeholder.svg';
            if (product.productImages && product.productImages.length > 0) {
                finalImageUrl = product.productImages[0].imageUrl;
            } else if(product.imageUrl) {
                finalImageUrl = product.imageUrl;
            }

            return {
                ...product,
                id: product.id || product.productId,
                imageUrl: generateImageUrl(finalImageUrl),
                price: product.price || 0,
                originalPrice: product.originalPrice,
                name: product.name || 'Sản phẩm không tên',
                discountPercentage: product.discount || product.Discount || product.discountPercentage || 0,
                region: product.category?.name // Assuming category name holds region
            };
        };

        const processedAllProducts = allProducts.map(processProduct);
        const processedFeaturedProducts = featuredProducts.map(processProduct);

        setNewProducts(processedAllProducts.slice(0, 5));
        setBestSellers(processedFeaturedProducts.slice(0, 10));
        setRegionalProducts(processedAllProducts.filter(p => p.region && p.region.includes("Miền")).slice(0, 5));
        
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        setNewProducts([]);
        setBestSellers([]);
        setRegionalProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  if (loading && !error) return (
    <div className="text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-green-600 border-t-transparent mx-auto"></div>
        <p className="mt-4 text-brand-brown-600 text-lg">Đang tải sản phẩm...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center py-12 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Thử lại
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-brand-background">
      <Banner />
      
      <div className="container-responsive py-4 md:py-8 space-y-8 md:space-y-12">
        <ProductSection 
          title="SẢN PHẨM MỚI" 
          products={newProducts} 
          viewAllLink="/products?sort=newest" 
          loading={loading && newProducts.length === 0}
        />
        <ProductSection 
          title="SẢN PHẨM BÁN CHẠY" 
          products={bestSellers} 
          viewAllLink="/products?sort=bestsellers"
          loading={loading && bestSellers.length === 0}
        />
      </div>
      
      <div className="container-responsive py-4 md:py-8 space-y-8 md:space-y-12">
        <ProductSection 
          title="ĐẶC SẢN VÙNG MIỀN" 
          products={regionalProducts} 
          viewAllLink="/products/regions"
          loading={loading && regionalProducts.length === 0}
        />
        <NewsSection news={mockNews} />
      </div>
    </div>
  );
}

export default HomePage;
