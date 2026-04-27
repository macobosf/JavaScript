'use strict';

/* =========================
   COMPONENTES
========================= */

/**
 * Genera una tarjeta visual (card) para un post
 * usando únicamente la API del DOM.
 * @param {Object} post - Datos del post (id, title, body)
 * @returns {HTMLElement} Elemento <article> listo para renderizar
 */
function PostCard(post) {
  /* ===== CONTENEDOR PRINCIPAL ===== */
  const article = document.createElement('article');
  article.className = 'post-card fade-in';
  article.dataset.id = post.id; // Identificador del post

  /* ===== HEADER ===== */
  const header = document.createElement('div');
  header.className = 'post-card-header';

  // Título del post
  const title = document.createElement('h3');
  title.className = 'post-card-title';
  title.textContent = post.title;

  // Badge con el ID
  const badge = document.createElement('span');
  badge.className = 'post-card-id';
  badge.textContent = `#${post.id}`;

  header.append(title, badge);

  /* ===== BODY ===== */
  const body = document.createElement('p');
  body.className = 'post-card-body';
  body.textContent = post.body;

  /* ===== FOOTER ===== */
  const footer = document.createElement('div');
  footer.className = 'post-card-footer';

  // Botón editar
  const btnEditar = document.createElement('button');
  btnEditar.className = 'btn-editar';
  btnEditar.textContent = 'Editar';
  btnEditar.dataset.action = 'editar';
  btnEditar.dataset.id = post.id;

  // Botón eliminar
  const btnEliminar = document.createElement('button');
  btnEliminar.className = 'btn-eliminar';
  btnEliminar.textContent = 'Eliminar';
  btnEliminar.dataset.action = 'eliminar';
  btnEliminar.dataset.id = post.id;

  footer.append(btnEditar, btnEliminar);

  /* ===== ENSAMBLAJE FINAL ===== */
  article.append(header, body, footer);

  return article;
}

/**
 * Componente visual de carga (spinner)
 * @returns {HTMLElement}
 */
function Spinner() {
  const container = document.createElement('div');
  container.className = 'loading';

  const spinner = document.createElement('div');
  spinner.className = 'spinner';

  const texto = document.createElement('p');
  texto.textContent = 'Cargando posts...';

  container.append(spinner, texto);

  return container;
}

/**
 * Muestra un mensaje de error
 * @param {string} mensaje
 * @returns {HTMLElement}
 */
function MensajeError(mensaje) {
  const container = document.createElement('div');
  container.className = 'error';

  const titulo = document.createElement('strong');
  titulo.textContent = 'Error';

  const texto = document.createElement('p');
  texto.textContent = mensaje;

  container.append(titulo, texto);

  return container;
}

/**
 * Muestra un mensaje de éxito
 * @param {string} mensaje
 * @returns {HTMLElement}
 */
function MensajeExito(mensaje) {
  const container = document.createElement('div');
  container.className = 'success';

  const texto = document.createElement('p');
  texto.textContent = mensaje;

  container.append(texto);

  return container;
}

/**
 * Componente cuando no hay datos
 * @returns {HTMLElement}
 */
function EstadoVacio() {
  const container = document.createElement('div');
  container.className = 'estado-vacio';

  const texto = document.createElement('p');
  texto.textContent = 'No hay posts para mostrar';

  container.append(texto);

  return container;
}

/**
 * Renderiza una lista de posts en el contenedor indicado
 * @param {Array} posts
 * @param {HTMLElement} contenedor
 */
function renderizarPosts(posts, contenedor) {
  // Limpiar contenido anterior
  contenedor.innerHTML = '';

  // Caso sin datos
  if (!posts || posts.length === 0) {
    contenedor.appendChild(EstadoVacio());
    return;
  }

  // Renderizar cada post
  posts.forEach(post => {
    contenedor.appendChild(PostCard(post));
  });
}

/**
 * Muestra indicador de carga
 * @param {HTMLElement} contenedor
 */
function mostrarCargando(contenedor) {
  contenedor.innerHTML = '';
  contenedor.appendChild(Spinner());
}

/**
 * Muestra un mensaje temporal (error o éxito)
 * @param {HTMLElement} contenedor
 * @param {HTMLElement} elemento
 * @param {number} duracion - milisegundos (0 = permanente)
 */
function mostrarMensajeTemporal(contenedor, elemento, duracion = 3000) {
  contenedor.innerHTML = '';
  contenedor.appendChild(elemento);

  // Asegura visibilidad
  contenedor.classList.remove('oculto');

  // Auto-ocultar si aplica
  if (duracion > 0) {
    setTimeout(() => {
      contenedor.classList.add('oculto');
    }, duracion);
  }
}