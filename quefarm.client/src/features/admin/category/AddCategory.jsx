import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createCategory } from '../../../services/categoryService';

const { Title } = Typography;
const { TextArea } = Input;

const AddCategory = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Prepare the data object with only the necessary fields
      const categoryData = {
        name: values.name,
        description: values.description || '',
        isActive: true
      };
      
      await createCategory(categoryData);
      message.success('Thêm danh mục thành công');
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      
      if (error.status) {
        if (error.status === 401) {
          message.error('Không có quyền tạo danh mục. Vui lòng liên hệ quản trị viên.');
        } else {
          message.error(`Lỗi: ${error.status} - ${error.statusText || error.message}`);
        }
      } else {
        message.error('Không thể thêm danh mục. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

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
          <Title level={2}>Thêm danh mục mới</Title>
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
                Thêm danh mục
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddCategory;
