import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Table } from 'antd';
import { ShoppingCartOutlined, ShoppingOutlined, DollarOutlined } from '@ant-design/icons';
import { getAllProducts } from '../../services/productService';

const { Title } = Typography;

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProducts: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Products
        const data = await getAllProducts();
        const list = data.items || data.products || [];
        setProducts(list);

        // Orders & Revenue
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`/api/order?pageNumber=1&pageSize=1`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (res.ok) {
          const json = await res.json();
          const totalOrders = json.totalItems || 0;

          // Lấy vài đơn mới để tính revenue (hoặc có thể tạo endpoint riêng nếu cần)
          const res2 = await fetch(`/api/order?pageNumber=1&pageSize=50`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          });
          let revenue = 0;
          if (res2.ok) {
            const json2 = await res2.json();
            revenue = (json2.orders || []).reduce((s, o) => s + Number(o.totalAmount || 0), 0);
          }

          setStats({ totalOrders, totalRevenue: revenue, totalProducts: list.length });
        } else {
          setStats({ totalOrders: 0, totalRevenue: 0, totalProducts: list.length });
        }
      } catch (error) {
        setStats({ totalOrders: 0, totalRevenue: 0, totalProducts: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statistics = stats;

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