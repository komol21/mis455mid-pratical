// Name: komol Krishna Paul, ID: 2221337
// Cart functionality

// Initialize cart from localStorage or create empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add item to cart
function addToCart(id, name, price, image) {
    try {
        console.log('Adding to cart:', id, name, price);
        
        // Make sure cart is initialized
        if (!Array.isArray(cart)) {
            cart = JSON.parse(localStorage.getItem('cart')) || [];
            console.log('Cart reinitialized');
        }
        
        // Check if item is already in cart
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            // Increase quantity if item already exists
            existingItem.quantity += 1;
            console.log('Increased quantity for:', name);
        } else {
            // Add new item to cart
            cart.push({
                id: id,
                name: name,
                price: Number(price),
                image: image,
                quantity: 1
            });
            console.log('Added new item:', name);
        }
        
        // Save cart to localStorage
        saveCart();
        
        // Update cart count display
        updateCartCount();
        
        // Show success message
        alert(`${name} has been added to your cart!`);
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('There was a problem adding the item to your cart. Please try again.');
    }
}

// Function to remove item from cart
function removeFromCart(id) {
    // Find item index
    const index = cart.findIndex(item => item.id === id);
    
    if (index !== -1) {
        // Remove item from cart
        cart.splice(index, 1);
        
        // Save cart to localStorage
        saveCart();
        
        // Update cart display
        updateCartCount();
        displayCart();
    }
}

// Function to update item quantity
function updateQuantity(id, newQuantity) {
    // Find item
    const item = cart.find(item => item.id === id);
    
    if (item) {
        // Update quantity
        if (newQuantity < 1) {
            // Remove item if quantity is less than 1
            removeFromCart(id);
        } else {
            item.quantity = newQuantity;
            
            // Save cart to localStorage
            saveCart();
            
            // Update cart display
            displayCart();
        }
    }
}

// Function to save cart to localStorage
function saveCart() {
    try {
        // Ensure cart is an array before saving
        if (!Array.isArray(cart)) {
            console.warn('Cart is not an array, creating new cart');
            cart = [];
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Cart saved to localStorage, items:', cart.length);
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
}

// Function to calculate total price
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Function to update cart count in UI
function updateCartCount() {
    try {
        const cartCountElements = document.querySelectorAll('#cart-count');
        
        if (cartCountElements && cartCountElements.length > 0) {
            const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
            
            // Update all cart count elements on the page
            cartCountElements.forEach(element => {
                element.textContent = itemCount;
                
                // Show or hide based on count
                element.style.display = itemCount > 0 ? 'inline-block' : 'none';
            });
            
            console.log('Cart count updated:', itemCount);
        } else {
            console.warn('Cart count elements not found');
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Function to display cart items
function displayCart() {
    try {
        console.log('Display cart function called');
        
        // Find cart elements - try different selectors in case of nested structure
        let cartItemsElement = document.getElementById('cart-items');
        const totalElement = document.getElementById('cart-total');
        const subtotalElement = document.getElementById('cart-subtotal');
        
        // Debug output
        console.log('Cart items element found:', cartItemsElement ? true : false);
        console.log('Total element found:', totalElement ? true : false);
        console.log('Subtotal element found:', subtotalElement ? true : false);
        
        if (!cartItemsElement) {
            console.warn('Cart items container not found by ID, trying querySelector');
            cartItemsElement = document.querySelector('.cart-items, #cart-items, .cart-container');
            
            if (!cartItemsElement) {
                console.error('Cart display area not found in document');
                return;
            }
        }
        
        // Make sure cart is initialized
        if (!Array.isArray(cart)) {
            console.warn('Cart is not an array, reinitializing from localStorage');
            try {
                cart = JSON.parse(localStorage.getItem('cart')) || [];
            } catch (e) {
                console.error('Failed to parse cart from localStorage', e);
                cart = [];
            }
        }
        
        console.log('Displaying', cart.length, 'items in cart');
        
        // Clear current cart display
        cartItemsElement.innerHTML = '';
        
        if (cart.length === 0) {
            // Display empty cart message
            cartItemsElement.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
            if (totalElement) {
                totalElement.textContent = '0';
            }
            if (subtotalElement) {
                subtotalElement.textContent = '0';
            }
            return;
        }
        
        // Create cart items
        cart.forEach(item => {
            try {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                
                // Ensure item has all required properties
                const itemName = item.name || 'Product';
                const itemPrice = item.price || 0;
                const itemQuantity = item.quantity || 1;
                const itemId = item.id || Math.random().toString(36);
                const itemImage = item.image || 'img2.avif'; // Fallback image
                
                cartItem.innerHTML = `
                    <img src="${itemImage}" alt="${itemName}" onerror="this.src='img2.avif'">
                    <div class="cart-item-details">
                        <h3>${itemName}</h3>
                        <p class="product-description">
                            ${itemName} - A delicious choice for food lovers
                            <span class="bangla">সুস্বাদু খাবার, সেরা উপাদান দিয়ে প্রস্তুত</span>
                        </p>
                        <div class="weight-info">Weight: 1KG</div>
                        <p class="price-info">৳${itemPrice}</p>
                        <div class="quantity-controls">
                            <button onclick="updateQuantity('${itemId}', ${itemQuantity - 1})">-</button>
                            <span>${itemQuantity}</span>
                            <button onclick="updateQuantity('${itemId}', ${itemQuantity + 1})">+</button>
                        </div>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${itemId}')" title="Remove item">×</button>
                `;
                
                cartItemsElement.appendChild(cartItem);
            } catch (itemError) {
                console.error('Error adding item to cart display:', itemError);
            }
        });
        
        // Update subtotal and total with shipping
        const subtotal = calculateTotal();
        let shippingFee = 0;
        
        try {
            // Handle the case where getSelectedShippingFee might not be defined yet
            if (typeof getSelectedShippingFee === 'function') {
                shippingFee = getSelectedShippingFee();
            }
        } catch (e) {
            console.warn('Shipping fee calculation error:', e);
        }
        
        const total = subtotal + shippingFee;
        
        if (subtotalElement) {
            subtotalElement.textContent = subtotal;
        }
        
        if (totalElement) {
            totalElement.textContent = total;
        }
        
        console.log('Cart display updated successfully');
    } catch (error) {
        console.error('Error displaying cart:', error);
    }
}

// Function to clear cart
function clearCart() {
    // Empty the cart array
    cart = [];
    
    // Save empty cart to localStorage
    saveCart();
    
    // Update UI
    updateCartCount();
    displayCart();
}

// Function to get the selected shipping fee
function getSelectedShippingFee() {
    try {
        const standardShipping = document.getElementById('standard-shipping');
        const expressShipping = document.getElementById('express-shipping');
        
        // Check if we have shipping elements
        if (standardShipping) {
            return standardShipping.checked ? 60 : 100;
        } else if (expressShipping) {
            return expressShipping.checked ? 100 : 60;
        } else {
            // If no shipping options found, default to standard shipping
            console.warn('Shipping elements not found, using default fee');
            return 60; // Default to standard shipping fee
        }
    } catch (error) {
        console.error('Error getting shipping fee:', error);
        return 60; // Default to standard shipping fee on error
    }
}

// Function to select shipping method
function selectShippingMethod(element, fee, type) {
    // Remove selected class from all shipping methods
    document.querySelectorAll('.shipping-method').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add selected class to the clicked element
    element.classList.add('selected');
    
    // Check the radio button
    const radioBtn = element.querySelector('input[type="radio"]');
    if (radioBtn) {
        radioBtn.checked = true;
    }
    
    // Update shipping
    updateShipping(fee);
}

// Function to update shipping cost
function updateShipping(fee) {
    const billShippingElement = document.getElementById('bill-shipping');
    if (billShippingElement) {
        billShippingElement.textContent = fee;
    }
    
    // Update total with new shipping fee
    displayCart();
}

// Initialize cart display when page loads
// Ensure cart is initialized immediately at the script load time
(function initializeCart() {
    try {
        console.log('Initializing cart variable');
        try {
            cart = JSON.parse(localStorage.getItem('cart'));
            // Check if cart is valid and initialize if not
            if (!cart || !Array.isArray(cart)) {
                console.log('Cart not found or invalid, creating new cart');
                cart = [];
                localStorage.setItem('cart', JSON.stringify([]));
            }
        } catch (e) {
            console.error('Error loading cart from localStorage:', e);
            cart = [];
        }
        
        console.log('Cart initialized with', cart.length, 'items');
    } catch (error) {
        console.error('Error during initial cart setup:', error);
        cart = [];
    }
})();

// DOM content loaded event for UI operations
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('DOM loaded, setting up cart UI');
        
        // Update cart count display on all pages
        updateCartCount();
        
        // Check if we're on the cart page using multiple methods for reliability
        const currentPath = window.location.pathname;
        const currentHref = window.location.href;
        
        // More robust page detection
        if (
            currentPath.endsWith('cart.html') || 
            currentPath.endsWith('/cart') || 
            currentPath.includes('cart.html') ||
            currentHref.includes('cart.html')
        ) {
            console.log('On cart page, displaying items');
            
            // Wait a moment to ensure DOM is fully loaded
            setTimeout(function() {
                displayCart();
                console.log('Cart display function called after delay');
            }, 100);
        }
        
        console.log('Cart.js UI initialization complete, cart contains', cart.length, 'items');
    } catch (error) {
        console.error('Error during cart UI initialization:', error);
    }
});