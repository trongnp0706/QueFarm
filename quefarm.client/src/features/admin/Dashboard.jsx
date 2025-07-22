import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Table } from 'antd';
import { ShoppingCartOutlined, ShoppingOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import { getAllProducts } from '../../services/productService';

const { Title } = Typography;

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock statistics
  const statistics = {
    totalOrders: 158,
    totalRevenue: 12450000,
    totalProducts: products.length,
    newUsers: 24,
  };

  // Most popular products (based on rating)
  const popularProducts = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${new Intl.NumberFormat('vi-VN').format(price)} VNĐ`,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => `${rating}/5`,
    },
  ];

  return (
    <div>
      <Title level={2} className="mb-6">Tổng quan</Title>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={statistics.totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={statistics.totalRevenue}
              precision={0}
              formatter={value => `${new Intl.NumberFormat('vi-VN').format(value)} VNĐ`}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sản phẩm"
              value={statistics.totalProducts}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng mới"
              value={statistics.newUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Sản phẩm nổi bật" className="mb-6">
        <Table 
          dataSource={popularProducts} 
          columns={columns} 
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Dashboard; 