import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/product')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Danh sách sản phẩm</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded shadow p-4 flex flex-col items-center">
            <img src={product.imageUrl} alt={product.name} className="w-40 h-32 object-cover mb-2 rounded" />
            <h2 className="font-semibold text-lg mb-1">{product.name}</h2>
            <p className="text-gray-600 mb-2">{product.price.toLocaleString()} đ</p>
            <Link to={`/product/${product.id}`} className="text-blue-500 hover:underline">Xem chi tiết</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList; 