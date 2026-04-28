"use strict";

/* =========================
   SERVICIO DE STORAGE
========================= */

const TareaStorage = {
  CLAVE: "tareas_lista",
  /**
   * Obtener todas las tareas desde localStorage
   * @returns {Array} Array de tareas
   */
  getAll() {
    try {
      const datos = localStorage.getItem(this.CLAVE);
      if (!datos) {
        return [];
      }
      return JSON.parse(datos);
    } catch (error) {
      console.error("Error al leer tareas:", error);
      return [];
    }
  },

  /**
   * Guardar todas las tareas en localStorage
   * @param {Array} tareas - Array de tareas
   */
  guardar(tareas) {
    try {
      localStorage.setItem(this.CLAVE, JSON.stringify(tareas));
    } catch (error) {
      console.error("Error al guardar tareas:", error);
    }
  },

  /**
   * Crear una nueva tarea y persistirla en almacenamiento
   * @param {string} texto - Texto descriptivo de la tarea
   * @returns {Object} Tarea creada
   */
  crear(texto) {
    // evitar crear tareas vacías o con solo espacios
    if (!texto || !texto.trim()) {
      throw new Error("El texto de la tarea es obligatorio");
    }

    // Obtener todas las tareas actuales
    const tareas = this.getAll();

    // Construir el objeto de la nueva tarea
    const nueva = {
      id: Date.now(), // Genera un ID único basado en el tiempo
      texto: texto.trim(), // Limpia espacios innecesarios
      completada: false, // Estado inicial: pendiente
    };

    // Agregar la nueva tarea al listado existente
    tareas.push(nueva);

    // Persistir el listado actualizado en localStorage
    this.guardar(tareas);

    // Retornar la tarea creada (útil para renderizar en UI)
    return nueva;
  },

  /**
   * Alterna el estado de una tarea (completada ↔ pendiente)
   * @param {number} id - ID de la tarea
   */
  toggleCompletada(id) {
    // Obtener todas las tareas
    const tareas = this.getAll();

    // Buscar la tarea por su identificador
    const tarea = tareas.find((t) => t.id === id);

    // Si la tarea existe, invertir su estado
    if (tarea) {
      tarea.completada = !tarea.completada;

      // Guardar los cambios en almacenamiento
      this.guardar(tareas);
    } else {
      console.warn(`Tarea no encontrada con id: ${id}`);
    }
  },

  /**
   * Elimina una tarea específica del listado
   * @param {number} id - ID de la tarea
   */
  eliminar(id) {
    // Obtener todas las tareas
    const tareas = this.getAll();

    //Filtrar el array excluyendo la tarea indicada
    const filtradas = tareas.filter((t) => t.id !== id);

    // Guardar el nuevo listado sin la tarea eliminada
    this.guardar(filtradas);
  },

  /**
   * Elimina completamente todas las tareas almacenadas
   */
  limpiarTodo() {
    // Eliminar la clave del almacenamiento local
    // Esto borra todos los datos asociados a las tareas
    localStorage.removeItem(this.CLAVE);
  },
};

/* =========================
   SERVICIO DE TEMA
========================= */

const TemaStorage = {
  CLAVE: "tema_app",

  getTema() {
    return localStorage.getItem(this.CLAVE) || "claro";
  },

  setTema(tema) {
    localStorage.setItem(this.CLAVE, tema);
  },
};
