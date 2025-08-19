async function cargarProductos() {
  const res = await fetch("productos.json");
  const productos = await res.json();
  const contenedor = document.getElementById("productos");

  productos.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="img/${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p class="price">S/ ${p.precioFinal}</p>
    `;
    contenedor.appendChild(card);
  });
}

cargarProductos();
