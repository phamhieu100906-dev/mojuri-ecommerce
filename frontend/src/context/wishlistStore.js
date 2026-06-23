import { create } from 'zustand';

export const useWishlistStore = create((set, get) => ({
  wishlist: (() => {
    try {
      const w = localStorage.getItem('wishlist');
      return w ? JSON.parse(w) : [];
    } catch {
      return [];
    }
  })(),

  addToWishlist: (product) => {
    set((state) => {
      const exists = state.wishlist.some((p) => p.id === product.id);
      if (exists) return {}; // Already in wishlist

      const newWishlist = [...state.wishlist, product];
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return { wishlist: newWishlist };
    });
  },

  removeFromWishlist: (productId) => {
    set((state) => {
      const newWishlist = state.wishlist.filter((p) => p.id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return { wishlist: newWishlist };
    });
  },

  toggleWishlist: (product) => {
    const { isInWishlist, addToWishlist, removeFromWishlist } = get();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  },

  isInWishlist: (productId) => {
    const { wishlist } = get();
    return wishlist.some((p) => p.id === productId);
  },

  clearWishlist: () => {
    localStorage.removeItem('wishlist');
    set({ wishlist: [] });
  },

  getWishlistCount: () => {
    const { wishlist } = get();
    return wishlist.length;
  }
}));
