import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaStar, FaShoppingCart, FaHeart, FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa';
import { 
  Button, 
  InputNumber, 
  Divider, 
  Card, 
  Row, 
  Col, 
  Tag, 
  Space, 
  Spin, 
  Alert,
  Image,
  Rate,
  Descriptions,
  Badge
} from 'antd';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', { product, quantity });
  };

  const handleBuyNow = () => {
    // TODO: Implement buy now functionality
    console.log('Buying now:', { product, quantity });
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist functionality
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert
          message="Lỗi tải sản phẩm"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert
          message="Không tìm thấy sản phẩm"
          description="Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <Row gutter={[24, 24]}>
          {/* Product Images */}
          <Col xs={24} lg={12}>
            <Card className="shadow-sm">
              <div className="relative">
                <Image
                  src={product.imageUrl || (product.images && product.images.length > 0 ? product.images[0].imageUrl : '')}
                  alt={product.name}
                  className="w-full rounded-lg"
                  preview={{
                    mask: 'Xem ảnh',
                  }}
                  fallback="https://via.placeholder.com/400x400?text=No+Image"
                />
                <Button
                  type="text"
                  icon={isWishlisted ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                  className="absolute top-3 right-3 bg-white/80 hover:bg-white shadow-md"
                  onClick={toggleWishlist}
                />
              </div>
            </Card>
          </Col>

          {/* Product Information */}
          <Col xs={24} lg={12}>
            <Card className="shadow-sm h-fit">
              <div className="space-y-6">
                {/* Product Title */}
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-3">
                    <Rate 
                      disabled 
                      defaultValue={product.rating} 
                      className="text-sm"
                    />
                    <span className="text-sm text-gray-600">
                      ({product.rating} đánh giá)
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-red-600">
                      {product.price.toLocaleString()} đ
                    </span>
                    <Tag color="green" className="text-xs">
                      Đã bao gồm VAT
                    </Tag>
                  </div>
                </div>

                <Divider />

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Mô tả sản phẩm</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <Divider />

                {/* Quantity and Actions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-800 min-w-20">Số lượng:</span>
                    <InputNumber
                      min={1}
                      max={99}
                      value={quantity}
                      onChange={setQuantity}
                      size="large"
                      className="w-24"
                    />
                  </div>

                  <Space direction="vertical" className="w-full">
                    <Button
                      type="primary"
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      className="w-full bg-green-600 border-green-600 hover:bg-green-700 h-12"
                      onClick={handleAddToCart}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                    <Button
                      size="large"
                      className="w-full border-green-600 text-green-600 hover:bg-green-50 h-12"
                      onClick={handleBuyNow}
                    >
                      Mua ngay
                    </Button>
                  </Space>
                </div>

                <Divider />

                {/* Product Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaTruck className="text-green-600" />
                    <span className="text-sm text-gray-600">
                      Miễn phí giao hàng cho đơn từ 500k
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaShieldAlt className="text-green-600" />
                    <span className="text-sm text-gray-600">
                      Bảo hành chính hãng
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaUndo className="text-green-600" />
                    <span className="text-sm text-gray-600">
                      Đổi trả trong 7 ngày
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Product Details */}
        <Row gutter={[24, 24]} className="mt-8">
          <Col xs={24}>
            <Card title="Thông tin chi tiết" className="shadow-sm">
              <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
                <Descriptions.Item label="Tình trạng">
                  <Badge status="success" text="Còn hàng" />
                </Descriptions.Item>
                <Descriptions.Item label="Danh mục">
                  {product.Category?.Name || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Mã sản phẩm">
                  {product.id}
                </Descriptions.Item>
                <Descriptions.Item label="Đánh giá">
                  <Rate disabled defaultValue={product.rating} />
                </Descriptions.Item>
                <Descriptions.Item label="Giá">
                  {product.price.toLocaleString()} đ
                </Descriptions.Item>
                <Descriptions.Item label="Bảo hành">
                  12 tháng
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ProductDetail; 