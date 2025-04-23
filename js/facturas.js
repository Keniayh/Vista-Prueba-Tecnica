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
            <th>Acciones</th>
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
            <td>
                <button onclick="viewFacturaDetails(${factura.facCod})" class="view-btn btn btn-primary">Ver Detalles</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
}


function viewFacturaDetails(facCod) {
    // Primero, obtener los detalles de la factura
    fetch(`http://localhost:3307/facturas/${facCod}`)
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener la factura");
            return response.json();
        })
        .then(factura => {
            // Una vez obtenida la factura, ahora obtenemos el Kardex de la factura
            return fetch(`http://localhost:3307/facturakardex/${factura.facCod}`)  // Usando facCod si es lo que se usa como ID
                .then(response => {
                    if (!response.ok) throw new Error("Error al obtener el Kardex de la factura");
                    return response.json();
                })
                .then(facturaKardex => {
                    // Ahora que tenemos tanto la factura como los detalles del Kardex
                    const modal = new bootstrap.Modal(document.getElementById('facturaModal'));
                    const modalBody = document.getElementById('facturaModalBody');

                    // Mostrar los detalles de la factura
                    const articulos = facturaKardex.kardex
                        .map(kardex => `
                            <div>
                                <p><strong>Código:</strong> ${kardex?.articulo?.artCod || 'No disponible'}</p>
                                <p><strong>Naturaleza:</strong> ${kardex?.articulo?.naturaleza || 'No disponible'}</p>
                                <p><strong>Cantidad:</strong> ${kardex?.facKUni || '0'}</p>
                            </div>
                        `)
                        .join("") || "<p>No hay artículos disponibles</p>";

                    modalBody.innerHTML = `
                        <h5>Detalles de la Factura ${factura.facCod}</h5>
                        <p><strong>Cliente:</strong> ${factura.nit?.nitNombre || 'Desconocido'}</p>
                        <p><strong>Fecha:</strong> ${new Date(factura.facFecha).toLocaleDateString()}</p>
                        <p><strong>Vencimiento:</strong> ${new Date(factura.facVenc).toLocaleDateString()}</p>
                        <p><strong>Total Venta:</strong> $${factura.facTtalVt?.toFixed(2) || '0.00'}</p>
                        <p><strong>Total Costo:</strong> $${factura.facTtalCost?.toFixed(2) || '0.00'}</p>
                        <h6>Artículos:</h6>
                        ${articulos}
                    `;
                    modal.show();
                })
                .catch(err => {
                    console.error("Error al obtener el Kardex de la factura:", err);
                });
        })
        .catch(err => {
            console.error("Error al obtener detalles de la factura:", err);
        });
}
