'use strict';

/* =========================
   API SERVICE
========================= */

/**
 * Objeto encargado de manejar todas las peticiones HTTP
 * hacia la API de JSONPlaceholder
 */
const ApiService = {
  // URL base de la API
  baseUrl: 'https://jsonplaceholder.typicode.com',

  /**
   * Método genérico para hacer peticiones HTTP
   * @param {string} endpoint - Ruta del endpoint (ej: '/posts')
   * @param {object} options - Opciones de fetch (method, body, headers)
   * @returns {Promise} - Promesa con los datos parseados
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    // Configuración por defecto de la petición
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers // Permite sobreescribir headers si se envían
      },
      ...options // Agrega method, body, etc.
    };

    try {
      const response = await fetch(url, config);

      // fetch NO lanza error en respuestas 4xx o 5xx
      // por eso validamos manualmente
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      // Si la respuesta es 204 (No Content), no hay JSON que retornar
      if (response.status === 204) {
        return null;
      }

      // Convertimos la respuesta a JSON
      return await response.json();

    } catch (error) {
      console.error('Error en petición:', error);
      throw error; // Propaga el error para manejarlo afuera
    }
  },

  /**
   * GET - Obtener todos los posts (con límite opcional)
   * @param {number} limit - Número máximo de posts
   */
  async getPosts(limit = 10) {
    return this.request(`/posts?_limit=${limit}`);
  },

  /**
   * GET - Obtener un post por ID
   * @param {number} id - ID del post
   */
  async getPostById(id) {
    return this.request(`/posts/${id}`);
  },

  /**
   * POST - Crear un nuevo post
   * @param {object} postData - Datos del nuevo post
   */
  async createPost(postData) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  },

  /**
   * PUT - Actualizar un post completo
   * @param {number} id - ID del post
   * @param {object} postData - Nuevos datos del post
   */
  async updatePost(id, postData) {
    return this.request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData)
    });
  },

  /**
   * DELETE - Eliminar un post
   * @param {number} id - ID del post
   */
  async deletePost(id) {
    return this.request(`/posts/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * GET - Obtener posts filtrados por usuario
   * @param {number} userId - ID del usuario
   */
  async getPostsByUser(userId) {
    return this.request(`/posts?userId=${userId}`);
  }
};