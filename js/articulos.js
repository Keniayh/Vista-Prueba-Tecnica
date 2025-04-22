let data = [];

function fetchArticulos() {
    fetch("http://localhost:3307/articulos")
        .then(response => response.json())
        .then(data => displayArticulos(data))
        .catch(error => {
            console.error("Error al obtener artículos:", error);
            console.log(data);
        });
}

fetchArticulos();

function displayArticulos(data) {
    const container = document.getElementById("articulos");
    container.innerHTML = "";

    data.forEach(articulo => {
        const div = document.createElement('div');
        div.className = 'articulo-card';
        div.innerHTML = `
            <p><strong>Código:</strong> ${articulo.artCod}</p>
            <p><strong>Nombre:</strong> ${articulo.artNom}</p>
            <p><strong>Laboratorio:</strong> ${articulo.artLab}</p>
            <p><strong>Saldo:</strong> ${articulo.artSaldo}</p>
            <p><strong>Costo:</strong> ${articulo.artCosto}</p>
            <p><strong>Precio Venta:</strong> ${articulo.artPreVt}</p>
            <button onclick="deleteArticulo(${articulo.artCod})">Eliminar</button>
        `;
        container.appendChild(div);
    });
}

function submitArticuloForm() {
    // Validación de campos vacíos
    const codigo = document.getElementById("codigo").value;
    const nombre = document.getElementById("nombre").value;
    const laboratorio = document.getElementById("laboratorio").value;
    const saldo = document.getElementById("saldo").value;
    const costo = document.getElementById("costo").value;
    const precioVenta = document.getElementById("precioVenta").value;

    if (!codigo || !nombre || !laboratorio || !saldo || !costo || !precioVenta) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    // Validación de formato para los campos numéricos
    if (isNaN(codigo) || isNaN(saldo) || isNaN(costo) || isNaN(precioVenta)) {
        alert("Los campos de código, saldo, costo y precio deben ser números válidos.");
        return;
    }

    // Validación de valores negativos
    if (codigo <= 0 || saldo <= 0 || costo <= 0 || precioVenta <= 0) {
        alert("Los valores de código, saldo, costo y precio deben ser mayores que cero.");
        return;
    }

    // Crear el cuerpo de la solicitud
    const body = {
        artCod: parseInt(codigo),
        artNom: nombre,
        artLab: laboratorio,
        artSaldo: parseInt(saldo),
        artCosto: parseFloat(costo),
        artPreVt: parseFloat(precioVenta),
    };

    // Enviar la solicitud de POST al backend
    fetch('http://localhost:3307/articulos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then(res => {
        if (!res.ok) throw new Error("Error al crear el artículo");
        return res.json();
    })
    .then(() => {
        fetchArticulos();
        limpiarFormulario();
    })
    .catch(err => console.error('Error al crear:', err));
}

function deleteArticulo(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este artículo?")) {
        fetch(`http://localhost:3307/articulos/${id}`, {
            method: 'DELETE'
        })
        .then(() => fetchArticulos())
        .catch(err => console.error('Error al eliminar:', err));
    }
}


function limpiarFormulario() {
    document.getElementById("codigo").value = '';
    document.getElementById("nombre").value = '';
    document.getElementById("laboratorio").value = '';
    document.getElementById("saldo").value = '';
    document.getElementById("costo").value = '';
    document.getElementById("precioVenta").value = '';
}

function deleteArticulo(id) {
    fetch(`http://localhost:3307/articulos/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchArticulos())
    .catch(err => console.error('Error al eliminar:', err));
}
