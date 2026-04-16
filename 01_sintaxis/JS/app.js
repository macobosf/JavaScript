'use strict';

const nombre = 'Marco';
const apellido = 'Cobos';
let ciclo = 5;
const activo = 'true';
const direccion = {
    ciudad : 'Cuenca',
    provincia : 'Azuay'
}

console.table({nombre, apellido, ciclo, activo, direccion});

const notas = [10,8,9,7];
//const calcularPromedio = (notas) => 

const esMayorEdad = (edad) => edad >= 18;
esMayorEdad(25);
esMayorEdad(10);

const getSaludo = (nombre, hora) => {
    if(hora < 12)
        return 'Buenos dias, ${nombre}';
    if(hora < 18)
        return 'Buenas tardes, ${nombre}';
    return 'Buenas tardes, ${nombre}';
}

const getSaludo2 = (nombre, hora) => hora < 12 ? `Buenos dias, ${nombre}`
: hora < 18
    ? `Buenas tardes,${nombre}`:
    `Buenas noches ${nombre}`;

//Mostrar en HTML
document.getElementById('nombre').texContent = `${nombre}`;
document.getElementById('apellido').texContent = `${apellido}`;
document.getElementById('ciclo').textContent = `${ciclo}`;
