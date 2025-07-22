import { useParams } from 'react-router-dom';
<<<<<<< HEAD
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
=======
import { useEffect, useState, useContext } from 'react';
import { FaStar, FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext';
import { getProductById } from '../../services/productService';
>>>>>>> dev-base

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
=======
  const [error] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
>>>>>>> dev-base

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        
        // Fallback to mock data
        const mockProduct = {
          id: parseInt(id),
          name: "Lạp xưởng tươi bò _ Gói 500gr",
          price: 124500,
          originalPrice: 149400,
          discount: 17,
          imageUrl: "https://via.placeholder.com/500x500?text=Product",
          rating: 4.7,
          description: "Lạp xưởng tươi bò được chế biến từ thịt bò tươi ngon, đảm bảo vệ sinh an toàn thực phẩm. Sản phẩm có hương vị đậm đà, thơm ngon đặc trưng của lạp xưởng truyền thống.",
          features: [
            "Thịt bò tươi ngon, được tuyển chọn kỹ lưỡng",
            "Chế biến theo quy trình hiện đại, đảm bảo vệ sinh",
            "Hương vị đậm đà, thơm ngon", 
            "Bảo quản trong ngăn mát tủ lạnh",
            "Hạn sử dụng: 30 ngày kể từ ngày sản xuất"
          ],
          relatedProducts: [
            { id: 101, name: "Lạp xưởng tươi bò _ Gói 250gr", price: 62200, imageUrl: "https://via.placeholder.com/200x200?text=Product" },
            { id: 102, name: "Lạp xưởng tươi tôm_ Gói 500gr", price: 138500, imageUrl: "https://via.placeholder.com/200x200?text=Product" }
          ]
        };
        setProduct(mockProduct);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
<<<<<<< HEAD
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
=======
    addToCart({ ...product, quantity });
    // Show confirmation message
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleQuantityChange = (val) => {
    const newQty = quantity + val;
    if (newQty > 0) {
      setQuantity(newQty);
    }
  };

  if (loading) return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      <p className="mt-2 text-gray-600">Đang tải sản phẩm...</p>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-12 px-4">
      <p className="text-red-600 font-bold text-lg">Lỗi khi tải sản phẩm</p>
      <p className="text-gray-600 mt-2">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Tải lại trang
      </button>
    </div>
  );
  
  if (!product) return (
    <div className="text-center py-12">
      <p className="text-gray-600">Không tìm thấy sản phẩm</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-2/5 relative">
            {product.discount && (
              <div className="absolute top-4 left-4 bg-green-600 text-white text-sm font-bold rounded-full h-12 w-12 flex items-center justify-center z-10">
                -{product.discount}%
              </div>
            )}
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full rounded-lg shadow-md object-cover" 
            />
          </div>
          
          {/* Product Info */}
          <div className="md:w-3/5">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">{product.rating}/5</span>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-2">
                {product.originalPrice && (
                  <span className="text-gray-500 text-lg line-through">{product.originalPrice.toLocaleString()}₫</span>
                )}
                <span className="text-red-600 text-3xl font-bold">{product.price.toLocaleString()}₫</span>
              </div>
              <p className="text-sm text-green-600 mt-1">Còn hàng</p>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-4">
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="flex flex-col space-y-2 mb-4">
              <div className="flex">
                <span className="font-medium w-24">Xuất xứ:</span>
                <span>{product.origin}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">Khối lượng:</span>
                <span>{product.weight}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">Vùng miền:</span>
                <span>{product.region}</span>
              </div>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="border border-gray-300 rounded flex items-center mr-4">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  <FaMinus />
                </button>
                <span className="px-4 py-1 border-l border-r border-gray-300">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  <FaPlus />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded flex items-center gap-2"
              >
                <FaShoppingCart /> Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
        
        {/* Product Features */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold mb-4">Đặc điểm sản phẩm</h2>
          <ul className="list-disc pl-5 space-y-2">
            {product.features.map((feature, index) => (
              <li key={index} className="text-gray-700">{feature}</li>
            ))}
          </ul>
        </div>
        
        {/* Related Products */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.relatedProducts.map((item) => (
              <div key={item.id} className="border rounded-lg p-3 hover:border-green-500 transition">
                <img 
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
                <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.name}</h3>
                <p className="text-green-800 font-bold">{item.price.toLocaleString()}₫</p>
              </div>
            ))}
          </div>
        </div>
>>>>>>> dev-base
      </div>
    </div>
  );
}

export default ProductDetail; 