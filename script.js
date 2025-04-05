document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // 1. CART MANAGEMENT SYSTEM
    // =============================================
    
    // DOM Elements
    const cartModal = document.getElementById('cart-modal');
    const paymentModal = document.getElementById('payment-modal');
    const authModal = document.getElementById('auth-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    const proceedCheckoutBtn = document.querySelector('.proceed-checkout');
    const checkoutForm = document.getElementById('checkout-form');
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const backToCartBtn = document.querySelector('.back-to-cart');
    const cartButton = document.getElementById('cartButton');
    const cartDropdown = document.getElementById('cartDropdown');
    const closeCart = document.getElementById('closeCart');
    
    // State Management
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    
    // =============================================
    // 2. PRODUCTS DATA (would normally come from backend)
    // =============================================
    const products = {
        'uno-r3': { name: 'Arduino Uno R3', price: 1400, image: 'Arduino Uno R3.jpg' },
        'nano': { name: 'Arduino Nano', price: 1100, image: 'Arduino Nano.jpg' },
        'pro-mini': { name: 'Arduino Pro Mini', price: 700, image: 'Arduino Pro mini.jpg' },
        'lm35dz': { name: 'LM35DZ Temperature Sensor', price: 400, image: 'Lm 35 temperature sensor.jpg' },
        'dht': { name: 'DHT11/DHT22 Sensor', price: 300, image: 'DHT11 humidity and temperature sensor.jpg' },
        'pir': { name: 'PIR Motion Sensor', price: 250, image: 'PIR motion sensor.jpg' },
        'ldr': { name: 'Photoresistor (LDR)', price: 50, image: 'LDR.jpg' },
        'mq': { name: 'MQ Series Gas Sensor', price: 350, image: 'mq.jpg' },
        'sound': { name: 'Microphone Module', price: 200, image: 'mic module.jpg' },
        'fingerprint': { name: 'GT511C1R Fingerprint Scanner', price: 1500, image: 'gt5sensor.jpg' },
        'pulse': { name: 'Pulse Sensor', price: 400, image: 'pulse sensor.jpg' },
        'max30102': { name: 'MAX30102 Pulse Oximeter', price: 300, image: 'max ox.jpg' },
        'muscle-sensor': { name: 'Muscle Sensor', price: 450, image: 'muscle.jpg' },
        'l298n': { name: 'L298N Motor Driver', price: 500, image: 'L298N Motor Drive.jpg' },
        '5v-relay': { name: '5V Relay Module', price: 250, image: 'relay.jpg' },
        'hc-06': { name: 'HC-06 Bluetooth Module', price: 600, image: 'HC-05 Bluetooth Module.jpg' },
        'resistors': { name: 'Resistors', price: 10, image: 'resistor.jpg' },
        'capacitors': { name: 'Capacitors', price: 20, image: 'capasitor.jpg' },
        'diodes': { name: 'Diodes', price: 10, image: 'diodes.jpg' },
        'transistors': { name: 'Transistors', price: 10, image: 'transistors.jpg' },
        'power-supply-module': { name: 'Power Supply Module', price: 250, image: 'powersuply.jpg' },
        'project-enclosure': { name: 'Project Enclosure', price: 200, image: 'case.jpg' },
        'solderable-breadboard': { name: 'Solderable Breadboard', price: 150, image: 'solderboard.jpg' },
        'matrix-keypad': { name: '4x5 Matrix Keypad', price: 500, image: '4x matrixboard.jpg' },
        'jumper-wires': { name: 'Jumper Wires Pack', price: 0, image: 'jumper .jpg' },
        'robot-wheels': { name: 'Robot Wheels', price: 150, image: 'wheels.jpg' },
        'dc-motors': { name: 'DC Motors 3-6V', price: 300, image: 'motor.jpg' }
    };
    
    // =============================================
    // 3. CART FUNCTIONALITY
    // =============================================
    
    // Initialize cart
    function initCart() {
        updateCartUI();
        attachAddToCartListeners();
    }
    
    // Add to cart functionality
    function attachAddToCartListeners() {
        document.querySelectorAll('.buy-button').forEach(button => {
            button.addEventListener('click', function(e) {
                const productCard = e.target.closest('.product-card');
                const productId = productCard.dataset.productId;
                
                if (products[productId]) {
                    addToCart(productId);
                    showNotification(`${products[productId].name} added to cart!`);
                }
            });
        });
    }
    
    function addToCart(productId) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                quantity: 1,
                ...products[productId]
            });
        }
        
        saveCart();
        updateCartUI();
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartUI();
    }
    
    function updateQuantity(productId, newQuantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity > 0) {
                item.quantity = newQuantity;
            } else {
                removeFromCart(productId);
            }
            saveCart();
            updateCartUI();
        }
    }
    
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    function calculateCartTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    function updateCartUI() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotalElement = document.querySelector('.cart-total span');
        const cartCountElement = document.querySelector('.cart-count');
        const orderItemsContainer = document.querySelector('.order-items');
        const orderTotalElement = document.querySelector('.order-total span');
        
        // Update cart count
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = itemCount;
        
        // Update cart modal
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            proceedCheckoutBtn.disabled = true;
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-info">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <h4>${item.name}</h4>
                            <p class="item-price">Ksh ${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="item-controls">
                        <button class="quantity-btn minus">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                        <button class="remove-item">×</button>
                    </div>
                </div>
            `).join('');
            
            // Add event listeners to quantity buttons
            document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                btn.addEventListener('click', function() {
                    const productId = this.closest('.cart-item').dataset.id;
                    const item = cart.find(item => item.id === productId);
                    if (item) updateQuantity(productId, item.quantity - 1);
                });
            });
            
            document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                btn.addEventListener('click', function() {
                    const productId = this.closest('.cart-item').dataset.id;
                    const item = cart.find(item => item.id === productId);
                    if (item) updateQuantity(productId, item.quantity + 1);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    const productId = this.closest('.cart-item').dataset.id;
                    removeFromCart(productId);
                });
            });
            
            proceedCheckoutBtn.disabled = false;
        }
        
        // Update totals
        const total = calculateCartTotal();
        cartTotalElement.textContent = total.toFixed(2);
        
        // Update order summary
        if (orderItemsContainer) {
            orderItemsContainer.innerHTML = cart.map(item => `
                <div class="order-item">
                    <span>${item.name} (${item.quantity})</span>
                    <span>Ksh ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');
            
            orderTotalElement.textContent = total.toFixed(2);
        }
    }
    
    // =============================================
    // 4. MODAL MANAGEMENT
    // =============================================
    
    function toggleModal(modal) {
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
        document.body.style.overflow = modal.style.display === 'block' ? 'hidden' : 'auto';
    }
    
    function showCartModal() {
        toggleModal(cartModal);
    }
    
    function showPaymentModal() {
        toggleModal(paymentModal);
    }
    
    function showAuthModal() {
        toggleModal(authModal);
    }
    
    function closeAllModals() {
        [cartModal, paymentModal, authModal].forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }
    
    // =============================================
    // 5. AUTHENTICATION SYSTEM
    // =============================================
    
    function loginUser(email, password) {
        // In a real app, this would be an API call
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return true;
        }
        return false;
    }
    
    function registerUser(name, email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.some(u => u.email === email)) {
            return false; // Email exists
        }
        
        const newUser = { 
            id: Date.now(), 
            name, 
            email, 
            password,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return true;
    }
    
    function logoutUser() {
        currentUser = null;
        localStorage.removeItem('currentUser');
    }
    
    function checkAuth() {
        return currentUser !== null;
    }
    
    // =============================================
    // 6. CHECKOUT PROCESS
    // =============================================
    
    function proceedToCheckout() {
        if (checkAuth()) {
            toggleModal(cartModal);
            showPaymentModal();
        } else {
            toggleModal(cartModal);
            showAuthModal();
        }
    }
    
    function completeOrder(orderData) {
        // In a real app, this would submit to your backend
        console.log('Order completed:', orderData);
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartUI();
        
        // Show confirmation
        showNotification('Order placed successfully!');
        
        // Close modals
        closeAllModals();
    }
    
    // =============================================
    // 7. UI HELPERS
    // =============================================
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // =============================================
    // 8. EVENT LISTENERS
    // =============================================
    
    // Cart button
    cartButton.addEventListener('click', showCartModal);
    
    // Close buttons
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            toggleModal(modal);
        });
    });
    
    // Continue shopping
    continueShoppingBtn.addEventListener('click', () => toggleModal(cartModal));
    
    // Proceed to checkout
    proceedCheckoutBtn.addEventListener('click', proceedToCheckout);
    
    // Back to cart from payment
    backToCartBtn.addEventListener('click', () => {
        toggleModal(paymentModal);
        showCartModal();
    });
    
    // Close cart dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.cart-container') && !e.target.closest('.cart-button') && 
            cartDropdown.classList.contains('active')) {
            cartDropdown.classList.remove('active');
        }
    });
    
    // Auth tabs
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });
    
    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    });
    
    // Login form
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('#login-email').value;
        const password = this.querySelector('#login-password').value;
        
        if (loginUser(email, password)) {
            showNotification('Login successful!');
            toggleModal(authModal);
            showPaymentModal();
            this.reset();
        } else {
            showNotification('Invalid email or password');
        }
    });
    
    // Register form
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.querySelector('#register-name').value;
        const email = this.querySelector('#register-email').value;
        const password = this.querySelector('#register-password').value;
        const confirmPassword = this.querySelector('#register-confirm').value;
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match');
            return;
        }
        
        if (registerUser(name, email, password)) {
            showNotification('Registration successful! You are now logged in.');
            toggleModal(authModal);
            showPaymentModal();
            this.reset();
        } else {
            showNotification('Email already registered');
        }
    });
    
    // Checkout form
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const shippingAddress = this.querySelector('#shipping-address').value;
        const paymentMethod = this.querySelector('#payment-method').value;
        
        if (!shippingAddress || !paymentMethod) {
            showNotification('Please fill all required fields');
            return;
        }
        
        const orderData = {
            user: currentUser,
            items: cart,
            shippingAddress,
            paymentMethod,
            total: calculateCartTotal(),
            date: new Date().toISOString()
        };
        
        completeOrder(orderData);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            toggleModal(e.target);
        }
    });
    
    // Initialize
    initCart();
});
