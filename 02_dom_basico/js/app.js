'use strict'; // Activa modo estricto para evitar errores comunes en JS

/**
 * Datos del estudiante (objeto simple)
 */
const estudiante = {
  nombre: 'Marco Cobos',
  carrera: 'Ingeniería de Sistemas',
  semestre: 5
};

/**
 * Lista de elementos (simula una base de datos)
 */
const elementos = [
  { id: 1, titulo: 'Proyecto Web', descripcion: 'Terminar práctica JS', categoria: 'Estudio', prioridad: 'Alta', activo: true },
  { id: 2, titulo: 'Comprar comida', descripcion: 'Ir al supermercado', categoria: 'Personal', prioridad: 'Media', activo: true },
  { id: 3, titulo: 'Reunión', descripcion: 'Equipo de trabajo', categoria: 'Trabajo', prioridad: 'Alta', activo: false },
  { id: 4, titulo: 'Leer libro', descripcion: 'Capítulo de JS', categoria: 'Estudio', prioridad: 'Baja', activo: true },
  { id: 5, titulo: 'Ejercicio', descripcion: 'Salir a correr', categoria: 'Personal', prioridad: 'Media', activo: false },
  { id: 6, titulo: 'Deploy', descripcion: 'Subir proyecto', categoria: 'Trabajo', prioridad: 'Alta', activo: true }
];

/**
 * Muestra la información del estudiante en el HTML
 */
function mostrarInfoEstudiante() {
  document.getElementById('estudiante-nombre').textContent = estudiante.nombre;
  document.getElementById('estudiante-carrera').textContent = estudiante.carrera;
  document.getElementById('estudiante-semestre').textContent = `${estudiante.semestre}° semestre`;
}

/**
 * Renderiza (dibuja) la lista de tarjetas en pantalla
 */
function renderizarLista(datos) {
  const contenedor = document.getElementById('contenedor-lista');

  // Limpia el contenedor antes de volver a renderizar
  contenedor.innerHTML = '';

  // Fragmento para mejorar rendimiento (evita múltiples renders al DOM)
  const fragment = document.createDocumentFragment();

  datos.forEach(el => {

    // === CREACIÓN DE TARJETA ===
    const card = document.createElement('div');
    card.classList.add('card');

    // Título
    const titulo = document.createElement('h3');
    titulo.textContent = el.titulo;

    // Descripción
    const descripcion = document.createElement('p');
    descripcion.textContent = el.descripcion;

    // === BADGES (etiquetas visuales) ===
    const badges = document.createElement('div');
    badges.classList.add('badges');

    // Categoría
    const categoria = document.createElement('span');
    categoria.textContent = el.categoria;
    categoria.classList.add('badge', 'badge-categoria');

    // Prioridad (con clases dinámicas)
    const prioridad = document.createElement('span');
    prioridad.textContent = el.prioridad;
    prioridad.classList.add('badge');

    if (el.prioridad === 'Alta') {
      prioridad.classList.add('prioridad-alta');
    } else if (el.prioridad === 'Media') {
      prioridad.classList.add('prioridad-media');
    } else {
      prioridad.classList.add('prioridad-baja');
    }

    // Estado (activo/inactivo)
    const estado = document.createElement('span');
    estado.textContent = el.activo ? 'Activo' : 'Inactivo';
    estado.classList.add('badge');
    estado.classList.add(
      el.activo ? 'estado-activo' : 'estado-inactivo'
    );

    // Agregar badges al contenedor
    badges.appendChild(categoria);
    badges.appendChild(prioridad);
    badges.appendChild(estado);

    // === BOTÓN ELIMINAR ===
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.classList.add('btn-eliminar');

    // Evento para eliminar elemento
    btnEliminar.addEventListener('click', () => {
      eliminarElemento(el.id);
    });

    // Contenedor de acciones
    const acciones = document.createElement('div');
    acciones.classList.add('card-actions');
    acciones.appendChild(btnEliminar);

    // === ENSAMBLE FINAL DE LA TARJETA ===
    card.appendChild(titulo);
    card.appendChild(descripcion);
    card.appendChild(badges);
    card.appendChild(acciones);

    // Agrega la tarjeta al fragmento
    fragment.appendChild(card);
  });

  // Inserta todo el fragmento en el DOM de una sola vez
  contenedor.appendChild(fragment);

  // Actualiza estadísticas después de renderizar
  actualizarEstadisticas();
}

/**
 * Elimina un elemento por su ID
 */
function eliminarElemento(id) {
  // Busca la posición del elemento en el array
  const index = elementos.findIndex(el => el.id === id);

  // Si existe, lo elimina
  if (index !== -1) {
    elementos.splice(index, 1);

    // Vuelve a renderizar la lista actualizada
    renderizarLista(elementos);
  }
}

/**
 * Calcula y muestra estadísticas
 */
function actualizarEstadisticas() {
  const total = elementos.length;

  // Filtra solo los elementos activos
  const activos = elementos.filter(el => el.activo).length;

  // Actualiza el HTML
  document.getElementById('total-elementos').textContent = total;
  document.getElementById('elementos-activos').textContent = activos;
}

/**
 * Inicializa los botones de filtro
 */
function inicializarFiltros() {
  const botones = document.querySelectorAll('.btn-filtro');

  botones.forEach(btn => {
    btn.addEventListener('click', () => {

      // Obtiene la categoría desde el atributo data
      const categoria = btn.dataset.categoria;

      // Quita clase activa a todos los botones
      document.querySelectorAll('.btn-filtro')
        .forEach(b => b.classList.remove('btn-filtro-activo'));

      // Activa el botón seleccionado
      btn.classList.add('btn-filtro-activo');

      // Filtrado de datos
      if (categoria === 'todas') {
        renderizarLista(elementos);
      } else {
        const filtrados = elementos.filter(e => e.categoria === categoria);
        renderizarLista(filtrados);
      }
    });
  });
}

/**
 * INICIALIZACIÓN DE LA APP
 */
mostrarInfoEstudiante();   // Carga datos del estudiante
renderizarLista(elementos); // Muestra lista inicial
inicializarFiltros();       // Activa filtros