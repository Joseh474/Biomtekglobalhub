// Global cart state
let cart = {
    items: [],
    total: 0
};

// Add this function to open the cart modal
function openCartModal() {
    const cartModal = document.getElementById('cart-modal'); // Ensure you have a cart modal in your HTML
    if (cartModal) {
        cartModal.classList.add('active');
    }
}


// Initialize on document load
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    setupEventListeners();
    initializePaymentSystem();
});

function initializeCart() {
    const savedCart = localStorage.getItem('biomtekCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

//  setupEventListeners function to include the cart button
function setupEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    // Cart button
    document.querySelector('.cart-button')?.addEventListener('click', openCartModal);

    // Close modals
    document.querySelectorAll('.close-modal, .close-payment').forEach(button => {
        button.addEventListener('click', closeModals);
    });
     // Continue shopping
     document.querySelector('.continue-shopping')?.addEventListener('click', closeModals);

    // Proceed to checkout
    document.querySelector('.proceed-checkout')?.addEventListener('click', openPaymentModal);
}

// Ensure you have a function to open the payment modal
function openPaymentModal() {
    if (cart.items.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    const paymentModal = document.getElementById('payment-modal');
    if (paymentModal) {
        paymentModal.classList.add('active');
    }
}
// Ensure you have a function to close the payment modal
function closePaymentModal() {
    const paymentModal = document.getElementById('payment-modal');
    if (paymentModal) {
        paymentModal.classList.remove('active');
    }
}

function handleAddToCart(e) {
    e.preventDefault();
    const productCard = this.closest('.product-card');
    const product = {
        id: productCard.dataset.productId,
        name: productCard.querySelector('h3').textContent,
        price: productCard.querySelector('.price').textContent,
        quantity: 1
    };
    addToCart(product);
}

function addToCart(product) {
    const existingItem = cart.items.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.items.push(product);
    }
    
    updateCart();
    showNotification('Item added to cart', 'success');
}

function updateCart() {
    localStorage.setItem('biomtekCart', JSON.stringify(cart));
    updateCartCount();
    updateCartTotal();
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.items.reduce((total, item) => total + item.quantity, 0);
    }
}

function updateCartTotal() {
    cart.total = cart.items.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.-]+/g, '')) || 0;
        return total + (price * item.quantity);
    }, 0);
}

function openCartModal() {
    if (cart.items.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    const cartModal = document.getElementById('cart-modal');
    const cartItems = cartModal.querySelector('.cart-items');
    const cartTotal = cartModal.querySelector('.cart-total span');

    // Clear previous items
    cartItems.innerHTML = '';

    // Add cart items with adjustment controls
    cart.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="item-details">
                <h4>${item.name}</h4>
                <p class="item-price">${item.price}</p>
            </div>
            <div class="item-controls">
                <button class="quantity-adjust" data-action="decrease" data-id="${item.id}">-</button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="quantity-adjust" data-action="increase" data-id="${item.id}">+</button>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(itemElement);

        // Add event listeners for quantity adjustment and remove
        itemElement.querySelectorAll('.quantity-adjust').forEach(button => {
            button.addEventListener('click', adjustQuantity);
        });
        itemElement.querySelector('.remove-item').addEventListener('click', removeItem);
    });

    cartTotal.textContent = cart.total.toFixed(2);
    cartModal.classList.add('active');
}

function adjustQuantity(e) {
    const itemId = e.target.dataset.id;
    const action = e.target.dataset.action;
    const item = cart.items.find(item => item.id === itemId);

    if (item) {
        if (action === 'increase') {
            item.quantity++;
        } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity--;
        }
        updateCart();
        openCartModal(); // Refresh cart display
    }
}

function removeItem(e) {
    const itemId = e.target.closest('.remove-item').dataset.id;
    cart.items = cart.items.filter(item => item.id !== itemId);
    updateCart();
    openCartModal(); // Refresh cart display
}

function proceedToCheckout() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.classList.remove('active');
    openPaymentModal();
}

function closeModals() {
    document.querySelectorAll('.modal, .payment-modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

function openPaymentModal() {
    if (cart.items.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    const paymentModal = document.getElementById('payment-modal');
    const orderItems = paymentModal.querySelector('.order-items');
    const orderTotal = paymentModal.querySelector('.order-total span');

    // Clear previous items
    orderItems.innerHTML = '';

    // Add cart items to modal
    cart.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <span class="item-name">${item.name}</span>
            <span class="item-quantity">x${item.quantity}</span>
            <span class="item-price">${item.price}</span>
        `;
        orderItems.appendChild(itemElement);
    });

    // Update total
    orderTotal.textContent = cart.total.toFixed(2);

    // Show modal
    paymentModal.classList.add('active');
}

function processPayment(paymentMethod) {
    showLoadingSpinner();

    // Simulate payment processing
    setTimeout(() => {
        hideLoadingSpinner();
        
        // Success scenario
        handleSuccessfulPayment();
        
        // You would normally handle different payment methods here
        switch(paymentMethod) {
            case 'paypal':
                // Redirect to PayPal
                break;
            case 'pesapal':
                // Redirect to PesaPal
                break;
            case 'card':
                // Show card form
                break;
        }
    }, 1500);
}

function handleSuccessfulPayment() {
    // Clear cart
    cart.items = [];
    updateCart();
    
    // Close payment modal
    const paymentModal = document.getElementById('payment-modal');
    paymentModal.classList.remove('active');
    
    // Show success message
    showNotification('Payment successful! Thank you for your purchase.', 'success');
}

function showLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    document.body.appendChild(spinner);
}

function hideLoadingSpinner() {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) spinner.remove();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Payment handling
function initializePaymentSystem() {
    // Add click handler for checkout button
    const checkoutButton = document.querySelector('.proceed-checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', openPaymentModal);
    }

    // Add click handlers for payment options
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Handle payment method selection
            handlePaymentMethod(this.dataset.method);
        });
    });

    // Add close handler for payment modal
    const closePaymentButton = document.querySelector('.close-payment');
    if (closePaymentButton) {
        closePaymentButton.addEventListener('click', closePaymentModal);
    }
}

function openPaymentModal() {
    if (cart.items.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    const paymentModal = document.getElementById('payment-modal');
    if (paymentModal) {
        paymentModal.classList.add('active');
    }
}

function closePaymentModal() {
    const paymentModal = document.getElementById('payment-modal');
    if (paymentModal) {
        paymentModal.classList.remove('active');
    }
}

function handlePaymentMethod(method) {
    clearPaymentForms();
    
    switch(method) {
        case 'google':
            showGooglePayForm();
            break;
        case 'paypal':
            showPayPalForm();
            break;
        case 'pesapal':
            showPesaPalForm();
            break;
        case 'card':
            showCardForm();
            break;
    }
}

function clearPaymentForms() {
    const paymentForms = document.querySelector('.payment-forms');
    if (paymentForms) {
        paymentForms.innerHTML = '';
    }
}

function showCardForm() {
    const formHTML = `
        <div class="payment-form card-form">
            <div class="form-group">
                <label>Card Number</label>
                <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="16">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Expiry Date</label>
                    <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5">
                </div>
                <div class="form-group">
                    <label>CVV</label>
                    <input type="text" id="card-cvv" placeholder="123" maxlength="3">
                </div>
            </div>
            <button class="process-payment" onclick="processCardPayment()">Pay Now</button>
        </div>
    `;
    
    const paymentForms = document.querySelector('.payment-forms');
    if (paymentForms) {
        paymentForms.innerHTML = formHTML;
    }
}

function showPayPalForm() {
    const formHTML = `
        <div class="payment-form paypal-form">
            <div id="paypal-button-container"></div>
            <button class="process-payment" onclick="processPayPalPayment()">Pay with PayPal</button>
        </div>
    `;
    
    const paymentForms = document.querySelector('.payment-forms');
    if (paymentForms) {
        paymentForms.innerHTML = formHTML;
    }
}

function showPesaPalForm() {
    const formHTML = `
        <div class="payment-form pesapal-form">
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="customer-email" required>
            </div>
            <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" id="customer-phone" required>
            </div>
            <button class="process-payment" onclick="processPesaPalPayment()">Continue to PesaPal</button>
        </div>
    `;
    
    const paymentForms = document.querySelector('.payment-forms');
    if (paymentForms) {
        paymentForms.innerHTML = formHTML;
    }
}

function showGooglePayForm() {
    const formHTML = `
        <div class="payment-form google-pay-form">
            <div id="google-pay-button-container"></div>
            <button class="process-payment" onclick="processGooglePayment()">Pay with Google Pay</button>
        </div>
    `;
    
    const paymentForms = document.querySelector('.payment-forms');
    if (paymentForms) {
        paymentForms.innerHTML = formHTML;
    }
}

// Initialize payment system when document loads
document.addEventListener('DOMContentLoaded', function() {
    initializePaymentSystem();
});


function proceedToCheckout() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.remove('active');
    }
    openPaymentModal();
}

function openPaymentModal() {
    if (cart.items.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    const paymentModal = document.getElementById('payment-modal');
    const orderItems = paymentModal.querySelector('.order-items');
    const orderTotal = paymentModal.querySelector('.order-total span');

    // Clear previous items
    orderItems.innerHTML = '';

    // Add cart items to payment modal
    cart.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <span class="item-name">${item.name}</span>
            <span class="item-quantity">x${item.quantity}</span>
            <span class="item-price">${item.price}</span>
        `;
        orderItems.appendChild(itemElement);
    });

    // Update the total amount
    orderTotal.textContent = cart.total.toFixed(2);

    // Show the payment modal
    paymentModal.classList.add('active');
}


document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('customer-name').value;
    const address = document.getElementById('customer-address').value;
    const email = document.getElementById('customer-email').value;

    // Prepare the order data
    const orderData = {
        customer: {
            name,
            address,
            email
        },
        products: cart.items, // Cart items
        total: cart.total // Total price
    };

    // Send the data to your backend
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            const result = await response.json();
            alert('Order placed successfully!');
            cart.clearCart(); // Clear the cart
            closeModal();
        } else {
            alert('Failed to place the order. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

