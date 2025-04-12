import './style.css';

// Datos obtenidos desde la API
let clientes = [];

async function obtenerNits() {
  try {
    const response = await fetch('http://localhost:8080/nits'); // Ruta de la API
    const nitsData = await response.json();

    console.log('Datos de la API:', nitsData); // Verificar qué datos se reciben

    // Mapear los datos de la API
    clientes = nitsData.map(nit => ({
      id: nit.nitCod,          // ID único del cliente
      nombre: nit.nitNombre,  // Nombre del cliente
      documento: nit.nitDoc,  // Documento del cliente
      direccion: nit.nitPlazo, // Dirección (ajustar si necesario)
      telefono: nit.nitCupo,  // Teléfono (ajustar si necesario)
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

const articulos = [
  {
    codigo: 'A001',
    nombre: 'Paracetamol',
    precio: 12.50,
    laboratorio: 'Farmacéutica XYZ',
    stock: 100,
    presentacion: 'Tabletas 500mg',
    vencimiento: '2024-12-31',
    imagen: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    codigo: 'A002',
    nombre: 'Ibuprofeno',
    precio: 15.75,
    laboratorio: 'Laboratorios ABC',
    stock: 75,
    presentacion: 'Tabletas 400mg',
    vencimiento: '2024-10-15',
    imagen: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    codigo: 'A003',
    nombre: 'Amoxicilina',
    precio: 25.00,
    laboratorio: 'Farmacéutica DEF',
    stock: 50,
    presentacion: 'Cápsulas 500mg',
    vencimiento: '2024-08-30',
    imagen: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

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
            <label class="info-label">Dirección:</label>
            <input type="text" class="info-input" value="${cliente.direccion}">
          </div>
          <div class="info-field">
            <label class="info-label">Teléfono:</label>
            <input type="text" class="info-input" value="${cliente.telefono}">
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
  const articulo = articulos.find(a => a.codigo === articuloId);
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
            <label class="info-label">Presentación:</label>
            <input type="text" class="info-input" value="${articulo.presentacion}" disabled>
          </div>
        </div>
        <div class="info-row">
          <div class="info-field">
            <label class="info-label">Stock:</label>
            <input type="number" class="info-input" value="${articulo.stock}" disabled>
          </div>
          <div class="info-field">
            <label class="info-label">Vencimiento:</label>
            <input type="date" class="info-input" value="${articulo.vencimiento}" disabled>
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
        <li class="nav-item" data-view="clientes">👥 Clientes</li>
        <li class="nav-item" data-view="productos">📦 Productos</li>
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
            <label for="articuloSelect">Medicamento:</label>
            <select id="articuloSelect">
              <option value="">Seleccione un medicamento</option>
              ${articulos.map(articulo =>
  `<option value="${articulo.codigo}">${articulo.codigo} - ${articulo.nombre}</option>`
).join('')}
            </select>
            <div id="articuloInfo"></div>
          </div>

          <div class="form-group">
            <label for="cantidad">Cantidad:</label>
            <input type="number" id="cantidad" min="1" value="1">
          </div>

          <button class="add-button" id="agregarBtn">
            ✨ Agregar a la Factura
          </button>
        </div>

        <div class="grid-container">
          <table class="invoice-grid">
            <thead>
              <tr>
                <th>Acciones</th>
                <th>Cliente</th>
                <th>Medicamento</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total</th>
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

// Manejadores de eventos
document.getElementById('themeToggle').addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
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


// Manejo del evento de cambio del artículo (medicación)
document.getElementById('articuloSelect').addEventListener('change', (e) => {
  mostrarInfoArticulo(e.target.value);
});


document.getElementById('agregarBtn').addEventListener('click', () => {
  const clienteId = document.getElementById('clienteSelect').value;
  const articuloId = document.getElementById('articuloSelect').value;
  const cantidad = parseInt(document.getElementById('cantidad').value);

  if (!clienteId || !articuloId || !cantidad) {
    alert('Por favor complete todos los campos');
    return;
  }

  const cliente = clientes.find(c => c.id === clienteId);
  const articulo = articulos.find(a => a.codigo === articuloId);
  const total = articulo.precio * cantidad;

  if (total > cliente.disponible) {
    alert('El monto excede el crédito disponible del cliente');
    return;
  }

  if (cantidad > articulo.stock) {
    alert('No hay suficiente stock disponible');
    return;
  }

  facturas.push({
    id: Date.now(),
    cliente: cliente.nombre,
    articulo: articulo.nombre,
    cantidad,
    precioUnitario: articulo.precio,
    total
  });

  actualizarTabla();
  actualizarEstadisticas();

  // Limpiar campos
  document.getElementById('cantidad').value = '1';
});

document.getElementById('guardarBtn').addEventListener('click', () => {
  if (facturas.length === 0) {
    alert('No hay items para guardar en la factura');
    return;
  }

  alert('Factura guardada con éxito!');
  facturas = [];
  actualizarTabla();
  actualizarEstadisticas();
});

function eliminarFactura(id) {
  facturas = facturas.filter(factura => factura.id !== id);
  actualizarTabla();
  actualizarEstadisticas();
}

function actualizarTabla() {
  const tbody = document.getElementById('facturaBody');
  tbody.innerHTML = facturas.map(factura => `
    <tr>
      <td>
        <button class="delete-button" onclick="eliminarFactura(${factura.id})">
          🗑️ Eliminar
        </button>
      </td>
      <td>${factura.cliente}</td>
      <td>${factura.articulo}</td>
      <td>${factura.cantidad}</td>
      <td>$${factura.precioUnitario}</td>
      <td>$${factura.total}</td>
    </tr>
  `).join('');
}



// Hacer la función eliminarFactura disponible globalmente
window.eliminarFactura = eliminarFactura;

// Inicializar estadísticas y vista activa
actualizarEstadisticas();
cambiarVista('facturas');