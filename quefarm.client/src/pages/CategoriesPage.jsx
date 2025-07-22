import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons';
import CategoryManagement from '../features/admin/category/CategoryManagement';

const CategoriesPage = () => {
  return (
    <div>
      <Breadcrumb
        style={{ marginBottom: '24px' }}
        items={[
          {
            href: '/',
            title: <HomeOutlined />,
          },
          {
            href: '/admin',
            title: (
              <>
                <span>Quản trị</span>
              </>
            ),
          },
          {
            title: (
              <>
                <AppstoreOutlined />
                <span>Danh mục</span>
              </>
            ),
          },
        ]}
      />
      
      <CategoryManagement />
    </div>
  );
};

export default CategoriesPage;
