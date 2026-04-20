# Solución practica DOM basico
 
 El ejercicio se trata de comprender el uso de java script puro, enfocando la manipulacion del DOM.

**Este ejercicio nos permite:**
- Visualizar informacion de un Estudiante.
- Mostrar una lista de tareas de forma dinamica.
- Poder filtrar estas tareas por categoria(Trabajo, Personal, Estudio).
- Botones para eliminar tareas de la lista.
- Ver estadisticas en tiempo real.

**La lógica principal esta implementada en JavaScript, con un enfoque hibrido entre:**
- Creción dinamica de elementos```(createElement)```
- Uso eficiente del DOM mediante ```DocumenteFragment```
- Manejo de evetos para la interacción del usuario.

## Renderizado dinamico de tarjetas
#### Solucion en JS
Este fragmento de codigo muestra como se generan dinamicamente las tarjetas en el DOM a partir de un array de datos.
```js
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
```
#### Estilos CSS para el renderizado de las tarjetas
Esta linea de CSS hace que:
- Se vea como una tarjeta.
- Tenga badges bonitos.
- Tenga el boton alineado.
- Tenga hover.

```css
/* =========================
   TARJETAS
   ========================= */
.card {
  background: #ffffff;
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 15px;

  /* Sombra suave */
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);

  /* Animación al interactuar */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Efecto hover (levanta la tarjeta) */
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 18px rgba(0,0,0,0.12);
}

/* =========================
   TEXTO DE TARJETAS
   ========================= */
.card h3 {
  color: #2d3748;
  margin-bottom: 5px;
}

.card p {
  color: #718096;
  font-size: 14px;
}

/* =========================
   BADGES (ETIQUETAS)
   ========================= */
.badges {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap; /* permite que bajen de línea */
}

/* Estilo base de badges */
.badge {
  padding: 5px 10px;
  border-radius: 999px; /* completamente redondeado */
  font-size: 12px;
  font-weight: 600;
}

/* Categoría */
.badge-categoria {
  background: #e6fffa;
  color: #2c7a7b;
}

/* =========================
   PRIORIDADES
   ========================= */
/* Alta = rojo suave */
.prioridad-alta {
  background: #ffe4e6;
  color: #c53030;
}

/* Media = amarillo suave */
.prioridad-media {
  background: #fefcbf;
  color: #b7791f;
}

/* Baja = azul suave */
.prioridad-baja {
  background: #ebf8ff;
  color: #2b6cb0;
}

/* =========================
   ESTADO
   ========================= */
/* Activo = verde suave */
.estado-activo {
  background: #e6fffa;
  color: #2f855a;
}

/* Inactivo = gris */
.estado-inactivo {
  background: #edf2f7;
  color: #718096;
}

/* =========================
   ACCIONES
   ========================= */
/* Contenedor del botón */
.card-actions {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end; /* alinea a la derecha */
}

/* Botón eliminar */
.btn-eliminar {
  background: #e53e3e;
  border: none;
  color: white;
  padding: 7px 14px;
  border-radius: 8px;
  cursor: pointer;

  /* transición para animación */
  transition: all 0.2s ease;
}

/* Hover botón eliminar */
.btn-eliminar:hover {
  background: #c53030;
  transform: scale(1.05); /* pequeño zoom */
}

```
## Eliminación de elementos
#### Solución en JS
Nos permite eliminar una tarea mediante su ID y actuliza la interfaz de manera automatica.
```js

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

```

#### El CSS de esta funcion solo se encarga de como se ve el boton.

```css
/* Botón eliminar */
.btn-eliminar {
  background: #e53e3e;
  border: none;
  color: white;
  padding: 7px 14px;
  border-radius: 8px;
  cursor: pointer;

  /* transición para animación */
  transition: all 0.2s ease;
}

/* Hover botón eliminar */
.btn-eliminar:hover {
  background: #c53030;
  transform: scale(1.05); /* pequeño zoom */
}

```
## Filtrado de Tareas
Implemetna la logica de filtrado uzando atributs ```data-*``` y metodos de arrays.

```js

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

```
## Vista General de la aplicacion
![Figura: Vista general de la aplicacion.](/02_dom_basico/assets/C7.png)

## Renderizado de Tarjetas
El resultado en el renderizado de las tarjetas ya en la vista a usuario nos da lo siguiente.

![Figura: Renderizado dinámico de tarjetas a partir del array de datos mediante manipulación del DOM.](/02_dom_basico/assets/C3.png)

![Figura: Renderizado dinámico de tarjetas a partir del array de datos mediante manipulación del DOM.](/02_dom_basico/assets/C4.png)

![Figura: Renderizado dinámico de tarjetas a partir del array de datos mediante manipulación del DOM.](/02_dom_basico/assets/C5.png)

![Renderizado dinámico de tarjetas a partir del array de datos mediante manipulación del DOM.](/02_dom_basico/assets/C6.png)

***Renderizado dinámico de tarjetas a partir del array de datos mediante manipulación del DOM.***


