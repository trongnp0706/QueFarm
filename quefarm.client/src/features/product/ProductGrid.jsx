import { Link } from 'react-router-dom';
import { Card, Row, Col, Button, Rate, Tag } from 'antd';
import { ShoppingCartOutlined, EyeOutlined, HeartOutlined } from '@ant-design/icons';
import { generateImageUrl } from '../../services/productService';

// Helper function to get image URL with fallbacks
const getImageUrl = (product) => {
  // Try different possible image URL properties from API
  let imageUrl = null;
  
  // Direct image URL properties
  if (product.imageUrl && product.imageUrl.trim()) {
    imageUrl = product.imageUrl;
  } else if (product.ImageUrl && product.ImageUrl.trim()) {
    imageUrl = product.ImageUrl;
  }
  // Images arrays
  else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const firstImage = product.images[0];
    imageUrl = firstImage.imageUrl || firstImage.ImageUrl || firstImage.url || firstImage.Url;
  } else if (product.Images && Array.isArray(product.Images) && product.Images.length > 0) {
    const firstImage = product.Images[0];
    imageUrl = firstImage.imageUrl || firstImage.ImageUrl || firstImage.url || firstImage.Url;
  }
  // ProductImages arrays
  else if (product.productImages && Array.isArray(product.productImages) && product.productImages.length > 0) {
    const firstImage = product.productImages[0];
    imageUrl = firstImage.imageUrl || firstImage.ImageUrl;
  } else if (product.ProductImages && Array.isArray(product.ProductImages) && product.ProductImages.length > 0) {
    const firstImage = product.ProductImages[0];
    imageUrl = firstImage.imageUrl || firstImage.ImageUrl;
  }
  
  // Use the new generateImageUrl function
  return generateImageUrl(imageUrl);
};

// Helper function to handle image load errors
const handleImageError = (e) => {
  if (e.target.src !== '/images/placeholder.svg') {
    e.target.src = '/images/placeholder.svg';
  }
};

function ProductGrid({ products }) {
  return (
    <Row gutter={[20, 24]}>
      {products.map(product => (
        <Col xs={24} sm={12} lg={8} xl={6} key={product.id}>
          <Card
            hoverable
            className="h-full bg-white rounded-xl shadow-sm hover:shadow-lg border-0 group transition-all duration-300 overflow-hidden"
            bodyStyle={{ padding: 0 }}
            cover={
              <div className="relative overflow-hidden">
                <img
                  alt={product.name}
                  src={getImageUrl(product)}
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={handleImageError}
                />
                
                {/* Overlay with hover effects */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.discount && (
                    <Tag color="red" className="text-xs font-bold px-2 py-1 rounded-full border-0">
                      -{product.discount}%
                    </Tag>
                  )}
                  {product.hot && (
                    <Tag color="orange" className="text-xs font-bold px-2 py-1 rounded-full border-0">
                      HOT
                    </Tag>
                  )}
                </div>
                
                {/* Heart button */}
                <Button
                  type="text"
                  icon={<HeartOutlined />}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full shadow-md w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-red-500"
                />
                
                {/* Quick view overlay */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Link to={`/product/${product.id}`}>
                    <Button
                      type="primary"
                      className="w-full bg-green-600 border-green-600 hover:bg-green-700 rounded-lg font-medium"
                      icon={<EyeOutlined />}
                    >
                      Xem nhanh
                    </Button>
                  </Link>
                </div>
              </div>
            }
          >
            <div className="p-4">
              <div className="mb-3">
                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2 text-base leading-5 mb-2">
                    {product.name}
                  </h3>
                </Link>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Rate disabled allowHalf defaultValue={product.rating || 0} className="text-xs" />
                  <span className="text-xs text-gray-500">({product.rating || 0})</span>
                </div>
                
                {/* Region */}
                {product.region && (
                  <div className="flex items-center mb-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    <span className="text-xs text-gray-500">{product.region}</span>
                  </div>
                )}
              </div>
              
              {/* Price section */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {product.originalPrice.toLocaleString()}₫
                    </span>
                  )}
                </div>
                <div className="text-lg font-bold text-red-600">
                  {product.price.toLocaleString()}₫
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2">
                <Link to={`/product/${product.id}`} className="flex-1">
                  <Button
                    type="primary"
                    className="w-full bg-green-600 border-green-600 hover:bg-green-700 rounded-lg font-medium"
                  >
                    Chi tiết
                  </Button>
                </Link>
                <Button
                  icon={<ShoppingCartOutlined />}
                  className="border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700 rounded-lg"
                  title="Thêm vào giỏ hàng"
                />
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default ProductGrid; 