import imageCompression from 'browser-image-compression';

/**
 * Nén hình ảnh trước khi tải lên
 * @param {File} imageFile - File ảnh cần nén
 * @param {Object} options - Tùy chọn nén
 * @returns {Promise<File>} File ảnh đã được nén
 */
export const compressImage = async (imageFile, options = {}) => {
  try {
    // Tùy chọn mặc định
    const defaultOptions = {
      maxSizeMB: 1, // Nén xuống tối đa 1MB
      maxWidthOrHeight: 1920, // Giảm kích thước xuống tối đa 1920px
      useWebWorker: true, // Sử dụng Web Worker để tăng hiệu suất
      ...options,
    };

    
    // Thực hiện nén
    const compressedFile = await imageCompression(imageFile, defaultOptions);
    
    
    // Tạo một File mới từ Blob được trả về để giữ lại tên file gốc
    return new File([compressedFile], imageFile.name, {
      type: compressedFile.type,
      lastModified: new Date().getTime(),
    });
  } catch (error) {
    console.error('Lỗi khi nén ảnh:', error);
    // Trả về file gốc nếu có lỗi
    return imageFile;
  }
};

/**
 * Nén nhiều file ảnh
 * @param {Array<File>} imageFiles - Mảng các file ảnh cần nén
 * @param {Object} options - Tùy chọn nén
 * @returns {Promise<Array<File>>} Mảng các file ảnh đã được nén
 */
export const compressImages = async (imageFiles, options = {}) => {
  if (!imageFiles || imageFiles.length === 0) {
    return [];
  }

  const compressPromises = imageFiles.map(file => compressImage(file, options));
  return Promise.all(compressPromises);
}; 