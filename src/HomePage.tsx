import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { jwtDecode } from 'jwt-decode';

function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [authToken, setAuthToken] = useState('');
    const [activeUser, setActiveUser] = useState<{ id: number, userName: string }>()
    const [loginStatus, setLoginStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [cartItems, setCartItems] = useState([]);

    const fetchCartItems = () => {
        fetch('https://fakestoreapi.com/carts')
            .then(res => res.json())
            .then(data => {
                setCartItems(data);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    useEffect(()=>{
        // Header scroll effect
        const header = document.getElementById('header');
        window.addEventListener('scroll', () => {
            header.classList.toggle('header--scrolled', window.scrollY > 50);
        });

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.filter-tab').forEach(t => { t.classList.remove('filter-tab--active'); t.setAttribute('aria-selected','false'); });
                tab.classList.add('filter-tab--active');
                tab.setAttribute('aria-selected', 'true');
            });
        });

        // Back to top
        const backToTop = document.getElementById('back-to-top');
        window.addEventListener('scroll', () => backToTop.classList.toggle('back-to-top--visible', window.scrollY > 400));

        // Newsletter
        document.getElementById('newsletter-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('newsletter-submit');
            btn.textContent = '✓ Subscribed!';
            btn.style.background = 'linear-gradient(135deg, #059669, #34d399)';
        });

        // Countdown timer
        setInterval(() => {
            const s = document.getElementById('seconds');
            const m = document.getElementById('minutes');
            const h = document.getElementById('hours');
            let sv = parseInt(s.textContent) - 1;
            let mv = parseInt(m.textContent);
            let hv = parseInt(h.textContent);
            if (sv < 0) { sv = 59; mv--; }
            if (mv < 0) { mv = 59; hv--; }
            if (hv < 0) hv = 23;
            h.textContent = String(hv).padStart(2,'0');
            m.textContent = String(mv).padStart(2,'0');
            s.textContent = String(sv).padStart(2,'0');
        }, 1000);

        // Wishlist toggle
        document.querySelectorAll('[id^="wish-"]').forEach(btn => {
            btn.addEventListener('click', () => btn.classList.toggle('wishlisted'));
        });
    },[]);

    const backToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleSearchBar = (showSearchBar: boolean) => {
        const searchBar = document.getElementById('search-bar')
        if (searchBar) {
            if (showSearchBar) {
                searchBar.classList.add('search-bar--open');
                document.getElementById('search-input').focus();
            } else {
                searchBar.classList.remove('search-bar--open');
            }
        }
    }

    const fetchProducts = () => {
        fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => setFeaturedProducts(data.slice(0,4)));
        fetch('https://fakestoreapi.com/users')
    }

    const login = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        const credentials = { 'username': event.target[0].value, 'password': event.target[1].value};
        setLoginStatus('loading');
        fetch('https://fakestoreapi.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        })
        .then(res => res.json())
        .then(res => {
            if (res.token) {
                setAuthToken(res.token);
                localStorage.setItem('authToken', res.token)
                setLoginStatus('success');
                setTimeout(() => {
                    setShowLoginModal(false);
                    setLoginStatus('idle');
                }, 1500);
            } else {
                setLoginStatus('error');
            }
        })
        .catch(() => setLoginStatus('error'));
    }

    const fetchUserInfo = () => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            const {sub, user} = jwtDecode<{ sub: number, user: 'string' }>(authToken);
            setActiveUser({id: sub, userName: user})
        }
    };

    const onAddToCard = (product) => {
        const authToken = localStorage.getItem('authToken');
        const {sub: userId} = jwtDecode(authToken) as any;

        fetch('https://fakestoreapi.com/carts', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: Number(Math.random().toFixed(3)),
                userId,
                product
            })
        }).then(fetchCartItems)
    };

    useEffect(() => {
        fetchProducts();
        fetchUserInfo();
    },[]);
    return (
        <>
            {/* <!-- HEADER --> */}
            <header className="header" id="header">
                <div className="container header__inner">
                <a href="#" className="logo" id="logo">Nova<span>Mart</span></a>
                <nav className="nav" id="main-nav" aria-label="Main navigation">
                    <ul className="nav__list">
                    <li><a href="#" className="nav__link nav__link--active">Home</a></li>
                    <li><a href="#" className="nav__link">Shop</a></li>
                    <li><a href="#" className="nav__link">Collections</a></li>
                    <li><a href="#" className="nav__link">Deals</a></li>
                    <li><a href="#" className="nav__link">About</a></li>
                    </ul>
                </nav>
                <div className="header__actions">
                    <button className="icon-btn" id="search-btn" aria-label="Search" onClick={() => toggleSearchBar(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </button>
                    <button className="icon-btn" id="wishlist-btn" aria-label="Wishlist">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </button>
                    <button className="icon-btn cart-btn" id="cart-btn" aria-label="Cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    <span className="cart-badge" id="cart-badge">3</span>
                    </button>

                    {/* Account Dropdown — CSS only, no JS */}
                    <div className="account-menu" id="account-menu">
                        <button className="icon-btn account-trigger" id="account-btn" aria-label="Account" aria-haspopup="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        </button>
                        <div className="account-dropdown" id="account-dropdown" role="menu">
                            <div className="account-dropdown__header">
                                <div className="account-dropdown__avatar">{activeUser?.userName ? activeUser.userName[0].toUpperCase() : 'G'}</div>
                                <div>
                                    <strong className="account-dropdown__name">{ activeUser?.userName ? activeUser.userName : 'Guest User'}</strong>
                                    <span className="account-dropdown__email">Sign in to your account</span>
                                </div>
                            </div>
                            <div className="account-dropdown__divider"></div>
                            <a href="#" className="account-dropdown__item" id="account-login" role="menuitem" onClick={(e) => { e.preventDefault(); setShowLoginModal(true); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                                Login
                            </a>
                            <a href="#" className="account-dropdown__item" id="account-profile" role="menuitem">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                My Account
                            </a>
                            <a href="#" className="account-dropdown__item" id="account-orders" role="menuitem">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
                                My Orders
                            </a>
                            <a href="#" className="account-dropdown__item" id="account-wishlist" role="menuitem">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                                Wishlist
                            </a>
                            <div className="account-dropdown__divider"></div>
                            <a href="#" className="account-dropdown__item account-dropdown__item--danger" id="account-logout" role="menuitem">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                Logout
                            </a>
                        </div>
                    </div>
                </div>
                </div>
                <div className="search-bar" id="search-bar">
                <div className="container">
                    <input type="search" id="search-input" className="search-bar__input" placeholder="Search for products, brands, categories..." />
                    <button className="search-bar__close" id="search-close" aria-label="Close" onClick={()=>{toggleSearchBar(false)}}>✕</button>
                </div>
                </div>
            </header>

            <main>

                {/* <!-- HERO --> */}
                <section className="hero" id="hero">
                <div className="hero__bg-grid"></div>
                <div className="container hero__inner">
                    <div className="hero__content">
                    <span className="hero__badge">🔥 New Season Drop</span>
                    <h1 className="hero__title">Shop the <br /><span className="hero__title--gradient">Future of</span><br />Fashion</h1>
                    <p className="hero__subtitle">Discover curated collections from the world's top brands. Exclusive deals, free shipping on orders over $50.</p>
                    <div className="hero__actions">
                        <a href="#" className="btn btn--primary" id="hero-shop-btn">Shop Now</a>
                        <a href="#" className="btn btn--ghost" id="hero-explore-btn">Explore Deals</a>
                    </div>
                    <div className="hero__stats">
                        <div className="hero__stat"><strong>50K+</strong><span>Products</span></div>
                        <div className="hero__stat-divider"></div>
                        <div className="hero__stat"><strong>4.9★</strong><span>Rating</span></div>
                        <div className="hero__stat-divider"></div>
                        <div className="hero__stat"><strong>2M+</strong><span>Happy Customers</span></div>
                    </div>
                    </div>
                    <div className="hero__visual">
                    <div className="hero__image-wrapper">
                        <div className="hero__glow"></div>
                        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80" alt="Fashion collection" className="hero__image" id="hero-image" />
                        <div className="hero__floating-card hero__floating-card--1">
                        <span className="floating-card__icon">✅</span>
                        <div><strong>Order Confirmed!</strong><p>Your package is on the way</p></div>
                        </div>
                        <div className="hero__floating-card hero__floating-card--2">
                        <span className="floating-card__icon">⚡</span>
                        <div><strong>Flash Sale</strong><p>Up to 60% off today</p></div>
                        </div>
                    </div>
                    </div>
                </div>
                </section>

                {/* <!-- TICKER --> */}
                <div className="ticker" id="ticker">
                <div className="ticker__track">
                    <span>🚚 Free Shipping on orders over $50</span>
                    <span>✨ New arrivals every Monday</span>
                    <span>🎁 Gift wrapping available</span>
                    <span>💳 Buy now, pay later with Klarna</span>
                    <span>🔄 Easy 30-day returns</span>
                    <span>🚚 Free Shipping on orders over $50</span>
                    <span>✨ New arrivals every Monday</span>
                    <span>🎁 Gift wrapping available</span>
                    <span>💳 Buy now, pay later with Klarna</span>
                    <span>🔄 Easy 30-day returns</span>
                </div>
                </div>

                {/* <!-- CATEGORIES --> */}
                <section className="categories section" id="categories">
                <div className="container">
                    <div className="section-header">
                    <span className="section-tag">Browse by</span>
                    <h2 className="section-title">Top Categories</h2>
                    <a href="#" className="section-link">View all →</a>
                    </div>
                    <div className="categories__grid">
                    <a href="#" className="category-card category-card--large" id="cat-fashion">
                        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80" alt="Fashion" className="category-card__image" />
                        <div className="category-card__overlay"><h3 className="category-card__name">Fashion</h3><span className="category-card__count">1,240 items</span></div>
                    </a>
                    <a href="#" className="category-card" id="cat-electronics">
                        <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80" alt="Electronics" className="category-card__image" />
                        <div className="category-card__overlay"><h3 className="category-card__name">Electronics</h3><span className="category-card__count">890 items</span></div>
                    </a>
                    <a href="#" className="category-card" id="cat-beauty">
                        <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80" alt="Beauty" className="category-card__image" />
                        <div className="category-card__overlay"><h3 className="category-card__name">Beauty</h3><span className="category-card__count">530 items</span></div>
                    </a>
                    <a href="#" className="category-card" id="cat-home">
                        <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" alt="Home & Living" className="category-card__image" />
                        <div className="category-card__overlay"><h3 className="category-card__name">Home & Living</h3><span className="category-card__count">720 items</span></div>
                    </a>
                    <a href="#" className="category-card" id="cat-sports">
                        <img src="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80" alt="Sports" className="category-card__image" />
                        <div className="category-card__overlay"><h3 className="category-card__name">Sports</h3><span className="category-card__count">410 items</span></div>
                    </a>
                    </div>
                </div>
                </section>

                {/* <!-- FEATURED PRODUCTS --> */}
                <section className="products section" id="featured-products">
                <div className="container">
                    <div className="section-header">
                    <span className="section-tag">Handpicked for you</span>
                    <h2 className="section-title">Featured Products</h2>
                    <a href="#" className="section-link" id="all-products-link">View all →</a>
                    </div>
                    <div className="products__filters" role="tablist">
                    <button className="filter-tab filter-tab--active" id="tab-all" role="tab" aria-selected="true">All</button>
                    <button className="filter-tab" id="tab-new" role="tab" aria-selected="false">New Arrivals</button>
                    <button className="filter-tab" id="tab-trending" role="tab" aria-selected="false">Trending</button>
                    <button className="filter-tab" id="tab-sale" role="tab" aria-selected="false">On Sale</button>
                    </div>
                    <div className="products__grid" id="products-grid">

                        {featuredProducts.map(product => {
                            return (
                                <ProductCard product={product} onAddToCard={onAddToCard} key={product.id} />
                            )
                        })}

                    </div>
                </div>
                </section>

                {/* <!-- PROMO BANNER --> */}
                <section className="promo-banner section" id="promo-banner">
                <div className="container">
                    <div className="promo-banner__inner">
                    <div className="promo-banner__content">
                        <span className="promo-banner__tag">Limited Time</span>
                        <h2 className="promo-banner__title">Summer Sale — Up to 60% Off</h2>
                        <p className="promo-banner__subtitle">Don't miss out on our biggest sale of the year across all categories.</p>
                        <div className="promo-banner__countdown" id="countdown">
                        <div className="countdown-unit"><span className="countdown-value" id="hours">12</span><span className="countdown-label">Hours</span></div>
                        <span className="countdown-separator">:</span>
                        <div className="countdown-unit"><span className="countdown-value" id="minutes">34</span><span className="countdown-label">Mins</span></div>
                        <span className="countdown-separator">:</span>
                        <div className="countdown-unit"><span className="countdown-value" id="seconds">56</span><span className="countdown-label">Secs</span></div>
                        </div>
                        <a href="#" className="btn btn--primary" id="promo-shop-btn">Shop the Sale</a>
                    </div>
                    <div className="promo-banner__visual">
                        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80" alt="Summer Sale" className="promo-banner__image" />
                    </div>
                    </div>
                </div>
                </section>

                {/* <!-- BRANDS --> */}
                <section className="brands section" id="brands">
                <div className="container">
                    <div className="section-header section-header--centered">
                    <span className="section-tag">Trusted partners</span>
                    <h2 className="section-title">Featured Brands</h2>
                    </div>
                    <div className="brands__grid">
                    <div className="brand-logo" id="brand-1">Nike</div>
                    <div className="brand-logo" id="brand-2">Adidas</div>
                    <div className="brand-logo" id="brand-3">Apple</div>
                    <div className="brand-logo" id="brand-4">Samsung</div>
                    <div className="brand-logo" id="brand-5">Zara</div>
                    <div className="brand-logo" id="brand-6">H&M</div>
                    </div>
                </div>
                </section>

                {/* <!-- TESTIMONIALS --> */}
                <section className="testimonials section" id="testimonials">
                <div className="container">
                    <div className="section-header section-header--centered">
                    <span className="section-tag">What they say</span>
                    <h2 className="section-title">Customer Reviews</h2>
                    </div>
                    <div className="testimonials__grid">
                    <article className="testimonial-card" id="testimonial-1">
                        <div className="testimonial-card__stars">★★★★★</div>
                        <p className="testimonial-card__text">"Absolutely love this store! The quality is outstanding and shipping was super fast. Definitely my go-to for online shopping."</p>
                        <div className="testimonial-card__author">
                        <div className="testimonial-card__avatar" style={{background: "linear-gradient(135deg, #a78bfa, #6d28d9)"}}>S</div>
                        <div><strong>Sarah Mitchell</strong><span>Verified Buyer</span></div>
                        </div>
                    </article>
                    <article className="testimonial-card" id="testimonial-2">
                        <div className="testimonial-card__stars">★★★★★</div>
                        <p className="testimonial-card__text">"Incredible selection and the customer service was top notch. Had an issue and it was resolved in minutes. 10/10!"</p>
                        <div className="testimonial-card__author">
                        <div className="testimonial-card__avatar" style={{background: "linear-gradient(135deg, #34d399, #059669)"}}>J</div>
                        <div><strong>James Rodriguez</strong><span>Verified Buyer</span></div>
                        </div>
                    </article>
                    <article className="testimonial-card" id="testimonial-3">
                        <div className="testimonial-card__stars">★★★★★</div>
                        <p className="testimonial-card__text">"The monthly deals are insane! I've saved hundreds of dollars. The checkout is a breeze. Highly recommend to everyone!"</p>
                        <div className="testimonial-card__author">
                        <div className="testimonial-card__avatar" style={{background: "linear-gradient(135deg, #f59e0b, #d97706)"}}>A</div>
                        <div><strong>Aisha Khan</strong><span>Verified Buyer</span></div>
                        </div>
                    </article>
                    </div>
                </div>
                </section>

                {/* <!-- NEWSLETTER --> */}
                <section className="newsletter section" id="newsletter">
                <div className="container">
                    <div className="newsletter__inner">
                    <div className="newsletter__content">
                        <h2 className="newsletter__title">Get Exclusive Deals 🎁</h2>
                        <p className="newsletter__subtitle">Subscribe and get 15% off your first order, plus first access to new arrivals and flash sales.</p>
                    </div>
                    <form className="newsletter__form" id="newsletter-form">
                        <input type="email" id="newsletter-email" name="email" className="newsletter__input" placeholder="Enter your email address" required />
                        <button type="submit" className="btn btn--primary" id="newsletter-submit">Subscribe</button>
                    </form>
                    <p className="newsletter__disclaimer">No spam, ever. Unsubscribe at any time.</p>
                    </div>
                </div>
                </section>

            </main>

            {/* <!-- FOOTER --> */}
            <footer className="footer" id="footer">
                <div className="container">
                <div className="footer__grid">
                    <div className="footer__brand">
                    <a href="#" className="logo footer__logo">Nova<span>Mart</span></a>
                    <p className="footer__tagline">Your premium destination for the latest trends, gadgets, and lifestyle products.</p>
                    <div className="footer__socials">
                        <a href="#" className="social-link" id="social-instagram" aria-label="Instagram">IG</a>
                        <a href="#" className="social-link" id="social-twitter" aria-label="Twitter">TW</a>
                        <a href="#" className="social-link" id="social-facebook" aria-label="Facebook">FB</a>
                    </div>
                    </div>
                    <div className="footer__links-group">
                    <h4 className="footer__heading">Shop</h4>
                    <ul className="footer__links">
                        <li><a href="#" className="footer__link">New Arrivals</a></li>
                        <li><a href="#" className="footer__link">Best Sellers</a></li>
                        <li><a href="#" className="footer__link">Sale Items</a></li>
                        <li><a href="#" className="footer__link">Gift Cards</a></li>
                    </ul>
                    </div>
                    <div className="footer__links-group">
                    <h4 className="footer__heading">Support</h4>
                    <ul className="footer__links">
                        <li><a href="#" className="footer__link">Help Center</a></li>
                        <li><a href="#" className="footer__link">Shipping Info</a></li>
                        <li><a href="#" className="footer__link">Returns</a></li>
                        <li><a href="#" className="footer__link">Track Order</a></li>
                    </ul>
                    </div>
                    <div className="footer__links-group">
                    <h4 className="footer__heading">Company</h4>
                    <ul className="footer__links">
                        <li><a href="#" className="footer__link">About Us</a></li>
                        <li><a href="#" className="footer__link">Careers</a></li>
                        <li><a href="#" className="footer__link">Press</a></li>
                        <li><a href="#" className="footer__link">Sustainability</a></li>
                    </ul>
                    </div>
                </div>
                <div className="footer__bottom">
                    <p className="footer__copy">© 2026 NovaMart. All rights reserved.</p>
                    <div className="footer__legal">
                    <a href="#" className="footer__link">Privacy Policy</a>
                    <a href="#" className="footer__link">Terms of Service</a>
                    </div>
                </div>
                </div>
            </footer>
            
            <button className="back-to-top" id="back-to-top" aria-label="Back to top" onClick={backToTop}>↑</button>

            {/* ============ LOGIN MODAL ============ */}
            <div className={`login-modal${showLoginModal ? ' login-modal--open' : ''}`} id="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
                {/* Clicking the backdrop overlay closes the modal */}
                <div className="login-modal__overlay" aria-label="Close modal" onClick={() => setShowLoginModal(false)}></div>

                <div className="login-modal__box" onClick={(e) => e.stopPropagation()}>
                    {/* Close button */}
                    <button className="login-modal__close" id="login-modal-close" aria-label="Close" onClick={() => setShowLoginModal(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>

                    {/* Header */}
                    <div className="login-modal__header">
                        <div className="login-modal__logo-mark">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <h2 className="login-modal__title" id="login-modal-title">Welcome back</h2>
                        <p className="login-modal__subtitle">Sign in to your NovaMart account</p>
                    </div>

                    {/* Social logins */}
                    <div className="login-modal__socials">
                        <a href="#" className="login-modal__social-btn" id="login-google">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                            Continue with Google
                        </a>
                        <a href="#" className="login-modal__social-btn" id="login-github">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                            Continue with GitHub
                        </a>
                    </div>

                    <div className="login-modal__divider"><span>or sign in with email</span></div>

                    {/* Form */}
                    <form className="login-modal__form" id="login-form" action="#" method="post" onSubmit={login}>
                        <div className="login-modal__field">
                            <label className="login-modal__label" htmlFor="login-email">Email address</label>
                            <div className="login-modal__input-wrap">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="login-modal__input-icon"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                <input type="text" id="login-email" name="email" className="login-modal__input" placeholder="you@example.com" autoComplete="email" required />
                            </div>
                        </div>
                        <div className="login-modal__field">
                            <div className="login-modal__label-row">
                                <label className="login-modal__label" htmlFor="login-password">Password</label>
                                <a href="#" className="login-modal__forgot" id="forgot-password">Forgot password?</a>
                            </div>
                            <div className="login-modal__input-wrap">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="login-modal__input-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                <input type="password" id="login-password" name="password" className="login-modal__input" placeholder="••••••••" autoComplete="current-password" required />
                            </div>
                        </div>
                        <label className="login-modal__remember" htmlFor="login-remember">
                            <input type="checkbox" id="login-remember" name="remember" />
                            <span>Keep me signed in</span>
                        </label>
                        {/* Status alert */}
                        {loginStatus === 'success' && (
                            <div className="login-modal__alert login-modal__alert--success" id="login-alert-success" role="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                                Login successful! Welcome back.
                            </div>
                        )}
                        {loginStatus === 'error' && (
                            <div className="login-modal__alert login-modal__alert--error" id="login-alert-error" role="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Invalid username or password. Please try again.
                            </div>
                        )}
                        <button
                            type="submit"
                            className={`login-modal__submit${loginStatus === 'loading' ? ' login-modal__submit--loading' : ''}`}
                            id="login-submit"
                            disabled={loginStatus === 'loading'}
                        >
                            {loginStatus === 'loading' ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>

                    <p className="login-modal__signup">Don't have an account? <a href="#" id="signup-link">Create one free</a></p>
                </div>
            </div>
        </>
    )
}

export default HomePage;