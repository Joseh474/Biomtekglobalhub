// Add this function to open the cart modal
function openCartModal() {
    const cartModal = document.getElementById('cart-modal'); // Ensure you have a cart modal in your HTML
    if (cartModal) {
        cartModal.classList.add('active');
    }
}

// Update the setupEventListeners function to include the cart button
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