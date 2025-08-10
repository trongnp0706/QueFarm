import { useEffect, useMemo, useState } from 'react';
import { CartContext } from './CartContext';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const normalizeProductForCart = (product) => {
    const discountPercent = product.discountPercentage ?? product.discount ?? null;
    const parsedDiscount = discountPercent != null ? Number(discountPercent) : null;
    const basePrice = Number(product.price) || 0;

    // IMPORTANT: Backend price is already the effective/current price.
    // Do not re-apply discount. Only carry metadata for UI.
    return {
      ...product,
      price: basePrice,
      originalPrice: product.originalPrice ?? product.OriginalPrice ?? undefined,
      discount: parsedDiscount != null && !Number.isNaN(parsedDiscount) ? parsedDiscount : undefined,
    };
  };

  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
      const quantityToAdd = product.quantity && product.quantity > 0 ? product.quantity : 1;

      if (found) {
        // Only update quantity; keep existing pricing to avoid re-discounting
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }

      const normalized = normalizeProductForCart(product);
      return [...prev, { ...normalized, quantity: quantityToAdd }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const getTotalItems = useMemo(() => () => {
    return cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }, [cart]);

  const getTotalPrice = useMemo(() => () => {
    return cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity) || 0), 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
} 