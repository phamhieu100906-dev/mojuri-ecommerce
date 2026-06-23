import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../context/cartStore';
import { useWishlistStore } from '../context/wishlistStore';

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist, wishlist } = useWishlistStore();
  const isFav = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    if (!isFav) {
      alert(`Đã thêm "${product.name}" vào mục yêu thích!`);
    } else {
      alert(`Đã xóa "${product.name}" khỏi mục yêu thích!`);
    }
  };

  const imageSrc = product.thumbnail.startsWith('http')
    ? product.thumbnail
    : `/${product.thumbnail}`;

  const hoverImageSrc = (() => {
    try {
      const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      if (Array.isArray(parsed) && parsed.length > 1) {
        return parsed[1].startsWith('http') ? parsed[1] : `/${parsed[1]}`;
      }
      return imageSrc;
    } catch {
      return imageSrc;
    }
  })();

  const hasSale = product.salePrice !== null && product.salePrice !== undefined;
  const salePercent = hasSale ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

  return (
    <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-4">
      <div className="products-entry clearfix product-wapper">
        <div className="products-thumb">
          <div className="product-lable">
            {hasSale && <div className="onsale">-{salePercent}%</div>}
            {product.stock > 15 && <div className="hot">Hot</div>}
          </div>
          <div className="product-thumb-hover">
            <Link to={`/product/${product.id}`}>
              <img 
                width="600" 
                height="600" 
                src={imageSrc} 
                className="post-image" 
                alt={product.name} 
                onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/product/3.jpg"}
              />
              <img 
                width="600" 
                height="600" 
                src={hoverImageSrc} 
                className="hover-image back" 
                alt={product.name} 
                onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/product/3-2.jpg"}
              />
            </Link>
          </div>
          <div className="product-button">
            <div className="btn-add-to-cart" data-title="Add to cart">
              <a rel="nofollow" href="#" className="product-btn button" onClick={handleAddToCart}>
                Add to cart
              </a>
            </div>
            <div className={`btn-wishlist ${isFav ? 'active' : ''}`} data-title={isFav ? "Remove from Wishlist" : "Wishlist"}>
              <button className={`product-btn ${isFav ? 'added' : ''}`} onClick={handleToggleWishlist}>
                {isFav ? "In Wishlist" : "Add to wishlist"}
              </button>
            </div>
            <div className="btn-compare" data-title="Compare">
              <button className="product-btn">Compare</button>
            </div>
            <span className="product-quickview" data-title="Quick View">
              <Link to={`/product/${product.id}`} className="quickview quickview-button">
                Quick View <i className="icon-search"></i>
              </Link>
            </span>
          </div>
          {product.stock <= 0 && (
            <div className="product-stock">
              <span className="stock">Out Of Stock</span>
            </div>
          )}
        </div>
        <div className="products-content">
          <div className="contents text-center">
            <div className="rating">
              <div className="star star-5"></div>
              <span className="count">(1 review)</span>
            </div>
            <h3 className="product-title">
              <Link to={`/product/${product.id}`}>{product.name}</Link>
            </h3>
            <span className="price">
              {hasSale ? (
                <>
                  <del aria-hidden="true"><span>${product.price}</span></del>
                  <ins><span>${product.salePrice}</span></ins>
                </>
              ) : (
                <span>${product.price}</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
