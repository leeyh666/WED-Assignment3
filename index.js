document.addEventListener("DOMContentLoaded", function () {

const PRODUCTS = [
  {
    id: "phone",
    name: "iPhone",
    category: "Phone",
    price: 5999,
    img: "iphone.jpg",
    tag: "New",
    desc: "A modern smartphone with powerful performance."
  },
  {
    id: "laptop",
    name: "MacBook",
    category: "Laptop",
    price: 7899,
    img: "macbook.jpg",
    tag: "Popular",
    desc: "A lightweight and powerful laptop."
  },
  {
    id: "watch",
    name: "Apple Watch",
    category: "Watch",
    price: 299,
    img: "apple watch.jpg",
    tag: "Fitness",
    desc: "Smart watch for daily tracking."
  },
  {
    id: "earbuds",
    name: "Wireless Earbuds",
    category: "Audio",
    price: 199,
    img: "earbuds.jpg",
    tag: "Best value",
    desc: "Wireless earbuds with clear sound."
  },
  {
    id: "accessory",
    name: "USB-C Adapter",
    category: "Accessories",
    price: 29,
    img: "adapter.jpg",
    tag: "Essential",
    desc: "USB-C Adapter for devices."
  }
];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Fix old cart data
cart = cart.map(item => ({
  ...item,
  qty: Number(item.qty) || 1,
  price: Number(item.price) || 0
}));

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");

const toastEl = document.getElementById("appToast");
const toastBody = document.getElementById("toastBody");
const toast = new bootstrap.Toast(toastEl);

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function money(n) {
  return "RM" + n.toLocaleString();
}

function showToast(msg) {
  toastBody.textContent = msg;
  toast.show();
}

function renderProducts(list) {
  productGrid.innerHTML = "";

  list.forEach(p => {
    const col = document.createElement("div");
    col.className = "col-sm-6 col-lg-4 col-xl-3";

    col.innerHTML = `
      <div class="product-card h-100">
        <img src="${p.img}" alt="${p.name}">

        <div class="p-3">
          <h6>${p.name}</h6>
          <div class="text-muted small">${p.category}</div>
          <div class="price">${money(p.price)}</div>

          <div class="d-flex justify-content-between mt-2">
            <button class="btn btn-outline-dark btn-sm" data-action="details" data-id="${p.id}">
              Details
            </button>

            <button class="btn btn-brand btn-sm" data-action="addToCart" data-id="${p.id}">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;

    productGrid.appendChild(col);
  });
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  cartCount.textContent = totalCount;

  const subtotal = cart.reduce((sum, item) => {
    return sum + ((Number(item.qty) || 0) * (Number(item.price) || 0));
  }, 0);

  cartSubtotal.textContent = money(subtotal);
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="text-muted mb-0">No items yet. Add a product to begin.</p>';
    return;
  }

  cart.forEach(item => {
    const qty = Number(item.qty) || 0;
    const price = Number(item.price) || 0;

    cartItems.innerHTML += `
      <div class="d-flex gap-3 align-items-center mb-3">
        <img src="${item.img}" alt="${item.name}" class="rounded border" style="width:60px;height:60px;object-fit:cover;">

        <div class="flex-grow-1">
          <div class="fw-semibold">${item.name}</div>
          <div class="text-muted small">${money(price)}</div>
        </div>

        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-outline-dark btn-sm" data-cart-action="minus" data-id="${item.id}">-</button>
          <span class="px-2 fw-semibold">${qty}</span>
          <button class="btn btn-outline-dark btn-sm" data-cart-action="plus" data-id="${item.id}">+</button>
        </div>

        <div class="fw-semibold">${money(price * qty)}</div>
      </div>
    `;
  });
}

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const existing = cart.find(x => x.id === id);

  if (existing) {
    existing.qty = (Number(existing.qty) || 0) + 1;
  } else {
    cart.push({ ...p, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(p.name + " added to cart");
}

function increaseCartQty(id) {
  const item = cart.find(x => x.id === id);
  if (!item) return;

  item.qty = (Number(item.qty) || 0) + 1;
  saveCart();
  updateCartUI();
}

function decreaseCartQty(id) {
  const item = cart.find(x => x.id === id);
  if (!item) return;

  item.qty = (Number(item.qty) || 0) - 1;

  if (item.qty <= 0) {
    cart = cart.filter(x => x.id !== id);
  }

  saveCart();
  updateCartUI();
}

function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();

  let list = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );

  if (sortSelect.value === "priceLow") {
    list.sort((a, b) => a.price - b.price);
  }

  if (sortSelect.value === "priceHigh") {
    list.sort((a, b) => b.price - a.price);
  }

  renderProducts(list);
}

productGrid.addEventListener("click", e => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === "addToCart") {
    addToCart(id);
  }

  if (action === "details") {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;

    document.getElementById("modalTitle").textContent = p.name;
    document.getElementById("modalImg").src = p.img;
    document.getElementById("modalImg").alt = p.name;
    document.getElementById("modalCategory").textContent = p.category;
    document.getElementById("modalPrice").textContent = money(p.price);
    document.getElementById("modalDesc").textContent = p.desc;

    document.getElementById("modalAddCart").onclick = () => {
      addToCart(p.id);
    };

    new bootstrap.Modal(document.getElementById("productModal")).show();
  }
});

cartItems.addEventListener("click", e => {
  const btn = e.target.closest("[data-cart-action]");
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.cartAction;

  if (action === "plus") {
    increaseCartQty(id);
  }

  if (action === "minus") {
    decreaseCartQty(id);
  }
});

document.getElementById("clearCartBtn").addEventListener("click", () => {
  cart = [];
  saveCart();
  updateCartUI();
  showToast("Cart cleared");
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Cart empty");
    return;
  }
  showToast("Checkout success");
});

document.getElementById("chatBtn").addEventListener("click", () => {
  showToast("Live chat opened");
});

document.getElementById("callBtn").addEventListener("click", () => {
  showToast("Calling support");
});

document.getElementById("newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("newsletterEmail").value.trim();

  if (email === "") {
    alert("Please enter your email");
    return;
  }

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/i;

  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address");
    return;
  }

  localStorage.setItem("newsletterEmail", email);
  showToast("Subscribed: " + email);
  e.target.reset();
});

searchInput.addEventListener("input", applyFilters);
sortSelect.addEventListener("change", applyFilters);

renderProducts(PRODUCTS);
updateCartUI();

});


