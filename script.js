document.getElementById("brandFilter").addEventListener("change", function() {
    const filter = this.value;
    const table = document.getElementById("celularTable");
    const rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const marca = rows[i].getElementsByTagName("td")[0].textContent;
        if (filter === "Todos" || marca === filter) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
});
