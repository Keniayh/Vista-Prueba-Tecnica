let data = [];

function fetchNits() {
    fetch("http://localhost:3307/nits")
        .then(response => response.json())
        .then(data => displayNits(data))
        .catch(error => {
            console.error("Error al obtener NITs:", error);
            console.log(data)
        });
}


function displayNits(data) {
    const container = document.getElementById("nits");
    container.innerHTML = "";

    data.forEach(nit => {
        const div = document.createElement('div');
        div.className = 'nit-card';
        div.innerHTML = `
            <p><strong>Nombre:</strong> ${nit.nitNombre}</p>
            <p><strong>Documento:</strong> ${nit.nitDoc}</p>
            <p><strong>Cupo:</strong> ${nit.nitCupo}</p>
            <p><strong>Plazo:</strong> ${nit.nitPlazo}</p>
            <p><strong>Cartera:</strong> ${nit.nitCart}</p>
            <p><strong>Disponible:</strong> ${nit.nitDisp}</p>
            <button onclick="deleteNit(${nit.nitCod})">Eliminar</button>
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

    fetch('http://localhost:3307/nits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then(res => {
        if (!res.ok) throw new Error("Error al crear el Nit");
        return res.json();
    })
    .then(() => {
        fetchNits();
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

function deleteNit(id) {
    fetch(`http://localhost:3307/nits/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchNits())
    .catch(err => console.error('Error al eliminar:', err));
}

