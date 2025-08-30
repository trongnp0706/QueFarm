import React, { useState } from 'react';
import { 
  Card, 
  Upload, 
  Button, 
  message, 
  Progress, 
  Table, 
  Alert, 
  Typography, 
  Space, 
  Checkbox, 
  Divider,
  Steps,
  Row,
  Col,
  Statistic,
  Tag,
  Spin
} from 'antd';
import { 
  UploadOutlined, 
  DownloadOutlined, 
  FileExcelOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
  CloudUploadOutlined,
  FileAddOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { downloadImportTemplate, importProductsFromExcel } from '../../../services/productService';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const ImportProducts = () => {
  const [uploading, setUploading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Check authentication on component mount
  React.useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
    setCheckingAuth(false);
    
    if (!token) {
      message.warning({
        content: (
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              🔐 Chưa đăng nhập Admin
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              Cần đăng nhập để sử dụng tính năng import
            </div>
          </div>
        ),
        duration: 4
      });
    }
  }, []);

  // Inject styles
  React.useEffect(() => {
    const customStyles = `
      .custom-upload-dragger {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        cursor: pointer !important;
        pointer-events: auto !important;
      }
      
      .custom-upload-dragger:hover {
        border-color: #40a9ff !important;
        background: #f0f9ff !important;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(24, 144, 255, 0.15) !important;
      }
      
      .custom-upload-dragger .ant-upload {
        cursor: pointer !important;
        pointer-events: auto !important;
      }
      
      .custom-upload-dragger .ant-upload-drag {
        background: white !important;
        cursor: pointer !important;
        pointer-events: auto !important;
      }
      
      .custom-upload-dragger .ant-upload-drag:hover {
        border-color: #40a9ff !important;
      }
      
      .custom-upload-dragger .ant-upload-drag-container {
        cursor: pointer !important;
        pointer-events: auto !important;
      }
      
      .import-step-container {
        animation: fadeInUp 0.5s ease-out;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .statistic-card {
        transition: all 0.3s ease;
      }
      
      .statistic-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
      }
      
      @media (max-width: 768px) {
        .ant-steps {
          margin-bottom: 24px !important;
        }
        
        .ant-steps-item-description {
          display: none !important;
        }
        
        .ant-table-thead > tr > th {
          padding: 8px 4px !important;
          font-size: 12px !important;
        }
        
        .ant-table-tbody > tr > td {
          padding: 8px 4px !important;
          font-size: 12px !important;
        }
      }
      
      @media (max-width: 576px) {
        .ant-card-head-title {
          font-size: 18px !important;
        }
        
        .ant-btn-lg {
          height: 40px !important;
          font-size: 14px !important;
        }
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  // Download template
  const handleDownloadTemplate = async () => {
    // Check authentication before download
    if (!isAuthenticated) {
      message.error({
        content: (
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              🔐 Chưa đăng nhập
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
              Vui lòng đăng nhập Admin để tải template
            </div>
          </div>
        ),
        duration: 4
      });
      return;
    }

    try {
      message.loading({ content: 'Đang tải template...', key: 'download' });
      
      const response = await downloadImportTemplate();

      // Get filename from response headers or use default
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'QueFarm_Product_Import_Template.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      message.success({ content: '✅ Đã tải template thành công!', key: 'download' });
    } catch (error) {
      console.error('Error downloading template:', error);
      
      // Handle authentication error
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        message.error({
          content: '🔒 Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
          key: 'download'
        });
        setTimeout(() => navigate('/admin'), 1500);
        return;
      }
      
      message.error({ 
        content: `❌ Lỗi tải template: ${error.message}`, 
        key: 'download'
      });
    }
  };

  // Handle file selection
  const handleFileSelect = (info) => {
    const { file } = info;
    
    console.log('handleFileSelect called with:', info); // Debug log
    console.log('File selected:', file); // Debug log
    
    if (file.status === 'removed') {
      setSelectedFile(null);
      setCurrentStep(0);
      setImportResult(null);
      message.info('Đã xóa file - Hãy chọn file Excel khác');
      return;
    }

    // Validate file type
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                    file.type === 'application/vnd.ms-excel' ||
                    file.name.endsWith('.xlsx') ||
                    file.name.endsWith('.xls');
    
    console.log('File type:', file.type, 'Is Excel:', isExcel); // Debug log
    
    if (!isExcel) {
      message.error(`Chỉ hỗ trợ file Excel (.xlsx, .xls). File type: ${file.type}`);
      return false;
    }

    // Validate file size (10MB)
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('File không được vượt quá 10MB');
      return false;
    }

    console.log('File validation passed, setting selected file'); // Debug log
    setSelectedFile(file);
    setCurrentStep(1); // Update step for progress indicator
    message.success(`✅ Đã chọn file: ${file.name} - Sẵn sàng để import!`);
    return false; // Prevent automatic upload
  };

  // Handle import
  const handleImport = async () => {
    // Check authentication first
    if (!isAuthenticated) {
      message.error({
        content: '🔐 Chưa đăng nhập Admin. Vui lòng đăng nhập để import sản phẩm.',
        duration: 4
      });
      return;
    }

    if (!selectedFile) {
      message.error('Vui lòng chọn file Excel');
      return;
    }

    console.log('Starting import with file:', selectedFile.name); // Debug log
    setUploading(true);
    setCurrentStep(2);

    try {
      console.log('Calling import service...'); // Debug log
      const result = await importProductsFromExcel(selectedFile, overwriteExisting);
      console.log('Import result:', result); // Debug log
      
      setImportResult(result);
      setCurrentStep(3);

      if (result.errorCount === 0) {
        message.success(`Import thành công ${result.successCount} sản phẩm!`);
      } else {
        message.warning(`Import hoàn tất: ${result.successCount} thành công, ${result.errorCount} lỗi`);
      }
    } catch (error) {
      console.error('Error importing products:', error);
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        // Clear invalid token
        localStorage.removeItem('adminToken');
        
        message.error({
          content: (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                🔒 Phiên đăng nhập đã hết hạn!
              </div>
              <div style={{ fontSize: '13px', color: '#8c8c8c' }}>
                Vui lòng đăng nhập lại để tiếp tục import sản phẩm
              </div>
            </div>
          ),
          duration: 6
        });
        
        // Update auth state and redirect to login after a short delay
        setIsAuthenticated(false);
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
        
        setCurrentStep(1);
        return;
      }
      
      // Handle other errors
      let errorMessage = 'Lỗi import không xác định';
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          errorMessage = `❌ Dữ liệu không hợp lệ: ${data?.message || 'Kiểm tra lại file Excel'}`;
        } else if (status === 500) {
          errorMessage = `🔧 Lỗi server: ${data?.message || 'Vui lòng thử lại sau'}`;
        } else {
          errorMessage = `🚫 Lỗi API (${status}): ${data?.message || data?.error || error.message}`;
        }
      } else if (error.message) {
        errorMessage = `🌐 Lỗi kết nối: ${error.message}`;
      }
      
      message.error({
        content: errorMessage,
        duration: 5
      });
      setCurrentStep(1);
    } finally {
      setUploading(false);
    }
  };

  // Reset import
  const handleReset = () => {
    setSelectedFile(null);
    setImportResult(null);
    setCurrentStep(0);
    message.info('Đã reset - Hãy chọn file Excel mới để import');
  };

  // Error table columns
  const errorColumns = [
    {
      title: 'Dòng',
      dataIndex: 'row',
      key: 'row',
      width: 80,
    },
    {
      title: 'Trường',
      dataIndex: 'field',
      key: 'field',
      width: 120,
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
      width: 150,
      render: (text) => text || '(trống)',
    },
    {
      title: 'Lỗi',
      dataIndex: 'error',
      key: 'error',
      render: (text) => <Text type="danger">{text}</Text>,
    },
  ];

  // Success table columns
  const successColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price?.toLocaleString('vi-VN') + ' VND',
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Số lượng',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
    },
  ];

  // Loading state
  if (checkingAuth) {
  return (
      <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Card style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Spin size="large" />
            <Title level={4} style={{ marginTop: '16px', color: '#8c8c8c' }}>
              Đang kiểm tra quyền truy cập...
            </Title>
          </Card>
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Card style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #ff4d4f, #ff7875)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 24px rgba(255, 77, 79, 0.3)'
            }}>
              <ExclamationCircleOutlined style={{ fontSize: '48px', color: 'white' }} />
            </div>
            <Title level={2} style={{ color: '#262626', marginBottom: '16px' }}>
              🔐 Cần đăng nhập Admin
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#8c8c8c', marginBottom: '32px' }}>
              Tính năng import sản phẩm từ Excel chỉ dành cho Admin.<br />
              Vui lòng đăng nhập để tiếp tục.
            </Paragraph>
            
            <Space size="large">
              <Button 
                type="primary"
                size="large"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/admin')}
                style={{
                  height: '48px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
                  border: 'none',
                  fontSize: '16px',
                  boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
                }}
              >
                Đăng nhập Admin
              </Button>
              <Button 
                size="large"
                onClick={() => navigate('/admin/products')}
                style={{
                  height: '48px',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              >
                Quay về danh sách sản phẩm
              </Button>
            </Space>
          </Card>
        </div>
      </div>
    );
  }

    return (
    <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileExcelOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
            <div>
              <Title level={4} style={{ margin: 0, color: '#262626' }}>
                Import sản phẩm từ Excel
              </Title>
            </div>
          </div>
        }
        extra={
          <Space size="small">
            <div style={{ 
              background: '#f6ffed',
              padding: '2px 8px',
              borderRadius: '8px',
              border: '1px solid #b7eb8f'
            }}>
              <Text style={{ fontSize: '11px', color: '#52c41a', fontWeight: 'bold' }}>
                ✅ Admin
              </Text>
            </div>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/admin/products')}
              size="small"
            >
              Quay về
            </Button>
          </Space>
        }
        size="small"
        style={{ 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
        }}
      >
                    <Steps 
            current={currentStep} 
            style={{ marginBottom: 20 }}
            size="small"
          >
            <Step title="Template" icon={<DownloadOutlined />} />
            <Step title="Upload" icon={<CloudUploadOutlined />} />
            <Step title="Import" icon={<LoadingOutlined />} />
            <Step title="Kết quả" icon={<CheckCircleOutlined />} />
          </Steps>

      {/* Combined Template & Upload Section */}
      {!importResult && (
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #e8e8e8'
        }}>
          <Row gutter={[24, 16]}>
            {/* Template Download */}
            <Col xs={24} lg={10}>
              <div style={{ 
                background: '#f6ffed',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #b7eb8f',
                height: '100%'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                  <DownloadOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                  <Title level={5} style={{ margin: 0, color: '#262626' }}>
                    1. Tải Template Excel
                  </Title>
                  <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>
                    File mẫu với cấu trúc chuẩn
                  </Text>
                </div>
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />} 
                  onClick={handleDownloadTemplate}
                  block
                  style={{
                    background: '#52c41a',
                    borderColor: '#52c41a',
                    borderRadius: '6px'
                  }}
                >
                  Tải template
                </Button>
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#8c8c8c' }}>
                  ✓ Cấu trúc cột chuẩn<br/>
                  ✓ Danh sách danh mục<br/>
                  ✓ Ví dụ dữ liệu mẫu
                </div>
              </div>
            </Col>

            {/* File Upload */}
            <Col xs={24} lg={14}>
              <div style={{ 
                background: '#fff7e6',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #ffd591',
                height: '100%'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                  <CloudUploadOutlined style={{ fontSize: '24px', color: '#fa8c16', marginBottom: '8px' }} />
                  <Title level={5} style={{ margin: 0, color: '#262626' }}>
                    2. Upload File Excel
                  </Title>
                  <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>
                    Chọn file đã chuẩn bị theo template
                  </Text>
                </div>

                          <Upload.Dragger
                  name="excelFile"
                  accept=".xlsx,.xls"
                  maxCount={1}
                  beforeUpload={handleFileSelect}
                  onRemove={() => handleFileSelect({ file: { status: 'removed' } })}
                  fileList={selectedFile ? [selectedFile] : []}
                  customRequest={({ onSuccess }) => {
                    onSuccess();
                  }}
                  showUploadList={false}
                  style={{
                    background: 'white',
                    borderRadius: '6px',
                    border: '2px dashed #ffa940',
                    padding: '16px'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <FileExcelOutlined style={{ fontSize: '32px', color: '#fa8c16', marginBottom: '8px' }} />
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#262626', marginBottom: '4px' }}>
                      Kéo thả file hoặc click để chọn
                    </div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
                      Hỗ trợ .xlsx, .xls (tối đa 10MB)
                    </div>
                    <Button
                      size="small"
                      icon={<FileExcelOutlined />}
                      style={{ borderColor: '#fa8c16', color: '#fa8c16' }}
                    >
                      Chọn file
                    </Button>
                  </div>
                </Upload.Dragger>
                
                {/* Alternative input */}
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleFileSelect({ file });
                    }
                  }}
                  id="file-input-backup"
                />
                
                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                  <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>
                    Bắt buộc: Tên SP, Giá, Danh mục
                  </Text>
                </div>
              </div>
            </Col>
          </Row>

                      {selectedFile && (
            <div style={{ marginTop: '16px' }}>
              <Alert
                message={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileExcelOutlined style={{ color: '#52c41a' }} />
                      <span style={{ fontWeight: 'bold' }}>{selectedFile.name}</span>
                      <span style={{ color: '#8c8c8c', fontSize: '12px' }}>
                        ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <div>
                      <Checkbox 
                        checked={overwriteExisting}
                        onChange={(e) => setOverwriteExisting(e.target.checked)}
                        style={{ fontSize: '13px', marginRight: '8px' }}
                      >
                        Ghi đè trùng tên
                      </Checkbox>
                      <Button 
                        onClick={handleReset}
                        size="small"
                        style={{ marginRight: '8px' }}
                      >
                        Đổi file
                      </Button>
                      <Button 
                        type="primary" 
                        loading={uploading}
                        onClick={handleImport}
                        disabled={!selectedFile}
                        icon={<FileAddOutlined />}
                        style={{
                          background: '#1890ff',
                          borderColor: '#1890ff'
                        }}
                      >
                        Import ngay
                      </Button>
                    </div>
                  </div>
                }
                type="success"
                showIcon={false}
                style={{ borderRadius: '6px' }}
              />
            </div>
          )}
        </div>
      )}

            {/* Step 3: Importing Progress */}
      {currentStep === 2 && uploading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          background: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #bae7ff'
        }}>
          <Spin size="large" />
          <Title level={4} style={{ color: '#262626', marginTop: '16px', marginBottom: '8px' }}>
            Đang import dữ liệu...
          </Title>
          <Text style={{ color: '#8c8c8c' }}>
            Vui lòng đợi, hệ thống đang xử lý file Excel của bạn
          </Text>
        </div>
      )}

            {/* Step 4: Results */}
      {currentStep === 3 && importResult && (
        <div style={{
          background: importResult.errorCount === 0 ? '#f6ffed' : '#fff7e6',
          borderRadius: '8px',
          padding: '20px',
          border: importResult.errorCount === 0 ? '1px solid #b7eb8f' : '1px solid #ffd591'
        }}>
          <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '16px' }}>
            <Col>
              {importResult.errorCount === 0 
                ? <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                : <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
              }
            </Col>
            <Col flex={1}>
              <Title level={4} style={{ margin: 0, color: '#262626' }}>
                {importResult.errorCount === 0 ? 'Import thành công!' : 'Import hoàn tất với lỗi'}
              </Title>
              <Text style={{ color: '#595959' }}>
                {importResult.successCount} thành công{importResult.errorCount > 0 && `, ${importResult.errorCount} lỗi`}
              </Text>
            </Col>
            <Col>
              <Space>
                <Button onClick={handleReset} icon={<FileAddOutlined />}>
                  Import file khác
                </Button>
                <Button onClick={() => navigate('/admin/products')}>
                  Về danh sách SP
                </Button>
              </Space>
            </Col>
          </Row>

          {/* Compact Statistics */}
          <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
            <Col xs={8}>
              <div style={{ textAlign: 'center', padding: '12px', background: 'white', borderRadius: '6px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                  {importResult.totalRows}
                </div>
                <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>Tổng dòng</Text>
              </div>
            </Col>
            <Col xs={8}>
              <div style={{ textAlign: 'center', padding: '12px', background: 'white', borderRadius: '6px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                  {importResult.successCount}
                </div>
                <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>Thành công</Text>
              </div>
            </Col>
            <Col xs={8}>
              <div style={{ textAlign: 'center', padding: '12px', background: 'white', borderRadius: '6px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4d4f' }}>
                  {importResult.errorCount}
                </div>
                <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>Lỗi</Text>
              </div>
            </Col>
          </Row>

                    {/* Compact Error/Success Details */}
          {(importResult.errors?.length > 0 || importResult.importedProducts?.length > 0) && (
            <Row gutter={[12, 12]}>
              {importResult.errors && importResult.errors.length > 0 && (
                <Col xs={24} lg={12}>
                  <div style={{ background: 'white', borderRadius: '6px', padding: '12px', border: '1px solid #ffccc7' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                      <Text strong style={{ fontSize: '14px' }}>Lỗi ({importResult.errors.length})</Text>
                    </div>
                    <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                      <Table
                        columns={errorColumns.map(col => ({ ...col, width: undefined }))}
                        dataSource={importResult.errors.slice(0, 5)}
                        rowKey={(record, index) => `error-${index}`}
                        pagination={false}
                        size="small"
                        scroll={{ x: true }}
                      />
                      {importResult.errors.length > 5 && (
                        <div style={{ textAlign: 'center', padding: '8px' }}>
                          <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                            ...và {importResult.errors.length - 5} lỗi khác
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              )}

              {importResult.importedProducts && importResult.importedProducts.length > 0 && (
                <Col xs={24} lg={importResult.errors?.length > 0 ? 12 : 24}>
                  <div style={{ background: 'white', borderRadius: '6px', padding: '12px', border: '1px solid #b7eb8f' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text strong style={{ fontSize: '14px' }}>Thành công ({importResult.importedProducts.length})</Text>
                    </div>
                    <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                      <Table
                        columns={successColumns.map(col => ({ ...col, width: undefined }))}
                        dataSource={importResult.importedProducts.slice(0, 5)}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        scroll={{ x: true }}
                      />
                      {importResult.importedProducts.length > 5 && (
                        <div style={{ textAlign: 'center', padding: '8px' }}>
                          <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                            ...và {importResult.importedProducts.length - 5} sản phẩm khác
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          )}
        </div>
      )}
    </Card>
  );
};

export default ImportProducts;
