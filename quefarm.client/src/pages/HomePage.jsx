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
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 my-4">
          <button className="bg-green-500 text-white px-6 py-2 rounded-t-lg flex items-center gap-2 font-semibold text-lg shadow border-b-2 border-green-600">
            <FaList />
            DANH MỤC SẢN PHẨM
          </button>
        </div>
        <CategoryMenu onSelect={handleSelectCategory} />
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600">Đang tải sản phẩm...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">Lỗi: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Thử lại
            </button>
          </div>
        )}
        {!loading && !error && <ProductGrid products={filtered} />}
      </div>
    </>
  );
}

export default HomePage; 