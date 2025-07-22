import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import categoryService from '../../../services/categoryService';

const { Title } = Typography;

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error('Không thể tải danh sách danh mục');
      setCategories([]);
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      message.success('Xóa danh mục thành công');
      fetchCategories();
    } catch (error) {
      message.error('Không thể xóa danh mục');
      console.error('Failed to delete category:', error);
    }
  };

  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/categories/edit/${record.id}`)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Quản lý danh mục</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/categories/add')}
        >
          Thêm danh mục
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default CategoryList;
