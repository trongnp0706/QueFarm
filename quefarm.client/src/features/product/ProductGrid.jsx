import { Link } from 'react-router-dom';
import { Card, Row, Col, Button, Rate, Tag } from 'antd';
import { ShoppingCartOutlined, EyeOutlined, HeartOutlined } from '@ant-design/icons';

function ProductGrid({ products }) {
  return (
    <Row gutter={[24, 32]}>
      {products.map(product => (
        <Col xs={24} sm={12} md={8} lg={6} xl={4} key={product.id}>
          <Card
            hoverable
            className="h-full flex flex-col justify-between border border-gray-100 rounded-2xl shadow-sm group transition-all duration-300"
            bodyStyle={{ padding: 16, display: 'flex', flexDirection: 'column', height: '100%' }}
            cover={
              <div className="relative overflow-hidden rounded-t-2xl">
                <img
                  alt={product.name}
                  src={product.imageUrl || (product.images && product.images.length > 0 ? product.images[0].imageUrl : 'https://via.placeholder.com/300x200?text=No+Image')}
                  className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={e => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                />
                <Button
                  type="text"
                  icon={<HeartOutlined />}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full shadow-md"
                />
                <Tag color="red" className="absolute top-2 left-2 text-xs font-semibold">Hot</Tag>
              </div>
            }
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <Link to={`/product/${product.id}`} className="block mb-1">
                  <span className="font-semibold text-base text-gray-800 group-hover:text-green-700 transition-colors line-clamp-2">
                    {product.name}
                  </span>
                </Link>
                <div className="flex items-center gap-1 mb-2">
                  <Rate disabled allowHalf defaultValue={product.rating} className="text-xs" />
                  <span className="text-xs text-gray-500">({product.rating})</span>
                </div>
                <div className="mb-2">
                  <span className="text-lg font-bold text-red-600">
                    {product.price.toLocaleString()} đ
                  </span>
                </div>
                <Tag color="green" className="text-xs">
                  {product.Category?.Name || product.Category?.name || 'N/A'}
                </Tag>
              </div>
              <div className="flex gap-2 mt-4">
                <Link to={`/product/${product.id}`} className="flex-1">
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    className="w-full bg-green-600 border-green-600 hover:bg-green-700"
                  >
                    Chi tiết
                  </Button>
                </Link>
                <Button
                  icon={<ShoppingCartOutlined />}
                  className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
                >
                  Mua
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default ProductGrid; 