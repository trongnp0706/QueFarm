import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import categoryService from '../../../services/categoryService';

const EditCategory = ({ visible, onCancel, onSuccess, category }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (category && visible) {
      form.setFieldsValue({
        name: category.name,
        description: category.description,
      });
    }
  }, [category, visible, form]);

  const handleSubmit = async (values) => {
    try {
      await categoryService.updateCategory(category.id, {
        id: category.id,
        ...values
      });
      message.success('Cập nhật danh mục thành công');
      onSuccess();
    } catch (error) {
      console.error('Error updating category:', error);
      message.error('Không thể cập nhật danh mục');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Chỉnh sửa danh mục"
      open={visible}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Cập nhật"
      cancelText="Hủy"
      destroyOnClose
    >
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
          <Input.TextArea
            rows={4}
            placeholder="Nhập mô tả chi tiết về danh mục"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCategory;
