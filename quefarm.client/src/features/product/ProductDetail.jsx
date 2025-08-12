import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react';
import { Image as AntImage } from 'antd';
import { FaStar, FaShoppingCart, FaMinus, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext';
import { getProductById, getProductsByCategory, generateImageUrl } from '../../services/productService';
import ImageFallback from '../../components/ImageFallback';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showSticky, setShowSticky] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { addToCart } = useContext(CartContext);
  const addBtnRef = useRef(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const FREE_SHIP_THRESHOLD = 500000;
  const formatVND = (n) => new Intl.NumberFormat('vi-VN').format(Number(n || 0));

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

  // Always scroll to top when switching product detail
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [id]);

  // Sticky add-to-cart on mobile when CTA is out of view
  useEffect(() => {
    if (!addBtnRef.current) return;
    const target = addBtnRef.current;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => setShowSticky(!e.isIntersecting));
    }, { threshold: 0.4 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
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
  const resolveImageUrl = (src) => {
    if (!src) return '';
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    const normalized = src.startsWith('/') ? src : `/${src}`;
    if (window.location.hostname === 'localhost') {
      return `https://localhost:7013${normalized}`;
    }
    return normalized;
  };
  const resolvedImages = images.map(resolveImageUrl);

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

  // Load related products when product is loaded
  useEffect(() => {
    const loadRelated = async () => {
      if (!product || !product.categoryId) {
        setRelatedProducts([]);
        return;
      }
      try {
        const products = await getProductsByCategory(product.categoryId);
        const processed = (products || [])
          .filter(p => (p.id || p.productId) !== product.id)
          .map(p => {
            const idValue = p.id || p.productId;
            const mainImage = (p.productImages && p.productImages[0]?.imageUrl) || p.imageUrl;
            return {
              ...p,
              id: idValue,
              imageUrl: generateImageUrl(mainImage),
              price: p.price || 0,
              name: p.name || 'Sản phẩm'
            };
          })
          .slice(0, 8);
        setRelatedProducts(processed);
      } catch (err) {
        console.error('Error loading related products', err);
        setRelatedProducts([]);
      }
    };
    loadRelated();
  }, [product]);

  const [previewVisible, setPreviewVisible] = useState(false);

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

  const price = Number(product.price || 0);
  const original = Number(product.originalPrice || 0);
  const save = original > price ? original - price : 0;
  const pct = original > price ? Math.round((1 - price / original) * 100) : 0;
  const needForFreeship = Math.max(0, FREE_SHIP_THRESHOLD - price * quantity);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      <div className="bg-white rounded-lg shadow-sm p-5 md:p-6">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Product Image Gallery */}
          <div className="md:flex-none md:basis-[460px] md:shrink-0">
            <div className="relative">
              {(product.discountPercentage || product.discount) && (
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold rounded-full h-10 w-10 flex items-center justify-center z-10">
                  -{product.discountPercentage || product.discount}%
                </div>
              )}
              
              {/* Main Image with preview group */}
              <div className="relative mb-4 mx-auto w-[440px] h-[440px] bg-white rounded-lg shadow-md">
                <img
                  src={resolvedImages[selectedImageIndex]}
                  alt={product.name}
                  width={440}
                  height={440}
                  className="absolute inset-0 w-full h-full object-contain rounded-lg cursor-zoom-in"
                  onClick={() => setPreviewVisible(true)}
                />
                <AntImage.PreviewGroup
                  items={resolvedImages}
                  preview={{ visible: previewVisible, onVisibleChange: setPreviewVisible, current: selectedImageIndex }}
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
                <div className="grid grid-cols-5 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative rounded-lg overflow-hidden border-2 transition w-20 h-20 bg-white ${
                        selectedImageIndex === index ? 'border-green-600' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <ImageFallback 
                        src={image} 
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full" 
                        imgStyle={{ objectFit: 'contain', backgroundColor: '#fff' }}
                        fallbackSrc="/images/placeholder.svg"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="md:flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.round(product.rating || 0) ? "text-yellow-400" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">{product.rating || 0}/5</span>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                {original > price && (
                  <span className="text-gray-500 text-base md:text-lg line-through">{formatVND(original)}₫</span>
                )}
                <span className="text-red-600 text-2xl md:text-3xl font-bold">{formatVND(price)}₫</span>
                {save > 0 && (
                  <span className="text-emerald-700 font-semibold">Tiết kiệm {formatVND(save)} (‑{pct}%)</span>
                )}
              </div>
              <p className="text-sm text-green-600 mt-1">Còn hàng</p>
            </div>
            
            <div className="border border-gray-100 rounded-lg p-4 mb-4 bg-white shadow-xs">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
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
            
            <div className="flex items-center mb-2">
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
                ref={addBtnRef}
                className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded flex items-center gap-2"
              >
                <FaShoppingCart /> Thêm vào giỏ hàng
              </button>
            </div>
            <div className="text-sm text-gray-600 mb-6">
              {needForFreeship > 0
                ? (<span>Miễn phí vận chuyển cho đơn từ {formatVND(FREE_SHIP_THRESHOLD)}₫. Mua thêm {formatVND(needForFreeship)}₫ để được freeship.</span>)
                : (<span>Đơn của bạn đã đủ điều kiện miễn phí vận chuyển 🎉</span>)}
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
        
      </div>

      {/* Related Products - separate section */}
      {relatedProducts.length > 0 && (
        <div className="mt-8">
          <div className="bg-white border rounded-2xl shadow-sm p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4">Các sản phẩm khác</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {relatedProducts.map((item) => (
                <Link key={item.id} to={`/product/${item.id}`} className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition block">
                  <div className="p-3">
                    <div className="relative w-full rounded-md overflow-hidden bg-gray-50">
                      <div className="pt-[100%]"></div>
                      <ImageFallback
                        src={item.imageUrl}
                        alt={item.name}
                        className="absolute inset-0"
                        style={{ width: '100%', height: '100%' }}
                        imgStyle={{ objectFit: 'cover' }}
                        fallbackSrc="/images/placeholder.svg"
                      />
                    </div>
                    <h3 className="mt-3 font-medium text-sm md:text-[15px] mb-1 line-clamp-2 group-hover:text-green-700">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-green-700 font-bold">{Number(item.price || 0).toLocaleString()}₫</p>
                      <span className="text-xs text-gray-500 group-hover:text-gray-700">Xem chi tiết</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Add-to-Cart - mobile only */}
      {showSticky && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg px-4 py-3 flex items-center justify-between md:hidden z-30">
          <div>
            <div className="text-sm text-gray-500">Tạm tính</div>
            <div className="text-lg font-bold text-gray-800">{formatVND(price * quantity)}₫</div>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Thêm vào giỏ
          </button>
        </div>
      )}

      {/* Toast */}
      <div className={`fixed right-4 bottom-4 bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-2 text-gray-800 transition ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} pointer-events-none` }>
        Đã thêm vào giỏ hàng!
      </div>
    </div>
  );
}

export default ProductDetail; 