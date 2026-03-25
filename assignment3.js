function subscribeNewsletter() {

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;

    if (name === "" || email === "") {
        alert("Please fill in all fields");
        return false;
    }

    // Email validation
    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (!email.match(emailPattern)) {
        alert("Please enter valid email");
        return false;
    }

    alert("Subscription successful!");
}


// ===============================
// Add to Cart Function
// ===============================
function addToCart(product, price) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
        product: product,
        price: price
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(product + " added to cart!");
}


// ===============================
// Display Cart
// ===============================
function displayCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let output = "";

    for (let i = 0; i < cart.length; i++) {
        output += `
        <tr>
            <td>${cart[i].product}</td>
            <td>RM ${cart[i].price}</td>
        </tr>
        `;
    }

    document.getElementById("cartTable").innerHTML = output;
}


// ===============================
// Checkout Validation
// ===============================
function checkout() {

    let name = document.getElementById("customerName").value;
    let email = document.getElementById("customerEmail").value;
    let address = document.getElementById("customerAddress").value;

    if (name === "" || email === "" || address === "") {
        alert("Please fill all fields");
        return false;
    }

    alert("Order placed successfully!");
}


// ===============================
// Clear Cart
// ===============================
function clearCart() {
    localStorage.removeItem("cart");
    alert("Cart cleared");
    location.reload();
}
