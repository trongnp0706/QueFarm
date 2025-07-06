import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { Button, InputNumber, Divider } from 'antd';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

  if (loading) {
    return (
      <div className="text-center py-8 md:py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-2 text-gray-600">Đang tải sản phẩm...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8 md:py-12">
        <p className="text-red-600 mb-3">Lỗi: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Thử lại
        </button>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="text-center py-8 md:py-12">
        <p className="text-gray-600">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="flex flex-col lg:flex-row">
            {/* Product Image */}
            <div className="lg:w-1/2 p-4 md:p-6">
              <div className="relative">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-lg shadow-sm" 
                />
                <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-50">
                  <FaHeart className="text-gray-400 hover:text-red-500" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 p-4 md:p-6">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {Array(Math.round(product.rating)).fill(0).map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm md:text-base" />
                  ))}
                </div>
                <span className="text-sm md:text-base text-gray-600">({product.rating})</span>
              </div>

              <div className="mb-4">
                <p className="text-2xl md:text-3xl font-bold text-red-600">
                  {product.price.toLocaleString()} đ
                </p>
                <p className="text-sm text-gray-500">Giá đã bao gồm VAT</p>
              </div>

              <Divider />

              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Mô tả sản phẩm:</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <Divider />

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-800">Số lượng:</span>
                  <InputNumber
                    min={1}
                    max={99}
                    value={quantity}
                    onChange={setQuantity}
                    size="large"
                    className="w-20"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="primary"
                    size="large"
                    icon={<FaShoppingCart />}
                    className="bg-green-600 border-green-600 hover:bg-green-700 flex-1"
                  >
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    size="large"
                    className="border-green-600 text-green-600 hover:bg-green-50 flex-1"
                  >
                    Mua ngay
                  </Button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Tình trạng:</span>
                  <span className="text-green-600">Còn hàng</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Giao hàng:</span>
                  <span>Miễn phí cho đơn từ 500k</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Bảo hành:</span>
                  <span>Đổi trả trong 7 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 