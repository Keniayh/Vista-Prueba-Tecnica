import './style.css';

// Datos de ejemplo
const clientes = [
  { 
    id: 'C001', 
    nombre: 'Juan Pérez',
    documento: '12345678',
    direccion: 'Calle 123',
    telefono: '555-0123',
    email: 'juan@email.com',
    cartera: 5000,
    disponible: 3000,
    imagen: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  { 
    id: 'C002', 
    nombre: 'María García',
    documento: '87654321',
    direccion: 'Avenida 456',
    telefono: '555-0124',
    email: 'maria@email.com',
    cartera: 8000,
    disponible: 8000,
    imagen: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  { 
    id: 'C003', 
    nombre: 'Carlos López',
    documento: '23456789',
    direccion: 'Plaza 789',
    telefono: '555-0125',
    email: 'carlos@email.com',
    cartera: 10000,
    disponible: 7000,
    imagen: 'https://randomuser.me/api/portraits/men/2.jpg'
  }
];

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
            <label class="info-label">Email:</label>
            <input type="email" class="info-input" value="${cliente.email}">
          </div>
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

        <div class="invoice-form">
          <div class="form-group">
            <label for="clienteSelect">Cliente:</label>
            <select id="clienteSelect">
              <option value="">Seleccione un cliente</option>
              ${clientes.map(cliente => 
                `<option value="${cliente.id}">${cliente.id} - ${cliente.nombre}</option>`
              ).join('')}
            </select>
            <div id="clienteInfo"></div>
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

      <div class="view clientes-view">
        <h2>Gestión de Clientes</h2>
        <div class="client-grid">
          ${clientes.map(cliente => `
            <div class="client-card">
              <img src="${cliente.imagen}" alt="${cliente.nombre}" class="client-image">
              <h3>${cliente.nombre}</h3>
              <p>ID: ${cliente.id}</p>
              <p>Documento: ${cliente.documento}</p>
              <p>Email: ${cliente.email}</p>
              <p>Cartera: $${cliente.cartera}</p>
              <p>Disponible: $${cliente.disponible}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="view productos-view">
        <h2>Catálogo de Productos</h2>
        <div class="product-grid">
          ${articulos.map(articulo => `
            <div class="product-card">
              <img src="${articulo.imagen}" alt="${articulo.nombre}" class="product-image">
              <h3>${articulo.nombre}</h3>
              <p>Código: ${articulo.codigo}</p>
              <p>Precio: $${articulo.precio}</p>
              <p>Stock: ${articulo.stock} unidades</p>
              <p>Presentación: ${articulo.presentacion}</p>
              <p>Vencimiento: ${articulo.vencimiento}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="view reportes-view">
        <h2>Reportes y Estadísticas</h2>
        <div class="reports-container">
          <div class="report-card">
            <img src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Ventas Mensuales" class="report-image">
            <h3>Ventas Mensuales</h3>
            <p>Análisis detallado de ventas por mes</p>
          </div>
          <div class="report-card">
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Productos Más Vendidos" class="report-image">
            <h3>Productos Más Vendidos</h3>
            <p>Top productos por volumen de ventas</p>
          </div>
          <div class="report-card">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Análisis de Clientes" class="report-image">
            <h3>Análisis de Clientes</h3>
            <p>Comportamiento y tendencias de clientes</p>
          </div>
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

document.getElementById('clienteSelect').addEventListener('change', (e) => {
  mostrarInfoCliente(e.target.value);
});

document.getElementById('articuloSelect').addEventListener('change', (e) => {
  mostrarInfoArticulo(e.target.value);
});

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const vista = item.getAttribute('data-view');
    cambiarVista(vista);
  });
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