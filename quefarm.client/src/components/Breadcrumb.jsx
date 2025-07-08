import { Link, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

function Breadcrumb() {
  const location = useLocation();
  const params = useParams();
  const [category, setCategory] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

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
    else if (location.pathname.startsWith('/category/') && params.id) {
      setLoading(true);
      fetch(`/api/category/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setCategory(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [location.pathname, params.id]);

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

  if (category) {
    const catName = category.Name || category.name;
    const catId = category.Id || category.id;
    breadcrumbItems.push({
      title: location.pathname.startsWith('/category/') ? (
        <span className="text-gray-800 font-medium">{catName}</span>
      ) : (
        <Link to={`/category/${catId}`} className="text-gray-600 hover:text-green-600">
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