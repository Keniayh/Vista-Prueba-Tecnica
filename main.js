import './style.css';

// Datos obtenidos desde la API
let clientes = [];

async function obtenerNits() {
  try {
    const response = await fetch('http://localhost:3307/nits'); // Ruta de la API
    const nitsData = await response.json();

    console.log('Datos de la API:', nitsData);

    // Mapear los datos de la API
    clientes = nitsData.map(nit => ({
      id: nit.nitCod,          // ID único del cliente
      nombre: nit.nitNombre,  // Nombre del cliente
      documento: nit.nitDoc,  // Documento del cliente
      plazo: nit.nitPlazo,
      cupo: nit.nitCupo,
      cartera: nit.nitCart,    // Cartera del cliente
      disponible: nit.nitDisp  // Cantidad disponible
    }));

    console.log('Clientes cargados:', clientes); // Verificar los datos mapeados

    // Llenar el select de clientes cuando los datos estén listos
    const clienteSelect = document.getElementById('clienteSelect');
    clienteSelect.innerHTML = `<option value="">Seleccione un cliente</option>` +
      clientes.map(cliente =>
        `<option value="${cliente.id}">${cliente.id} - ${cliente.nombre}</option>`
      ).join('');

  } catch (error) {
    console.error('Error al obtener los Nits:', error);
  }
}

// Llamar a la función para obtener los datos
obtenerNits();

let articulos = [];

async function obtenerArts() {
  try {
    const response = await fetch('http://localhost:3307/articulos'); // Ruta de la API
    const artsData = await response.json();

    console.log('Datos de la API:', artsData); // Verificar qué datos se reciben

    // Mapear los datos de la API
    articulos = artsData.map(articulo => ({
      id: articulo.artCod,          // ID único del cliente
      nombre: articulo.artNom,  // Nombre del cliente
      laboratorio: articulo.artLab,
      costo: articulo.artCosto,
      saldo: articulo.artSaldo,
      precioVenta: articulo.artPreVt,    // Cartera del cliente
    }));

    console.log('Clientes cargados:', articulos); // Verificar los datos mapeados

    // Llenar el select de clientes cuando los datos estén listos
    const articuloSelect = document.getElementById('articuloSelect');
    articuloSelect.innerHTML = `<option value="">Seleccione un articulo</option>` +
      articulos.map(articulo =>
        `<option value="${articulo.id}">${articulo.id} - ${articulo.nombre}</option>`
      ).join('');

  } catch (error) {
    console.error('Error al obtener los Articulos:', error);
  }
}

// Llamar a la función para obtener los datos
obtenerArts();

// Estado de la aplicación
let facturas = [];
let isDarkMode = false;
let currentView = 'facturas';

// Función para calcular estadísticas
function actualizarEstadisticas() {
  const totalFacturas = facturas.length;
  const totalVentas = facturas.reduce((sum, factura) => sum + factura.total, 0);
  const totalCosto = facturas.reduce((sum, factura) => sum + factura.totalCosto, 0); // Asegúrate de sumar el totalCosto también
  const promedioVenta = totalFacturas > 0 ? totalVentas / totalFacturas : 0;

  // Actualizar el DOM con los totales
  document.getElementById('totalFacturas').textContent = totalFacturas;
  document.getElementById('totalVentas').textContent = `$${totalVentas.toFixed(2)}`;
  document.getElementById('totalCostoSpan').textContent = `$${totalCosto.toFixed(2)}`;
  document.getElementById('promedioVenta').textContent = `$${promedioVenta.toFixed(2)}`;
}

// Función para mostrar información del cliente
function mostrarInfoCliente(clienteId) {
  const cliente = clientes.find(c => c.id === clienteId);
  const infoCliente = document.getElementById('clienteInfo');

  // Calcular la fecha de vencimiento sumando el plazo al día actual
  const fechaActual = new Date();
  fechaActual.setDate(fechaActual.getDate() + cliente.plazo);  // Se suma el plazo (en días)

  const fechaVencimiento = fechaActual.toISOString().split('T')[0];
  // Asignar la fecha calculada al campo de fecha de vencimiento en el formulario
  document.getElementById('fechaVencimiento').value = fechaVencimiento;

  if (cliente) {

    infoCliente.innerHTML = `
      <div class="info-box">
        <div class="info-row">
          <div class="info-field">
            <label class="info-label">Documento:</label>
            <input type="text" class="info-input" value="${cliente.documento}" disabled>
          </div>
          <div class="info-field">
            <label class="info-label">Nombre:</label>
            <input type="text" class="info-input" value="${cliente.nombre}" disabled>
          </div>
        </div>
        <div class="info-row">
          <div class="info-field">
            <label class="info-label">Plazo:</label>
            <input type="text" class="info-input" value="${cliente.plazo}" disabled>
          </div>
          <div class="info-field">
            <label class="info-label">Cupo:</label>
            <input type="text" class="info-input" value="${cliente.cupo}" disabled>
          </div>
        </div>
        <div class="info-row">
          <div class="info-field">
            <label class="info-label">Cartera:</label>
            <input type="number" class="info-input" value="${cliente.cartera}" disabled id="carteraInput">
          </div>
        </div>
        <div class="info-row">
          <div class="info-field">
            <label class="info-label">Disponible:</label>
            <input type="number" class="info-input" value="${cliente.disponible}" disabled id="disponibleInput
            ">
          </div>
        </div>
      </div>
    `;
  } else {
    // Si no se encuentra el cliente, limpiar la vista
    infoCliente.innerHTML = '';
  }
}

// Función para mostrar información del artículo
function mostrarInfoArticulo(articuloId) {
  const articulo = articulos.find(a => a.id === articuloId);
  const infoArticulo = document.getElementById('articuloInfo');

  if (articulo) {
    infoArticulo.innerHTML = `
      <div class="info-box">
        <div class="info-row">
          <div class="info-field">
            <label class="info-label">Laboratorio:</label>
            <input type="text" class="info-input" value="${articulo.laboratorio}" disabled>
          </div>
          <div class="info-field">
            <label class="info-label">Nombre:</label>
            <input type="text" class="info-input" value="${articulo.nombre}" disabled>
          </div>
          <div class="info-field">
            <label class="info-label">Costo:</label>
            <input type="text" class="info-input" value="${articulo.costo}" disabled>
          </div>
        </div>
        <div class="info-row">
          <div class="info-field">
            <label class="info-label">Saldo:</label>
            <input type="number" id="saldoArticulo" class="info-input" value="${articulo.saldo}" disabled>
          </div>
          <div class="info-field">
            <label class="info-label">Precio de Venta:</label>
            <input type="number" class="info-input" value="${articulo.precioVenta}" disabled>
          </div>
        </div>
      </div>
    `;
  } else {
    infoArticulo.innerHTML = '';
  }
}

function cambiarVista(vista) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelector(`.${vista}-view`).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.querySelector(`[data-view="${vista}"]`).classList.add('active');
  currentView = vista;
}

document.querySelector('#app').innerHTML = `
  <div class="dashboard">
    <div class="sidebar">
      <div class="sidebar-logo">
        💊 Farmacia Sistema
      </div>
      <ul class="nav-items">
      <li class="nav-item" data-view="clientes"><a href="./view/nit.html">👥 Clientes</a></li>
      <li class="nav-item" data-view="productos"><a href="./view/articulos.html">📦 Articulos</a></li>
      <li class="nav-item" data-view="facturas">📝 Registro</li>
        <li class="nav-item" data-view="reportes"><a href="./view/facturasView.html">📊 Historial Facturas</a></li>
      </ul>
    </div>
    
    <div class="main-content">
      <div class="header">
        <h1>Sistema de Facturación - Farmacia</h1>
        <button class="theme-toggle" id="themeToggle">
          🌙 Cambiar Tema
        </button>
      </div>

      <div class="view facturas-view active">
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-number" id="totalFacturas">0</div>
            <div class="stat-label">Facturas Creadas</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" id="totalVentas">$0.00</div>
            <div class="stat-label">Total en Ventas</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" id="promedioVenta">$0.00</div>
            <div class="stat-label">Promedio por Venta</div>
          </div>
        </div>
        
        <div class="container1">
          <div class="form-group">
          <label for="facCod">Cod Factura:</label>
          <input type="number" id="facCod" value="1" min="1">
        </div>
      
        <div class="form-group">
          <label for="clienteSelect">Cliente:</label>
          <select id="clienteSelect">
            <option value="">Seleccione un cliente</option>
            ${clientes.map(cliente => `
              <option value="${cliente.id}">${cliente.id} - ${cliente.nombre}</option>
            `).join('')}
          </select>
          <!-- Aquí se mostrará la información del cliente -->
        </div>

        <div class="form-group">
          <label for="articuloSelect">Articulo:</label>
          <select id="articuloSelect">
            <option value="">Seleccione un articulo</option>
            ${articulos.map(articulo =>
  `<option value="${articulo.id}">${articulo.id} - ${articulo.nombre}</option>`
).join('')}
          </select>
          <!-- Aquí se mostrará la información del artículo -->
        </div>

        <div class="form-group">
        <label for="naturaleza">Naturaleza:</label>
        <select id="naturaleza">
          <option value="">Seleccione la naturaleza</option>
          <option value="+">+</option>
          <option value="-">-</option>
        </select>
      </div>
      <div class="form-group">
        <label for="costoUni">Costo:</label>
        <input type="number" id="costoUni" min="1">
      </div>
      <div class="form-group" id="precioGroup">
        <label for="precioUni">Precio:</label>
        <input type="number" id="precioUni" min="1">
      </div>
      <div class="form-group">
        <label for="cantidad">Cantidad:</label>
        <input type="number" id="cantidad" value="1" min="1">
      </div>


        <!-- Nuevos campos agregados -->

        <div class="form-group">
          <label for="fechaVencimiento">Fecha de Vencimiento:</label>
          <input type="date" id="fechaVencimiento" required>
        </div>

        <div class="form-group">
          <label for="fechaFactura">Fecha de la Factura:</label>
          <input type="date" id="fechaFactura" required>
        </div>
      </div>
        <div class="container">
          <div id="clienteInfo"></div> 
          <div id="articuloInfo"></div>
        </div>
        <button class="add-button" id="agregarBtn">
          ✨ Agregar a la Factura
        </button>

        <div class="grid-container">
  <table class="invoice-grid">
    <thead>
      <tr>
        <th>Acciones</th>
        <th>Cod Factura</th>
        <th>ID Cliente</th>
        <th>Cliente</th>
        <th>ID Artículo</th>
        <th>Medicamento</th>
        <th>Naturaleza</th>
        <th>Costo</th>
        <th>Precio</th>
        <th>Fecha Vencimiento</th>
        <th>Fecha Factura</th>
        <th>Cantidad</th>
        <th>Precio Unitario</th>
        <th>Total Venta</th>
        <th>Total Costo</th>
      </tr>
    </thead>
    <tbody id="facturaBody">
    </tbody>
  </table>
  <!-- Sección para los totales fuera de la tabla -->
<div class="totales">
  <strong>Total Venta: </strong><span id="totalVentaSpan">$0.00</span>
  <strong>Total Costo: </strong><span id="totalCostoSpan">$0.00</span>
</div>
  <button class="save-button" id="guardarBtn">
    💾 Guardar Factura
  </button>
</div>

      </div>
    </div>
  </div>
`;

document.getElementById('articuloSelect').addEventListener('change', (e) => {
  const articuloId = parseInt(e.target.value);  // Convierte el valor del select a un número

  if (articuloId) {
    // Buscar el artículo correspondiente
    const articulo = articulos.find(a => a.id === articuloId);

    if (articulo) {
      // Mostrar la información del artículo (esto depende de tu lógica de mostrar info, aquí solo asignamos)
      mostrarInfoArticulo(articuloId);

      // Asignar los valores del artículo en los campos de costo y precio
      document.getElementById('costoUni').value = articulo.costo; // Establece el costo
      document.getElementById('precioUni').value = articulo.precioVenta; // Establece el precio unitario
    }
  } else {
    // Si no hay artículo seleccionado, limpiamos los campos
    document.getElementById('articuloInfo').innerHTML = '';  // Limpiar la información
    document.getElementById('costoUni').value = '';  // Limpiar costo
    document.getElementById('precioUni').value = '';  // Limpiar precio
  }
});



// Establecer la fecha actual en el campo de fecha
window.addEventListener('DOMContentLoaded', () => {
  const fechaFacturaInput = document.getElementById('fechaFactura');
  if (fechaFacturaInput) {
    const hoy = new Date();
    const fechaActual = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    fechaFacturaInput.value = fechaActual;
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const naturalezaSelect = document.getElementById('naturaleza');
  const costoInput = document.getElementById('costoUni');
  const precioGroup = document.getElementById('precioGroup');

  // Ocultar el campo "Precio" al cargar la página
  precioGroup.style.display = 'none';

  naturalezaSelect.addEventListener('change', () => {
    const naturaleza = naturalezaSelect.value;

    if (naturaleza === '+') {
      costoInput.disabled = false; // Costo habilitado
      precioGroup.style.display = 'none'; // Precio oculto
    } else if (naturaleza === '-') {
      costoInput.disabled = true; // Costo deshabilitado
      precioGroup.style.display = 'block'; // Precio visible
    } else {
      // Restablecer al estado inicial
      costoInput.disabled = false;
      precioGroup.style.display = 'none';
    }
  });
});

document.getElementById('naturaleza').addEventListener('change', (event) => {
  const naturaleza = event.target.value;
  const costoInput = document.getElementById('costoUni'); // Ajusta el ID si no coincide.
  const precioInput = document.getElementById('precioUni'); // Ajusta el ID si no coincide.

  if (naturaleza === '+') {
    // Naturaleza positiva: habilitar costo, mostrar precio sin modificar
    costoInput.disabled = false;
    precioInput.disabled = true; // Solo mostrar, no modificar
  } else if (naturaleza === '-') {
    // Naturaleza negativa: deshabilitar costo, mostrar precio sin modificar
    costoInput.disabled = true;
    precioInput.disabled = true; // Solo mostrar, no modificar
  } else {
    // Si no se selecciona nada, habilitar ambos (puedes personalizar esto)
    costoInput.disabled = false;
    precioInput.disabled = false;
  }
});



// Manejo del evento de cambio del cliente
document.getElementById('clienteSelect').addEventListener('change', (e) => {
  const clienteId = parseInt(e.target.value);  // Convierte el valor a número (asegurando que sea un número)

  if (clienteId) {
    mostrarInfoCliente(clienteId);  // Muestra la información del cliente
  } else {
    document.getElementById('clienteInfo').innerHTML = '';  // Limpia si no se selecciona nada
  }
});

// Manejo del evento de cambio del cliente
document.getElementById('articuloSelect').addEventListener('change', (e) => {
  const articuloId = parseInt(e.target.value);

  if (articuloId) {
    mostrarInfoArticulo(articuloId);
  } else {
    document.getElementById('articuloInfo').innerHTML = '';
  }
});

document.getElementById('agregarBtn').addEventListener('click', () => {
  const codFactura = parseInt(document.getElementById('facCod').value);
  const clienteId = parseInt(document.getElementById('clienteSelect').value);
  const articuloId = parseInt(document.getElementById('articuloSelect').value);
  const naturaleza = document.getElementById('naturaleza').value;
  const costo = parseFloat(document.getElementById('costoUni').value);
  const precio = parseFloat(document.getElementById('precioUni').value);
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const fechaVencimiento = document.getElementById('fechaVencimiento').value;
  const fechaFactura = document.getElementById('fechaFactura').value;

  if (!clienteId || !articuloId || !naturaleza || !cantidad || !fechaVencimiento || !fechaFactura) {
    alert('Por favor complete todos los campos requeridos.');
    return;
  }

  const cliente = clientes.find(c => c.id === clienteId);
  const articulo = articulos.find(a => a.id === articuloId);

  if (!cliente) {
    alert('Cliente no válido.');
    return;
  }

  if (!articulo) {
    alert('Artículo no válido.');
    return;
  }

  let totalVenta = 0;
  let totalCosto = 0;

  if (naturaleza === '+') {
    totalVenta = 0;
    totalCosto = cantidad * costo;
  } else if (naturaleza === '-') {
    totalVenta = cantidad * precio;
    totalCosto = 0;

    if (cantidad > articulo.saldo) {
      alert(`La cantidad solicitada (${cantidad}) excede el saldo disponible del artículo (${articulo.saldo}).`);
      return;
    }

    if (totalVenta > cliente.disponible) {
      alert(`El total de la venta ($${totalVenta.toFixed(2)}) excede el cupo disponible del cliente ($${cliente.disponible.toFixed(2)}).`);
      return;
    }

    // Actualizar la cartera y el disponible
    const carteraNueva = cliente.cartera + totalVenta;
    const disponibleNuevo = cliente.disponible - totalVenta;

    cliente.cartera = carteraNueva;
    cliente.disponible = disponibleNuevo;

    // Actualizar los valores de Cartera y Disponible en los inputs
    const carteraInput = document.getElementById('carteraInput');
    const disponibleInput = document.getElementById('disponibleInput');
    
    if (carteraInput) {
      carteraInput.value = cliente.cartera.toFixed(2);
    }

    if (disponibleInput) {
      disponibleInput.value = cliente.disponible.toFixed(2);
    }
  }

  // Actualizar el saldo del artículo según naturaleza
  if (naturaleza === '+') {
    articulo.saldo += cantidad;
  } else {
    articulo.saldo -= cantidad;
  }

  // Mostrar el saldo actualizado en el input correspondiente
  const saldoInput = document.getElementById('saldoArticulo');
  if (saldoInput) {
    saldoInput.value = articulo.saldo;
  }

  const nuevaFactura = {
    codFactura,
    clienteId,
    clienteNombre: cliente.nombre,
    articuloId,
    articuloNombre: articulo.nombre,
    naturaleza,
    costo,
    precio,
    cantidad,
    fechaVencimiento,
    fechaFactura,
    total: totalVenta,
    totalCosto
  };

  facturas.push(nuevaFactura);

  // Bloquear naturaleza y cliente
  document.getElementById('naturaleza').disabled = true;
  document.getElementById('clienteSelect').disabled = true;

  // Actualizar las estadísticas y la tabla
  actualizarEstadisticas();
  actualizarTablaFactura();

  alert('Artículo agregado a la factura correctamente.');
});








function actualizarTablaFactura() {
  const tbody = document.getElementById('facturaBody');
  tbody.innerHTML = ''; // Limpiar antes de volver a llenar

  let totalVenta = 0;  // Inicializar el total de venta
  let totalCosto = 0;  // Inicializar el total de costo

  facturas.forEach((item, index) => {
    // Acumular los totales
    totalVenta += item.total;
    totalCosto += item.totalCosto;

    const row = `
      <tr>
        <td><button onclick="eliminarLineaFactura(${index})">🗑️</button></td>
        <td>${item.codFactura}</td>
        <td>${item.clienteId}</td>
        <td>${item.clienteNombre}</td>
        <td>${item.articuloId}</td>
        <td>${item.articuloNombre}</td>
        <td>${item.naturaleza}</td>
        <td>$${item.costo.toFixed(2)}</td>
        <td>$${item.precio.toFixed(2)}</td>
        <td>${item.fechaVencimiento}</td>
        <td>${item.fechaFactura}</td>
        <td>${item.cantidad}</td>
        <td>$${item.precio.toFixed(2)}</td>
        <td>$${item.total.toFixed(2)}</td>
        <td>$${item.totalCosto.toFixed(2)}</td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', row);
  });

  // Actualizar los totales fuera de la tabla
  document.getElementById('totalVentaSpan').textContent = `$${totalVenta.toFixed(2)}`;
  document.getElementById('totalCostoSpan').textContent = `$${totalCosto.toFixed(2)}`;
}


function renderizarTablaFactura() {
  const tbody = document.getElementById('facturaBody');
  tbody.innerHTML = facturas.map((f, index) => `
    <tr>
      <td><button onclick="eliminarLineaFactura(${index})">🗑️</button></td>
      <td>${f.codFactura}</td>
      <td>${f.clienteId}</td>
      <td>${f.clienteNombre}</td>
      <td>${f.articuloId}</td>
      <td>${f.articuloNombre}</td>
      <td>${f.naturaleza}</td>
      <td>$${f.costo.toFixed(2)}</td>
      <td>$${f.precio.toFixed(2)}</td>
      <td>${f.fechaVencimiento}</td>
      <td>${f.fechaFactura}</td>
      <td>${f.cantidad}</td>
      <td>$${f.precio.toFixed(2)}</td>
      <td>$${f.total.toFixed(2)}</td>
      <td>$${f.totalCosto.toFixed(2)}</td>
    </tr>
  `).join('');
}


function eliminarLineaFactura(index) {
  facturas.splice(index, 1);
  actualizarEstadisticas();
  renderizarTablaFactura();
}

window.eliminarLineaFactura = eliminarLineaFactura;


// Inicializar estadísticas y vista activa
actualizarEstadisticas();
cambiarVista('facturas');
// Evento para guardar la factura
document.getElementById('guardarBtn').addEventListener('click', async () => {
  const codigoFactura = parseInt(document.getElementById('facCod').value);

  if (facturas.length === 0) {
    alert('No hay items para guardar en la factura');
    return;
  }

  if (isNaN(codigoFactura)) {
    alert('Por favor ingrese un código de factura válido');
    return;
  }

  const clienteId = parseInt(document.getElementById('clienteSelect').value);
  const naturaleza = document.getElementById('naturaleza').value;

  const totalVenta = parseFloat(document.getElementById('totalVentaSpan').textContent.replace('$', '').trim());
  const totalCosto = parseFloat(document.getElementById('totalCostoSpan').textContent.replace('$', '').trim());

  const facturaData = {
    facCod: codigoFactura,
    nit: { nitCod: clienteId },
    facFecha: document.getElementById('fechaFactura').value,
    facVenc: document.getElementById('fechaVencimiento').value,
    facNatu: naturaleza,
    facTtalVt: totalVenta.toFixed(2),
    facTtalCost: totalCosto.toFixed(2),
  };

  try {
    if (naturaleza === '-') {
      try {
        const clienteResponse = await fetch(`http://localhost:3307/nits/${clienteId}`);
        if (!clienteResponse.ok) throw new Error('Error al obtener los datos del cliente');

        const cliente = await clienteResponse.json();
        console.log(cliente);  // Esto te permitirá ver los datos completos del cliente

        // Ahora usamos los nombres correctos de las propiedades
        if (cliente.nitCart === undefined || cliente.nitCupo === undefined) {
          throw new Error('El cliente no tiene los campos necesarios para actualizar');
        }

        const carteraNueva = cliente.nitCart + totalVenta;
        const disponibleNuevo = cliente.nitCupo - carteraNueva;

        const clienteActualizar = {
          ...cliente,  // Copia todos los valores del cliente
          nitCart: carteraNueva, // Solo actualiza la cartera
          nitDisp: disponibleNuevo // Solo actualiza el disponible
        };
        
        const clienteUpdateResponse = await fetch(`http://localhost:3307/nits/${clienteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clienteActualizar) // Actualizamos con los nombres correctos
        });


        if (!clienteUpdateResponse.ok) {
          const errorText = await clienteUpdateResponse.text();
          console.error('Error al actualizar la cartera del cliente:', errorText);
          alert('No se pudo actualizar la cartera del cliente. La factura no se guardará.');
          return;
        }

      } catch (error) {
        console.error("Error al actualizar la cartera:", error);
        alert("No se pudo actualizar la cartera del cliente. La factura no se guardará.");
        return;
      }
    }

    const response = await fetch("http://localhost:3307/facturas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(facturaData)
    });

    if (!response.ok) throw new Error('Error al guardar la factura');
    const facturaGuardada = await response.json();

    for (const item of facturas) {
      try {
        const kardex = {
          factura: { facCod: facturaGuardada.facCod },
          articulo: { artCod: item.articuloId },
          facKUni: item.cantidad,
          facKCtUni: item.costo.toFixed(2),
          facKTtalVt: item.total.toFixed(2),
          facKTtalCost: item.totalCosto.toFixed(2)
        };

        const kardexResponse = await fetch("http://localhost:3307/facturaKardex", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(kardex)
        });

        if (!kardexResponse.ok) {
          console.error('Error al guardar línea de factura:', item);
          continue;
        }

        const articuloResponse = await fetch(`http://localhost:3307/articulos/${item.articuloId}`);
        if (!articuloResponse.ok) {
          console.error(`No se pudo obtener el artículo ${item.articuloId}`);
          continue;
        }

        const articulo = await articuloResponse.json();

        let nuevoSaldo;
        if (naturaleza === '-') {
          nuevoSaldo = articulo.artSaldo - item.cantidad;
        } else {
          nuevoSaldo = articulo.artSaldo + item.cantidad;
        }

        const articuloActualizar = {
          ...articulo,
          artSaldo: nuevoSaldo
        };

        const actualizarArticuloResponse = await fetch(`http://localhost:3307/articulos/${item.articuloId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(articuloActualizar)
        });

        if (!actualizarArticuloResponse.ok) {
          const errorText = await actualizarArticuloResponse.text();
          console.error(`Error al actualizar saldo del artículo ${item.articuloId}:`, errorText);
        } else {
          console.log(`Saldo del artículo ${item.articuloId} actualizado a ${nuevoSaldo}`);
        }

      } catch (error) {
        console.error(`Error procesando el item ${item.articuloId}:`, error);
      }
    }

    alert("¡Factura guardada correctamente!");

    facturas = [];
    actualizarTablaFactura();
    actualizarEstadisticas();

    document.getElementById('naturaleza').disabled = false;
    document.getElementById('clienteSelect').disabled = false;

    document.getElementById('facCod').value = '';
    document.getElementById('clienteSelect').value = '';
    document.getElementById('fechaFactura').value = '';

  } catch (error) {
    console.error('Error al guardar factura:', error);
    alert('Error al guardar la factura');
  }
});

