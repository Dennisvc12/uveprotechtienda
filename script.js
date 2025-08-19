// Lista de productos (modifica esto con tus celulares)
const productos = [
  { id: 1, nombre: "iPhone 13", precio: 2149, img: "img/celular1.jpg" },
  { id: 2, nombre: "Samsung Galaxy S23", precio: 2999, img: "img/celular2.jpg" },
  { id: 3, nombre: "Xiaomi Redmi Note 12", precio: 999, img: "img/celular3.jpg" },
];

const productList = document.getElementById("product-list");
const cart = [];
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const cartDiv = document.getElementById("cart");
const cartBtn = document.getElementById("cart-btn");

// Renderizar productos
productos.forEach(p => {
  const div = document.createElement("div");
  div.classList.add("producto");
  div.innerHTML = `
    <img src="${p.img}" alt="${p.nombre}">
    <h3>${p.nombre}</h3>
    <p>Precio: $${p.precio}</p>
    <button onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
  `;
  productList.appendChild(div);
});

// Agregar producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  cart.push(producto);
  actualizarCarrito();
}

// Actualizar carrito
function actualizarCarrito() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.onclick = () => {
      cart.splice(index, 1);
      actualizarCarrito();
    };
    li.appendChild(removeBtn);
    cartItems.appendChild(li);
    total += item.precio;
  });

  cartTotal.textContent = total;
  cartCount.textContent = cart.length;
}

// Mostrar/Ocultar carrito
cartBtn.addEventListener("click", () => {
  cartDiv.style.display = cartDiv.style.display === "block" ? "none" : "block";
});

// Checkout
document.getElementById("checkout-btn").addEventListener("click", () => {
  alert("Gracias por tu compra 🎉");
  cart.length = 0;
  actualizarCarrito();
});