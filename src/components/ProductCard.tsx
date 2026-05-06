function ProductCard({product, onAddToCard} : any) {
    return (
        <>
        <article className="product-card" id="product-1">
            <div className="product-card__image-wrapper">
                <img src={product.image} alt="Air Max Sneakers" className="product-card__image" />
                <div className="product-card__badges"><span className="badge badge--new">New</span></div>
                <div className="product-card__actions">
                    <button className="product-action-btn" id="wish-1" aria-label="Wishlist">♡</button>
                    <button className="product-action-btn" id="quick-view-1" aria-label="Quick view">👁</button>
                </div>
                <button className="product-card__add-cart" id="add-cart-1" onClick={() => onAddToCard(product)}>Add to Cart</button>
            </div>
            <div className="product-card__info">
                <span className="product-card__category">{product.category}</span>
                <h3 className="product-card__name">{product.title}</h3>
                <div className="product-card__rating"><span className="stars">★★★★★</span><span className="reviews">(128)</span></div>
                <div className="product-card__pricing"><span className="product-card__price">${product.price}</span></div>
            </div>
        </article>
        </>
    )
}

export default ProductCard;