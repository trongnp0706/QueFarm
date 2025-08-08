import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Alert, Empty, Typography, Tag, Rate, Button } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, AppstoreOutlined } from '@ant-design/icons';
import { getCategoryById, getCategoryBySlug } from '../services/categoryService';
import { getProductsByCategorySlug, generateImageUrl } from '../services/productService';
import ImageFallback from '../components/ImageFallback';

const { Title, Paragraph } = Typography;

function CategoryPage() {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Determine if the parameter is a numeric ID or a slug
  const isNumeric = /^\d+$/.test(categorySlug);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let categoryData;
        let productsData;
        
        if (isNumeric) {
          // Fetch by ID
          categoryData = await getCategoryById(categorySlug);
          // For ID-based requests, we need to fetch products differently
          const response = await fetch(`/api/product?categoryId=${categorySlug}`);
          if (!response.ok) throw new Error('Failed to fetch products');
          productsData = await response.json();
        } else {
          // Fetch by slug
          categoryData = await getCategoryBySlug(categorySlug);
          productsData = await getProductsByCategorySlug(categorySlug);
        }
        
        setCategory(categoryData);
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching category or products:', err);
        setError(err.response?.status === 404 ? 'Không tìm thấy danh mục' : 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchData();
    }
  }, [categorySlug, isNumeric]);

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
                <AppstoreOutlined className="mr-2" />{category.name || category.Name}
              </Title>
              {(category.description || category.Description) && (
                <Paragraph className="text-gray-600 text-lg mb-2">
                  {category.description || category.Description}
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
                      <ImageFallback
                        alt={product.name}
                        src={generateImageUrl(
                          product.imageUrl || 
                          (product.images && product.images.length > 0 
                            ? product.images[0].imageUrl 
                            : null)
                        )}
                        className="h-48 w-full object-cover rounded-t-lg"
                        fallbackSrc="/images/placeholder.svg"
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
                          <Rate disabled defaultValue={product.rating || 4} className="text-xs" />
                          <span className="text-xs text-gray-500">({product.rating || 4})</span>
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
