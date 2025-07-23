import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Space, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategoryById, updateCategory } from '../../../services/categoryService';

const { Title } = Typography;
const { TextArea } = Input;

const EditCategory = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      setInitialLoading(true);
      try {
        const categoryData = await getCategoryById(id);
        console.log("Category data fetched:", categoryData);
        form.setFieldsValue({
          name: categoryData.name,
          description: categoryData.description,
        });
      } catch (error) {
        console.error('Error fetching category:', error);
        message.error('Không thể tải thông tin danh mục');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const categoryData = {
        id: parseInt(id),
        name: values.name,
        description: values.description || '',
        isActive: true
      };
      
      console.log("Updating category with data:", categoryData);
      await updateCategory(id, categoryData);
      message.success('Cập nhật danh mục thành công');
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      
      if (error.status) {
        if (error.status === 401) {
          message.error('Không có quyền cập nhật danh mục. Vui lòng liên hệ quản trị viên.');
        } else {
          message.error(`Lỗi: ${error.status} - ${error.statusText || error.message}`);
        }
      } else {
        message.error('Không thể cập nhật danh mục. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/admin/categories')}
          >
            Quay lại
          </Button>
          <Title level={2}>Chỉnh sửa danh mục</Title>
        </Space>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[
              { required: true, message: 'Vui lòng nhập tên danh mục' },
              { max: 100, message: 'Tên danh mục không được quá 100 ký tự' }
            ]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { max: 500, message: 'Mô tả không được quá 500 ký tự' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập mô tả chi tiết về danh mục"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space>
              <Button onClick={() => navigate('/admin/categories')}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditCategory;
