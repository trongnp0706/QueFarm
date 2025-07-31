import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Button, Upload, InputNumber, 
  Select, Switch, message, Card, Typography, Space 
} from 'antd';
import { InboxOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import categoryService from '../../../services/categoryService';
import { createProductWithImagesDirect } from '../../../services/productService';
import ImageFallback from '../../../components/ImageFallback';
import { compressImage, compressImages } from '../../../utils/imageCompression';

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

  const handleMainImageChange = async (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    
    if (info.file.status === 'done' || info.file.status === 'error') {
      const file = info.file.originFileObj;
      
      try {
        // Compress image if larger than 1MB
        if (file.size > 1024 * 1024) {
          message.info('Ảnh đang được nén để tải lên nhanh hơn...');
          const compressedFile = await compressImage(file);
          setMainImageFile(compressedFile);
          
          // Generate preview
          const reader = new FileReader();
          reader.onload = (e) => {
            setMainImagePreview(e.target.result);
          };
          reader.readAsDataURL(compressedFile);
        } else {
          setMainImageFile(file);
          
          // Generate preview
          const reader = new FileReader();
          reader.onload = (e) => {
            setMainImagePreview(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error('Error compressing image:', error);
        message.error('Có lỗi khi xử lý ảnh');
        
        // Use original file if error
        setMainImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setMainImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAdditionalImagesChange = async (info) => {
    const fileList = info.fileList;
    
    const files = fileList.map(file => file.originFileObj);
    
    try {
              // Compress all images larger than 1MB
        const filesToCompress = files.filter(file => file && file.size > 1024 * 1024);
        
        if (filesToCompress.length > 0) {
          message.info('Các ảnh bổ sung đang được nén để tải lên nhanh hơn...');
          
          // Compress large images
        const compressedFiles = await compressImages(filesToCompress);
        
        // Thay thế các file gốc bằng các file đã nén
        const finalFiles = files.map(file => {
          if (!file) return file;
          const compressedFile = compressedFiles.find(cf => cf.name === file.name);
          return compressedFile || file;
        });
        
        setAdditionalImageFiles(finalFiles);
      } else {
        setAdditionalImageFiles(files);
      }
    } catch (error) {
      console.error('Error compressing images:', error);
      message.error('Có lỗi khi xử lý ảnh');
      
      // Use original files if error
      setAdditionalImageFiles(files);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {

      
      await createProductWithImagesDirect(values, mainImageFile, additionalImageFiles);
      message.success('Thêm sản phẩm thành công');
      navigate('/admin/products');
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
        return false;
    }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Hình ảnh phải nhỏ hơn 5MB!');
        return false;
      }
      return true;
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
        return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
        message.error('Hình ảnh phải nhỏ hơn 5MB!');
        return false;
    }
      return true;
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