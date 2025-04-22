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
    container.innerHTML = "";  // Limpiar contenido anterior

    data.forEach(factura => {
        const div = document.createElement('div');
        div.className = 'factura-card';

        // Formatear fechas
        const fechaFactura = new Date(factura.facFecha).toLocaleDateString();
        const fechaVencimiento = new Date(factura.facVenc).toLocaleDateString();

        div.innerHTML = `
            <p><strong>Factura ID:</strong> ${factura.facCod}</p>
            <p><strong>Cliente:</strong> ${factura.nit.nitNombre}</p>
            <p><strong>Fecha:</strong> ${fechaFactura}</p>
            <p><strong>Vencimiento:</strong> ${fechaVencimiento}</p>
            <p><strong>Total Venta:</strong> $${factura.facTtalVt}</p>
            <p><strong>Total Costo:</strong> $${factura.facTtalCost}</p>
            <h4>Factura Kardex:</h4>
            <ul>
                ${factura.kardex.map(kardex => `
                    <li>
                        <p><strong>Cod Artículo:</strong> ${kardex.articulo.artCod || 'No disponible'}</p>
                        <p><strong>Cantidad:</strong> ${kardex.facKUni}</p>
                        <p><strong>Costo Unitario:</strong> $${kardex.facKCtUni}</p>
                        <p><strong>Total Venta:</strong> $${kardex.facKTtalVt}</p>
                        <p><strong>Total Costo:</strong> $${kardex.facKTtalCost}</p>
                    </li>
                `).join('')}
            </ul>
            <button onclick="deleteFactura(${factura.facCod})">Eliminar</button>
        `;
        container.appendChild(div);
    });
}

function deleteFactura(id) {
    fetch(`http://localhost:3307/facturas/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchFacturas())  // Volver a cargar las facturas después de eliminar
    .catch(err => console.error('Error al eliminar la factura:', err));
}
