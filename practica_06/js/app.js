'use strict';

/* =========================
   SELECCIÓN DE ELEMENTOS
========================= */

/**
 * Referencias a elementos del DOM
 * Se utilizan para interactuar con el formulario,
 * búsqueda, listado y mensajes de estado
 */
const formPost = document.querySelector('#form-post');
const inputPostId = document.querySelector('#post-id');
const inputTitulo = document.querySelector('#titulo');
const inputContenido = document.querySelector('#contenido');
const btnSubmit = document.querySelector('#btn-submit');
const btnCancelar = document.querySelector('#btn-cancelar');

const inputBuscar = document.querySelector('#input-buscar');
const btnBuscar = document.querySelector('#btn-buscar');
const btnLimpiar = document.querySelector('#btn-limpiar');

const listaPosts = document.querySelector('#lista-posts');
const mensajeEstado = document.querySelector('#mensaje-estado');
const contador = document.querySelector('#contador strong');

/* =========================
   ESTADO GLOBAL
========================= */

/**
 * Variables de estado de la aplicación
 * - posts: lista completa obtenida desde la API
 * - postsFiltrados: lista actual (puede estar filtrada)
 * - modoEdicion: indica si el formulario está en modo edición
 */
let posts = [];
let postsFiltrados = [];
let modoEdicion = false;

/* =========================
   FUNCIONES PRINCIPALES
========================= */

/**
 * Carga los posts desde la API y los renderiza
 * Maneja estados de carga y errores
 */
async function cargarPosts() {
  try {
    // Mostrar indicador de carga
    mostrarCargando(listaPosts);

    // Obtener posts desde la API
    posts = await ApiService.getPosts(20);

    // Inicializar lista filtrada
    postsFiltrados = [...posts];

    // Renderizar en el DOM
    renderizarPosts(postsFiltrados, listaPosts);

    // Actualizar contador visual
    actualizarContador();

  } catch (error) {
    // Manejo de errores en UI
    listaPosts.innerHTML = '';
    listaPosts.appendChild(
      MensajeError(`No se pudieron cargar los posts: ${error.message}`)
    );
  }
}

/**
 * Actualiza el contador de posts visibles
 */
function actualizarContador() {
  contador.textContent = postsFiltrados.length;
}

/**
 * Limpia el formulario y restablece el estado inicial
 */
function limpiarFormulario() {
  formPost.reset();
  inputPostId.value = '';
  modoEdicion = false;

  // Restaurar UI
  btnSubmit.textContent = 'Crear Post';
  btnCancelar.style.display = 'none';
}

/**
 * Activa el modo edición y carga los datos del post en el formulario
 * @param {Object} post - Post seleccionado
 */
function activarModoEdicion(post) {
  modoEdicion = true;

  // Cargar datos en inputs
  inputPostId.value = post.id;
  inputTitulo.value = post.title;
  inputContenido.value = post.body;

  // Actualizar UI
  btnSubmit.textContent = 'Actualizar Post';
  btnCancelar.style.display = 'inline-block';

  // Mejorar UX: scroll y foco
  formPost.scrollIntoView({ behavior: 'smooth', block: 'start' });
  inputTitulo.focus();
}

/**
 * Crea o actualiza un post dependiendo del modo actual
 * @param {Object} datosPost - Datos ingresados en el formulario
 */
async function guardarPost(datosPost) {
  try {
    // Bloquear botón durante la operación
    btnSubmit.disabled = true;
    btnSubmit.textContent = modoEdicion ? 'Actualizando...' : 'Creando...';

    let resultado;

    if (modoEdicion) {
      const id = parseInt(inputPostId.value);

      // Actualizar en API
      resultado = await ApiService.updatePost(id, datosPost);

      // Sincronizar con estado local
      const index = posts.findIndex(p => p.id === id);
      if (index !== -1) {
        posts[index] = { ...resultado, id };
      }

      // Feedback al usuario
      mostrarMensajeTemporal(
        mensajeEstado,
        MensajeExito(`Post #${id} actualizado correctamente`),
        3000
      );

    } else {
      // Crear en API
      resultado = await ApiService.createPost(datosPost);

      // Agregar al inicio del array
      posts.unshift(resultado);

      mostrarMensajeTemporal(
        mensajeEstado,
        MensajeExito(`Post #${resultado.id} creado correctamente`),
        3000
      );
    }

    // Re-renderizar UI
    postsFiltrados = [...posts];
    renderizarPosts(postsFiltrados, listaPosts);
    actualizarContador();

    // Resetear formulario
    limpiarFormulario();

  } catch (error) {
    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeError(`Error al guardar: ${error.message}`),
      5000
    );
  } finally {
    // Restaurar estado del botón
    btnSubmit.disabled = false;
    btnSubmit.textContent = modoEdicion ? 'Actualizar Post' : 'Crear Post';
  }
}

/**
 * Elimina un post por ID
 * @param {number} id
 */
async function eliminarPost(id) {
  // Confirmación del usuario
  if (!confirm(`¿Eliminar el post #${id}?`)) return;

  try {
    // Eliminar en API
    await ApiService.deletePost(id);

    // Actualizar estado local
    posts = posts.filter(p => p.id !== id);
    postsFiltrados = postsFiltrados.filter(p => p.id !== id);

    // Actualizar UI
    renderizarPosts(postsFiltrados, listaPosts);
    actualizarContador();

    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeExito(`Post #${id} eliminado correctamente`),
      3000
    );

  } catch (error) {
    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeError(`Error al eliminar: ${error.message}`),
      5000
    );
  }
}

/**
 * Filtra los posts por título o contenido
 * @param {string} termino
 */
function buscarPosts(termino) {
  const terminoLower = termino.toLowerCase().trim();

  if (terminoLower === '') {
    // Resetear filtro
    postsFiltrados = [...posts];
  } else {
    // Filtrar por coincidencia en título o contenido
    postsFiltrados = posts.filter(post => {
      const tituloMatch = post.title.toLowerCase().includes(terminoLower);
      const bodyMatch = post.body.toLowerCase().includes(terminoLower);
      return tituloMatch || bodyMatch;
    });
  }

  renderizarPosts(postsFiltrados, listaPosts);
  actualizarContador();
}

/**
 * Restablece la búsqueda
 */
function limpiarBusqueda() {
  inputBuscar.value = '';
  postsFiltrados = [...posts];
  renderizarPosts(postsFiltrados, listaPosts);
  actualizarContador();
}

/* =========================
   EVENT LISTENERS
========================= */

/**
 * Manejo del submit del formulario
 * Determina si se crea o actualiza un post
 */
formPost.addEventListener('submit', (e) => {
  e.preventDefault();

  const datosPost = {
    title: inputTitulo.value.trim(),
    body: inputContenido.value.trim(),
    userId: 1
  };

  guardarPost(datosPost);
});

/**
 * Cancelar modo edición
 */
btnCancelar.addEventListener('click', limpiarFormulario);

/**
 * Ejecutar búsqueda manual
 */
btnBuscar.addEventListener('click', () => {
  buscarPosts(inputBuscar.value);
});

/**
 * Ejecutar búsqueda con tecla Enter
 */
inputBuscar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    buscarPosts(inputBuscar.value);
  }
});

/**
 * Limpiar filtro de búsqueda
 */
btnLimpiar.addEventListener('click', limpiarBusqueda);

/**
 * Delegación de eventos para acciones dinámicas
 * (editar y eliminar posts)
 */
listaPosts.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  if (!action) return;

  const id = parseInt(e.target.dataset.id);
  const post = posts.find(p => p.id === id);

  if (action === 'editar' && post) {
    activarModoEdicion(post);
  }

  if (action === 'eliminar') {
    eliminarPost(id);
  }
});

/* =========================
   INICIALIZACIÓN
========================= */

/**
 * Punto de entrada de la aplicación
 * Carga los datos iniciales
 */
cargarPosts();