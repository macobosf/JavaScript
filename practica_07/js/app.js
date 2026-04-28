"use strict";

/* =========================
   SELECCIÓN DE ELEMENTOS DOM
========================= */

// Referencias a elementos clave del DOM
const formTarea = document.getElementById("form-tarea");
const inputTarea = document.getElementById("input-tarea");
const listaTareas = document.getElementById("lista-tareas");
const mensajeEstado = document.getElementById("mensaje-estado");
const btnLimpiar = document.getElementById("btn-limpiar");
const themeBtns = document.querySelectorAll("[data-theme]");

/* =========================
   ESTADO GLOBAL
========================= */

// Estado en memoria que refleja las tareas actuales
let tareas = [];

/**
 * Crear elemento simple de tarea (versión básica)
 * @param {Object} tarea
 * @returns {HTMLElement}
 */
function crearTarea(tarea) {
  const li = document.createElement("li");

  // textContent evita inyección de HTML (seguridad)
  li.textContent = tarea.texto;

  return li;
}

/**
 * Crear elemento completo de tarea con estructura y eventos
 * @param {Object} tarea - { id, texto, completada }
 * @returns {HTMLElement} Elemento <li>
 */
function crearElementoTarea(tarea) {
  // Crear contenedor principal
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.id = tarea.id;

  // Aplicar estilo si está completada
  if (tarea.completada) {
    li.classList.add("task-item--completed");
  }

  // Crear checkbox de estado
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-item__checkbox";
  checkbox.checked = tarea.completada;

  // Crear texto de la tarea
  const span = document.createElement("span");
  span.className = "task-item__text";
  span.textContent = tarea.texto;

  // Crear botón de eliminación
  const btnEliminar = document.createElement("button");
  btnEliminar.className = "btn btn--danger btn--small";
  btnEliminar.textContent = "🗑️";

  // Contenedor de acciones
  const divAcciones = document.createElement("div");
  divAcciones.className = "task-item__actions";
  divAcciones.appendChild(btnEliminar);

  // Ensamblar estructura
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(divAcciones);

  // Eventos
  checkbox.addEventListener("change", () => toggleTarea(tarea.id));
  btnEliminar.addEventListener("click", () => eliminarTarea(tarea.id));

  return li;
}

/**
 * Renderizar todas las tareas en el DOM
 */
function renderizarTareas() {
  // Limpiar contenido previo para evitar duplicados
  listaTareas.innerHTML = "";

  // Estado vacío
  if (tareas.length === 0) {
    const divVacio = document.createElement("div");
    divVacio.className = "empty-state";

    const p = document.createElement("p");
    p.textContent = "🎉 No hay tareas. ¡Agrega una para comenzar!";

    divVacio.appendChild(p);
    listaTareas.appendChild(divVacio);
    return;
  }

  // Renderizar cada tarea
  tareas.forEach((tarea) => {
    const elemento = crearElementoTarea(tarea);
    listaTareas.appendChild(elemento);
  });
}

/**
 * Mostrar mensaje temporal en UI
 * @param {string} texto
 * @param {string} tipo - 'success' | 'error'
 */
function mostrarMensaje(texto, tipo = "success") {
  mensajeEstado.textContent = texto;
  mensajeEstado.className = `mensaje mensaje--${tipo}`;
  mensajeEstado.classList.remove("oculto");

  // Ocultar automáticamente después de 3 segundos
  setTimeout(() => {
    mensajeEstado.classList.add("oculto");
  }, 3000);
}

/**
 * Cargar tareas desde almacenamiento persistente
 */
function cargarTareas() {
  tareas = TareaStorage.getAll();
  renderizarTareas();
}

/**
 * Agregar nueva tarea
 * @param {string} texto
 */
function agregarTarea(texto) {
  // Validación de entrada
  if (!texto.trim()) {
    mostrarMensaje("El texto no puede estar vacío", "error");
    return;
  }

  // Crear tarea en storage
  const nueva = TareaStorage.crear(texto);

  // Sincronizar estado local
  tareas = TareaStorage.getAll();

  // Actualizar UI
  renderizarTareas();

  // Feedback al usuario
  mostrarMensaje(`✓ Tarea "${nueva.texto}" agregada`);
}

/**
 * Alternar estado de una tarea
 * @param {number} id
 */
function toggleTarea(id) {
  // Cambiar estado en almacenamiento
  TareaStorage.toggleCompletada(id);

  // Sincronizar estado local
  tareas = TareaStorage.getAll();

  // Re-renderizar UI
  renderizarTareas();
}

/**
 * Eliminar tarea específica
 * @param {number} id
 */
function eliminarTarea(id) {
  // Buscar tarea para mostrar en confirmación
  const tarea = tareas.find((t) => t.id === id);

  if (!tarea) return;

  // Confirmación del usuario
  if (!confirm(`¿Eliminar "${tarea.texto}"?`)) return;

  // Eliminar desde storage
  TareaStorage.eliminar(id);

  // Actualizar estado local
  tareas = TareaStorage.getAll();

  // Re-renderizar
  renderizarTareas();

  // Mensaje de confirmación
  mostrarMensaje("🗑️ Tarea eliminada");
}

/**
 * Eliminar todas las tareas
 */
function limpiarTodo() {
  // Validar que existan tareas
  if (tareas.length === 0) {
    mostrarMensaje("No hay tareas para eliminar", "error");
    return;
  }

  // Confirmación
  if (!confirm("¿Seguro que deseas eliminar TODAS las tareas?")) return;

  // Limpiar almacenamiento
  TareaStorage.limpiarTodo();

  // Resetear estado local
  tareas = [];

  // Re-renderizar UI
  renderizarTareas();

  // Feedback
  mostrarMensaje("🧹 Todas las tareas eliminadas");
}

/**
 * Aplicar tema visual
 * @param {string} nombreTema - 'claro' | 'oscuro'
 */
function aplicarTema(nombreTema) {
  // Aplicación dinámica de variables CSS
  if (nombreTema === "oscuro") {
    document.documentElement.style.setProperty("--bg-primary", "#1a1a2e");
    document.documentElement.style.setProperty("--card-bg", "#16213e");
    document.documentElement.style.setProperty("--text-color", "#ffffff");
  } else {
    // Reset (tema claro por defecto)
    document.documentElement.style.removeProperty("--bg-primary");
    document.documentElement.style.removeProperty("--card-bg");
    document.documentElement.style.removeProperty("--text-color");
  }

  // Actualizar estado visual de botones
  themeBtns.forEach((btn) => {
    btn.classList.toggle("theme-btn--active", btn.dataset.theme === nombreTema);
  });

  // Persistir preferencia
  TemaStorage.setTema(nombreTema);
}

/* =========================
   EVENTOS
========================= */

// Envío del formulario (crear tarea)
formTarea.addEventListener("submit", (e) => {
  e.preventDefault();

  const texto = inputTarea.value.trim();
  agregarTarea(texto);

  // Limpiar input
  inputTarea.value = "";
});

// Botón limpiar todo
btnLimpiar.addEventListener("click", limpiarTodo);

// Cambio de tema
themeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    aplicarTema(btn.dataset.theme);
  });
});

/* =========================
   INICIALIZACIÓN
========================= */

// Cargar tema previamente guardado
const temaGuardado = TemaStorage.getTema();
aplicarTema(temaGuardado);

// Cargar tareas desde almacenamiento
cargarTareas();

// Mensaje inicial si no hay tareas
if (tareas.length === 0) {
  mostrarMensaje("👋 Bienvenido! Agrega tu primera tarea", "success");
}
