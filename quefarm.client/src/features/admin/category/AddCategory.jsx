import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import categoryService from '../../../services/categoryService';

const AddCategory = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      await categoryService.createCategory(values);
      message.success('Thêm danh mục thành công');
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Error creating category:', error);
      message.error('Không thể thêm danh mục');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Thêm danh mục mới"
      open={visible}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Thêm"
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

export default AddCategory;
