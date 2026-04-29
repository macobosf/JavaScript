/**
 * Valida un campo individual según su tipo
 * @param {HTMLInputElement} campo
 * @returns {boolean}
 */
export function validarCampo(campo) {
  const valor = campo.value.trim();
  let valido = true;
  let mensaje = "";

  switch (campo.name) {
    case "nombre":
      // Mínimo 3 caracteres
      if (valor.length < 3) {
        valido = false;
        mensaje = "Mínimo 3 caracteres";
      }
      break;

    case "email":
      // Validación con regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(valor)) {
        valido = false;
        mensaje = "Email inválido";
      }
      break;

    case "telefono":
      // Formato con máscara
      const telRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
      if (!telRegex.test(valor)) {
        valido = false;
        mensaje = "Formato: (099) 123-4567";
      }
      break;

    case "fecha":
      // Validar mayoría de edad
      const edad = new Date().getFullYear() - new Date(valor).getFullYear();
      if (edad < 18) {
        valido = false;
        mensaje = "Debe ser mayor de edad";
      }
      break;

    case "password":
      // Seguridad de contraseña
      const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passRegex.test(valor)) {
        valido = false;
        mensaje = "Mínimo 8, mayúscula, minúscula y número";
      }
      break;

    case "confirmar":
      // Comparación de contraseñas
      const pass = document.querySelector("[name='password']").value;
      if (valor !== pass) {
        valido = false;
        mensaje = "No coincide";
      }
      break;
  }

  mostrarResultado(campo, valido, mensaje);
  return valido;
}

/**
 * Muestra el resultado visual de validación
 */
function mostrarResultado(campo, valido, mensaje) {
  const error = campo.parentElement.querySelector(".error");

  if (valido) {
    campo.classList.add("valido");
    campo.classList.remove("invalido");
    error.textContent = "";
  } else {
    campo.classList.add("invalido");
    campo.classList.remove("valido");
    error.textContent = mensaje;
  }
}

/**
 * Valida todo el formulario
 */
export function validarFormulario(form) {
  let valido = true;

  form.querySelectorAll("input, select").forEach((campo) => {
    if (campo.type !== "checkbox") {
      if (!validarCampo(campo)) valido = false;
    }
  });

  // Validación de términos
  const terminos = form.querySelector("[name='terminos']");
  if (!terminos.checked) {
    valido = false;
    terminos.parentElement.nextElementSibling.textContent = "Debe aceptar";
  }

  return valido;
}
