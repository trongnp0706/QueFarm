import Banner from '../components/Banner';
import Breadcrumb from '../components/Breadcrumb';
import ProductGrid from '../features/product/ProductGrid';
import { Card, Typography, Spin, Alert, Button } from 'antd';
import { useState, useEffect } from 'react';

const { Title, Text } = Typography;

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/product')
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
  }, []);

  return (
    <>
      <Banner />
      <Breadcrumb />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center min-h-96">
              <div className="text-center">
                <Spin size="large" />
                <div className="mt-4 text-gray-600">Đang tải sản phẩm...</div>
              </div>
            </div>
          )}
          {/* Error state */}
          {error && (
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
              className="mb-6"
            />
          )}
          {/* Products grid */}
          {!loading && !error && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <Title level={3} className="text-gray-800 mb-0">
                  Sản phẩm nổi bật
                </Title>
                <Text className="text-gray-600">
                  {products.length} sản phẩm
                </Text>
              </div>
              {products.length > 0 ? (
                <ProductGrid products={products} />
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <Title level={4} className="text-gray-600">
                    Không tìm thấy sản phẩm
                  </Title>
                  <Text className="text-gray-500">
                    Hãy thử lại sau hoặc liên hệ quản trị viên.
                  </Text>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage; 