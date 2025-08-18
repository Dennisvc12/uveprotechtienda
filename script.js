// FILTRO POR MARCA
document.getElementById("brandFilter").addEventListener("change", function() {
    const filter = this.value;
    const rows = document.getElementById("celularTable").getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const marca = rows[i].getElementsByTagName("td")[0].textContent;
        rows[i].style.display = (filter === "Todos" || marca === filter) ? "" : "none";
    }
});

// CARRITO SIMULADO
let cartCount = 0;
const buttons = document.querySelectorAll(".buy-btn");
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        cartCount++;
        document.getElementById("cart-count").textContent = cartCount;
        alert("Producto agregado al carrito!");
    });
});
