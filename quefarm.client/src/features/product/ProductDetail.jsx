import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { FaStar, FaShoppingCart, FaMinus, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext';
import { getProductById } from '../../services/productService';
import ImageFallback from '../../components/ImageFallback';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    // Show confirmation message
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleQuantityChange = (val) => {
    const newQty = quantity + val;
    if (newQty > 0) {
      setQuantity(newQty);
    }
  };

  // Helper functions for image gallery
  const getAllImages = () => {
    if (!product) return [];
    const images = [];
    if (product.imageUrl) {
      images.push(product.imageUrl);
    }
    if (product.additionalImages && Array.isArray(product.additionalImages)) {
      images.push(...product.additionalImages);
    }
    return images;
  };

  const images = getAllImages();

  const nextImage = () => {
    if (images.length > 1) {
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (loading) return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      <p className="mt-2 text-gray-600">Đang tải sản phẩm...</p>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-12 px-4">
      <p className="text-red-600 font-bold text-lg">Lỗi khi tải sản phẩm</p>
      <p className="text-gray-600 mt-2">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Tải lại trang
      </button>
    </div>
  );
  
  if (!product) return (
    <div className="text-center py-12">
      <p className="text-gray-600">Không tìm thấy sản phẩm</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image Gallery */}
          <div className="md:w-2/5">
            <div className="relative">
              {(product.discountPercentage || product.discount) && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold rounded-full h-12 w-12 flex items-center justify-center z-10">
                  -{product.discountPercentage || product.discount}%
                </div>
              )}
              
              {/* Main Image */}
              <div className="relative mb-4">
                <ImageFallback 
                  src={images[selectedImageIndex]} 
                  alt={product.name}
                  className="w-full h-96 rounded-lg shadow-md object-cover" 
                  fallbackSrc="/placeholder.png"
                />
                
                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition"
                    >
                      <FaChevronLeft />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative rounded-lg overflow-hidden border-2 transition ${
                        selectedImageIndex === index ? 'border-green-600' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <ImageFallback 
                        src={image} 
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-20 object-cover" 
                        fallbackSrc="/placeholder.png"
                      />
                      {selectedImageIndex === index && (
                        <div className="absolute inset-0 bg-green-600 bg-opacity-20"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="md:w-3/5">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.round(product.rating || 0) ? "text-yellow-400" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">{product.rating || 0}/5</span>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-2">
                {product.originalPrice && (
                  <span className="text-gray-500 text-lg line-through">{product.originalPrice.toLocaleString()}₫</span>
                )}
                <span className="text-red-600 text-3xl font-bold">{product.price.toLocaleString()}₫</span>
              </div>
              <p className="text-sm text-green-600 mt-1">Còn hàng</p>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-4">
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="flex flex-col space-y-2 mb-4">
              {product.origin && (
                <div className="flex">
                  <span className="font-medium w-24">Xuất xứ:</span>
                  <span>{product.origin}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex">
                  <span className="font-medium w-24">Khối lượng:</span>
                  <span>{product.weight}</span>
                </div>
              )}
              {product.region && (
                <div className="flex">
                  <span className="font-medium w-24">Vùng miền:</span>
                  <span>{product.region}</span>
                </div>
              )}
              {product.stockQuantity !== undefined && (
                <div className="flex">
                  <span className="font-medium w-24">Tồn kho:</span>
                  <span className={product.stockQuantity > 0 ? "text-green-600" : "text-red-600"}>
                    {product.stockQuantity > 0 ? `${product.stockQuantity} sản phẩm` : "Hết hàng"}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center mb-6">
              <div className="border border-gray-300 rounded flex items-center mr-4">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  <FaMinus />
                </button>
                <span className="px-4 py-1 border-l border-r border-gray-300">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  <FaPlus />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded flex items-center gap-2"
              >
                <FaShoppingCart /> Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
        
        {/* Product Features */}
        {product.features && product.features.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold mb-4">Đặc điểm sản phẩm</h2>
            <ul className="list-disc pl-5 space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="text-gray-700">{feature}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Product Description as fallback for features */}
        {(!product.features || product.features.length === 0) && product.description && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold mb-4">Mô tả sản phẩm</h2>
            <div className="text-gray-700 leading-relaxed">
              {product.description}
            </div>
          </div>
        )}
        
        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.relatedProducts.map((item) => (
                <div key={item.id} className="border rounded-lg p-3 hover:border-green-500 transition cursor-pointer">
                  <ImageFallback 
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-40 object-cover mb-2 rounded"
                    fallbackSrc="/placeholder.png"
                  />
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.name}</h3>
                  <p className="text-green-800 font-bold">{item.price.toLocaleString()}₫</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail; 