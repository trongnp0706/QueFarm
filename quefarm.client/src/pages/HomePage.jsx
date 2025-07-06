import Banner from '../components/Banner';
import Breadcrumb from '../components/Breadcrumb';
import CategoryMenu from '../features/category/CategoryMenu';
import ProductGrid from '../features/product/ProductGrid';
import { FaList } from 'react-icons/fa';
import { useState, useEffect } from 'react';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/product')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSelectCategory = (catId) => {
    if (!catId) setFiltered(products);
    else setFiltered(products.filter(p => p.categoryId === catId));
  };

  return (
    <>
      <Banner />
      <Breadcrumb />
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center gap-2 my-3 md:my-4">
          <button className="bg-green-500 text-white px-3 md:px-6 py-2 rounded-t-lg flex items-center gap-2 font-semibold text-sm md:text-lg shadow border-b-2 border-green-600">
            <FaList className="text-sm md:text-base" />
            <span className="hidden sm:inline">DANH MỤC SẢN PHẨM</span>
            <span className="sm:hidden">DANH MỤC</span>
          </button>
        </div>
        <CategoryMenu onSelect={handleSelectCategory} />
        
        {/* Loading state */}
        {loading && (
          <div className="text-center py-8 md:py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600 text-sm md:text-base">Đang tải sản phẩm...</p>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="text-center py-8 md:py-12">
            <p className="text-red-600 text-sm md:text-base mb-3">Lỗi: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm md:text-base"
            >
              Thử lại
            </button>
          </div>
        )}
        
        {/* Products grid */}
        {!loading && !error && (
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                Sản phẩm nổi bật
              </h2>
              <span className="text-sm md:text-base text-gray-600">
                {filtered.length} sản phẩm
              </span>
            </div>
            <ProductGrid products={filtered} />
          </div>
        )}
      </div>
    </>
  );
}

export default HomePage; 