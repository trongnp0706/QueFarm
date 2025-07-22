import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Button, Upload, InputNumber, 
  Select, Switch, message, Card, Typography, Space 
} from 'antd';
import { InboxOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import categoryService from '../../../services/categoryService';
import ImageFallback from '../../../components/ImageFallback';

const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;
const { Option } = Select;

const AddProduct = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        message.error('Không thể tải danh mục sản phẩm');
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleMainImageChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    
    if (info.file.status === 'done' || info.file.status === 'error') {
      // Get file object
      const file = info.file.originFileObj;
      setMainImageFile(file);
      
      // Generate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setMainImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (info) => {
    const fileList = info.fileList;
    
    // Get file objects
    const files = fileList.map(file => file.originFileObj);
    setAdditionalImageFiles(files);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields, including required ones
      formDataToSend.append('name', values.name);
      formDataToSend.append('price', values.price);
      formDataToSend.append('categoryId', values.categoryId);
      formDataToSend.append('stockQuantity', values.stockQuantity);
      formDataToSend.append('isActive', values.isActive !== undefined ? values.isActive : true);
      
      // Add optional fields only if they have values
      if (values.originalPrice) formDataToSend.append('originalPrice', values.originalPrice);
      if (values.description) formDataToSend.append('description', values.description);
      if (values.origin) formDataToSend.append('origin', values.origin);
      if (values.weight) formDataToSend.append('weight', values.weight);
      if (values.region) formDataToSend.append('region', values.region);
      
      // Append main image if it exists
      if (mainImageFile) {
        formDataToSend.append('mainImage', mainImageFile);
      }
      
      // Append additional images if they exist
      if (additionalImageFiles && additionalImageFiles.length > 0) {
        additionalImageFiles.forEach(image => {
          formDataToSend.append('additionalImages', image);
        });
      }

      console.log('Sending FormData:', Object.fromEntries(formDataToSend.entries()));

      const response = await fetch('https://localhost:7013/api/product', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        message.success('Thêm sản phẩm thành công');
        navigate('/admin/products');
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      message.error('Không thể thêm sản phẩm: ' + error.message);
      console.error('Failed to create product:', error);
    } finally {
      setLoading(false);
    }
  };

  const mainImageUploadProps = {
    name: 'mainImage',
    multiple: false,
    maxCount: 1,
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Bạn chỉ có thể tải lên tệp hình ảnh!');
    }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Hình ảnh phải nhỏ hơn 2MB!');
      }
      return isImage && isLt2M;
    },
    customRequest: ({ onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok", null);
      }, 0);
    },
    onChange: handleMainImageChange,
  };

  const additionalImagesUploadProps = {
    name: 'additionalImages',
    multiple: true,
    maxCount: 5,
    fileList: additionalImageFiles.map((file, index) => ({
      uid: index,
      name: file.name,
      status: 'done',
      url: URL.createObjectURL(file),
      originFileObj: file,
    })),
    beforeUpload: (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
        message.error('Bạn chỉ có thể tải lên tệp hình ảnh!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Hình ảnh phải nhỏ hơn 2MB!');
    }
      return isImage && isLt2M;
    },
    customRequest: ({ onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok", null);
      }, 0);
    },
    onChange: handleAdditionalImagesChange,
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/admin/products')}
          >
            Quay lại
          </Button>
          <Title level={2}>Thêm sản phẩm mới</Title>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          isActive: true,
          stockQuantity: 0,
          price: 0,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2">
            <Card title="Thông tin sản phẩm" className="mb-6">
        <Form.Item
          name="name"
          label="Tên sản phẩm"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="price"
                  label="Giá (VNĐ)"
                  rules={[
                    { required: true, message: 'Vui lòng nhập giá!' },
                    { type: 'number', min: 0, message: 'Giá phải lớn hơn 0!' },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    placeholder="0"
                  />
                </Form.Item>

                <Form.Item
                  name="originalPrice"
                  label="Giá gốc (VNĐ)"
                >
                  <InputNumber
                    className="w-full"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    placeholder="0"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="categoryId"
          label="Danh mục"
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
        >
                  <Select placeholder="Chọn danh mục">
                    {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
          </Form.Item>
          
          <Form.Item
            name="stockQuantity"
            label="Số lượng trong kho"
            rules={[
                    { required: true, message: 'Vui lòng nhập số lượng!' },
                    { type: 'number', min: 0, message: 'Số lượng không được âm!' },
            ]}
          >
                  <InputNumber className="w-full" min={0} placeholder="0" />
          </Form.Item>
              </div>

        <Form.Item
          name="description"
          label="Mô tả sản phẩm"
        >
                <TextArea rows={6} placeholder="Nhập mô tả sản phẩm" />
        </Form.Item>
            </Card>

            <Card title="Thông tin bổ sung" className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item
            name="origin"
                  label="Xuất xứ"
          >
                  <Input placeholder="Nhập xuất xứ" />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Khối lượng"
          >
                  <Input placeholder="Nhập khối lượng" />
          </Form.Item>
          
          <Form.Item
            name="region"
            label="Vùng miền"
          >
            <Input placeholder="Nhập vùng miền" />
          </Form.Item>
              </div>
            </Card>
          </div>

          {/* Right Column - Images & Status */}
          <div>
            <Card title="Ảnh sản phẩm" className="mb-6">
              <Form.Item label="Ảnh chính">
                <Dragger {...mainImageUploadProps}>
            {mainImagePreview ? (
                    <div className="p-2">
                <img
                        src={mainImagePreview}
                        alt="Main product"
                        className="max-h-[200px] mx-auto"
                />
              </div>
            ) : (
                    <div className="p-8 text-center">
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                      <p className="ant-upload-hint">
                        Hỗ trợ tải lên một ảnh chính. Ảnh nên có kích thước không quá 2MB.
                      </p>
              </div>
            )}
                </Dragger>
        </Form.Item>

              <Form.Item label="Ảnh bổ sung">
                <Upload.Dragger {...additionalImagesUploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                  <p className="ant-upload-hint">
                    Hỗ trợ tải lên nhiều ảnh bổ sung. Mỗi ảnh không quá 2MB.
                  </p>
                </Upload.Dragger>
        </Form.Item>
            </Card>

            <Card title="Trạng thái">
        <Form.Item
          name="isActive"
                label="Trạng thái sản phẩm"
          valuePropName="checked"
        >
                <Switch 
                  checkedChildren="Đang bán" 
                  unCheckedChildren="Ngừng bán"
                />
        </Form.Item>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Space>
            <Button onClick={() => navigate('/admin/products')}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm sản phẩm
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default AddProduct; 