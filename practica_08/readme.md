# Practica-08 Formularios Validacion
Este proyecto consiste en la implementación de un formulario de registro web con validación completa del lado del cliente utilizando JavaScript puro (Vanilla JS).

El sistema valida los datos ingresados en tiempo real, proporciona retroalimentación visual al usuario y gestiona el envío de forma controlada sin recargar la página.

## Objetivos
- Implementar validación de formularios sin usar librerías externas
- Aplicar expresiones regulares para validar datos
- Mejorar la experiencia de usuario con feedback visual
- Manipular el DOM de manera dinámica
- Gestionar almacenamiento temporal con sessionStorage

## Funcionalidades Implementadas
### Validación de Campos
- Nombre (mínimo 3 caracteres)
- Email (formato válido con regex)
- Teléfono (formato con máscara (099) 123-4567)
- Fecha de nacimiento (mayor de edad)
- Género (selección obligatoria)
- Contraseña (mínimo 8 caracteres, mayúscula, minúscula y número)
- Confirmación de contraseña
- Aceptación de términos

### Validación en Tiempo Real
- Evento focusout → valida al salir del campo
- Evento input → limpia errores al escribir
- Estilos visuales:
    - 🔴 Campo inválido
    - 🟢 Campo válido

### Seguridad y UX
- Indicador de fuerza de contraseña dinámico
- Botón de envío deshabilitado hasta que el formulario sea válido
- Mostrar/Ocultar contraseña con icono 👁️

### Persistencia de Datos
- Uso de sessionStorage para guardar datos automáticamente
- Recuperación de datos al recargar la página

### Envío del Formulario
- Uso de event.preventDefault()
- Validación completa antes del envío
- Extracción de datos con:
    - Object.fromEntries(new FormData(form))
- Mensaje de éxito o error
- Reseteo del formulario tras envío exitoso

## Evidencia Grafica
### Errores de Validacion
![Errores](/JavaScript/practica_08/assets/error.png)

**Descripcion:** Se muestran mensajes de error

### Campos Validados
![Validacion](/JavaScript/practica_08/assets/valido.png)

**Descripcion:** Campos validados segun los parametros

### Registro
![Registro](/JavaScript/practica_08/assets/registro.png)

**Descripcion:** Registro Exitoso