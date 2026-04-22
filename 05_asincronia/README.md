# Practica 05 Asincronía 
El proyecto consiste en demostrar partes claves de asincronía en JS, mediante tres modulos:
- **Simulación de peteciones asíncronas:**
Permite la ejecución secuencial vs paralela de múltiples operaciones, mostrando tiempos de respuesta y de rendimiento
- **Temporizador regresivo:**
Implementa un contador dinámico que actualiza la interfaz en tiempo real,incluyendo una barra de progresoy alertas visuales al momento de finalizar.
- **Manejo de errores y reintentos:**
Simula fallos en operaciones asincronas y demuestra cómo capturarlos con ``` try/catch``` ademas de implementar un sistema de reintentos automaticos con backoff exponencial.

## Fragmentos de funciones principales

### 1. Simulacion de peticion
```js 
function simularPeticion(nombre, tiempoMin = 500, tiempoMax = 2000, fallar = false) {
  return new Promise((resolve, reject) => {
    const tiempoDelay =
      Math.floor(Math.random() * (tiempoMax - tiempoMin + 1)) + tiempoMin;

    setTimeout(() => {
      if (fallar) {
        reject(new Error(`Error al cargar ${nombre}`));
      } else {
        resolve({
          nombre,
          tiempo: tiempoDelay,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    }, tiempoDelay);
  });
}
``` 
### 2. Carga secuencial

``` js
async function cargarSecuencial() {
  const inicio = performance.now();

  try {
    const usuario = await simularPeticion("Usuario", 500, 1000);
    const posts = await simularPeticion("Posts", 700, 1500);
    const comentarios = await simularPeticion("Comentarios", 600, 1200);

    const total = performance.now() - inicio;
    tiempoSecuencial = total;
  } catch (error) {
    console.error(error);
  }
}

```

### 3. Carga en paralelo

```js

async function cargarParalelo() {
  const inicio = performance.now();

  try {
    const promesas = [
      simularPeticion("Usuario", 500, 1000),
      simularPeticion("Posts", 700, 1500),
      simularPeticion("Comentarios", 600, 1200),
    ];

    const resultados = await Promise.all(promesas);

    const total = performance.now() - inicio;
    tiempoParalelo = total;
  } catch (error) {
    console.error(error);
  }
}

``` 
### 4. Temporizador

``` js 
function iniciar() {
  const tiempo = parseInt(inputTiempo.value);

  tiempoRestante = tiempo;
  tiempoInicial = tiempo;

  intervaloId = setInterval(() => {
    tiempoRestante--;

    if (tiempoRestante <= 0) {
      detener();
      alert("⏰ ¡Tiempo terminado!");
    }
  }, 1000);
}

``` 
### 5. Manejo de errores con try/catch

```js 
async function simularError() {
  try {
    await simularPeticion("API", 500, 1000, true);
  } catch (error) {
    console.error("Error capturado:", error.message);
  }
}

```

### 6. Reintentos con backoff exponencial 

```js 
async function fetchConReintentos(nombre, intentos = 3) {
  for (let i = 0; i < intentos; i++) {
    try {
      const resultado = await simularPeticion(
        nombre,
        500,
        1000,
        Math.random() > 0.5
      );
      return resultado;
    } catch (error) {
      if (i < intentos - 1) {
        const espera = Math.pow(2, i) * 500;
        await new Promise((resolve) => setTimeout(resolve, espera));
      }
    }
  }

  throw new Error(`No se pudo cargar ${nombre}`);
}

``` 
## Capturas
### 1. Comparativa secuencial vs paralelo con tiempos
![Figura: Comparativa secuencial vs paralelo con tiempos](/05_asincronia/assets/cargas.png)
**Descripcion:** La carga secuencial tomo 3.12s, mientras la paralela tomo 1.08s, un 65.4%  mas rapido.
### 2. Temporizador funcionando con barra de progreso
![Figura: Temporizador](/05_asincronia/assets/Contador01.png)
**Descripcion:** Temporizador de 20s, con barra de progreso actualizandose cada segundo
![Figura: Temporizador Finalizado](/05_asincronia/assets/Contador02.png)
**Descripcion:** Temporizador luego de finalizar el temporizador de 20s.

### 3. Error capturado y mostrado en UI
![Figura: Error](/05_asincronia/assets/Error.png)
**Descripcion:** Error capturado con try/catch y mostrado en la interfaz