import axios from 'axios';

// Configure axios default base URL
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'https://localhost:7013'
  : ''; // Use relative URL in production

// Create axios instance with interceptor for authentication
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add interceptor to automatically send auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Keep backward compatibility
axios.defaults.baseURL = API_BASE_URL;

const API_URL = '/api/product';

// Configure base URL for images
const getImageBaseUrl = () => {
  // Priority order:
  // 1. VITE_API_BASE_URL environment variable
  // 2. Window location origin for local development
  // 3. Fallback to relative path
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, ''); // Remove trailing slashes
  }

  // For local development
  if (window.location.hostname === 'localhost') {
    return 'https://localhost:7013';
  }

  // Production: use the current origin
  return window.location.origin;
};

// Helper function to generate full image URL
export const generateImageUrl = (imageUrl) => {
  // If already a full URL, return as-is
  if (!imageUrl || imageUrl.startsWith('http')) {
    return imageUrl || '/placeholder.png';
  }

  // Ensure image path starts with a slash
  const normalizedImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;

  // Combine base URL with image path
  return `${getImageBaseUrl()}${normalizedImageUrl}`;
};

export const getAllProducts = async (pageNumber = 1, pageSize = 10, searchTerm = '') => {
  let url = `${API_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  if (searchTerm) {
    url += `&search=${encodeURIComponent(searchTerm)}`;
  }
  const response = await axios.get(url);
  
  // API returns data in this format (handle both Pascal and camelCase):
  // { Products: [...], TotalItems: 10, PageNumber: 1, PageSize: 10 }
  // or { products: [...], totalItems: 10, pageNumber: 1, pageSize: 10 }
  return {
    items: response.data.Products || response.data.products || [],
    totalCount: response.data.TotalItems || response.data.totalItems || 0,
    pageNumber: response.data.PageNumber || response.data.pageNumber || pageNumber,
    pageSize: response.data.PageSize || response.data.pageSize || pageSize
  };
};

export const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const getProductsByCategory = async (categoryId) => {
  const response = await axios.get(`${API_URL}/category/${categoryId}`);
  return response.data;
};

export const getProductsByCategorySlug = async (slug) => {
  const response = await axios.get(`${API_URL}/category-slug/${slug}`);
  return response.data;
};

export const getFeaturedProducts = async (count = 6) => {
  const response = await axios.get(`${API_URL}/featured/${count}`);
  return response.data;
};

export const searchProducts = async (query) => {
  const response = await axios.get(`${API_URL}/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post(API_URL, productData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const updateData = {
    id: parseInt(id),
    name: productData.name,
    price: parseFloat(productData.price),
    categoryId: parseInt(productData.categoryId),
    description: productData.description || '',
    stockQuantity: parseInt(productData.stockQuantity) || 0,
    origin: productData.origin || '',
    weight: productData.weight || '',
    region: productData.region || '',
    isActive: productData.isActive !== undefined ? productData.isActive : true
  };

  const response = await axios.put(`${API_URL}/${id}`, updateData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return response.data;
};

export const deleteProduct = async (id) => {
  return await api.delete(`${API_URL}/${id}`);
};

// File upload functions (Separate Controllers)
const FILE_API_URL = '/api/product-files';

export const uploadMainImage = async (productId, imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  
  const response = await api.post(`${FILE_API_URL}/${productId}/main-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const uploadAdditionalImages = async (productId, imageFiles) => {
  const formData = new FormData();
  imageFiles.forEach(file => {
    formData.append('files', file);
  });
  
  const response = await api.post(`${FILE_API_URL}/${productId}/additional-images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const deleteProductImage = async (productId, imageUrl) => {
  const response = await api.delete(`${FILE_API_URL}/${productId}/image?imageUrl=${encodeURIComponent(imageUrl)}`);
  return response.data;
};

// Helper functions (Combines data + file operations)
export const createProductWithImages = async (productData, mainImage = null, additionalImages = []) => {
  // 1. Create product with JSON data first
  const product = await createProduct(productData);
  
  try {
    // 2. Upload main image if provided
    if (mainImage) {
      await uploadMainImage(product.id, mainImage);
    }
    
    // 3. Upload additional images if provided
    if (additionalImages && additionalImages.length > 0) {
      await uploadAdditionalImages(product.id, additionalImages);
    }
    
    // 4. Return updated product data
    return await getProductById(product.id);
  } catch (error) {
    console.error('Error uploading images:', error);
    // Product created but image upload failed
    throw new Error(`Product created successfully but image upload failed: ${error.message}`);
  }
};

export const updateProductWithImages = async (id, productData, mainImage = null, additionalImages = []) => {
  // 1. Update product data first
  const product = await updateProduct(id, productData);
  
  try {
    // 2. Upload main image if provided
    if (mainImage) {
      await uploadMainImage(id, mainImage);
    }
    
    // 3. Upload additional images if provided
    if (additionalImages && additionalImages.length > 0) {
      await uploadAdditionalImages(id, additionalImages);
    }
    
    // 4. Return updated product data
    return await getProductById(id);
  } catch (error) {
    console.error('Error uploading images:', error);
    // Product updated but image upload failed
    throw new Error(`Product updated successfully but image upload failed: ${error.message}`);
  }
};

// New endpoints with direct image upload (Integrated)
export const createProductWithImagesDirect = async (productData, mainImage = null, additionalImages = []) => {
  const formData = new FormData();
  
  // Add product data
  formData.append('name', productData.name);
  formData.append('price', productData.price);
  formData.append('categoryId', productData.categoryId);
  
  if (productData.description) formData.append('description', productData.description);
  if (productData.originalPrice) formData.append('originalPrice', productData.originalPrice);
  if (productData.stockQuantity) formData.append('stockQuantity', productData.stockQuantity);
  if (productData.origin) formData.append('origin', productData.origin);
  if (productData.weight) formData.append('weight', productData.weight);
  if (productData.region) formData.append('region', productData.region);
  
  // Add images
  if (mainImage) {
    formData.append('mainImage', mainImage);
  }
  
  if (additionalImages && additionalImages.length > 0) {
    additionalImages.forEach(image => {
      formData.append('additionalImages', image);
    });
  }
  
  const response = await api.post(`${API_URL}/with-images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const updateProductWithImagesDirect = async (id, productData, mainImage = null, additionalImages = []) => {
  const formData = new FormData();
  
  // Add product data
  formData.append('name', productData.name);
  formData.append('price', productData.price);
  formData.append('categoryId', productData.categoryId);
  
  if (productData.description) formData.append('description', productData.description);
  if (productData.originalPrice) formData.append('originalPrice', productData.originalPrice);
  if (productData.stockQuantity) formData.append('stockQuantity', productData.stockQuantity);
  if (productData.origin) formData.append('origin', productData.origin);
  if (productData.weight) formData.append('weight', productData.weight);
  if (productData.region) formData.append('region', productData.region);
  formData.append('isActive', productData.isActive !== undefined ? productData.isActive : true);
  
  // Add images
  if (mainImage) {
    formData.append('mainImage', mainImage);
  }
  
  if (additionalImages && additionalImages.length > 0) {
    additionalImages.forEach(image => {
      formData.append('additionalImages', image);
    });
  }
  
  const response = await api.put(`${API_URL}/${id}/with-images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

const productService = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsByCategorySlug,
  getFeaturedProducts,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  // File upload functions (Solution 2)
  uploadMainImage,
  uploadAdditionalImages,
  deleteProductImage,
  // Helper functions (Combined operations)
  createProductWithImages,
  updateProductWithImages,
  // New direct image upload functions
  createProductWithImagesDirect,
  updateProductWithImagesDirect
};

export default productService; 