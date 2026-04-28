'use strict';

/* =========================
   SERVICIO DE STORAGE
========================= */

const TareaStorage = {
  CLAVE: 'tareas_lista',

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
      console.error('Error al leer tareas:', error);
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
      console.error('Error al guardar tareas:', error);
    }
  },

    /**
   * TODO 4.2.1: Crear una nueva tarea
   * @param {string} texto - Texto de la tarea
   * @returns {Object} Tarea creada
   */
  crear(texto) {
    // TODO 4.2.1.1: Obtener todas las tareas con this.getAll()
    
    // TODO 4.2.1.2: Crear objeto nueva tarea con:
    //   - id: Date.now() (ID único usando timestamp)
    //   - texto: texto.trim() (sin espacios al inicio/fin)
    //   - completada: false
    
    // TODO 4.2.1.3: Agregar la nueva tarea al array con push()
    
    // TODO 4.2.1.4: Guardar el array actualizado con this.guardar(tareas)
    
    // TODO 4.2.1.5: Retornar el objeto nueva
  },

  /**
   * TODO 4.2.2: Alternar estado completada/pendiente
   * @param {number} id - ID de la tarea
   */
  toggleCompletada(id) {
    // TODO 4.2.2.1: Obtener todas las tareas
    
    // TODO 4.2.2.2: Buscar la tarea con find() usando t => t.id === id
    
    // TODO 4.2.2.3: Si existe, invertir su propiedad completada (!tarea.completada)
    
    // TODO 4.2.2.4: Guardar el array actualizado
  },

  /**
   * TODO 4.2.3: Eliminar una tarea
   * @param {number} id - ID de la tarea
   */
  eliminar(id) {
    // TODO 4.2.3.1: Obtener todas las tareas
    
    // TODO 4.2.3.2: Filtrar el array para excluir la tarea con ese id
    //   const filtradas = tareas.filter(t => t.id !== id);
    
    // TODO 4.2.3.3: Guardar el array filtrado
  },

  /**
   * TODO 4.2.4: Eliminar todas las tareas
   */
  limpiarTodo() {
    // TODO 4.2.4.1: Usar localStorage.removeItem(this.CLAVE) para eliminar la clave completa
  }

};

/* =========================
   SERVICIO DE TEMA
========================= */

const TemaStorage = {
  CLAVE: 'tema_app',

  getTema() {
    return localStorage.getItem(this.CLAVE) || 'claro';
  },

  setTema(tema) {
    localStorage.setItem(this.CLAVE, tema);
  }
};