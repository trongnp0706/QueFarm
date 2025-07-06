import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/product/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-8">Đang tải...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Lỗi: {error}</div>;
  if (!product) return <div className="text-center py-8">Không tìm thấy sản phẩm</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <img src={product.imageUrl} alt={product.name} className="w-64 h-64 object-cover rounded-xl shadow" />
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-red-600 text-xl font-semibold mb-2">{product.price.toLocaleString()} đ</p>
          <p className="mb-4">{product.description}</p>
          <div className="flex gap-2 items-center mb-4">
            <span className="font-semibold">Đánh giá:</span>
            <span className="text-yellow-400">{product.rating} ★</span>
          </div>
          {/* Thêm nút mua hàng hoặc thêm vào giỏ tại đây nếu muốn */}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 