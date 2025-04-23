let data = [];

function fetchFacturas() {
    fetch("http://localhost:3307/facturas")
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                displayFacturas(data);
            } else {
                console.error("La respuesta no es un JSON válido.");
            }
        })
        .catch(error => {
            console.error("Error al obtener facturas:", error);
        });
}

fetchFacturas();

function displayFacturas(data) {
    const container = document.getElementById("facturas-container");
    container.innerHTML = ""; // Limpiar contenido anterior

    // Crear la tabla
    const table = document.createElement("table");
    table.className = "facturas-table";

    // Crear encabezados de la tabla
    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>Factura ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Vencimiento</th>
            <th>Total Venta</th>
            <th>Total Costo</th>
        </tr>
    `;
    table.appendChild(thead);

    // Crear cuerpo de la tabla
    const tbody = document.createElement("tbody");
    data.forEach(factura => {
        const fechaFactura = new Date(factura.facFecha).toLocaleDateString();
        const fechaVencimiento = new Date(factura.facVenc).toLocaleDateString();

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${factura.facCod}</td>
            <td>${factura.nit.nitNombre}</td>
            <td>${fechaFactura}</td>
            <td>${fechaVencimiento}</td>
            <td>$${factura.facTtalVt.toFixed(2)}</td>
            <td>$${factura.facTtalCost.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
}
