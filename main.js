// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
        this.loadFeaturedProducts();
        this.showCookiePopup();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showNotification('Product added to cart!');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartCount();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'alert alert-success position-fixed';
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Product Data
const products = [
    {
        id: 1,
        name: "PUBG Premium Battle Pass",
        price: 9.99,
        image: "images/battle-pass.jpg",
        category: "Battle Pass",
        description: "Unlock exclusive skins, emotes, and rewards with the premium battle pass.",
        badge: "Popular"
    },
    {
        id: 2,
        name: "Legendary AKM Skin",
        price: 4.99,
        image: "images/akm-skin.jpg",
        category: "Weapon Skins",
        description: "Rare legendary skin for the AKM assault rifle with unique animations.",
        badge: "Limited"
    },
    {
        id: 3,
        name: "Elite Player Outfit",
        price: 7.99,
        image: "images/elite-outfit.jpg",
        category: "Character Skins",
        description: "Premium elite outfit with custom animations and effects.",
        badge: "New"
    },
    {
        id: 4,
        name: "PUBG UC Credits",
        price: 19.99,
        image: "images/uc-credits.jpg",
        category: "Gaming Currency",
        description: "1000 UC credits for in-game purchases and premium content.",
        badge: "Best Value"
    },
    {
        id: 5,
        name: "Pro Gamer Bundle",
        price: 24.99,
        image: "images/pro-bundle.jpg",
        category: "Bundles",
        description: "Complete bundle including skins, emotes, and exclusive items.",
        badge: "Hot Deal"
    },
    {
        id: 6,
        name: "Victory Royale Emote",
        price: 2.99,
        image: "images/victory-emote.jpg",
        category: "Emotes",
        description: "Celebrate your wins with this exclusive victory emote.",
        badge: "Trending"
    }
];

// Initialize Cart
const cart = new ShoppingCart();

// Load Featured Products
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const featuredProducts = products.slice(0, 3);
    
    container.innerHTML = featuredProducts.map(product => `
        <div class="col-md-4">
            <div class="card bg-dark-card border-purple h-100 product-card">
                <div class="position-relative">
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}" 
                         style="height: 200px; object-fit: cover;">
                    <span class="badge badge-category position-absolute top-0 end-0 m-2">${product.badge}</span>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-white">${product.name}</h5>
                    <p class="card-text text-muted flex-grow-1">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="h5 text-purple mb-0">$${product.price}</span>
                        <button class="btn btn-purple btn-sm" onclick="cart.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                            <i class="fas fa-cart-plus me-1"></i>Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Cookie Management
function showCookiePopup() {
    if (!localStorage.getItem('cookiesAccepted')) {
        const cookiePopup = document.getElementById('cookie-popup');
        if (cookiePopup) {
            setTimeout(() => {
                cookiePopup.classList.add('show');
            }, 2000);
        }
    }
}

function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    const cookiePopup = document.getElementById('cookie-popup');
    if (cookiePopup) {
        cookiePopup.classList.remove('show');
    }
}

function declineCookies() {
    localStorage.setItem('cookiesAccepted', 'false');
    const cookiePopup = document.getElementById('cookie-popup');
    if (cookiePopup) {
        cookiePopup.classList.remove('show');
    }
}

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span class="loading"></span> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
                submitBtn.classList.remove('btn-gradient');
                submitBtn.classList.add('btn-success');
                
                // Reset form
                this.reset();
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('btn-success');
                    submitBtn.classList.add('btn-gradient');
                }, 3000);
            }, 1500);
        });
    }
});

// Search Functionality
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    return filteredProducts;
}

// Utility Functions
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load featured products
    loadFeaturedProducts();
    
    // Show cookie popup if not accepted
    showCookiePopup();
    
    // Update cart count
    cart.updateCartCount();
});

// Export cart for use in other pages
window.cart = cart;
window.products = products;