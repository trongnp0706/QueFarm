import Banner from '../components/Banner';
import ProductGrid from '../features/product/ProductGrid';
import ImageFallback from '../components/ImageFallback';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { getFeaturedProducts, getAllProducts } from '../services/productService';

function ProductSection({ title, products, viewAllLink, loading = false }) {
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-brown-800 relative inline-block">
          <span className="relative z-10">{title}</span>
          <span className="absolute bottom-0 left-0 w-full h-1 bg-green-700"></span>
        </h2>
      </div>
      
      <div className="relative">
        <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-green-600/80 text-white p-2 rounded-full shadow hover:bg-green-700 transition">
          <FiArrowLeft />
        </button>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-8">
          {loading ? (
            // Skeleton loading
            [...Array(4)].map((_, index) => (
              <div key={index} className="group relative">
                <div className="block bg-white rounded-lg overflow-hidden border border-gray-200">
                  <div className="h-40 bg-gray-200 animate-pulse"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>
                <div className="mt-2 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))
          ) : (
            products.map(product => (
              <div key={product.id} className="group relative">
                {(product.discount || product.discountPercentage) && (
                  <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold rounded-full h-10 w-10 flex items-center justify-center z-10">
                    -{product.discount || product.discountPercentage}%
                  </div>
                )}
                <Link to={`/product/${product.id}`} className="block bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-green-500 transition">
                  <div className="h-40 overflow-hidden">
                    <ImageFallback 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      fallbackSrc="/placeholder.png"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1 group-hover:text-green-700 transition">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      {product.originalPrice && (
                        <span className="text-gray-500 text-xs line-through">{product.originalPrice.toLocaleString()}₫</span>
                      )}
                      <span className="text-green-800 font-bold">{product.price.toLocaleString()}₫</span>
                    </div>
                  </div>
                </Link>
                <Link 
                  to={`/product/${product.id}`}
                  className="mt-2 block text-center bg-green-800 text-white text-sm font-medium py-1 rounded hover:bg-green-700 transition"
                >
                  MUA HÀNG
                </Link>
              </div>
            ))
          )}
        </div>
        
        <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-green-600/80 text-white p-2 rounded-full shadow hover:bg-green-700 transition">
          <FiArrowRight />
        </button>
      </div>
      
      {viewAllLink && !loading && (
        <div className="text-center mt-6">
          <Link to={viewAllLink} className="inline-flex items-center text-green-700 hover:text-green-800">
            Xem tất cả <FiArrowRight className="ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
}

function TestimonialSection() {
  return (
    <div className="py-12 bg-gradient-to-r from-green-900 to-green-800 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-8">CẢM NHẬN KHÁCH HÀNG</h2>
        
        <div className="relative max-w-2xl mx-auto">
          <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg">
            <div className="mb-4 flex justify-center">
              <img 
                src="https://via.placeholder.com/100" 
                alt="Customer" 
                className="w-20 h-20 rounded-full border-2 border-white"
              />
            </div>
            <h3 className="text-xl font-semibold">Chị Hồng Ánh – Quận Tân Bình</h3>
            <div className="text-yellow-400 text-lg mb-2">★★★★★</div>
            <p className="text-white/90 italic">
              Mình là khách ruột của đặc sản 3 miền vì mình ăn cảm giác món ăn đúng vị quê nhà và sản phẩm được chăm chút bao bì rất đẹp và nhờ mấy món này mà nhà mình đông khách đến chơi đó nhé 🙂
            </p>
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
          <button className="h-3 w-3 rounded-full bg-white mx-1 opacity-50"></button>
          <button className="h-3 w-3 rounded-full bg-white mx-1"></button>
          <button className="h-3 w-3 rounded-full bg-white mx-1 opacity-50"></button>
        </div>
      </div>
    </div>
  );
}

function NewsSection({ news }) {
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-brown-800 relative inline-block">
          <span className="relative z-10">TIN TỨC</span>
          <span className="absolute bottom-0 left-0 w-full h-1 bg-green-700"></span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {news.map((item, index) => (
          <Link key={index} to={item.link} className="block group">
            <div className="relative">
              <div className="absolute top-0 left-0 bg-green-800 text-white text-xs px-2 py-1 z-10">
                <div className="font-bold">{item.date.day}</div>
                <div>Th{item.date.month}</div>
              </div>
              <ImageFallback 
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-lg group-hover:opacity-90 transition"
                fallbackSrc="/banner.jpg"
              />
            </div>
            <div className="bg-white p-4 rounded-b-lg shadow">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-green-700 transition">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">{item.excerpt}</p>
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
  const [southProducts, setSouthProducts] = useState([]);
  const [centralProducts, setCentralProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for development
 
  const mockNews = [
    {
      title: "LAP XƯỞNG TƯƠI: NGUỒN GỐC LAP XƯỞNG TƯƠI NGON & MUA LAP XƯỞNG TƯƠI",
      excerpt: "XUẤT XỨ LAP XƯỞNG TƯƠI & MUA LAP XƯỞNG TƯƠI NGON ✓ Trong không khí Tết...",
      imageUrl: "https://via.placeholder.com/400x300?text=News",
      link: "/news/1",
      date: { day: 25, month: 4 }
    },
    {
      title: "Cơm cháy Chà bông VIỆT SPECIAL – Sạch Ngon khó cưỡng",
      excerpt: "LỊCH SỬ 100 NĂM CƠM CHÁY CHÀ BÔNG Bạn có biết Cơm cháy chà bông...",
      imageUrl: "https://via.placeholder.com/400x300?text=News",
      link: "/news/2",
      date: { day: 8, month: 1 }
    },
    {
      title: "HOÀNG MỸ GIA – Đặc sản vùng miền – Cung ứng sỉ lẻ",
      excerpt: "Hoàng Mỹ Gia là đơn vị phân phối các sản phẩm bánh kẹo đặc sản...",
      imageUrl: "https://via.placeholder.com/400x300?text=News",
      link: "/news/3",
      date: { day: 8, month: 1 }
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch featured products and all products concurrently
        const [featuredResponse, allProductsResponse] = await Promise.all([
          getFeaturedProducts(8),
          getAllProducts(1, 16)
        ]);
        
        const featuredProducts = featuredResponse || [];
        const allProducts = allProductsResponse.items || [];
        
        // Set products for different sections
        setNewProducts(allProducts.slice(0, 4));
        setBestSellers(featuredProducts.slice(0, 8));
        
        // Filter products by region if available
        const southProducts = allProducts.filter(p => p.region === "Miền Nam").slice(0, 4);
        const centralProducts = allProducts.filter(p => p.region === "Miền Trung").slice(0, 4);
        
        // Fallback to first 4 products if no region-specific products
        setSouthProducts(southProducts.length > 0 ? southProducts : allProducts.slice(0, 4));
        setCentralProducts(centralProducts.length > 0 ? centralProducts : allProducts.slice(4, 8));
        
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Không thể tải sản phẩm. Đang sử dụng dữ liệu mẫu.');
        
        // Fallback to mock data with better structure
        const mockProducts = [
          { 
            id: 1, 
            name: "Lạp xưởng tươi tôm - Gói 250gr", 
            price: 66700, 
            originalPrice: 80040, 
            discountPercentage: 17,
            imageUrl: "/images/products/lap-xuong-tom-250gr.jpg",
            region: "Miền Nam"
          },
          { 
            id: 2, 
            name: "Lạp xưởng tươi tôm - Gói 500gr", 
            price: 138500, 
            originalPrice: 166200, 
            discountPercentage: 17,
            imageUrl: "/images/products/lap-xuong-tom-500gr.jpg",
            region: "Miền Nam"
          },
          { 
            id: 3, 
            name: "Lạp xưởng tươi bò - Gói 250gr", 
            price: 62200, 
            originalPrice: 74640, 
            discountPercentage: 17,
            imageUrl: "/images/products/lap-xuong-bo-250gr.jpg",
            region: "Miền Nam"
          },
          { 
            id: 4, 
            name: "Lạp xưởng tươi bò - Gói 500gr", 
            price: 124500, 
            originalPrice: 149400, 
            discountPercentage: 17,
            imageUrl: "/images/products/lap-xuong-bo-500gr.jpg",
            region: "Miền Nam"
          },
          { 
            id: 5, 
            name: "Bánh gai - Gói 250gr", 
            price: 36500, 
            originalPrice: 40150, 
            discountPercentage: 9,
            imageUrl: "/images/products/banh-gai-250gr.jpg",
            region: "Miền Bắc"
          },
          { 
            id: 6, 
            name: "Nem chua Thanh Hóa - Gói 300gr", 
            price: 42000, 
            originalPrice: 48000, 
            discountPercentage: 12,
            imageUrl: "/images/products/nem-chua-thanh-hoa-300gr.jpg",
            region: "Miền Trung"
          },
          { 
            id: 7, 
            name: "Mắm ruốc Huế - Hũ 200gr", 
            price: 65000, 
            originalPrice: 72000, 
            discountPercentage: 10,
            imageUrl: "/images/products/mam-ruoc-hue-200gr.jpg",
            region: "Miền Trung"
          },
          { 
            id: 8, 
            name: "Bánh đậu xanh nướng 250gr", 
            price: 48000, 
            originalPrice: 55200, 
            discountPercentage: 13,
            imageUrl: "/images/products/banh-dau-xanh-250gr.jpg",
            region: "Miền Bắc"
          }
        ];
        
        setNewProducts(mockProducts.slice(0, 4));
        setBestSellers(mockProducts);
        setSouthProducts(mockProducts.filter(p => p.region === "Miền Nam"));
        setCentralProducts(mockProducts.filter(p => p.region === "Miền Trung"));
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 text-lg">Đang tải sản phẩm...</p>
        <div className="mt-2 flex space-x-1">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="text-center py-12 bg-red-50 border border-red-200 rounded-lg mx-4">
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
  );

  return (
    <div>
      <Banner />
      
      <div className="container mx-auto px-4 py-8">
        <ProductSection 
          title="SẢN PHẨM MỚI" 
          products={newProducts} 
          viewAllLink="/products/new" 
          loading={loading}
        />
        <ProductSection 
          title="SẢN PHẨM BÁN CHẠY" 
          products={bestSellers} 
          viewAllLink="/products/bestsellers" 
          loading={loading}
        />
      </div>
      
      <TestimonialSection />
      
      <div className="container mx-auto px-4 py-8">
        <ProductSection 
          title="ĐẶC SẢN MIỀN NAM" 
          products={southProducts} 
          viewAllLink="/products/south" 
          loading={loading}
        />
        <ProductSection 
          title="ĐẶC SẢN MIỀN TRUNG" 
          products={centralProducts} 
          viewAllLink="/products/central" 
          loading={loading}
        />
        <NewsSection news={mockNews} />
      </div>
    </div>
  );
}

export default HomePage; 