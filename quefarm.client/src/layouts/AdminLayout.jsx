import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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
  
  // Menu items
  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
      onClick: () => {
        navigate('/admin');
        if (isMobile) setMobileMenuVisible(false);
      }
    },
    {
      key: '2',
      icon: <ShoppingOutlined />,
      label: 'Sản phẩm',
      onClick: () => {
        navigate('/admin/products');
        if (isMobile) setMobileMenuVisible(false);
      }
    },
    {
      key: '3',
      icon: <AppstoreOutlined />,
      label: 'Danh mục',
      onClick: () => {
        navigate('/admin/categories');
        if (isMobile) setMobileMenuVisible(false);
      }
    },
    {
      key: '4',
      icon: <ShoppingCartOutlined />,
      label: 'Đơn hàng',
      onClick: () => {
        navigate('/admin/orders');
        if (isMobile) setMobileMenuVisible(false);
      }
    },
    {
      key: '6',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      onClick: () => {
        navigate('/admin/settings');
        if (isMobile) setMobileMenuVisible(false);
      }
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
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header style={{ 
        background: '#fff', 
        padding: '0 16px', 
        borderBottom: '1px solid #e8e8e8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Mobile menu button */}
          {isMobile ? (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuVisible(true)}
              style={{ fontSize: '18px' }}
            />
          ) : (
            /* Desktop collapse button */
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '18px' }}
            />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/">
              <img 
                src="/logo.png" 
                alt="QueFarm" 
                style={{ 
                  height: '32px', 
                  width: '32px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '2px solid #f0f0f0',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              />
            </Link>
            {!isMobile && (
              <span style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                color: '#262626' 
              }}>
                Quản trị QueFarm
              </span>
            )}
          </div>
        </div>

        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: '#f6ffed',
            padding: '4px 8px',
            borderRadius: '12px',
            border: '1px solid #b7eb8f'
          }}>
            <span style={{ fontSize: '12px', color: '#52c41a', fontWeight: 'bold' }}>
              Admin
            </span>
          </div>
        </div>
      </Header>

      <Layout style={{ marginTop: '64px' }}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sider 
            width={220} 
            collapsed={collapsed}
            collapsedWidth={60}
            style={{ 
              background: '#fff',
              borderRight: '1px solid #e8e8e8',
              position: 'fixed',
              left: 0,
              top: '64px',
              bottom: 0,
              zIndex: 999,
              height: 'calc(100vh - 64px)',
              overflow: 'auto'
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[getSelectedKey()]}
              style={{ 
                height: '100%', 
                borderRight: 0,
                paddingTop: '8px'
              }}
              items={menuItems}
            />
          </Sider>
        )}

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            title="Menu Admin"
            placement="left"
            closable={true}
            onClose={() => setMobileMenuVisible(false)}
            open={mobileMenuVisible}
            width={280}
            bodyStyle={{ padding: 0 }}
          >
            <Menu
              mode="inline"
              selectedKeys={[getSelectedKey()]}
              style={{ height: '100%', borderRight: 0 }}
              items={menuItems}
            />
          </Drawer>
        )}

        {/* Content */}
        <Layout 
          className="admin-content-area"
          style={{ 
            background: '#f5f5f5',
            marginLeft: isMobile ? 0 : (collapsed ? '60px' : '220px')
          }}
        >
          <Content
            style={{
              margin: isMobile ? '8px' : '16px',
              padding: 0,
              minHeight: 'calc(100vh - 64px - 32px)',
              overflow: 'auto'
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