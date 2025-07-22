import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { FaFilter, FaSort, FaThLarge, FaList } from 'react-icons/fa';
import CategoryMenu from '../category/CategoryMenu';
import ProductGrid from './ProductGrid';
import { getAllProducts, getProductsByCategorySlug, searchProducts } from '../../services/productService';

// Mock data for fallback
const mockProducts = [
  { 
    id: 1, 
    name: "Lạp xưởng tươi tôm_ Gói 250gr", 
    price: 66700, 
    originalPrice: 80040, 
    discount: 17,
    rating: 4.8,
    categoryId: 4,
    imageUrl: "https://via.placeholder.com/300x300?text=Product" 
  },
  { 
    id: 2, 
    name: "Lạp xưởng tươi tôm_ Gói 500gr", 
    price: 138500, 
    originalPrice: 166200, 
    discount: 17,
    rating: 4.5,
    categoryId: 4,
    imageUrl: "https://via.placeholder.com/300x300?text=Product" 
  },
  { 
    id: 3, 
    name: "Lạp xưởng tươi bò _ Gói 250gr", 
    price: 62200, 
    originalPrice: 74640, 
    discount: 17,
    rating: 4.9,
    categoryId: 4, 
    imageUrl: "https://via.placeholder.com/300x300?text=Product" 
  },
  { 
    id: 4, 
    name: "Lạp xưởng tươi bò _ Gói 500gr", 
    price: 124500, 
    originalPrice: 149400, 
    discount: 17,
    rating: 4.7,
    categoryId: 4,
    imageUrl: "https://via.placeholder.com/300x300?text=Product" 
  },
  { 
    id: 5, 
    name: "Bánh gai _ Gói 250gr", 
    price: 36500, 
    originalPrice: 40150, 
    discount: 9,
    rating: 4.6,
    categoryId: 5,
    imageUrl: "https://via.placeholder.com/300x300?text=Product" 
  },
  { 
    id: 6, 
    name: "Bánh đậu xanh nướng 250gr", 
    price: 48000, 
    originalPrice: 55200, 
    discount: 13,
    rating: 4.8,
    categoryId: 5,
    imageUrl: "https://via.placeholder.com/300x300?text=Product" 
  },
  { 
    id: 7, 
    name: "Bánh ống kem _ Gói 360gr", 
    price: 45500, 
    originalPrice: 50050, 
    discount: 9,
    rating: 4.4,
    categoryId: 5,
    imageUrl: "https://via.placeholder.com/300x300?text=Product" 
  },
  { 
    id: 8, 
    name: "Bánh kẹp mè _ Gói 200gr", 
    price: 31500, 
    originalPrice: 34650, 
    discount: 9,
    rating: 4.3,
    categoryId: 5,
    imageUrl: "https://via.placeholder.com/300x300?text=Product" 
  }
];

// Mock categories for reference
const mockCategoryMap = {
  'dac-san-mien-bac': 1,
  'dac-san-mien-trung': 2,
  'dac-san-mien-nam': 3,
  'lap-xuong-tuoi': 4,
  'banh-keo-truyen-thong': 5,
  'dac-san-tay-ninh': 6,
  'combo-qua-tang': 7
};

function ProductList() {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  
  // Search query from URL if present
  const query = searchParams.get('q') || '';
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let productsData = [];
        
        if (categorySlug) {
          // Fetch products by category slug
          productsData = await getProductsByCategorySlug(categorySlug);
        } else if (query) {
          // Search products
          productsData = await searchProducts(query);
        } else {
          // Get all products
          const response = await getAllProducts(1, 50); // Get more products for filtering
          productsData = response.items || [];
        }
        
        // Apply client-side filtering and sorting
        let filteredProducts = [...productsData];
        
        // Filter by price range
        filteredProducts = filteredProducts.filter(p => 
          p.price >= priceRange[0] && p.price <= priceRange[1]
        );
        
        // Sort products
        switch (sortBy) {
          case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
          case 'popularity':
          default:
            // Default sorting (by popularity)
            break;
        }
        
        setProducts(filteredProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
        
        // Fallback to mock data if API fails
        let filteredProducts = [...mockProducts];
        
        // Filter by category if categorySlug is provided
        if (categorySlug) {
          const categoryId = mockCategoryMap[categorySlug];
          if (categoryId) {
            filteredProducts = filteredProducts.filter(p => p.categoryId === categoryId);
          }
        }
        
        // Filter by search query if provided
        if (query) {
          filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase())
          );
        }
        
        // Filter by price range
        filteredProducts = filteredProducts.filter(p => 
          p.price >= priceRange[0] && p.price <= priceRange[1]
        );
        
        // Sort products
        switch (sortBy) {
          case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
          case 'popularity':
          default:
            // Default sorting (by popularity)
            break;
        }
        
        setProducts(filteredProducts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [categorySlug, query, sortBy, priceRange]);

  const handleCategorySelect = (categoryId) => {
    // In a real app, update URL or fetch products by category ID
    console.log('Selected category:', categoryId);
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  const handlePriceRangeChange = (min, max) => {
    setPriceRange([min, max]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar with filters */}
        <div className="md:w-1/4">
          <CategoryMenu onSelect={handleCategorySelect} />
          
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <div className="bg-green-700 text-white py-3 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaFilter />
                <span className="font-bold">LỌC SẢN PHẨM</span>
              </div>
              <button 
                className="md:hidden text-white"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? '−' : '+'}
              </button>
            </div>
            
            <div className={`p-4 border-t border-gray-200 ${showFilters ? 'block' : 'hidden md:block'}`}>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Giá</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="price-range" 
                      className="mr-2" 
                      onChange={() => handlePriceRangeChange(0, 50000)}
                      checked={priceRange[0] === 0 && priceRange[1] === 50000}
                    />
                    <span>Dưới 50.000₫</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="price-range" 
                      className="mr-2" 
                      onChange={() => handlePriceRangeChange(50000, 100000)}
                      checked={priceRange[0] === 50000 && priceRange[1] === 100000}
                    />
                    <span>50.000₫ - 100.000₫</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="price-range" 
                      className="mr-2" 
                      onChange={() => handlePriceRangeChange(100000, 200000)}
                      checked={priceRange[0] === 100000 && priceRange[1] === 200000}
                    />
                    <span>100.000₫ - 200.000₫</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="price-range" 
                      className="mr-2" 
                      onChange={() => handlePriceRangeChange(0, 1000000)}
                      checked={priceRange[0] === 0 && priceRange[1] === 1000000}
                    />
                    <span>Tất cả giá</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product listing */}
        <div className="md:w-3/4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="text-gray-600 mr-2 hidden sm:inline">Hiển thị:</span>
              <button 
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-100 text-green-700' : 'text-gray-600'}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <FaThLarge />
              </button>
              <button 
                className={`p-2 rounded ml-1 ${viewMode === 'list' ? 'bg-green-100 text-green-700' : 'text-gray-600'}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <FaList />
              </button>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center text-gray-600">
                <FaSort className="mr-2" />
                <span className="mr-2 hidden sm:inline">Sắp xếp:</span>
                <select 
                  className="border rounded px-2 py-1 text-sm"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="popularity">Mặc định</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                  <option value="name">Tên sản phẩm</option>
                  <option value="rating">Đánh giá</option>
                </select>
              </label>
            </div>
          </div>
          
          {/* Products */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mt-2 text-gray-600">Đang tải sản phẩm...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm p-6">
              <p className="text-red-600 font-bold">Lỗi khi tải sản phẩm</p>
              <p className="text-gray-600 mt-2">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Tải lại trang
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 font-medium text-lg">Không tìm thấy sản phẩm nào</p>
              <p className="text-gray-500 mt-2">Vui lòng thử lại với bộ lọc khác</p>
            </div>
          ) : (
            viewMode === 'grid' ? (
              <ProductGrid products={products} />
            ) : (
              <div className="space-y-4">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm p-4 flex">
                    <div className="w-1/4 relative">
                      {product.discount && (
                        <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center z-10">
                          -{product.discount}%
                        </div>
                      )}
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                    <div className="w-3/4 pl-4 flex flex-col">
                      <h3 className="font-medium mb-2">{product.name}</h3>
                      <div className="mb-2">
                        <span className="text-yellow-400">{'★'.repeat(Math.round(product.rating))}</span>
                        <span className="text-gray-300">{'★'.repeat(5 - Math.round(product.rating))}</span>
                      </div>
                      <div className="mb-auto">
                        {product.originalPrice && (
                          <span className="text-gray-500 text-sm line-through mr-2">{product.originalPrice.toLocaleString()}₫</span>
                        )}
                        <span className="text-red-600 font-bold">{product.price.toLocaleString()}₫</span>
                      </div>
                      <button className="self-end bg-green-700 hover:bg-green-800 text-white px-4 py-1 rounded text-sm">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList; 