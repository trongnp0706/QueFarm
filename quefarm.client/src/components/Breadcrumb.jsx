import { Link, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
        .then(data => {
          setProduct(data);
          // Lấy category
          if (data && data.categoryId) {
            fetch(`/api/category`)
              .then(res => res.json())
              .then(cats => {
                const cat = cats.find(c => c.id === data.categoryId);
                setCategory(cat);
                setLoading(false);
              });
          } else {
            setLoading(false);
          }
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
        });
    }
  }, [location.pathname, params.id]);

  // Xây dựng breadcrumb
  const crumbs = [
    { name: 'Trang chủ', to: '/' }
  ];
  if (category) {
    crumbs.push({ name: category.name, to: `/category/${category.id}` });
  }
  if (product) {
    crumbs.push({ name: product.name });
  }

  return (
    <div className="bg-gray-800 text-white py-2 px-4 text-center text-base font-medium">
      {loading ? (
        <span>Đang tải...</span>
      ) : (
        crumbs.map((c, i) => (
          <span key={i}>
            {c.to ? <Link to={c.to} className="hover:underline text-white/90">{c.name}</Link> : <span>{c.name}</span>}
            {i < crumbs.length - 1 && ' » '}
          </span>
        ))
      )}
    </div>
  );
}

export default Breadcrumb; 