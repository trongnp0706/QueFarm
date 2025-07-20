import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { FaStar, FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
  
  // For demo purposes - should be fetched from API
  const mockProduct = {
    id: parseInt(id),
    name: "Lạp xưởng tươi bò _ Gói 500gr",
    price: 124500,
    originalPrice: 149400,
    discount: 17,
    imageUrl: "https://via.placeholder.com/500x500?text=Product",
    description: "Lạp xưởng tươi bò 500gr là sản phẩm đặc sản được chế biến từ thịt bò tươi ngon, không chất bảo quản, đảm bảo vệ sinh an toàn thực phẩm. Sản phẩm có hương vị thơm ngon, đặc trưng, phù hợp cho các bữa ăn gia đình hoặc làm quà biếu tặng.",
    rating: 4.8,
    region: "Miền Nam",
    weight: "500gr",
    origin: "Long An",
    features: [
      "Thịt bò tươi ngon, không chất bảo quản",
      "Đóng gói vệ sinh, bảo quản kỹ lưỡng",
      "Hương vị đặc trưng miền Nam"
    ],
    relatedProducts: [
      { id: 101, name: "Lạp xưởng tươi bò _ Gói 250gr", price: 62200, imageUrl: "https://via.placeholder.com/200x200?text=Product" },
      { id: 102, name: "Lạp xưởng tươi tôm_ Gói 500gr", price: 138500, imageUrl: "https://via.placeholder.com/200x200?text=Product" }
    ]
  };

  useEffect(() => {
    // For demo, using mock data
    // In real app, fetch from API
    setProduct(mockProduct);
    setLoading(false);
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
          {/* Product Image */}
          <div className="md:w-2/5 relative">
            {product.discount && (
              <div className="absolute top-4 left-4 bg-green-600 text-white text-sm font-bold rounded-full h-12 w-12 flex items-center justify-center z-10">
                -{product.discount}%
              </div>
            )}
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full rounded-lg shadow-md object-cover" 
            />
          </div>
          
          {/* Product Info */}
          <div className="md:w-3/5">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">{product.rating}/5</span>
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
              <div className="flex">
                <span className="font-medium w-24">Xuất xứ:</span>
                <span>{product.origin}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">Khối lượng:</span>
                <span>{product.weight}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">Vùng miền:</span>
                <span>{product.region}</span>
              </div>
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
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold mb-4">Đặc điểm sản phẩm</h2>
          <ul className="list-disc pl-5 space-y-2">
            {product.features.map((feature, index) => (
              <li key={index} className="text-gray-700">{feature}</li>
            ))}
          </ul>
        </div>
        
        {/* Related Products */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.relatedProducts.map((item) => (
              <div key={item.id} className="border rounded-lg p-3 hover:border-green-500 transition">
                <img 
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
                <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.name}</h3>
                <p className="text-green-800 font-bold">{item.price.toLocaleString()}₫</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 