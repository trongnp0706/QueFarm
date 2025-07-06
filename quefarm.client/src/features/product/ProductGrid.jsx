import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
      {products.map(product => (
        <div
          key={product.id}
          className="bg-white rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-3 md:p-4 flex flex-col items-center group border border-gray-100 hover:border-green-400 hover:scale-105"
        >
          <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-lg">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {/* Quick view overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <Link
                to={`/product/${product.id}`}
                className="opacity-0 group-hover:opacity-100 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:bg-green-700"
              >
                Xem nhanh
              </Link>
            </div>
          </div>
          
          <div className="w-full text-center">
            <h2 className="font-semibold text-sm md:text-base mb-1 group-hover:text-green-700 transition-colors line-clamp-2">
              {product.name}
            </h2>
            
            <div className="flex items-center justify-center mb-1">
              {Array(Math.round(product.rating)).fill(0).map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-xs md:text-sm" />
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
            </div>
            
            <p className="text-red-600 font-bold mb-2 text-base md:text-lg">
              {product.price.toLocaleString()} đ
            </p>
            
            <div className="flex gap-2 w-full">
              <Link
                to={`/product/${product.id}`}
                className="flex-1 bg-green-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-full font-medium text-xs md:text-sm shadow hover:bg-green-700 transition-colors text-center"
              >
                Chi tiết
              </Link>
              <button className="bg-orange-500 text-white px-2 md:px-3 py-1 md:py-2 rounded-full font-medium text-xs md:text-sm shadow hover:bg-orange-600 transition-colors">
                Mua
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid; 