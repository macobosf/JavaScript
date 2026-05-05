"use strict";

const STORAGE_KEY = "tareas";

// Elementos del DOM
const input = document.querySelector("#input-tarea");
const btnAgregar = document.querySelector("#btn-agregar");
const lista = document.querySelector("#lista-tareas");
const btnLimpiar = document.querySelector("#btn-limpiar");

let tareas = [];

// LocalStorage
function cargarDelStorage() {
  const datos = localStorage.getItem(STORAGE_KEY);
  return datos ? JSON.parse(datos) : [];
}

function guardarTareas() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
}

// Lógica
function agregarTarea(texto) {
  if (!texto.trim()) return;

  const nuevaTarea = {
    id: Date.now(),
    texto: texto.trim(),
    completada: false,
  };

  tareas.push(nuevaTarea);
  guardarTareas();
  renderizar();

  input.value = "";
  input.focus();
}

function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id !== id);
  guardarTareas();
  renderizar();
}

function toggleTarea(id) {
  const tarea = tareas.find(t => t.id === id);
  if (tarea) {
    tarea.completada = !tarea.completada;
  }
  guardarTareas();
  renderizar();
}

function clearAll() {
  if (tareas.length === 0) return;

  if (confirm("¿Estás seguro?")) {
    tareas = [];
    guardarTareas();
    renderizar();
  }
}

// Render
function renderizar() {
  lista.innerHTML = "";

  if (tareas.length === 0) {
    const vacio = document.createElement("p");
    vacio.className = "vacio";
    vacio.textContent = "No hay tareas. ¡Agrega una!";
    lista.appendChild(vacio);
    btnLimpiar.disabled = true;
    return;
  }

  btnLimpiar.disabled = false;

  tareas.forEach(tarea => {
    const item = document.createElement("div");
    item.className = "item-tarea";

    if (tarea.completada) {
      item.classList.add("completada");
    }

    const texto = document.createElement("span");
    texto.className = "texto-tarea";
    texto.textContent = tarea.texto;
    texto.addEventListener("click", () => toggleTarea(tarea.id));

    const btnEliminar = document.createElement("button");
    btnEliminar.className = "btn-eliminar";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => eliminarTarea(tarea.id));

    item.appendChild(texto);
    item.appendChild(btnEliminar);
    lista.appendChild(item);
  });
}

// Eventos
btnAgregar.addEventListener("click", () => {
  agregarTarea(input.value);
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    agregarTarea(input.value);
  }
});

btnLimpiar.addEventListener("click", clearAll);

// Inicialización
tareas = cargarDelStorage();
renderizar();
input.focus();