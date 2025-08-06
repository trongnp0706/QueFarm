import axios from 'axios';

// Cấu hình URL cơ sở cho axios
// Sử dụng proxy trong development, URL tương đối trong production
const API_BASE_URL =  import.meta.env.NODE_ENV === 'production' 
  ? '' // Sử dụng URL tương đối trong môi trường sản xuất
  : ''; // Sử dụng proxy trong development

// Tạo instance Axios tùy chỉnh
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Trong development, tin tưởng self-signed certificates
  ...(import.meta.env.NODE_ENV === 'development' && {
    httpsAgent: false
  })
});

// Thêm interceptor để gửi token xác thực khi có
api.interceptors.request.use(config => {
  // Lấy token từ localStorage
  const token = localStorage.getItem('adminToken');
  
  // Thêm token vào header nếu có
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

const API_PATH = '/api/category';

// Bảng ánh xạ các ký tự tiếng Việt cho hàm tạo slug
const vietnameseMap = {
  'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
  'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
  'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
  'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
  'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
  'đ': 'd',
  'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A', 'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
  'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
  'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
  'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
  'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
  'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
  'Đ': 'D'
};

// Hàm tạo slug từ tên (giữ lại từ phiên bản trước)
const createSlug = (name) => {
  if (!name) return '';
  
  // Chuyển đổi sang chữ thường
  let slug = name.toLowerCase();
  
  // Thay thế từng ký tự tiếng Việt
  slug = slug.split('').map(char => vietnameseMap[char] || char).join('');
  
  // Thay thế các ký tự không phải chữ cái hoặc số bằng dấu gạch ngang
  slug = slug.replace(/[^a-z0-9]+/g, '-');
  
  // Loại bỏ dấu gạch ngang ở đầu và cuối
  slug = slug.replace(/^-|-$/g, '');
  
  return slug;
};

// Làm sạch dữ liệu trước khi gửi đi
const sanitizeData = (data) => {
  const cleanData = { ...data };
  
  // Tự động tạo slug nếu không có
  if (!cleanData.slug && cleanData.name) {
    cleanData.slug = createSlug(cleanData.name);
  }
  
  return cleanData;
};

// Dịch vụ danh mục
const categoryService = {
  // Lấy tất cả danh mục
  getAllCategories: async () => {
    try {
      const response = await api.get(API_PATH);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  // Lấy danh mục theo ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`${API_PATH}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with id ${id}:`, error);
      throw error;
    }
  },

  // Lấy danh mục theo slug
  getCategoryBySlug: async (slug) => {
    try {
      const response = await api.get(`${API_PATH}/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with slug ${slug}:`, error);
      throw error;
    }
  },

  // Tạo danh mục mới
  createCategory: async (categoryData) => {
    try {
      const cleanData = sanitizeData(categoryData);
      const response = await api.post(API_PATH, cleanData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Cập nhật danh mục
  updateCategory: async (id, categoryData) => {
    try {
      const cleanData = sanitizeData(categoryData);
      const response = await api.put(`${API_PATH}/${id}`, cleanData);
      return response.data;
    } catch (error) {
      console.error(`Error updating category with id ${id}:`, error);
      throw error;
    }
  },

  // Xóa danh mục
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`${API_PATH}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      throw error;
    }
  },
  
  // Hàm trợ giúp để tạo slug
  createSlug
};

// Export các hàm để sử dụng import có tên
export const getAllCategories = categoryService.getAllCategories;
export const getCategoryById = categoryService.getCategoryById;
export const getCategoryBySlug = categoryService.getCategoryBySlug;
export const createCategory = categoryService.createCategory;
export const updateCategory = categoryService.updateCategory;
export const deleteCategory = categoryService.deleteCategory;
export const generateSlug = categoryService.createSlug;

export default categoryService; 