import { Link, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { getAllCategories } from '../services/categoryService';

function Breadcrumb() {
  const location = useLocation();
  const params = useParams();
  const [category, setCategory] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Load categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getAllCategories();
        setCategories(categoryData || []);
      } catch (error) {
        console.error('Error fetching categories for breadcrumb:', error);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    setCategory(null);
    setProduct(null);
    setLoading(false);

    // Nếu là trang chi tiết sản phẩm
    if (location.pathname.startsWith('/product/') && params.id) {
      setLoading(true);
      fetch(`/api/product/${params.id}`)
        .then(res => res.json())
        .then(async data => {
          setProduct(data);
          // Lấy category từ product data nếu có
          let cat = data.Category || data.category;
          if (cat && (cat.Name || cat.name)) {
            setCategory(cat);
            setLoading(false);
          } else if (data.categoryId) {
            // Nếu không có, fetch category từ API
            try {
              const res = await fetch(`/api/category/${data.categoryId}`);
              const catData = await res.json();
              setCategory(catData);
            } catch {
              setCategory(null);
            }
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
    // Nếu là trang danh mục
    else if (location.pathname.startsWith('/category/') && (params.id || params.categorySlug)) {
      setLoading(true);
      const categoryParam = params.id || params.categorySlug;
      const isNumeric = /^\d+$/.test(categoryParam);
      
      if (isNumeric) {
        // Fetch by ID
        fetch(`/api/category/${categoryParam}`)
          .then(res => res.json())
          .then(data => {
            setCategory(data);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        // Fetch by slug
        fetch(`/api/category/slug/${categoryParam}`)
          .then(res => res.json())
          .then(data => {
            setCategory(data);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }
    }
  }, [location.pathname, params.id, params.categorySlug]);

  // Xây dựng breadcrumb items cho Ant Design
  const breadcrumbItems = [
    {
      title: (
        <Link to="/" className="text-gray-600 hover:text-green-600">
          <HomeOutlined /> Trang chủ
        </Link>
      ),
    }
  ];

  // Thêm breadcrumb cho các trang chính
  if (location.pathname === '/products') {
    const categoryParam = new URLSearchParams(location.search).get('category');
    if (categoryParam) {
      // Hiển thị breadcrumb với danh mục được lọc
      breadcrumbItems.push({
        title: (
          <Link to="/products" className="text-gray-600 hover:text-green-600">
            Tất cả sản phẩm
          </Link>
        ),
      });
      // Tìm category từ danh sách categories theo slug
      const foundCategory = categories.find(cat => cat.slug === categoryParam);
      const categoryName = foundCategory ? foundCategory.name : categoryParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      breadcrumbItems.push({
        title: <span className="text-gray-800 font-medium">{categoryName}</span>,
      });
    } else {
      breadcrumbItems.push({
        title: <span className="text-gray-800 font-medium">Tất cả sản phẩm</span>,
      });
    }
  } else if (location.pathname === '/about') {
    breadcrumbItems.push({
      title: <span className="text-gray-800 font-medium">Giới thiệu</span>,
    });
  } else if (location.pathname === '/contact') {
    breadcrumbItems.push({
      title: <span className="text-gray-800 font-medium">Liên hệ</span>,
    });
  } else if (location.pathname === '/promotion') {
    breadcrumbItems.push({
      title: <span className="text-gray-800 font-medium">Khuyến mãi</span>,
    });
  } else if (location.pathname === '/help') {
    breadcrumbItems.push({
      title: <span className="text-gray-800 font-medium">Hỗ trợ mua hàng</span>,
    });
  } else if (location.pathname === '/cart') {
    breadcrumbItems.push({
      title: <span className="text-gray-800 font-medium">Giỏ hàng</span>,
    });
  } else if (location.pathname === '/checkout') {
    breadcrumbItems.push({
      title: <span className="text-gray-800 font-medium">Thanh toán</span>,
    });
  }

  if (category) {
    const catName = category.Name || category.name;
    const catSlug = category.Slug || category.slug;
    const catId = category.Id || category.id;
    
    // Ưu tiên sử dụng slug, fallback về ID nếu không có slug
    const categoryLink = catSlug ? `/category/${catSlug}` : `/category/${catId}`;
    
    breadcrumbItems.push({
      title: location.pathname.startsWith('/category/') ? (
        <span className="text-gray-800 font-medium">{catName}</span>
      ) : (
        <Link to={categoryLink} className="text-gray-600 hover:text-green-600">
          {catName}
        </Link>
      ),
    });
  }

  if (product) {
    breadcrumbItems.push({
      title: <span className="text-gray-800 font-medium">{product.name}</span>,
    });
  }

  return (
    <div className="bg-white border-b border-gray-200 py-3 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
            <span className="text-gray-600 text-sm">Đang tải...</span>
          </div>
        ) : (
          <AntBreadcrumb
            separator=">"
            items={breadcrumbItems}
            className="text-sm"
          />
        )}
      </div>
    </div>
  );
}

export default Breadcrumb; 