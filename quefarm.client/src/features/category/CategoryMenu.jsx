import { useEffect, useState } from 'react';

function CategoryMenu({ onSelect }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch('/api/category')
      .then(res => {
        console.log('Category response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Categories from API:', data);
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-3 md:py-4">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
        <p className="mt-1 text-sm text-gray-600">Đang tải danh mục...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-3 md:py-4">
        <p className="text-red-600 text-sm">Lỗi tải danh mục: {error}</p>
      </div>
    );
  }

  return (
    <div className="my-3 md:my-4">
      {/* Desktop view - centered */}
      <div className="hidden md:flex flex-wrap gap-2 justify-center">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-full shadow hover:bg-green-700 transition border border-green-700 font-semibold text-sm"
          onClick={() => onSelect && onSelect(null)}
        >
          Tất cả
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-full border border-red-300 font-semibold shadow hover:bg-red-200 hover:text-white hover:bg-red-500 transition text-sm"
            onClick={() => onSelect && onSelect(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Mobile/Tablet view - horizontal scroll */}
      <div className="md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            className="bg-green-600 text-white px-3 py-2 rounded-full shadow hover:bg-green-700 transition border border-green-700 font-semibold text-sm whitespace-nowrap flex-shrink-0"
            onClick={() => onSelect && onSelect(null)}
          >
            Tất cả
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className="bg-red-100 text-red-600 px-3 py-2 rounded-full border border-red-300 font-semibold shadow hover:bg-red-200 hover:text-white hover:bg-red-500 transition text-sm whitespace-nowrap flex-shrink-0"
              onClick={() => onSelect && onSelect(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryMenu; 