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
function calcularEstadisticas() {
  const totalFacturas = facturas.length;
  const totalVentas = facturas.reduce((sum, factura) => sum + factura.total, 0);
  const promedioVenta = totalFacturas > 0 ? totalVentas / totalFacturas : 0;

  return {
    totalFacturas,
    totalVentas: totalVentas.toFixed(2),
    promedioVenta: promedioVenta.toFixed(2)
  };
}

// Función para actualizar las estadísticas en el DOM
function actualizarEstadisticas() {
  const stats = calcularEstadisticas();
  document.getElementById('totalFacturas').textContent = stats.totalFacturas;
  document.getElementById('totalVentas').textContent = `$${stats.totalVentas}`;
  document.getElementById('promedioVenta').textContent = `$${stats.promedioVenta}`;
}

// Función para mostrar información del cliente
function mostrarInfoCliente(clienteId) {
  const cliente = clientes.find(c => c.id === clienteId);
  const infoCliente = document.getElementById('clienteInfo');
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
            <input type="text" class="info-input" value="${cliente.nombre}">
          </div>
        </div>
        <div class="info-row">
          <div class="info-field">
            <label class="info-label">Plazo:</label>
            <input type="text" class="info-input" value="${cliente.plazo}">
          </div>
          <div class="info-field">
            <label class="info-label">Cupo:</label>
            <input type="text" class="info-input" value="${cliente.cupo}">
          </div>
        </div>
        <div class="info-row">
          <div class="info-field">
            <label class="info-label">Cartera:</label>
            <input type="number" class="info-input" value="${cliente.cartera}" disabled>
          </div>
        </div>
        <div class="info-row">
          <div class="info-field">
            <label class="info-label">Disponible:</label>
            <input type="number" class="info-input" value="${cliente.disponible}" disabled>
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
            <input type="number" class="info-input" value="${articulo.saldo}" disabled>
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
        <li class="nav-item" data-view="facturas">📝 Facturas</li>
        <li class="nav-item" data-view="clientes"><a href="./view/nit.html">👥 Clientes</a></li>
        <li class="nav-item" data-view="productos"><a href="./view/articulos.html">📦 Articulos</a></li>
        <li class="nav-item" data-view="reportes">📊 Reportes</li>
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

        <div class="form-group">
          <label for="clienteSelect">Cliente:</label>
          <select id="clienteSelect">
            <option value="">Seleccione un cliente</option>
            ${clientes.map(cliente => `
              <option value="${cliente.id}">${cliente.id} - ${cliente.nombre}</option>
            `).join('')}
          </select>
          <div id="clienteInfo"></div> <!-- Aquí se mostrará la información del cliente -->
        </div>

        <div class="form-group">
          <label for="articuloSelect">Articulo:</label>
          <select id="articuloSelect">
            <option value="">Seleccione un articulo</option>
            ${articulos.map(articulo =>
  `<option value="${articulo.id}">${articulo.id} - ${articulo.nombre}</option>`
).join('')}
          </select>
          <div id="articuloInfo"></div> <!-- Aquí se mostrará la información del artículo -->
        </div>

        <div class="form-group">
        <label for="naturaleza">Naturaleza:</label>
        <select id="naturaleza">
          <option value="">Seleccione la naturaleza</option>
          <option value="venta">+</option>
          <option value="devolucion">-</option>
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

        <button class="add-button" id="agregarBtn">
          ✨ Agregar a la Factura
        </button>

        <div class="grid-container">
  <table class="invoice-grid">
    <thead>
      <tr>
        <th>Acciones</th>
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
  <button class="save-button" id="guardarBtn">
    💾 Guardar Factura
  </button>
</div>

      </div>
    </div>
  </div>
`;

document.getElementById('articuloSelect').addEventListener('change', (e) => {
  const articuloId = parseInt(e.target.value);

  if (articuloId) {
    // Mostrar la información del artículo
    mostrarInfoArticulo(articuloId);

    // Obtener el costo del artículo seleccionado y establecerlo en el campo "Costo"
    const articulo = articulos.find(a => a.id === articuloId);
    if (articulo) {
      document.getElementById('costoUni').value = articulo.costo;
    }
  } else {
    document.getElementById('articuloInfo').innerHTML = '';
    document.getElementById('costoUni').value = ''; // Limpiar el campo "Costo" si no hay artículo seleccionado
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

    if (naturaleza === 'venta') {
      costoInput.disabled = false; // Costo habilitado
      precioGroup.style.display = 'none'; // Precio oculto
    } else if (naturaleza === 'devolucion') {
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

  if (naturaleza === 'venta') {
    // Naturaleza positiva: habilitar costo, mostrar precio sin modificar
    costoInput.disabled = false;
    precioInput.disabled = true; // Solo mostrar, no modificar
  } else if (naturaleza === 'devolucion') {
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

  const totalVenta = naturaleza === 'venta' ? cantidad * articulo.precioVenta : cantidad * precio;
  const totalCosto = naturaleza === 'venta' ? cantidad * costo : 0;

  const nuevaFactura = {
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
  actualizarEstadisticas();
  renderizarTablaFactura();
});


// Función para mostrar las líneas en la tabla
function actualizarTablaFactura() {
  const tbody = document.getElementById('facturaBody');
  tbody.innerHTML = ''; // Limpiar antes de volver a llenar

  facturas.forEach((item, index) => {
    const row = `
      <tr>
        <td><button onclick="eliminarLinea(${index})">🗑️</button></td>
        <td>${item.clienteId}</td>
        <td>${item.clienteNombre}</td>
        <td>${item.articuloId}</td>
        <td>${item.articuloNombre}</td>
        <td>${item.naturaleza}</td>
        <td>${item.costo}</td>
        <td>${item.precio}</td>
        <td>${item.fechaVencimiento}</td>
        <td>${item.fechaFactura}</td>
        <td>${item.cantidad}</td>
        <td>${(item.precio).toFixed(2)}</td>
        <td>${(item.totalVenta).toFixed(2)}</td>
        <td>${(item.totalCosto).toFixed(2)}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

function renderizarTablaFactura() {
  const tbody = document.getElementById('facturaBody');
  tbody.innerHTML = facturas.map((f, index) => `
    <tr>
      <td><button onclick="eliminarLineaFactura(${index})">🗑️</button></td>
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

document.getElementById('guardarBtn').addEventListener('click', async () => {
  if (facturas.length === 0) {
    alert('No hay items para guardar en la factura');
    return;
  }

  // Crear el objeto con los datos de la factura
  const facturaData = {
    fechaFactura: document.getElementById('fechaFactura').value,
    facturas: facturas.map(factura => ({
      cliente: factura.cliente,
      articulo: factura.articulo,
      cantidad: factura.cantidad,
      precioUnitario: factura.precioUnitario,
      totalVenta: factura.totalVenta,
      totalCosto: factura.totalCosto
    }))
  };


  // Llamar a la función para enviar los datos al backend
  await guardarFacturaEnServidor(facturaData);

  // Limpiar las facturas y actualizar la interfaz
  facturas = [];
  actualizarTabla();
  actualizarEstadisticas();
});

function eliminarFactura(idFactura) {
  facturas = facturas.filter(item => item.id !== idFactura);
  actualizarTabla();
}

// Hacer la función eliminarFactura disponible globalmente
window.eliminarFactura = eliminarFactura;

// Inicializar estadísticas y vista activa
actualizarEstadisticas();
cambiarVista('facturas');