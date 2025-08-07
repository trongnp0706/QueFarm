// src/features/product/ProductGrid.jsx
import { Link } from 'react-router-dom';
import ImageFallback from '../../components/ImageFallback';
import { generateImageUrl } from '../../services/productService';

const ProductCardSkeleton = () => (
    <div className="group relative">
        <div className="block bg-white rounded-xl overflow-hidden border border-brand-cream-300 shadow-sm product-card">
            <div className="product-image-container">
                <div className="bg-brand-cream-200 animate-pulse w-full h-full"></div>
            </div>
            <div className="product-content">
                <div className="h-5 bg-brand-cream-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-brand-cream-200 rounded animate-pulse w-3/4 mb-3"></div>
                <div className="flex justify-between items-center mb-3">
                    <div className="h-3 bg-brand-cream-200 rounded animate-pulse w-16"></div>
                    <div className="h-6 bg-brand-cream-200 rounded animate-pulse w-12"></div>
                </div>
                <div className="h-10 bg-brand-cream-200 rounded-lg animate-pulse"></div>
            </div>
        </div>
    </div>
);

const ProductCard = ({ product }) => {
    const imageUrl = generateImageUrl(product.productImages?.[0]?.imageUrl || product.imageUrl);
    
    return (
        <div className="group relative">
            {product.discountPercentage > 0 && (
                <div className="discount-badge">
                    -{Math.round(product.discountPercentage)}%
                </div>
            )}
            <div className="bg-white rounded-xl overflow-hidden border border-brand-cream-300 hover:border-brand-green-500 hover:shadow-xl transition-all duration-300 shadow-sm product-card">
                <Link to={`/product/${product.id}`} className="block overflow-hidden">
                    <div className="product-image-container">
                        <ImageFallback
                            src={imageUrl}
                            alt={product.name}
                            className="product-image"
                            fallbackSrc="/images/placeholder.svg"
                        />
                    </div>
                </Link>
                <div className="product-content">
                    <h3 className="product-title group-hover:text-brand-green-700 transition-colors line-clamp-2 leading-tight">
                        <Link to={`/product/${product.id}`} className="hover:text-brand-green-700">
                            {product.name}
                        </Link>
                    </h3>
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex flex-col">
                            {product.originalPrice && (
                                <span className="product-original-price">
                                    {product.originalPrice.toLocaleString()}₫
                                </span>
                            )}
                            <span className="product-price">
                                {product.price.toLocaleString()}₫
                            </span>
                        </div>
                    </div>
                    <Link 
                        to={`/product/${product.id}`}
                        className="btn-primary text-center mt-auto"
                    >
                        MUA NGAY
                    </Link>
                </div>
            </div>
        </div>
    );
};


const ProductGrid = ({ products, loading = false, itemsPerPage = 12 }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 product-grid">
                {[...Array(itemsPerPage)].map((_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (!products || products.length === 0) {
        return <p className="text-center col-span-full text-brand-brown-600">Không có sản phẩm nào được tìm thấy.</p>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 product-grid">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
