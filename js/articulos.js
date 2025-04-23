let data = [];

function fetchArticulos() {
  fetch("http://localhost:3307/articulos")
    .then(response => response.json())
    .then(fetchedData => {
      data = fetchedData; // Actualizamos la variable 'data' con los artículos más recientes
      displayArticulos(data);
    })
    .catch(error => {
      console.error("Error al obtener artículos:", error);
    });
}

fetchArticulos();

function displayArticulos(data) {
  const container = document.getElementById("articulos");
  container.innerHTML = "";

  const table = document.createElement("table");
  table.className = "table table-striped";
  table.innerHTML = `
    <thead>
      <tr>
        <th>Código</th>
        <th>Nombre</th>
        <th>Laboratorio</th>
        <th>Saldo</th>
        <th>Costo</th>
        <th>Precio Venta</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector("tbody");

  data.forEach(articulo => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${articulo.artCod}</td>
      <td>${articulo.artNom}</td>
      <td>${articulo.artLab}</td>
      <td>${articulo.artSaldo}</td>
      <td>${articulo.artCosto}</td>
      <td>${articulo.artPreVt}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editArticulo(${articulo.artCod})" data-bs-toggle="modal" data-bs-target="#articuloModal">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="deleteArticulo(${articulo.artCod})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  container.appendChild(table);
}

function submitArticuloForm() {
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

  if (isNaN(codigo) || isNaN(saldo) || isNaN(costo) || isNaN(precioVenta)) {
    alert("Los campos de código, saldo, costo y precio deben ser números válidos.");
    return;
  }

  if (codigo <= 0 || saldo <= 0 || costo <= 0 || precioVenta <= 0) {
    alert("Los valores de código, saldo, costo y precio deben ser mayores que cero.");
    return;
  }

  const body = {
    artCod: parseInt(codigo),
    artNom: nombre,
    artLab: laboratorio,
    artSaldo: parseInt(saldo),
    artCosto: parseFloat(costo),
    artPreVt: parseFloat(precioVenta),
  };

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

// function editArticulo(id) {
//   const articulo = data.find(a => a.artCod === id);
//   if (!articulo) return;

//   document.getElementById("editCodigo").value = articulo.artCod;
//   document.getElementById("editNombre").value = articulo.artNom;
//   document.getElementById("editLaboratorio").value = articulo.artLab;
//   document.getElementById("editSaldo").value = articulo.artSaldo;
//   document.getElementById("editCosto").value = articulo.artCosto;
//   document.getElementById("editPrecioVenta").value = articulo.artPreVt;
// }


function editArticulo(id) {
    const articulo = data.find(a => a.artCod === id);
    if (!articulo) return;
  
    // Llenar el formulario de edición con los datos del artículo
    document.getElementById("editCodigo").value = articulo.artCod;
    document.getElementById("editNombre").value = articulo.artNom;
    document.getElementById("editLaboratorio").value = articulo.artLab;
    document.getElementById("editSaldo").value = articulo.artSaldo;
    document.getElementById("editCosto").value = articulo.artCosto;
    document.getElementById("editPrecioVenta").value = articulo.artPreVt;
  
    // Mostrar el modal de edición
    const modal = new bootstrap.Modal(document.getElementById('articuloModal'));
    modal.show();
  }
  
  function submitEditArticulo() {
    const id = parseInt(document.getElementById("editCodigo").value); // Obtener el código del artículo
    const nombre = document.getElementById("editNombre").value.trim();
    const laboratorio = document.getElementById("editLaboratorio").value.trim();
    const saldo = parseInt(document.getElementById("editSaldo").value.trim());
    const costo = parseFloat(document.getElementById("editCosto").value.trim());
    const precioVenta = parseFloat(document.getElementById("editPrecioVenta").value.trim());
  
    // Validación de campos
    if (!nombre || !laboratorio || isNaN(saldo) || isNaN(costo) || isNaN(precioVenta)) {
      alert("Todos los campos deben estar completos y válidos.");
      return;
    }
  
    // Crear el cuerpo para enviar al servidor
    const body = {
      artCod: id, // ID del artículo que se va a actualizar
      artNom: nombre,
      artLab: laboratorio,
      artSaldo: saldo,
      artCosto: costo,
      artPreVt: precioVenta
    };
  
    // Realizar la solicitud PUT para actualizar el artículo
    fetch(`http://localhost:3307/articulos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    .then(res => {
      if (!res.ok) throw new Error("Error al actualizar el artículo");
      return res.json();
    })
    .then(() => {
      fetchArticulos(); // Refrescar la lista de artículos después de la actualización
  
      // Ocultar el modal de edición después de guardar
      const modal = bootstrap.Modal.getInstance(document.getElementById('articuloModal'));
      if (modal) {
        modal.hide();
      }
  
      alert("¡Artículo actualizado correctamente!");
    })
    .catch(err => console.error("Error al actualizar:", err));
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