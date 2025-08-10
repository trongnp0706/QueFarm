import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the selected key based on current path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/admin') return '1';
    if (path.startsWith('/admin/products')) return '2';
    if (path.startsWith('/admin/categories')) return '3';
    if (path.startsWith('/admin/orders')) return '4';
    if (path.startsWith('/admin/settings')) return '6';
    return '1';
  };
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="admin-header flex items-center justify-between px-6">
        <div className="logo flex items-center">
          <Link to="/">
            <img src="/logo.png" alt="QueFarm" className="admin-logo" />
          </Link>
          <span className="admin-title">Quản trị QueFarm</span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="bg-white">
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            style={{ height: '100%', borderRight: 0 }}
            items={[
              {
                key: '1',
                icon: <DashboardOutlined />,
                label: 'Tổng quan',
                onClick: () => navigate('/admin')
              },
              {
                key: '2',
                icon: <ShoppingOutlined />,
                label: 'Sản phẩm',
                onClick: () => navigate('/admin/products')
              },
              {
                key: '3',
                icon: <AppstoreOutlined />,
                label: 'Danh mục',
                onClick: () => navigate('/admin/categories')
              },
              {
                key: '4',
                icon: <ShoppingCartOutlined />,
                label: 'Đơn hàng',
                onClick: () => navigate('/admin/orders')
              },
              {
                key: '6',
                icon: <SettingOutlined />,
                label: 'Cài đặt',
                onClick: () => navigate('/admin/settings')
              },
              {
                key: '7',
                icon: <LogoutOutlined />,
                label: 'Đăng xuất',
                onClick: () => {
                  localStorage.removeItem('adminToken');
                  navigate('/');
                }
              }
            ]}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280,
              borderRadius: 4,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 