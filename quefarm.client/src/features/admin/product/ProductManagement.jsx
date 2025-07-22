import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminProductList from './AdminProductList';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';

const ProductManagement = () => {
  return (
    <Routes>
      <Route index element={<AdminProductList />} />
      <Route path="add" element={<AddProduct />} />
      <Route path="edit/:id" element={<EditProduct />} />
      <Route path="*" element={<Navigate to="/admin/products" replace />} />
    </Routes>
  );
};

export default ProductManagement;

