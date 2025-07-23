import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Typography, Alert } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAllCategories, deleteCategory } from '../../../services/categoryService';

const { Title } = Typography;

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCategories();
      console.log("Categories fetched:", data);
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Không thể tải danh sách danh mục. Vui lòng thử lại sau.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      console.log(`Deleting category with ID: ${id}`);
      await deleteCategory(id);
      message.success('Xóa danh mục thành công');
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      
      if (error.status) {
        if (error.status === 401) {
          message.error('Không có quyền xóa danh mục. Vui lòng liên hệ quản trị viên.');
        } else if (error.status === 400) {
          message.error('Không thể xóa danh mục có sản phẩm liên kết.');
        } else {
          message.error(`Lỗi: ${error.status} - ${error.statusText || error.message}`);
        }
      } else {
        message.error('Không thể xóa danh mục. Vui lòng thử lại sau.');
      }
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
      ellipsis: true,
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
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchCategories}
            loading={loading}
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/categories/add')}
          >
            Thêm danh mục
          </Button>
        </Space>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          className="mb-4"
          action={
            <Button size="small" onClick={fetchCategories}>
              Thử lại
            </Button>
          }
        />
      )}

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        locale={{
          emptyText: 'Không có danh mục nào'
        }}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `Tổng số: ${total} danh mục`,
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50']
        }}
      />
    </div>
  );
};

export default CategoryList;
