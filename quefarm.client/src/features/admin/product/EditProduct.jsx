import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Button, Upload, InputNumber, 
  Select, Switch, message, Card, Typography, Space, Spin, Modal, Image
} from 'antd';
import { InboxOutlined, ArrowLeftOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, updateProduct } from '../../../services/productService';
import { getAllCategories } from '../../../services/categoryService';
import ImageFallback from '../../../components/ImageFallback';

const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;
const { Option } = Select;

// Get API base URL for image paths
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'https://localhost:7013'
  : ''; // Use relative URL in production

const EditProduct = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const navigate = useNavigate();

  // Helper function to get full image URL
  const getFullImageUrl = (relativePath) => {
    if (!relativePath) return '';
    
    // If it's already a full URL or a data URL, return as is
    if (relativePath.startsWith('http') || relativePath.startsWith('data:')) {
      return relativePath;
    }
    
    // Ensure the path starts with a slash
    const normalizedPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    return `${API_BASE_URL}${normalizedPath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);
        // Fetch product
        const productData = await getProductById(id);
        
        // Set main image preview if exists
        if (productData.imageUrl) {
          const fullImageUrl = getFullImageUrl(productData.imageUrl);
          setMainImagePreview(fullImageUrl);
        }
        
        // Set additional images if they exist
        if (productData.additionalImages && productData.additionalImages.length > 0) {
          const fullUrlAdditionalImages = productData.additionalImages.map(img => ({
            uid: img.split('/').pop() || img,
            name: img.split('/').pop() || 'image',
            status: 'done',
            url: getFullImageUrl(img)
          }));
          setAdditionalImagePreviews(fullUrlAdditionalImages);
        }

        // Set form values
        form.setFieldsValue({
          ...productData,
        });
        
        // Fetch categories
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        message.error('Không thể tải thông tin sản phẩm');
        console.error('Failed to fetch product data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

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

  const handleAdditionalImagesChange = ({ fileList }) => {
    // Filter only new files
    const newFiles = fileList.filter(file => file.originFileObj).map(file => file.originFileObj);
    setAdditionalImageFiles(newFiles);
    
    // Generate previews for new files
    const previews = newFiles.map(file => {
      return {
        uid: file.uid || Math.random().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
        status: 'done',
      };
    });
    
    setAdditionalImagePreviews(previews);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    setPreviewImage(file.url || file.preview);
    setPreviewTitle(file.name || file.url.split('/').pop());
    setPreviewVisible(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      await updateProduct(id, values, mainImageFile, additionalImageFiles);
      message.success('Cập nhật sản phẩm thành công');
      navigate('/admin/products');
    } catch (error) {
      message.error('Không thể cập nhật sản phẩm');
      console.error('Failed to update product:', error);
    } finally {
      setLoading(false);
    }
  };

  // Extract filename from path for display
  const getFileName = (path) => {
    if (!path) return '';
    const parts = path.split('/');
    return parts[parts.length - 1];
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
    listType: 'picture-card',
    fileList: additionalImageFiles.map((file, index) => ({
      uid: index,
      name: file.name,
      status: 'done',
      originFileObj: file,
    })),
    onPreview: handlePreview,
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
            onClick={() => navigate('/admin/products')}
          >
            Quay lại
          </Button>
          <Title level={2}>Chỉnh sửa sản phẩm</Title>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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

            {/* Hidden form fields */}
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          </div>

          {/* Right Column - Images & Status */}
          <div>
            <Card title="Ảnh sản phẩm" className="mb-6">
              <Form.Item label="Ảnh chính">
                {mainImagePreview && (
                  <div className="mb-4">
                    <p className="mb-2 text-gray-600">Ảnh hiện tại:</p>
                    <div className="relative inline-block">
                      <img
                        src={mainImagePreview}
                        alt="Main product"
                        className="max-h-[200px] max-w-full border rounded"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <Button 
                          type="primary" 
                          shape="circle" 
                          icon={<EyeOutlined />}
                          onClick={() => {
                            setPreviewImage(mainImagePreview);
                            setPreviewTitle(getFileName(mainImagePreview));
                            setPreviewVisible(true);
                          }}
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 break-all">
                      {getFileName(mainImagePreview)}
                    </p>
                  </div>
                )}
                <p className="mb-2 text-gray-600">Tải lên ảnh mới:</p>
                <Dragger {...mainImageUploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                  <p className="ant-upload-hint">
                    Hỗ trợ tải lên một ảnh chính. Ảnh nên có kích thước không quá 2MB.
                  </p>
                </Dragger>
              </Form.Item>

              <Form.Item label="Ảnh bổ sung">
                {additionalImagePreviews && additionalImagePreviews.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 text-gray-600">Ảnh bổ sung hiện tại:</p>
                    <div className="flex flex-wrap gap-2">
                      {additionalImagePreviews.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.url}
                            alt={`Additional product ${index + 1}`}
                            className="w-24 h-24 object-cover border rounded"
                          />
                          <div className="absolute top-1 right-1">
                            <Button 
                              type="primary" 
                              size="small"
                              shape="circle" 
                              icon={<EyeOutlined />}
                              onClick={() => {
                                setPreviewImage(image.url);
                                setPreviewTitle(getFileName(image.url));
                                setPreviewVisible(true);
                              }}
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500 max-w-[96px] truncate" title={image.name}>
                            {image.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <p className="mb-2 text-gray-600">Tải lên ảnh mới:</p>
                <Upload.Dragger {...additionalImagesUploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                  <p className="ant-upload-hint">
                    Hỗ trợ tải lên nhiều ảnh bổ sung. Mỗi ảnh không quá 2MB.
                  </p>
                </Upload.Dragger>
                <p className="mt-2 text-gray-500 text-sm">
                  Lưu ý: Tải lên ảnh mới sẽ thay thế tất cả các ảnh bổ sung hiện tại
                </p>
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
              Cập nhật sản phẩm
            </Button>
          </Space>
        </div>
      </Form>

      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default EditProduct; 