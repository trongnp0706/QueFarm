import axios from 'axios';

// Configure axios default base URL
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'https://localhost:7013'
  : ''; // Use relative URL in production

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

export const createProduct = async (productData, mainImage, additionalImages = []) => {
  const formData = new FormData();
  
  // Append product data, only non-empty values
  Object.keys(productData).forEach(key => {
    const value = productData[key];
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value);
    }
  });
  
  // Append main image if it exists
  if (mainImage) {
    formData.append('mainImage', mainImage);
  }
  
  // Append additional images if they exist
  if (additionalImages && additionalImages.length > 0) {
    additionalImages.forEach(image => {
      formData.append('additionalImages', image);
    });
  }
  
  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const updateProduct = async (id, productData, mainImage, additionalImages = []) => {
  const formData = new FormData();
  
  // Append product data, only non-empty values
  Object.keys(productData).forEach(key => {
    const value = productData[key];
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value);
    }
  });
  
  // Append main image if it exists
  if (mainImage) {
    formData.append('mainImage', mainImage);
  }
  
  // Append additional images if they exist
  if (additionalImages && additionalImages.length > 0) {
    additionalImages.forEach(image => {
      formData.append('additionalImages', image);
    });
  }
  
  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const deleteProduct = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
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
  deleteProduct
};

export default productService; 