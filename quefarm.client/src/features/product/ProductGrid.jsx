// src/features/product/ProductGrid.jsx
import { Link } from 'react-router-dom';
import { useContext, memo } from 'react';
import ImageFallback from '../../components/ImageFallback';
import { generateImageUrl } from '../../services/productService';
import { CartContext } from '../../context/CartContext';

/* ------------------------ Utils ------------------------ */
const formatVND = (n) => (typeof n === 'number' ? n.toLocaleString('vi-VN') + '₫' : '');

const calcDiscountPct = (product) => {
  if (product?.discountPercentage) return Math.round(product.discountPercentage);
  if (product?.originalPrice && product?.price) {
    return Math.max(0, Math.round((1 - product.price / product.originalPrice) * 100));
  }
  return 0;
};

/* --------------------- Loading Skeleton --------------------- */
const ProductCardSkeleton = () => (
  <div className="relative h-full">
    <div className="bg-white rounded-2xl overflow-hidden border border-brand-cream-300 shadow-sm h-full flex flex-col">
      <div className="aspect-square bg-brand-cream-200 animate-pulse" />
      <div className="p-3 flex-1 flex flex-col gap-2">
        <div className="h-5 bg-brand-cream-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-brand-cream-200 rounded animate-pulse w-1/2" />
        <div className="mt-auto h-10 bg-brand-cream-200 rounded-lg animate-pulse" />
      </div>
    </div>
  </div>
);

/* ------------------------ Product Card ------------------------ */
const ProductCard = memo(function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const imageUrl = generateImageUrl(product.productImages?.[0]?.imageUrl || product.imageUrl);
  const pct = calcDiscountPct(product);
  const outOfStock = product?.stock === 0 || product?.isOutOfStock;
  const rating = Number(product?.rating || 4.8);
  const ratingCount = product?.ratingCount;

  const handleAdd = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl,
      quantity: 1,
      originalPrice: product.originalPrice,
      discountPercentage: pct,
    });
  };

  return (
    <div className="group relative h-full">
      {/* Badges (top-left) */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {pct > 0 && (
          <span className="bg-red-500 text-white text-[11px] px-2 py-1 rounded-full font-semibold shadow">
            -{pct}%
          </span>
        )}
        {product?.isNew && (
          <span className="bg-emerald-600 text-white text-[11px] px-2 py-1 rounded-full font-semibold shadow">
            Mới
          </span>
        )}
      </div>

      {/* Rating (top-right) */}
      <div className="absolute top-2 right-2 z-10">
        <span className="bg-white/95 backdrop-blur px-2 py-1 rounded-full text-[11px] font-medium shadow border border-slate-200">
          <span aria-hidden>⭐</span> {rating.toFixed(1)}
          {ratingCount ? <span className="text-slate-500"> ({ratingCount})</span> : null}
        </span>
      </div>

      <div
        className={[
          'bg-white rounded-2xl overflow-hidden border shadow-sm h-full flex flex-col',
          'border-brand-cream-300 hover:border-brand-green-500 hover:shadow-lg transition-all duration-300',
        ].join(' ')}
      >
        {/* Image */}
        <Link to={`/product/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden">
            <ImageFallback
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              fallbackSrc="/images/placeholder.svg"
            />
            {outOfStock && (
              <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                <span className="text-white text-sm font-semibold px-3 py-1 bg-black/50 rounded-full">
                  Hết hàng
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-3 sm:p-3.5 flex-1 flex flex-col gap-2 font-[Poppins]">
          {/* Title */}
          <h3 className="text-[13.5px] sm:text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-brand-green-700 transition-colors">
            <Link to={`/product/${product.id}`} aria-label={product.name}>
              {product.name}
            </Link>
          </h3>

          {/* Meta: weight/variant & sold */}
          <div className="text-[11.5px] text-slate-500 flex items-center gap-2">
            {product?.variant || product?.weight ? (
              <span className="truncate">{product.variant || product.weight}</span>
            ) : null}
            {product?.sold ? (
              <>
                <span className="text-slate-300">•</span>
                <span>Đã bán {product.sold.toLocaleString('vi-VN')}</span>
              </>
            ) : null}
          </div>

          {/* Price block */}
          <div className="mt-1">
            {product.originalPrice ? (
              <div className="flex items-baseline gap-2">
                <span className="text-slate-400 line-through text-[12px]">
                  {formatVND(product.originalPrice)}
                </span>
                <span className="text-brand-green-700 font-bold text-[15px]">
                  {formatVND(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-brand-green-700 font-bold text-[15px]">
                {formatVND(product.price)}
              </span>
            )}
            {pct > 0 && product.originalPrice ? (
              <div className="text-[11px] text-emerald-700">
                Tiết kiệm {formatVND(product.originalPrice - product.price)}
              </div>
            ) : null}
          </div>

          {/* CTAs */}
          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock}
              className={[
                'btn-secondary btn-icon inline-flex items-center justify-center h-10 rounded-xl font-semibold',
                'focus:outline-none focus:ring-2 focus:ring-brand-green-600/30',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              ].join(' ')}
              aria-label="Thêm vào giỏ"
            >
              <span aria-hidden>🛒</span>
              <span>Thêm vào giỏ</span>
            </button>

            <Link
              to={outOfStock ? '#' : `/product/${product.id}`}
              onClick={(e) => outOfStock && e.preventDefault()}
              className={[
                'btn-primary btn-icon inline-flex items-center justify-center h-10 rounded-xl font-semibold text-center',
                'focus:outline-none focus:ring-2 focus:ring-brand-green-600/30',
                outOfStock ? 'opacity-50 pointer-events-none' : '',
              ].join(' ')}
              aria-disabled={outOfStock}
            >
              <span aria-hidden>⚡</span>
              <span>Mua ngay</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

/* ------------------------ Grid Wrapper ------------------------ */
const ProductGrid = ({ 
  products, 
  loading = false, 
  itemsPerPage = 12,
  containerClassName,
}) => {
  const defaultContainer = 'bg-[#f9f5f0] p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4';
  const container = containerClassName || defaultContainer;
  if (loading) {
    return (
      <div className={container}>
        {Array.from({ length: itemsPerPage }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <p className="text-center p-8 text-brand-brown-600">
        Không có sản phẩm nào được tìm thấy.
      </p>
    );
  }

  return (
    <div className={container}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;
