import React, { useState, useEffect, useCallback } from 'react';
import { Table, Space, Button, Input, Popconfirm, message, Select, Card, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import ImageFallback from '../../../components/ImageFallback';
import { getAllProducts, deleteProduct } from '../../../services/productService';

const { Option } = Select;

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'created',
    sortDescending: true,
  });
  
  const navigate = useNavigate();

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      
      const response = await getAllProducts(
        searchParams.pageNumber || 1,
        searchParams.pageSize || 10,
        searchParams.searchTerm || ''
      );
      
      
      // getAllProducts already handles the API format
      setProducts(response.items || []);
      setPagination({
        current: response.pageNumber || 1,
        pageSize: response.pageSize || 10,
        total: response.totalCount || 0,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Không thể tải danh sách sản phẩm: ' + (error.message || ''));
      setProducts([]);
      setPagination({
        current: 1,
        pageSize: 10,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Load products when component mounts or when search parameters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle table pagination, sorting, and filtering
  const handleTableChange = (pagination, filters, sorter) => {
    const sortMapping = {
      name: 'name',
      price: 'price',
      stockQuantity: 'stock',
      createdAt: 'created',
    };

    setSearchParams(prev => ({
      ...prev,
      pageNumber: pagination.current,
      pageSize: pagination.pageSize,
      sortBy: sorter.field && sortMapping[sorter.field] ? sortMapping[sorter.field] : 'created',
      sortDescending: sorter.order ? sorter.order === 'descend' : true,
    }));
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchParams(prev => ({
      ...prev,
      searchTerm: value,
      pageNumber: 1, // Reset to first page when searching
    }));
  };

  // Handle delete product
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      message.success('Xóa sản phẩm thành công');
      fetchProducts(); // Refresh list after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Không thể xóa sản phẩm: ' + (error.message || ''));
    }
  };

  // Add new product
  const handleAddProduct = () => {
    navigate('/admin/products/add');
  };

  // Define table columns
  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (imageUrl) => (
        <ImageFallback 
          src={imageUrl || '/logo.png'} 
          alt="Sản phẩm" 
          width={60}
          height={60}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text, record) => <Link to={`/admin/products/edit/${record.id}`}>{text}</Link>,
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      render: (price) => (price && typeof price === 'number') ? price.toLocaleString('vi-VN') : '0',
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      filters: products && Array.isArray(products) ? [...new Set(products.map(p => p.categoryName))].map(name => ({
        text: name,
        value: name,
      })) : [],
      onFilter: (value, record) => record.categoryName === value,
    },
    {
      title: 'Số lượng trong kho',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      sorter: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
      filters: [
        { text: 'Hoạt động', value: true },
        { text: 'Không hoạt động', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/products/edit/${record.id}`)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
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
    <Card title="Quản lý sản phẩm">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm..."
          allowClear
          onSearch={handleSearch}
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
          Thêm sản phẩm
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} sản phẩm`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
      />
    </Card>
  );
};

export default AdminProductList;
