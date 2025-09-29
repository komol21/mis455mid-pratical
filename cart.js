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
    const cartItemsElement = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    const subtotalElement = document.getElementById('cart-subtotal');
    
    if (!cartItemsElement) return;
    
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
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        // Generate random stock information
        const stock = Math.floor(Math.random() * 10) + 1;
        const stockClass = stock <= 3 ? 'out-of-stock' : '';
        const stockText = stock <= 3 ? `Only ${stock} left!` : `In Stock (${stock})`;
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="product-description">
                    ${item.name} - A delicious choice for food lovers
                    <span class="bangla">সুস্বাদু খাবার, সেরা উপাদান দিয়ে প্রস্তুত</span>
                </p>
                <div class="weight-info">Weight: 1KG</div>
                <p class="price-info">৳${item.price}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <span class="stock-info ${stockClass}">${stockText}</span>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')" title="Remove item">×</button>
        `;
        
        cartItemsElement.appendChild(cartItem);
    });
    
    // Update subtotal and total with shipping
    const subtotal = calculateTotal();
    const shippingFee = getSelectedShippingFee();
    const total = subtotal + shippingFee;
    
    if (subtotalElement) {
        subtotalElement.textContent = subtotal;
    }
    
    if (totalElement) {
        totalElement.textContent = total;
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
    const standardShipping = document.getElementById('standard-shipping');
    return standardShipping && standardShipping.checked ? 60 : 100;
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
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count display on all pages
    updateCartCount();
    
    // If on cart page, display items
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
    
    console.log('Cart.js initialized, cart contains', cart.length, 'items');
});