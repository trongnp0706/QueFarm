import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaList } from 'react-icons/fa';
import categoryService from '../../services/categoryService';

// SVG icon mẫu cho từng danh mục (có thể thay thế sau)
const categoryIcons = [
  (
    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 15s1.5-2 4-2 4 2 4 2" /></svg>
  ), // Rau củ quả
  (
    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 12h20M12 2v20" /></svg>
  ), // Thịt cá trứng
  (
    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
  ), // Mì cháo phở
  (
    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 21h8M12 17v4" /></svg>
  ), // Đồ uống các loại
  (
    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 20h16M4 4h16v16H4z" /></svg>
  ), // Dầu ăn gia vị
  (
    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="6" /></svg>
  ), // Đồ đông lạnh
  (
    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>
  ), // Thực phẩm chế biến
  (
    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 9h16" /></svg>
  ), // Thực phẩm tết
];

function CategoryMenu({ onSelect }) {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
<<<<<<< HEAD
    setLoading(true);
    setError(null);
    fetch('/api/category')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4">
        <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-600"></span>
        <div className="mt-2 text-sm text-gray-600">Đang tải danh mục...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-3 rounded mb-4">Lỗi tải danh mục: {error}</div>
    );
  }

  return (
    <div className="w-full rounded shadow overflow-hidden">
      {/* Danh sách danh mục */}
      <ul className="divide-y divide-gray-100">
        {categories.map((cat, idx) => (
          <li
            key={cat.id}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition hover:bg-green-100 ${idx % 2 === 1 ? 'bg-green-50' : 'bg-white'}`}
            onClick={() => onSelect && onSelect(cat.id)}
          >
            <span className="w-8 h-8 flex items-center justify-center text-green-700">
              {categoryIcons[idx] || categoryIcons[0]}
            </span>
            <span className="text-green-900 font-medium text-base">{cat.name}</span>
=======
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        
        // Fallback to mock data if API fails
        const mockCategories = [
          { id: 1, name: 'Đặc sản miền Bắc', slug: 'dac-san-mien-bac', count: 24 },
          { id: 2, name: 'Đặc sản miền Trung', slug: 'dac-san-mien-trung', count: 18 },
          { id: 3, name: 'Đặc sản miền Nam', slug: 'dac-san-mien-nam', count: 32 },
          { id: 4, name: 'Lap xưởng tươi', slug: 'lap-xuong-tuoi', count: 12 },
          { id: 5, name: 'Bánh kẹo truyền thống', slug: 'banh-keo-truyen-thong', count: 28 },
          { id: 6, name: 'Đặc sản Tây Ninh', slug: 'dac-san-tay-ninh', count: 15 },
          { id: 7, name: 'Combo quà tặng', slug: 'combo-qua-tang', count: 8 }
        ];
        setCategories(mockCategories);
      }
    };
    
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    if (onSelect) {
      onSelect(categoryId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
      {/* Category Header */}
      <div className="bg-green-700 text-white py-3 px-4">
        <div className="flex items-center gap-2">
          <FaList />
          <span className="font-bold">DANH MỤC SẢN PHẨM</span>
        </div>
      </div>
      
      {/* Category List */}
      <ul className="divide-y divide-gray-200">
        {categories.map((category) => (
          <li key={category.id}>
            <Link 
              to={`/category/${category.slug}`}
              className={`flex items-center justify-between py-3 px-4 hover:bg-green-50 transition-colors
                ${activeCategory === category.id ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="flex items-center">
                <FaLeaf className={`mr-3 ${activeCategory === category.id ? 'text-green-600' : 'text-green-400'}`} />
                <span>{category.name}</span>
              </div>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{category.count}</span>
            </Link>
>>>>>>> dev-base
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryMenu; 