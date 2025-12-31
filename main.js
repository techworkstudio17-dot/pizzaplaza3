// Pizza Data
const pizzas = [
    { id: 1, name: "Margherita", price: 12.99, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=300&fit=crop", description: "Classic tomato sauce, mozzarella, fresh basil" },
    { id: 2, name: "Pepperoni", price: 14.99, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=300&fit=crop", description: "Tomato sauce, mozzarella, pepperoni slices" },
    { id: 3, name: "BBQ Chicken", price: 16.99, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop", description: "BBQ sauce, grilled chicken, red onions" },
    { id: 4, name: "Veggie Supreme", price: 15.99, image: "https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=300&h=300&fit=crop", description: "Bell peppers, mushrooms, olives, tomatoes" },
    { id: 5, name: "Meat Lovers", price: 18.99, image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=300&h=300&fit=crop", description: "Pepperoni, sausage, bacon, ham" },
    { id: 6, name: "Hawaiian", price: 15.99, image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=300&fit=crop", description: "Ham, pineapple, mozzarella cheese" },
    { id: 7, name: "Four Cheese", price: 16.99, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=300&fit=crop", description: "Mozzarella, parmesan, gorgonzola, ricotta" },
    { id: 8, name: "Buffalo Chicken", price: 17.99, image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=300&h=300&fit=crop", description: "Buffalo sauce, chicken, blue cheese" }
];

// Cart State
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderPizzas();
    loadCart();
    updateCartUI();
    initNavbarScroll();
    initSmoothScroll();
});

// Initialize Navbar Scroll Effect
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

// Initialize Smooth Scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Render Pizza Cards
function renderPizzas() {
    const grid = document.getElementById('pizza-grid');
    if (!grid) return;
    
    grid.innerHTML = pizzas.map((pizza, index) => `
        <div class="pizza-card bg-gray-800 rounded-2xl overflow-hidden" style="animation: slideIn 0.6s ease-out ${index * 0.1}s forwards; opacity: 0;">
            <div class="relative overflow-hidden">
                <img src="${pizza.image}" alt="${pizza.name}" class="pizza-image w-full h-48 object-cover">
                <div class="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full font-bold">
                    $${pizza.price.toFixed(2)}
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold mb-2">${pizza.name}</h3>
                <p class="text-gray-400 text-sm mb-4">${pizza.description}</p>
                <button onclick="addToCart(${pizza.id})" class="order-btn w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Add to Cart
function addToCart(pizzaId) {
    const pizza = pizzas.find(p => p.id === pizzaId);
    const existingItem = cart.find(item => item.id === pizzaId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...pizza, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`${pizza.name} added to cart!`);

    // Animate cart badge
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.classList.add('bump');
        setTimeout(() => badge.classList.remove('bump'), 300);
    });
}

// Remove from Cart
function removeFromCart(pizzaId) {
    cart = cart.filter(item => item.id !== pizzaId);
    saveCart();
    updateCartUI();
    renderCartItems();
}

// Update Quantity
function updateQuantity(pizzaId, change) {
    const item = cart.find(item => item.id === pizzaId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(pizzaId);
            return;
        }
    }
    saveCart();
    updateCartUI();
    renderCartItems();
}

// Update Cart UI
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCount = document.getElementById('cart-count');
    const cartCountMobile = document.getElementById('cart-count-mobile');
    
    if (cartCount) cartCount.textContent = totalItems;
    if (cartCountMobile) cartCountMobile.textContent = totalItems;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = cart.length > 0 ? 3.99 : 0;
    const tax = subtotal * 0.1;
    const total = subtotal + deliveryFee + tax;

    const subtotalEl = document.getElementById('subtotal');
    const deliveryFeeEl = document.getElementById('delivery-fee');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (deliveryFeeEl) deliveryFeeEl.textContent = `$${deliveryFee.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Render Cart Items
function renderCartItems() {
    const container = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');

    if (!container || !emptyCart) return;

    if (cart.length === 0) {
        container.classList.add('hidden');
        emptyCart.classList.remove('hidden');
        return;
    }

    container.classList.remove('hidden');
    emptyCart.classList.add('hidden');

    container.innerHTML = cart.map(item => `
        <div class="bg-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center scale-in">
            <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-xl">
            <div class="flex-1 text-center sm:text-left">
                <h3 class="font-bold text-lg">${item.name}</h3>
                <p class="text-gray-400 text-sm">${item.description}</p>
                <p class="text-orange-500 font-bold mt-1">$${item.price.toFixed(2)}</p>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="updateQuantity(${item.id}, -1)" class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="font-bold text-lg w-8 text-center">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-400 transition-colors sm:ml-4">
                <i class="fas fa-trash text-xl"></i>
            </button>
        </div>
    `).join('');
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('pizzaCart', JSON.stringify(cart));
}

// Load Cart from LocalStorage
function loadCart() {
    const saved = localStorage.getItem('pizzaCart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

// Page Navigation
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const page = document.getElementById(`${pageName}-page`);
    if (page) {
        page.classList.add('active');
    }

    if (pageName === 'cart') {
        renderCartItems();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3000);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    showToast('Order placed successfully! 🎉');
    cart = [];
    saveCart();
    updateCartUI();
    renderCartItems();
}

// Navigate to Menu
function navigateToMenu() {
    showPage('home');
    setTimeout(() => {
        const menu = document.getElementById('menu');
        if (menu) {
            menu.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
}

// Apply Promo Code
function applyPromoCode() {
    const promoInput = document.getElementById('promo-input');
    if (promoInput && promoInput.value.trim()) {
        showToast('Promo code applied!');
    } else {
        showToast('Please enter a promo code');
    }
}

// Contact Form Submit
function submitContactForm(e) {
    e.preventDefault();
    showToast('Message sent successfully!');
    e.target.reset();
}
