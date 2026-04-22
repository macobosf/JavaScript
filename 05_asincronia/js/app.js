"use strict"; // Activa el modo estricto para evitar errores comunes en JS

/* =========================
   SIMULADOR DE PETICIONES
========================= */

// Obtiene el elemento HTML donde se mostrarán los logs
const log = document.getElementById("log");

// Obtiene el contenedor donde se mostrará la comparativa
const resultados = document.getElementById("resultados");

// Variables para guardar los tiempos de ejecución
let tiempoSecuencial = 0;
let tiempoParalelo = 0;

// Función que simula una petición a una API
function simularPeticion(
  nombre,              // Nombre del recurso (Usuario, Posts, etc.)
  tiempoMin = 500,     // Tiempo mínimo de espera
  tiempoMax = 2000,    // Tiempo máximo de espera
  fallar = false       // Indica si debe fallar
) {
  return new Promise((resolve, reject) => { // Retorna una promesa
    // Genera un tiempo aleatorio entre min y max
    const tiempoDelay =
      Math.floor(Math.random() * (tiempoMax - tiempoMin + 1)) + tiempoMin;

    // Simula la espera de la petición
    setTimeout(() => {
      if (fallar) {
        // Si debe fallar, rechaza la promesa
        reject(new Error(`Error al cargar ${nombre}`));
      } else {
        // Si no falla, devuelve datos simulados
        resolve({
          nombre,
          tiempo: tiempoDelay,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    }, tiempoDelay);
  });
}

// Convierte milisegundos a segundos con 2 decimales
function formatearTiempo(ms) {
  return `${(ms / 1000).toFixed(2)}s`;
}

// Muestra mensajes en el log visual
function mostrarLog(mensaje, tipo = "info") {
  const item = document.createElement("div"); // Crea un div
  item.className = `log-item log-${tipo}`;    // Asigna clases según tipo
  item.textContent = `[${new Date().toLocaleTimeString()}] ${mensaje}`; // Texto con hora
  log.appendChild(item); // Lo agrega al contenedor
  log.scrollTop = log.scrollHeight; // Hace scroll automático
}

// Ejecuta peticiones de forma SECUENCIAL
async function cargarSecuencial() {
  mostrarLog("🔄 Iniciando carga secuencial...", "info");
  resultados.classList.remove("visible"); // Oculta resultados

  const inicio = performance.now(); // Marca tiempo inicial

  try {
    // Espera cada petición una por una
    const usuario = await simularPeticion("Usuario", 500, 1000);
    mostrarLog(`✓ ${usuario.nombre} cargado en ${formatearTiempo(usuario.tiempo)}`, "success");

    const posts = await simularPeticion("Posts", 700, 1500);
    mostrarLog(`✓ ${posts.nombre} cargados en ${formatearTiempo(posts.tiempo)}`, "success");

    const comentarios = await simularPeticion("Comentarios", 600, 1200);
    mostrarLog(`✓ ${comentarios.nombre} cargados en ${formatearTiempo(comentarios.tiempo)}`, "success");

    const fin = performance.now(); // Tiempo final
    const total = fin - inicio;    // Tiempo total
    tiempoSecuencial = total;

    mostrarLog(`✅ Secuencial completado en ${formatearTiempo(total)}`, "success");
    mostrarComparativa(); // Muestra comparación
  } catch (error) {
    // Captura errores
    mostrarLog(`❌ Error: ${error.message}`, "error");
  }
}

// Ejecuta peticiones en PARALELO
async function cargarParalelo() {
  mostrarLog("🔄 Iniciando carga paralela...", "info");
  resultados.classList.remove("visible");

  const inicio = performance.now();

  try {
    // Ejecuta todas las promesas al mismo tiempo
    const promesas = [
      simularPeticion("Usuario", 500, 1000),
      simularPeticion("Posts", 700, 1500),
      simularPeticion("Comentarios", 600, 1200),
    ];

    const resultadosPromesas = await Promise.all(promesas); // Espera todas

    // Muestra cada resultado
    resultadosPromesas.forEach((resultado) => {
      mostrarLog(`✓ ${resultado.nombre} cargado en ${formatearTiempo(resultado.tiempo)}`, "success");
    });

    const fin = performance.now();
    const total = fin - inicio;
    tiempoParalelo = total;

    mostrarLog(`✅ Paralelo completado en ${formatearTiempo(total)}`, "success");
    mostrarComparativa();
  } catch (error) {
    mostrarLog(`❌ Error: ${error.message}`, "error");
  }
}

// Muestra comparación entre secuencial y paralelo
function mostrarComparativa() {
  if (tiempoSecuencial > 0 && tiempoParalelo > 0) {
    const diferencia = tiempoSecuencial - tiempoParalelo;
    const porcentaje = ((diferencia / tiempoSecuencial) * 100).toFixed(1);

    resultados.innerHTML = `
      <h3>📊 Comparativa de Rendimiento</h3>
      <p><strong>Carga Secuencial:</strong> ${formatearTiempo(tiempoSecuencial)}</p>
      <p><strong>Carga Paralela:</strong> ${formatearTiempo(tiempoParalelo)}</p>
      <p><strong>Diferencia:</strong> ${formatearTiempo(diferencia)} (${porcentaje}% más rápido)</p>
    `;
    resultados.classList.add("visible"); // Muestra resultados
  }
}

// Limpia el log y reinicia valores
function limpiarLog() {
  log.innerHTML = "";
  resultados.classList.remove("visible");
  tiempoSecuencial = 0;
  tiempoParalelo = 0;
}

// Eventos de botones
document.getElementById("btn-secuencial").addEventListener("click", cargarSecuencial);
document.getElementById("btn-paralelo").addEventListener("click", cargarParalelo);
document.getElementById("btn-limpiar").addEventListener("click", limpiarLog);

/* =========================
   TEMPORIZADOR
========================= */

// Referencias a elementos del temporizador
const inputTiempo = document.getElementById("input-tiempo");
const display = document.getElementById("display");
const barraProgreso = document.getElementById("barra-progreso");
const btnIniciar = document.getElementById("btn-iniciar");
const btnDetener = document.getElementById("btn-detener");
const btnReiniciar = document.getElementById("btn-reiniciar");

// Variables de control
let intervaloId = null;
let tiempoRestante = 0;
let tiempoInicial = 0;

// Formatea segundos a MM:SS
function formatearTiempoDisplay(segundos) {
  const mins = Math.floor(segundos / 60).toString().padStart(2, "0");
  const segs = (segundos % 60).toString().padStart(2, "0");
  return `${mins}:${segs}`;
}

// Actualiza el display y barra
function actualizarDisplay() {
  display.textContent = formatearTiempoDisplay(tiempoRestante);

  if (tiempoInicial > 0) {
    const porcentaje = ((tiempoInicial - tiempoRestante) / tiempoInicial) * 100;
    barraProgreso.style.width = `${porcentaje}%`;

    // Alerta cuando quedan 10 segundos
    if (tiempoRestante <= 10 && tiempoRestante > 0) {
      display.classList.add("alerta");
      barraProgreso.classList.add("alerta");
    } else {
      display.classList.remove("alerta");
      barraProgreso.classList.remove("alerta");
    }
  }
}

// Inicia el temporizador
function iniciar() {
  if (intervaloId) return; // Evita duplicar intervalos

  const tiempo = parseInt(inputTiempo.value);
  if (isNaN(tiempo) || tiempo <= 0) {
    alert("Ingresa un tiempo válido");
    return;
  }

  tiempoRestante = tiempo;
  tiempoInicial = tiempo;

  btnIniciar.disabled = true;
  btnDetener.disabled = false;
  inputTiempo.disabled = true;

  actualizarDisplay();

  intervaloId = setInterval(() => {
    tiempoRestante--;
    actualizarDisplay();

    if (tiempoRestante <= 0) {
      detener();
      display.classList.add("alerta");
      alert("⏰ ¡Tiempo terminado!");
    }
  }, 1000);
}

// Detiene el temporizador
function detener() {
  if (intervaloId) {
    clearInterval(intervaloId);
    intervaloId = null;
    btnIniciar.disabled = false;
    btnDetener.disabled = true;
    inputTiempo.disabled = false;
  }
}

// Reinicia todo
function reiniciar() {
  detener();
  tiempoRestante = 0;
  tiempoInicial = 0;
  display.textContent = "00:00";
  barraProgreso.style.width = "0%";
  display.classList.remove("alerta");
  barraProgreso.classList.remove("alerta");
}

// Eventos del temporizador
btnIniciar.addEventListener("click", iniciar);
btnDetener.addEventListener("click", detener);
btnReiniciar.addEventListener("click", reiniciar);

btnDetener.disabled = true; // Desactiva detener al inicio

/* =========================
   MANEJO DE ERRORES
========================= */

// Contenedor de logs de error
const logErrores = document.getElementById("log-errores");

// Muestra logs de error
function mostrarLogError(mensaje, tipo = "info") {
  const item = document.createElement("div");
  item.className = `log-item log-${tipo}`;
  item.textContent = `[${new Date().toLocaleTimeString()}] ${mensaje}`;
  logErrores.appendChild(item);
  logErrores.scrollTop = logErrores.scrollHeight;
}

// Simula un error forzado
async function simularError() {
  mostrarLogError("🔄 Intentando operación que fallará...", "info");

  try {
    await simularPeticion("API", 500, 1000, true); // Siempre falla
    mostrarLogError("✓ Operación exitosa", "success");
  } catch (error) {
    mostrarLogError(`❌ Error capturado: ${error.message}`, "error");
    mostrarLogError("ℹ️ El error fue manejado correctamente con try/catch", "info");
  }
}

// Reintentos con backoff exponencial
async function fetchConReintentos(nombre, intentos = 3) {
  mostrarLogError(`🔄 Iniciando ${intentos} intentos para cargar ${nombre}...`, "info");

  for (let i = 0; i < intentos; i++) {
    try {
      mostrarLogError(`⏳ Intento ${i + 1}/${intentos}...`, "info");

      const resultado = await simularPeticion(
        nombre,
        500,
        1000,
        Math.random() > 0.5 // 50% probabilidad de fallo
      );

      mostrarLogError(`✓ Éxito en intento ${i + 1}: ${nombre} cargado`, "success");
      return resultado;
    } catch (error) {
      mostrarLogError(`❌ Intento ${i + 1} falló: ${error.message}`, "error");

      if (i < intentos - 1) {
        const espera = Math.pow(2, i) * 500; // Backoff exponencial
        mostrarLogError(`⏰ Esperando ${espera}ms...`, "warning");
        await new Promise((resolve) => setTimeout(resolve, espera));
      }
    }
  }

  mostrarLogError(`💥 Todos los intentos fallaron para ${nombre}`, "error");
  throw new Error(`No se pudo cargar ${nombre}`);
}

// Eventos de errores
document.getElementById("btn-error").addEventListener("click", simularError);
document.getElementById("btn-reintentos").addEventListener("click", () => {
  fetchConReintentos("Recurso", 3).catch(() => {
    mostrarLogError("ℹ️ Proceso de reintentos completado", "info");
  });
});