import Banner from '../components/Banner';
<<<<<<< HEAD
import Breadcrumb from '../components/Breadcrumb';
import ProductGrid from '../features/product/ProductGrid';
import { Card, Typography, Spin, Alert, Button } from 'antd';
=======
import ProductGrid from '../features/product/ProductGrid';
>>>>>>> dev-base
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { getFeaturedProducts, getAllProducts } from '../services/productService';

function ProductSection({ title, products, viewAllLink }) {
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
          {products.map(product => (
            <div key={product.id} className="group relative">
              {product.discount && (
                <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold rounded-full h-10 w-10 flex items-center justify-center z-10">
                  -{product.discount}%
                </div>
              )}
              <Link to={`/product/${product.id}`} className="block bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-green-500 transition">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
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
          ))}
        </div>
        
        <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-green-600/80 text-white p-2 rounded-full shadow hover:bg-green-700 transition">
          <FiArrowRight />
        </button>
      </div>
      
      {viewAllLink && (
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
              <div className="absolute top-0 left-0 bg-green-800 text-white text-xs px-2 py-1">
                <div>{item.date.day}</div>
                <div>Th{item.date.month}</div>
              </div>
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-lg group-hover:opacity-90 transition"
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

const { Title, Text } = Typography;

function HomePage() {
<<<<<<< HEAD
  const [products, setProducts] = useState([]);
=======
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [southProducts, setSouthProducts] = useState([]);
  const [centralProducts, setCentralProducts] = useState([]);
>>>>>>> dev-base
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
<<<<<<< HEAD
    setLoading(true);
    setError(null);
    fetch('/api/product')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setProducts(data);
=======
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch featured products
        const featuredProducts = await getFeaturedProducts(8);
        
        // Fetch all products for other sections  
        const allProductsResponse = await getAllProducts(1, 20);
        const allProducts = allProductsResponse.items || [];
        
        setNewProducts(featuredProducts.slice(0, 4));
        setBestSellers(featuredProducts);
        setSouthProducts(allProducts.slice(0, 4));
        setCentralProducts(allProducts.slice(4, 8));
        
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Không thể tải sản phẩm');
        
        // Fallback to mock data
        const mockProducts = [
          { 
            id: 1, 
            name: "Lạp xưởng tươi tôm_ Gói 250gr", 
            price: 66700, 
            originalPrice: 80040, 
            discount: 17, 
            imageUrl: "https://via.placeholder.com/300x300?text=Product" 
          },
          { 
            id: 2, 
            name: "Lạp xưởng tươi tôm_ Gói 500gr", 
            price: 138500, 
            originalPrice: 166200, 
            discount: 17, 
            imageUrl: "https://via.placeholder.com/300x300?text=Product" 
          },
          { 
            id: 3, 
            name: "Lạp xưởng tươi bò _ Gói 250gr", 
            price: 62200, 
            originalPrice: 74640, 
            discount: 17, 
            imageUrl: "https://via.placeholder.com/300x300?text=Product" 
          },
          { 
            id: 4, 
            name: "Lạp xưởng tươi bò _ Gói 500gr", 
            price: 124500, 
            originalPrice: 149400, 
            discount: 17, 
            imageUrl: "https://via.placeholder.com/300x300?text=Product" 
          }
        ];
        
        setNewProducts(mockProducts);
        setBestSellers(mockProducts);
        setSouthProducts(mockProducts);
        setCentralProducts(mockProducts);
      } finally {
>>>>>>> dev-base
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

<<<<<<< HEAD
=======
  if (loading) return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      <p className="mt-2 text-gray-600">Đang tải sản phẩm...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-12">
      <p className="text-red-600">Lỗi: {error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Thử lại
      </button>
    </div>
  );

>>>>>>> dev-base
  return (
    <div>
      <Banner />
<<<<<<< HEAD
      <Breadcrumb />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center min-h-96">
              <div className="text-center">
                <Spin size="large" />
                <div className="mt-4 text-gray-600">Đang tải sản phẩm...</div>
              </div>
            </div>
          )}
          {/* Error state */}
          {error && (
            <Alert
              message="Lỗi tải sản phẩm"
              description={error}
              type="error"
              showIcon
              action={
                <Button size="small" onClick={() => window.location.reload()}>
                  Thử lại
                </Button>
              }
              className="mb-6"
            />
          )}
          {/* Products grid */}
          {!loading && !error && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <Title level={3} className="text-gray-800 mb-0">
                  Sản phẩm nổi bật
                </Title>
                <Text className="text-gray-600">
                  {products.length} sản phẩm
                </Text>
              </div>
              {products.length > 0 ? (
                <ProductGrid products={products} />
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <Title level={4} className="text-gray-600">
                    Không tìm thấy sản phẩm
                  </Title>
                  <Text className="text-gray-500">
                    Hãy thử lại sau hoặc liên hệ quản trị viên.
                  </Text>
                </div>
              )}
            </Card>
          )}
        </div>
=======
      
      <div className="container mx-auto px-4 py-8">
        <ProductSection title="SẢN PHẨM MỚI" products={newProducts} viewAllLink="/products/new" />
        <ProductSection title="SẢN PHẨM BÁN CHẠY" products={bestSellers} viewAllLink="/products/bestsellers" />
>>>>>>> dev-base
      </div>
      
      <TestimonialSection />
      
      <div className="container mx-auto px-4 py-8">
        <ProductSection title="ĐẶC SẢN MIỀN NAM" products={southProducts} viewAllLink="/products/south" />
        <ProductSection title="ĐẶC SẢN MIỀN TRUNG" products={centralProducts} viewAllLink="/products/central" />
        <NewsSection news={mockNews} />
      </div>
    </div>
  );
}

export default HomePage; 