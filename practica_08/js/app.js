import { validarCampo, validarFormulario } from "./validacion.js";

const form = document.getElementById("formulario");
const btn = form.querySelector("button");
const mensaje = document.getElementById("mensaje");

/**
 * Aplica máscara de teléfono en tiempo real
 */
form.telefono.addEventListener("input", (e) => {
  let x = e.target.value.replace(/\D/g, "").slice(0, 10);

  if (x.length >= 6) x = `(${x.slice(0, 3)}) ${x.slice(3, 6)}-${x.slice(6)}`;
  else if (x.length >= 3) x = `(${x.slice(0, 3)}) ${x.slice(3)}`;

  e.target.value = x;
});

/**
 * Calcula fuerza de contraseña
 */
form.password.addEventListener("input", (e) => {
  const val = e.target.value;
  let score = 0;

  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[a-z]/.test(val)) score++;
  if (/\d/.test(val)) score++;

  const barra = document.getElementById("fuerza");
  barra.style.width = score * 25 + "%";
  barra.style.background =
    ["red", "orange", "yellow", "green"][score - 1] || "red";
});

/**
 * Validación al salir del campo
 */
form.addEventListener("focusout", (e) => {
  if (e.target.name) validarCampo(e.target);
});

/**
 * Limpieza de errores y validación en vivo
 */
form.addEventListener("input", (e) => {
  e.target.classList.remove("invalido");
  const error = e.target.parentElement.querySelector(".error");
  if (error) error.textContent = "";

  verificarFormulario();
  guardarDatos();
});

/**
 * Manejo del envío
 */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (validarFormulario(form)) {
    const data = Object.fromEntries(new FormData(form));

    mensaje.textContent = "Registro exitoso ✅";
    mensaje.style.color = "green";

    sessionStorage.clear();
    form.reset();
  } else {
    mensaje.textContent = "Errores en el formulario ❌";
    mensaje.style.color = "red";
  }
});

/**
 * Habilita/deshabilita botón
 */
function verificarFormulario() {
  btn.disabled = !validarFormulario(form);
}

/**
 * Guarda datos en sessionStorage
 */
function guardarDatos() {
  const data = Object.fromEntries(new FormData(form));
  sessionStorage.setItem("form", JSON.stringify(data));
}

/**
 * Carga datos guardados al iniciar
 */
window.addEventListener("load", () => {
  const data = JSON.parse(sessionStorage.getItem("form"));
  if (data) {
    Object.keys(data).forEach((key) => {
      const campo = form.querySelector(`[name='${key}']`);
      if (campo) campo.value = data[key];
    });
  }
});

/**
 * Mostrar/Ocultar contraseña
 */
document.querySelectorAll(".toggle-password").forEach(icono => {
  icono.addEventListener("click", () => {
    const input = document.getElementById(icono.dataset.target);

    if (input.type === "password") {
      input.type = "text";
      icono.textContent = "🙈";
    } else {
      input.type = "password";
      icono.textContent = "👁️";
    }
  });
})
