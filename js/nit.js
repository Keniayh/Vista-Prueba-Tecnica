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

fetchNits();

function displayNits(data) {
    const container = document.getElementById("nits");
    container.innerHTML = "";

    data.forEach(nit => {
        const div = document.createElement('div');
        div.className = 'nit-card';
        div.innerHTML = `
            <p><strong>Id:</strong> ${nit.nitCod}</p>
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
    // Capturar los valores de los campos
    const nombre = document.getElementById("nombre").value.trim();
    const doc = document.getElementById("doc").value.trim();
    const cupo = document.getElementById("cupo").value.trim();
    const plazo = document.getElementById("plazo").value.trim();

    // Validaciones
    if (!nombre) {
        alert("El campo 'Nombre' es obligatorio.");
        return;
    }

    if (!doc) {
        alert("El campo 'Documento' es obligatorio.");
        return;
    }

    if (isNaN(parseFloat(doc)) || parseFloat(doc) < 0) {
        alert("El campo 'Documento' debe ser un número positivo.");
        return;
    }

    if (isNaN(parseFloat(cupo)) || parseFloat(cupo) < 0) {
        alert("El campo 'Cupo' debe ser un número positivo.");
        return;
    }

    if (isNaN(parseInt(plazo)) || parseInt(plazo) <= 0) {
        alert("El campo 'Plazo' debe ser un número entero positivo.");
        return;
    }

    // Crear el cuerpo de la solicitud con 'disponible' igual a 'cupo'
    const body = {
        nitNombre: nombre,
        nitDoc: doc,
        nitCupo: parseFloat(cupo),
        nitPlazo: parseInt(plazo),
        nitCart: 0, // Cartera inicializada a 0
        nitDisp: parseFloat(cupo), // Disponible igual al cupo
    };

    // Enviar los datos al servidor
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
}

function deleteNit(id) {
    fetch(`http://localhost:3307/nits/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchNits())
    .catch(err => console.error('Error al eliminar:', err));
}

