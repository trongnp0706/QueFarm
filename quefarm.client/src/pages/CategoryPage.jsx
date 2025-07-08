import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Alert, Empty, Typography, Tag, Rate, Button } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, AppstoreOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/category/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setCategory(data);
        return fetch(`/api/product?categoryId=${id}`);
      })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

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
          message="Lỗi tải danh mục"
          description={error}
          type="error"
          showIcon
          action={
            <Button onClick={() => window.location.reload()} type="primary">Thử lại</Button>
          }
        />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert
          message="Không tìm thấy danh mục"
          description="Danh mục bạn đang tìm kiếm không tồn tại."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Category Header */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Title level={2} className="text-green-700 mb-2">
                <AppstoreOutlined className="mr-2" />{category.Name}
              </Title>
              {category.Description && (
                <Paragraph className="text-gray-600 text-lg mb-2">
                  {category.Description}
                </Paragraph>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Tag color="green" className="text-base px-4 py-1">
                {products.length} sản phẩm
              </Tag>
            </div>
          </div>
        </Card>

        {/* Products Grid */}
        {products.length > 0 ? (
          <Row gutter={[24, 24]}>
            {products.map(product => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  className="h-full transition-all duration-300"
                  cover={
                    <div className="relative">
                      <img
                        alt={product.name}
                        src={product.imageUrl || (product.images && product.images.length > 0 ? product.images[0].imageUrl : '')}
                        className="h-48 w-full object-cover rounded-t-lg"
                        onError={e => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                      />
                      <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md">
                        <HeartOutlined className="text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  }
                  actions={[
                    <Link to={`/product/${product.id}`} key="view">
                      <Button type="link" className="text-green-600 hover:text-green-700 p-0">Xem chi tiết</Button>
                    </Link>,
                    <Button key="cart" icon={<ShoppingCartOutlined />} className="text-green-600 hover:text-green-700" type="text">
                      Thêm vào giỏ
                    </Button>
                  ]}
                >
                  <Card.Meta
                    title={
                      <Link to={`/product/${product.id}`} className="text-gray-800 hover:text-green-600">
                        <span className="font-semibold text-base line-clamp-2">{product.name}</span>
                      </Link>
                    }
                    description={
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Rate disabled defaultValue={product.rating} className="text-xs" />
                          <span className="text-xs text-gray-500">({product.rating})</span>
                        </div>
                        <span className="text-lg font-bold text-red-600 block mb-1">
                          {product.price.toLocaleString()} đ
                        </span>
                        <span className="text-xs text-gray-500 line-clamp-2">
                          {product.description}
                        </span>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            description="Chưa có sản phẩm nào trong danh mục này"
            className="py-12"
          />
        )}
      </div>
    </div>
  );
}

export default CategoryPage; 