# Practica-06 Fetch API
Aplicacion web tipo (SPA), que permite gestionar publicaciones (posts), mediante consumos de una API publica.
El sistema implementa operaciones CRUD completas, mediante manejo de interfaz y renderizado usando JavaScript puro (Vanilla JS).

## 🎯 Objetivos
- Aplicar el uso de Fetch API para consumo de servicios REST.
- Implementar operaciones CRUD completas.
- Separar responsabilidades (API, componentes, lógica).
- Manipular DOM de forma Dinamica.
- Crear una interfaz interactiva y responsive.

## Aruquitectura del proyecto
### Servicio API (apiService.js)
Encapsula toda la lógica de comunicación con la API.

Responsabilidades:

- Centralizar peticiones HTTP
- Manejar errores de red
- Abstraer el uso de fetch

Operaciones implementadas:

GET /posts → Obtener lista de posts
GET /posts/{id} → Obtener post por ID
POST /posts → Crear post
PUT /posts/{id} → Actualizar post
DELETE /posts/{id} → Eliminar post

## Flujo de la Aplicación
1. Al iniciar:
- Se ejecuta cargarPosts()
- Se obtiene data desde la API
-Se renderizan los posts
2. Usuario interactúa:
- Crear / editar → formulario
- Eliminar → confirmación
- Buscar → filtrado en memoria
3. Actualización:
- Se modifica el estado (posts)
- Se re-renderiza la UI

## 📂 Estructura del Proyecto
```
/practica_06 
│ 
├── css/ 
│ └── styles.css # Estilos de la aplicación (UI, layout, responsive) 
│ 
├── js/ 
│ ├── apiService.js     # Servicio API (peticiones HTTP - CRUD) 
│ ├── components.js     # Componentes reutilizables (UI dinámica) 
│ └── app.js            # Lógica principal de la aplicación 
│ 
└── index.html # Estructura base de la aplicación
```
## Metodo generico de peticiones (API Service)
Este método centraliza todas las llamadas HTTP usando fetch, manejando errores y parseo de respuesta.

```js

async request(endpoint, options = {}) { 
    
    const url = `${this.baseUrl}${endpoint}`; 
    
    const config = { 
        headers: { 
            'Content-Type': 'application/json', 
            ...options.headers 
        }, 
        ...options 
    }; 
    
    const response = await fetch(url, config); 
    
    if (!response.ok) { 
        throw new Error(`HTTP Error: ${response.status}`); 
    } 
        
    return response.status === 204 ? null : response.json(); 
}

```


## Evidencia de Funcionamiento