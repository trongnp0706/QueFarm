import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { FaFilter, FaSort, FaThLarge, FaList } from 'react-icons/fa';
import CategoryMenu from '../category/CategoryMenu';
import ProductGrid from './ProductGrid';
import { getAllProducts, getProductsByCategorySlug, searchProducts, generateImageUrl } from '../../services/productService';

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
          const response = await getAllProducts(1, 50);
          productsData = response.items || [];
        }
        
        // Ensure productsData is an array
        if (!Array.isArray(productsData)) {
          productsData = [];
        }
        
        // Process real API data - ensure image URLs are complete
        productsData = productsData.map(product => {
          // Try to get image URL from various possible properties
          let finalImageUrl = '/placeholder.png';
          
          // Check direct imageUrl properties
          if (product.imageUrl && product.imageUrl.trim()) {
            finalImageUrl = product.imageUrl;
          } else if (product.ImageUrl && product.ImageUrl.trim()) {
            finalImageUrl = product.ImageUrl;
          }
          // Check images array
          else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            if (product.images[0].imageUrl) {
              finalImageUrl = product.images[0].imageUrl;
            } else if (product.images[0].ImageUrl) {
              finalImageUrl = product.images[0].ImageUrl;
            } else if (product.images[0].url) {
              finalImageUrl = product.images[0].url;
            } else if (product.images[0].Url) {
              finalImageUrl = product.images[0].Url;
            }
          }
          // Check Images array (Pascal case)
          else if (product.Images && Array.isArray(product.Images) && product.Images.length > 0) {
            if (product.Images[0].imageUrl) {
              finalImageUrl = product.Images[0].imageUrl;
            } else if (product.Images[0].ImageUrl) {
              finalImageUrl = product.Images[0].ImageUrl;
            } else if (product.Images[0].url) {
              finalImageUrl = product.Images[0].url;
            } else if (product.Images[0].Url) {
              finalImageUrl = product.Images[0].Url;
            }
          }
          // Check productImages array
          else if (product.productImages && Array.isArray(product.productImages) && product.productImages.length > 0) {
            if (product.productImages[0].imageUrl) {
              finalImageUrl = product.productImages[0].imageUrl;
            } else if (product.productImages[0].ImageUrl) {
              finalImageUrl = product.productImages[0].ImageUrl;
            }
          }
          // Check ProductImages array (Pascal case)
          else if (product.ProductImages && Array.isArray(product.ProductImages) && product.ProductImages.length > 0) {
            if (product.ProductImages[0].imageUrl) {
              finalImageUrl = product.ProductImages[0].imageUrl;
            } else if (product.ProductImages[0].ImageUrl) {
              finalImageUrl = product.ProductImages[0].ImageUrl;
            }
          }
          
          return {
            ...product,
            imageUrl: generateImageUrl(finalImageUrl),
            // Ensure price is properly formatted
            price: product.price || product.Price || 0,
            originalPrice: product.originalPrice || product.OriginalPrice,
            // Handle different naming conventions
            name: product.name || product.Name || 'Sản phẩm',
            discountPercentage: product.discount || product.Discount || product.discountPercentage,
            region: product.region || product.Region
          };
        });
        
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
            filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case 'popularity':
          default:
            // Default sorting (by popularity)
            break;
        }
        
        setProducts(filteredProducts);
      } catch {
        setError('Không thể tải danh sách sản phẩm từ database. Vui lòng kiểm tra kết nối server.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [categorySlug, query, sortBy, priceRange]);

  const handleCategorySelect = () => {
    // In a real app, update URL or fetch products by category ID
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  const handlePriceRangeChange = (min, max) => {
    setPriceRange([min, max]);
  };

  return (
    <>
      {/* Hero Section for Products Page */}
      <div className="relative bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Đặc Sản Vùng Miền Việt Nam
            </h1>
            <p className="text-xl md:text-2xl mb-6 opacity-90">
              Tinh hoa ẩm thực từ Bắc đến Nam
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm md:text-base">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span>Chính gốc</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span>Chất lượng cao</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span>Giao hàng tận nơi</span>
              </div>
            </div>
          </div>
        </div>
      </div>



      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          
          {/* Statistics Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between">
              <div className="text-gray-600">
                <span className="font-medium">{products.length}</span> sản phẩm được tìm thấy
                {query && <span className="ml-2">cho từ khóa: <strong>"{query}"</strong></span>}
              </div>
              <div className="flex items-center space-x-4 mt-2 md:mt-0">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  Hot
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Mới
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Enhanced Sidebar with filters */}
            <div className="lg:w-1/4">
              <div className="sticky top-4">
                <CategoryMenu onSelect={handleCategorySelect} className="mb-6" />
                
                <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-700 to-green-600 text-white py-4 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaFilter />
                      <span className="font-bold">BỘ LỌC SẢN PHẨM</span>
                    </div>
                    <button 
                      className="lg:hidden text-white hover:text-yellow-300 transition-colors"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      {showFilters ? '−' : '+'}
                    </button>
                  </div>
                  
                  <div className={`p-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 text-gray-800 flex items-center">
                        <span className="w-1 h-4 bg-green-600 mr-2 rounded"></span>
                        Khoảng giá
                      </h4>
                      <div className="space-y-3">
                        <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                          <input 
                            type="radio" 
                            name="price-range" 
                            className="mr-3 text-green-600" 
                            onChange={() => handlePriceRangeChange(0, 50000)}
                            checked={priceRange[0] === 0 && priceRange[1] === 50000}
                          />
                          <span className="text-gray-700">Dưới 50.000₫</span>
                        </label>
                        <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                          <input 
                            type="radio" 
                            name="price-range" 
                            className="mr-3 text-green-600" 
                            onChange={() => handlePriceRangeChange(50000, 100000)}
                            checked={priceRange[0] === 50000 && priceRange[1] === 100000}
                          />
                          <span className="text-gray-700">50.000₫ - 100.000₫</span>
                        </label>
                        <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                          <input 
                            type="radio" 
                            name="price-range" 
                            className="mr-3 text-green-600" 
                            onChange={() => handlePriceRangeChange(100000, 200000)}
                            checked={priceRange[0] === 100000 && priceRange[1] === 200000}
                          />
                          <span className="text-gray-700">100.000₫ - 200.000₫</span>
                        </label>
                        <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                          <input 
                            type="radio" 
                            name="price-range" 
                            className="mr-3 text-green-600" 
                            onChange={() => handlePriceRangeChange(0, 1000000)}
                            checked={priceRange[0] === 0 && priceRange[1] === 1000000}
                          />
                          <span className="text-gray-700">Tất cả giá</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Product listing */}
            <div className="lg:w-3/4">
              {/* Enhanced Toolbar */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex items-center mb-4 lg:mb-0">
                    <span className="text-gray-600 mr-3 hidden sm:inline">Hiển thị:</span>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button 
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-green-600'}`}
                        onClick={() => setViewMode('grid')}
                        aria-label="Grid view"
                      >
                        <FaThLarge />
                      </button>
                      <button 
                        className={`p-2 rounded-md ml-1 transition-all ${viewMode === 'list' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-green-600'}`}
                        onClick={() => setViewMode('list')}
                        aria-label="List view"
                      >
                        <FaList />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <label className="flex items-center text-gray-600">
                      <FaSort className="mr-2" />
                      <span className="mr-3 hidden sm:inline">Sắp xếp:</span>
                      <select 
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
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
              </div>
              
              {/* Products with enhanced loading and error states */}
              {loading ? (
                <div className="text-center py-16">
                  <div className="inline-flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 text-lg">Đang tải sản phẩm...</p>
                    <div className="mt-2 flex space-x-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm p-8">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Lỗi khi tải sản phẩm</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Tải lại trang
                    </button>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm p-8">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-6l-2 2h-4l-2-2H4"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
                    <p className="text-gray-600 mb-6">Vui lòng thử lại với bộ lọc khác hoặc từ khóa tìm kiếm khác</p>
                    <button 
                      onClick={() => window.location.href = '/products'} 
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Xem tất cả sản phẩm
                    </button>
                  </div>
                </div>
              ) : (
                viewMode === 'grid' ? (
                  <ProductGrid products={products} />
                ) : (
                  <div className="space-y-4">
                    {products.map(product => (
                      <div key={product.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex">
                          <div className="w-1/4 relative">
                            {product.discount && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center z-10">
                                -{product.discount}%
                              </div>
                            )}
                            {product.hot && (
                              <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                HOT
                              </div>
                            )}
                            <img 
                              src={product.imageUrl} 
                              alt={product.name} 
                              className="w-full h-32 object-cover rounded-lg"
                              onError={(e) => {
                                if (e.target.src !== '/placeholder.png') {
                                  e.target.src = '/placeholder.png';
                                }
                              }}
                            />
                          </div>
                          <div className="w-3/4 pl-6 flex flex-col">
                            <h3 className="font-semibold text-lg text-gray-800 mb-2 hover:text-green-600 cursor-pointer transition-colors">{product.name}</h3>
                            <div className="mb-3 flex items-center">
                              <div className="flex text-yellow-400 mr-2">
                                {'★'.repeat(Math.round(product.rating))}
                                <span className="text-gray-300">{'★'.repeat(5 - Math.round(product.rating))}</span>
                              </div>
                              <span className="text-sm text-gray-500">({product.rating})</span>
                            </div>
                            <div className="mb-4">
                              {product.originalPrice && (
                                <span className="text-gray-500 text-sm line-through mr-3">{product.originalPrice.toLocaleString()}₫</span>
                              )}
                              <span className="text-red-600 font-bold text-xl">{product.price.toLocaleString()}₫</span>
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                              <div className="text-sm text-gray-500">
                                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                {product.region}
                              </div>
                              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                                Xem chi tiết
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductList;
