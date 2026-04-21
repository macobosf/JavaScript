# Solución Practica-03 Eventos
El ejercicio consiste en un aplicacion web, desarrollada con JS, HTML, y CSS, que integra funcionalidades como:

## 1. Formulario de contacto interactivo
Se implementa un fomrulario en el cual el usuario puede ingresar:
- Nombre
- Email
- Asunto 
- Mensaje

En los cuales sus características principales son:
- Validacion en tiempo real con (blur e input).
- Validación mediante expresiones regulares para el email.
- Mensajes de error dinácos.
- Contador de caracteres en el textarea.
- Detección de errores para detener el envío.
- Visualización de datos sin recargar la página.
- Atajo de teclado (Crtl + Enter) para enviar.

### 1.2 Sistema de gestión de Tareas (To-Do-List)
Nos ayuda a administrar una lista de tareas de manera dinamica.

**Funcionalidades**
- Colocar nuevas tareas.
- Marcar las tareas que ya esten completas.
- Eliminar tareas.
- Contador de tareas aun pendientes.
- Renderizado de manera dinamica del DOM.

### 1.3 Diseño y estilos
- Diseño responsive usando CSS.
- Uso de flexbox para la estructura.
- Estilos para estados (error, completado, hover).
- Interfaz centrada en usabilidad.

## 2. Fragmentos de código de funciones principales.

### Validación de campos
```js 

// Función genérica para validar campos
function validarCampo(input, esValido, errorId) {
  const errorMsg = document.getElementById(errorId);

  if (esValido) {
    input.classList.remove('error');
    errorMsg.classList.remove('visible');
  } else {
    input.classList.add('error');
    errorMsg.classList.add('visible');
  }

  return esValido;
}

```
### Validación de email
```js

function validarEmail() {
  return validarCampo(
    inputEmail,
    EMAIL_REGEX.test(inputEmail.value.trim()),
    'error-email'
  );
}

```

### Contador de caracteres
```js

function actualizarContador(e) {
  const longitud = e.target.value.length;
  charCount.textContent = longitud;
  charCount.style.color = longitud > 270 ? '#e74c3c' : '#999';
}

```

### Mostrar resultados del formulario

```js

// Muestra los datos ingresados
function mostrarResultado() {
  resultado.innerHTML = '';

  const titulo = document.createElement('strong');
  titulo.textContent = 'Datos recibidos:';

  const pNombre = document.createElement('p');
  pNombre.textContent = `Nombre: ${inputNombre.value.trim()}`;

  const pEmail = document.createElement('p');
  pEmail.textContent = `Email: ${inputEmail.value.trim()}`;

  const pAsunto = document.createElement('p');
  pAsunto.textContent = `Asunto: ${selectAsunto.options[selectAsunto.selectedIndex].text}`;

  const pMensaje = document.createElement('p');
  pMensaje.textContent = `Mensaje: ${textMensaje.value.trim()}`;

  resultado.appendChild(titulo);
  resultado.appendChild(pNombre);
  resultado.appendChild(pEmail);
  resultado.appendChild(pAsunto);
  resultado.appendChild(pMensaje);

  resultado.classList.add('visible');
}
```
### Renderizado de tareas

```js

function renderizarTareas() {
  listaTareas.innerHTML = '';

  if (tareas.length === 0) {
    const itemVacio = document.createElement('li');
    itemVacio.className = 'estado-vacio';
    itemVacio.textContent = 'No hay tareas registradas';
    listaTareas.appendChild(itemVacio);
    contadorTareas.textContent = '0 pendiente(s)';
    return;
  }

  tareas.forEach((tarea) => {
    const item = crearItemTarea(tarea);
    listaTareas.appendChild(item);
  });

  actualizarContadorTareas();
}

```
### Agregar tarea
```js

function agregarTarea() {
  const texto = inputNuevaTarea.value.trim();

  if (texto === '') {
    inputNuevaTarea.focus();
    return;
  }

  tareas.push({
    id: Date.now(),
    texto,
    completada: false
  });

  inputNuevaTarea.value = '';
  renderizarTareas();
  inputNuevaTarea.focus();
}

```
### Manejo de eventos en la lista

```js

listaTareas.addEventListener('click', (e) => {
  const action = e.target.dataset.action;

  if (!action) return;

  const item = e.target.closest('li');
  if (!item || !item.dataset.id) return;

  const id = Number(item.dataset.id);

  if (action === 'eliminar') {
    tareas = tareas.filter((tarea) => tarea.id !== id);
    renderizarTareas();
    return;
  }

  if (action === 'toggle') {
    const tarea = tareas.find((itemTarea) => itemTarea.id === id);
    if (tarea) {
      tarea.completada = !tarea.completada;
      renderizarTareas();
    }
  }
});

```

## Conclusiones
Este ejercicio nos indica:
- Uso correcto del DOM y los eventos en JS.
- Validacion de robusta del lado del cliente.
- Interactividad sin recargar la pagina.
- Manipulación dinámica de las listas.

## Capturas de la Aplicación

### 1. Validación en acción
![Figura: Validacion en accion.](/03_eventos/assets/Validacion-en-accion.png)
### 2. Formulario procesado
![Figura: Formulario Procesado.](/03_eventos/assets/Formulario-procesado.png)
### 3. Event delegation funcionando
![Figura: Event delegation funcionando.](/03_eventos/assets/Event-01.png)
![Figura: Event delegation funcionando.](/03_eventos/assets/Event-02.png)
### 4. Contador de tareas actualizado
![Figura: Contador de tareas actualizado.](/03_eventos/assets/Contador-Tareas.png)
### 5. Tareas completadas
![Figura: Tareas Completadas.](/03_eventos/assets/Tareas-Completas.png)