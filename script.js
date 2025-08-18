const products = [
  { id: 1, name: "iPhone 14 Pro 128GB", price: 4599, brand: "Apple", img: "img/iphone14pro.jpg" },
  { id: 2, name: "Samsung Galaxy S23 256GB", price: 3699, brand: "Samsung", img: "img/galaxy-s23.jpg" },
  { id: 3, name: "Xiaomi Redmi Note 12", price: 899, brand: "Xiaomi", img: "img/redmi-note12.jpg" },
  { id: 4, name: "Motorola Moto G84", price: 1099, brand: "Motorola", img: "img/moto-g84.jpg" }
];

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("search");
const brandFilter = document.getElementById("brand-filter");
const priceFilter = document.getElementById("price-filter");
const priceValue = document.getElementById("price-value");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const clearCartBtn = document.getElementById("clear-cart");

let cart = [];

function renderProducts() {
  productsContainer.innerHTML = "";
  const search = searchInput.value.toLowerCase();
  const brand = brandFilter.value;
  const maxPrice = Number(priceFilter.value);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search) &&
    (brand ? p.brand === brand : true) &&
    p.price <= maxPrice
  );

  filtered.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="info">
        <h3>${p.name}</h3>
        <div class="price">S/ ${p.price.toFixed(2)}</div>
        <button onclick="addToCart(${p.id})">Agregar</button>
      </div>
    `;
    productsContainer.appendChild(div);
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((p, idx) => {
    total += p.price;
    const li = document.createElement("li");
    li.innerHTML = `${p.name} - S/ ${p.price.toFixed(2)} <button onclick="removeFromCart(${idx})">x</button>`;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = cart.length;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

clearCartBtn.addEventListener("click", () => {
  cart = [];
  updateCart();
});

searchInput.addEventListener("input", renderProducts);
brandFilter.addEventListener("change", renderProducts);
priceFilter.addEventListener("input", () => {
  priceValue.textContent = priceFilter.value;
  renderProducts();
});

renderProducts();
