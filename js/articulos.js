let data = [];

function fetchArticulos() {
    fetch("http://localhost:3307/articulos")
        .then(response => response.json())
        .then(data => displayArticulos(data))
        .catch(error => {
            console.error("Error al obtener articulos:", error);
            console.log(data)
        });
}


function displayArticulos(data) {
    const container = document.getElementById("articulos");
    container.innerHTML = "";

    data.forEach(nit => {
        const div = document.createElement('div');
        div.className = 'nit-card';
        div.innerHTML = `
            <p><strong>Nombre:</strong> ${articulo.nitNombre}</p>
            <p><strong>Documento:</strong> ${articulo.nitDoc}</p>
            <p><strong>Cupo:</strong> ${articulo.nitCupo}</p>
            <p><strong>Plazo:</strong> ${articulonit.nitPlazo}</p>
            <p><strong>Cartera:</strong> ${articulo.nitCart}</p>
            <p><strong>Disponible:</strong> ${articulo.nitDisp}</p>
            <button onclick="deleteNit(${articulo.nitCod})">Eliminar</button>
        `;
        container.appendChild(div);
    });
}


function submitNitForm() {
    const body = {
        nitNombre: document.getElementById("nombre").value,
        nitDoc: document.getElementById("doc").value,
        nitCupo: parseFloat(document.getElementById("cupo").value),
        nitPlazo: parseInt(document.getElementById("plazo").value),
        nitCart: parseFloat(document.getElementById("cartera").value),
        nitDisp: parseFloat(document.getElementById("disponible").value),
    };

    fetch('http://localhost:3306/articulos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then(res => {
        if (!res.ok) throw new Error("Error al crear el articulo");
        return res.json();
    })
    .then(() => {
        fetchArticulo();
        limpiarFormulario();
    })
    .catch(err => console.error('Error al crear:', err));
}

function limpiarFormulario() {
    document.getElementById("nombre").value = '';
    document.getElementById("doc").value = '';
    document.getElementById("cupo").value = '';
    document.getElementById("plazo").value = '';
    document.getElementById("cartera").value = '';
    document.getElementById("disponible").value = '';
}
