import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaList } from 'react-icons/fa';
import categoryService from '../../services/categoryService';

function CategoryMenu({ onSelect }) {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryMenu; 