import axios from 'axios';

// Configure axios default base URL
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'https://localhost:7013'
  : ''; // Use relative URL in production

axios.defaults.baseURL = API_BASE_URL;

const API_URL = '/api/product';

export const getAllProducts = async (pageNumber = 1, pageSize = 10, searchTerm = '') => {
  try {
    let url = `${API_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    console.log('API URL:', url);
    const response = await axios.get(url);
    console.log('API Response:', response.data);
    
    // API returns data in this format (handle both Pascal and camelCase):
    // { Products: [...], TotalItems: 10, PageNumber: 1, PageSize: 10 }
    // or { products: [...], totalItems: 10, pageNumber: 1, pageSize: 10 }
    return {
      items: response.data.Products || response.data.products || [],
      totalCount: response.data.TotalItems || response.data.totalItems || 0,
      pageNumber: response.data.PageNumber || response.data.pageNumber || pageNumber,
      pageSize: response.data.PageSize || response.data.pageSize || pageSize
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty result instead of throwing error
    return {
      items: [],
      totalCount: 0,
      pageNumber: pageNumber,
      pageSize: pageSize
    };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error; // Re-throw to let component handle the error
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

export const getProductsByCategorySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/category-slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category slug:', error);
    return [];
  }
};

export const getFeaturedProducts = async (count = 6) => {
  try {
    const response = await axios.get(`${API_URL}/featured/${count}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    // Return empty array instead of throwing error to prevent app crash
    return [];
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
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
  
  console.log('Creating product with FormData:', Object.fromEntries(formData.entries()));
  
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
  
  console.log('Updating product with FormData:', Object.fromEntries(formData.entries()));
  
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