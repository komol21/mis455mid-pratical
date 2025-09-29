// Name: komol Krishna Paul, ID: 2221337
// Cart functionality

// Initialize cart from localStorage or create empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add item to cart
function addToCart(id, name, price, image) {
    // Check if item is already in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        // Increase quantity if item already exists
        existingItem.quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart count display
    updateCartCount();
    
    // Show success message
    alert(`${name} has been added to your cart!`);
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
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to calculate total price
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Function to update cart count in UI
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    
    if (cartCountElement) {
        const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
        cartCountElement.textContent = itemCount;
        
        // Show or hide based on count
        cartCountElement.style.display = itemCount > 0 ? 'inline-block' : 'none';
    }
}

// Function to display cart items
function displayCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    
    if (!cartItemsElement) return;
    
    // Clear current cart display
    cartItemsElement.innerHTML = '';
    
    if (cart.length === 0) {
        // Display empty cart message
        cartItemsElement.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        if (totalElement) {
            totalElement.textContent = '0';
        }
        return;
    }
    
    // Create cart items
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Price: ৳${item.price}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <p>Total: ৳${item.price * item.quantity}</p>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
        `;
        
        cartItemsElement.appendChild(cartItem);
    });
    
    // Update total
    if (totalElement) {
        totalElement.textContent = calculateTotal();
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

// Initialize cart display when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // If on cart page, display items
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
});