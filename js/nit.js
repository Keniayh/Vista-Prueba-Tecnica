let data = [];

function fetchNits() {
    fetch("http://localhost:3307/nits")
        .then(response => response.json())
        .then(json => {
            data = json; // Guardar los datos globalmente
            displayNits(data);
        })
        .catch(error => {
            console.error("Error al obtener NITs:", error);
        });
}

fetchNits();

function displayNits(data) {
    const container = document.getElementById("nits");
    container.innerHTML = "";

    const table = document.createElement("table");
    table.className = "table table-striped";

    table.innerHTML = `
        <thead>
            <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Cupo</th>
                <th>Plazo</th>
                <th>Cartera</th>
                <th>Disponible</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    data.forEach(nit => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${nit.nitCod}</td>
            <td>${nit.nitNombre}</td>
            <td>${nit.nitDoc}</td>
            <td>${nit.nitCupo}</td>
            <td>${nit.nitPlazo}</td>
            <td>${nit.nitCart}</td>
            <td>${nit.nitDisp}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editNit(${nit.nitCod})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteNit(${nit.nitCod})">Eliminar</button>
            </td>
        `;

        tbody.appendChild(row);
    });

    container.appendChild(table);
}

function submitNitForm() {
    const nombre = document.getElementById("nombre").value.trim();
    const doc = document.getElementById("doc").value.trim();
    const cupo = document.getElementById("cupo").value.trim();
    const plazo = document.getElementById("plazo").value.trim();

    if (!nombre || !doc || isNaN(cupo) || isNaN(plazo)) {
        alert("Todos los campos deben estar completos y válidos.");
        return;
    }

    const body = {
        nitNombre: nombre,
        nitDoc: doc,
        nitCupo: parseFloat(cupo),
        nitPlazo: parseInt(plazo),
        nitCart: 0,
        nitDisp: parseFloat(cupo),
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
        alert("¡NIT creado correctamente!");
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
    .then(res => {
        if (!res.ok) throw new Error("Error al eliminar");
        return res.text();
    })
    .then(() => {
        fetchNits();
        alert("¡NIT eliminado correctamente!");
    })
    .catch(err => console.error('Error al eliminar:', err));
}

function editNit(id) {
    const nit = data.find(n => n.nitCod === id);
    if (!nit) return;

    document.getElementById("editNitCod").value = nit.nitCod;
    document.getElementById("editNombre").value = nit.nitNombre;
    document.getElementById("editDoc").value = nit.nitDoc;
    document.getElementById("editCupo").value = nit.nitCupo;
    document.getElementById("editPlazo").value = nit.nitPlazo;
    document.getElementById("editCart").value = nit.nitCart;
    document.getElementById("editDisp").value = nit.nitDisp;

    const modal = new bootstrap.Modal(document.getElementById('nitModal'));
    modal.show();
}

function isNitDocDuplicated(nitDoc, currentNitCod) {
    return data.some(nit => nit.nitDoc === nitDoc && nit.nitCod !== currentNitCod);
}

// const modal = bootstrap.Modal.getInstance(document.getElementById('nitModal'));
// modal.hide();


function submitEdit() {
    const id = parseInt(document.getElementById("editNitCod").value);
    const nombre = document.getElementById("editNombre").value.trim();
    const doc = document.getElementById("editDoc").value.trim();
    const cupo = parseFloat(document.getElementById("editCupo").value.trim());
    const plazo = parseInt(document.getElementById("editPlazo").value.trim());
    const cartera = parseFloat(document.getElementById("editCart").value.trim());
    const disponible = parseFloat(document.getElementById("editDisp").value.trim());

    if (!nombre || !doc || isNaN(cupo) || isNaN(plazo) || isNaN(cartera) || isNaN(disponible)) {
        alert("Todos los campos deben estar completos y válidos.");
        return;
    }

    const body = {
        nitCod: id, // 🔥 IMPORTANTE: esto le dice al backend que es una edición
        nitNombre: nombre,
        nitDoc: doc,
        nitCupo: cupo,
        nitPlazo: plazo,
        nitCart: cartera,
        nitDisp: parseFloat(cupo)
    };

    fetch(`http://localhost:3307/nits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then(res => {
        if (!res.ok) throw new Error("Error al actualizar");
        return res.json();
    })
    
    .then(() => {
        fetchNits(); // Refrescar la lista de Nits
    
        // Ocultar el modal después de guardar
        const modal = bootstrap.Modal.getInstance(document.getElementById('nitModal'));
        if (modal) {
            modal.hide();
        }
    
        alert("¡NIT actualizado correctamente!");
    })
        
    
    .catch(err => console.error("Error al actualizar:", err));
}

