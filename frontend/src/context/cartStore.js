import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: (() => {
    try {
      const c = localStorage.getItem('cart');
      return c ? JSON.parse(c) : [];
    } catch {
      return [];
    }
  })(),

  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.product.id === product.id);
      let newCart;
      
      if (existingItem) {
        newCart = state.cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...state.cart, { product, quantity }];
      }
      
      localStorage.setItem('cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  removeFromCart: (productId) => {
    set((state) => {
      const newCart = state.cart.filter((item) => item.product.id !== productId);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        const newCart = state.cart.filter((item) => item.product.id !== productId);
        localStorage.setItem('cart', JSON.stringify(newCart));
        return { cart: newCart };
      }
      
      const newCart = state.cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      
      localStorage.setItem('cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ cart: [] });
  },

  getTotalPrice: () => {
    const { cart } = get();
    return cart.reduce((total, item) => {
      const price = item.product.salePrice !== null ? item.product.salePrice : item.product.price;
      return total + price * item.quantity;
    }, 0);
  },

  getCartCount: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
}));
