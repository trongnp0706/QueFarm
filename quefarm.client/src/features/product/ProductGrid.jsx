import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map(product => (
        <div
          key={product.id}
          className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center group border border-gray-100 hover:border-green-400"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-32 h-32 object-cover mb-2 rounded-lg group-hover:scale-105 transition"
          />
          <h2 className="font-semibold text-base mb-1 text-center group-hover:text-green-700 transition">
            {product.name}
          </h2>
          <div className="flex items-center mb-1">
            {Array(Math.round(product.rating)).fill(0).map((_, i) => (
              <FaStar key={i} className="text-yellow-400 text-sm" />
            ))}
          </div>
          <p className="text-red-600 font-bold mb-2 text-lg">{product.price.toLocaleString()} đ</p>
          <Link
            to={`/product/${product.id}`}
            className="bg-green-600 text-white px-4 py-1 rounded-full font-semibold shadow hover:bg-green-700 transition mt-auto"
          >
            Xem chi tiết
          </Link>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid; 