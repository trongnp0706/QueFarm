import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CategoryList from './CategoryList';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';

const CategoryManagement = () => {
  return (
    <Routes>
      <Route index element={<CategoryList />} />
      <Route path="add" element={<AddCategory />} />
      <Route path="edit/:id" element={<EditCategory />} />
      <Route path="*" element={<Navigate to="/admin/categories" replace />} />
    </Routes>
  );
};

export default CategoryManagement;
