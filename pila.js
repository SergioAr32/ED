// La Pila (el arreglo que almacena los datos)
let stack = []; 
const MAX_CAPACITY = 5; // Límite de elementos para demostrar el Desbordamiento

//Variables de Estado
let tipoDatoSeleccionado = '';
let pilaBloqueada = false;

// Elementos del DOM
const pilaVisual = document.getElementById('pila-visual');
const estadoMensaje = document.getElementById('estado-mensaje');
const infoEstado = document.getElementById('info-estado');
const valorInput = document.getElementById('valor-input');

const tipoActualDiv = document.getElementById('tipo-actual'); 
const tipoSelect = document.getElementById('tipo-dato-select');


function seleccionarTipoDato() {
    tipoDatoSeleccionado = tipoSelect.value;
    tipoActualDiv.textContent = `Tipo seleccionado: ${tipoDatoSeleccionado.toUpperCase() || 'NINGUNO'}`;

    if (tipoDatoSeleccionado && !pilaBloqueada) {
        valorInput.disabled = false; // Habilitar el input al seleccionar un tipo
        estadoMensaje.textContent = ` Ahora solo se aceptan valores de tipo "${tipoDatoSeleccionado.toUpperCase()}"`;
    } else {
        // Si no selecciona un tipo válido (ej. la opción 'Seleccionar Tipo'), deshabilitamos el input
        valorInput.disabled = true; 
        estadoMensaje.textContent = 'Selecciona un tipo de dato válido para comenzar.';
    }
    estadoMensaje.className = 'estado';
}

// Función auxiliar para actualizar el Tope visual y el estado
function actualizarPila() {
    // 1. Limpiar visualización anterior
    pilaVisual.innerHTML = '';
    
    // 2. Dibujar la pila
    stack.forEach((valor, indice) => {
        const bloque = document.createElement('div');
        bloque.className = 'bloque';
        bloque.textContent = valor;
        
        // El último elemento (el que está más arriba) es el TOPE
        if (indice === stack.length - 1) {
            bloque.classList.add('bloque-tope'); //estilo del tope
            bloque.innerHTML += '<span class="tope-label">TOPE</span>';
        }
        
        pilaVisual.appendChild(bloque);
    });

    // 3. Actualizar el estado de la pila
    infoEstado.textContent = stack.length > 0 
        ? `Elementos: ${stack.join(', ')} | Tope: ${stack[stack.length - 1]}`
        : 'La pila está vacía.';
}

// Función principal para PUSH (Apilar)
function pushElement() {


    // 1. Obtener y preparar el valor
    const valorRaw = valorInput.value.trim();
    estadoMensaje.className = 'estado'; // Resetear estilos
    valorInput.value = ''; // Limpiar input 

    // 1. Validacion de seleccion de tipo de dato e input vacio**
    if (!tipoDatoSeleccionado) {
        estadoMensaje.textContent = '❌ ERROR: Por favor, selecciona primero un Tipo de Dato (int, string, etc.).';
        estadoMensaje.classList.add('error');
        return;
    }
    if (valorRaw === '') {
        estadoMensaje.textContent = '❌ ERROR: El valor no puede estar vacío.';
        estadoMensaje.classList.add('error');
        return;
    }
    
    // Función de ayuda para verificar el tipo
    let esTipoValido = false;
    let valorAInsertar = valorRaw;

    switch (tipoDatoSeleccionado) {
        case 'int':
            // Es válido si es un número, no contiene decimales y no resulta en NaN.
            esTipoValido = !isNaN(parseInt(valorRaw)) && String(parseInt(valorRaw)) === valorRaw && !valorRaw.includes('.');
            if (esTipoValido) valorAInsertar = parseInt(valorRaw);
            break;
            
        case 'double':
            // Es válido si es un número (acepta decimales).
            esTipoValido = !isNaN(parseFloat(valorRaw));
            if (esTipoValido) valorAInsertar = parseFloat(valorRaw);
            break;
            
        case 'char':
            // Es válido si es un solo carácter.
            esTipoValido = valorRaw.length === 1;
            break;
            
        case 'string':
            //Todo input es una cadena
            esTipoValido = valorRaw.length > 0;
            break;
    }
    
    if (!esTipoValido) {
        estadoMensaje.textContent = `❌ ERROR DE TIPO: "${valorRaw}" no es un valor válido para el tipo "${tipoDatoSeleccionado.toUpperCase()}".`;
        estadoMensaje.classList.add('error');
        return;
    }
    
  
    // Manejo de Desbordamiento (Overflow)
    if (stack.length >= MAX_CAPACITY) {
        estadoMensaje.textContent = '⛔ ERROR: ¡DESBORDAMIENTO! (OVERFLOW)';
        estadoMensaje.classList.add('error');
        return;
    }

    // PUSH (Last-In)
    stack.push(valorAInsertar); 
    actualizarPila();
    estadoMensaje.textContent = `✅ PUSH exitoso: Se apiló el valor "${valorAInsertar}"`;
    valorInput.value = ''; // Limpiar input

    //Bloqueo del Selector del Dato 
    if (stack.length === 1 && !pilaBloqueada) {
        tipoSelect.disabled = true; // Deshabilita el selector después del primer elemento
        valorInput.disabled = false; 
        pilaBloqueada = true; // Marca la pila como bloqueada
        tipoActualDiv.textContent = `Tipo seleccionado: ${tipoDatoSeleccionado.toUpperCase()} (BLOQUEADO)`;
    }
    
    estadoMensaje.textContent = `✅ PUSH exitoso: Se apiló el ${tipoDatoSeleccionado.toUpperCase()} "${valorAInsertar}"`;
}



// Función principal para POP (Desapilar)
function popElement() {
    estadoMensaje.className = 'estado'; // Resetear estilos
    
    // Manejo de Subdesbordamiento (Underflow)
    if (stack.length === 0) {
        estadoMensaje.textContent = '⛔ ERROR: ¡SUBDESBORDAMIENTO! (UNDERFLOW)';
        estadoMensaje.classList.add('error');
        return;
    }
    
    // POP (First-Out)
    const valorEliminado = stack.pop();
    actualizarPila();
    estadoMensaje.textContent = `✅ POP exitoso: Se desapiló el valor "${valorEliminado}"`;
    if (stack.length === 0 && pilaBloqueada) {
        tipoSelect.disabled = false;
        pilaBloqueada = false; 
        tipoActualDiv.textContent = `Tipo: Desbloqueado `
    }
}

// Función principal para PEEK (Ver Tope)
function peekElement() {
    estadoMensaje.className = 'estado'; // Resetear estilos

    // Manejo de Subdesbordamiento (Underflow)
    if (stack.length === 0) {
        estadoMensaje.textContent = '⛔ ERROR: ¡SUBDESBORDAMIENTO! (UNDERFLOW)';
        estadoMensaje.classList.add('error');
        return;
    }
    
    const tope = stack[stack.length - 1];
    estadoMensaje.textContent = `👁️ TOPE (PEEK): El elemento superior es "${tope}"`;

    // Resaltar visualmente el tope
    const bloques = pilaVisual.getElementsByClassName('bloque');
    if (bloques.length > 0) {
        const bloqueTope = bloques[bloques.length - 1];
        bloqueTope.classList.add('resaltado-peek');
        setTimeout(() => {
            bloqueTope.classList.remove('resaltado-peek');
        }, 900); // Quita el resaltado después de 0.9 segundos
    }
}


function resetStack() {
    // 1. Resetear las variables de control
    stack = [];
    tipoDatoSeleccionado = '';
    pilaBloqueada = false;
    
    // 2. Desbloquear los elementos de entrada
    tipoSelect.disabled = false;
    valorInput.disabled = true;
    tipoSelect.value = ''; // Resetear el selector al valor por defecto
    valorInput.value = '';
    
    // 3. Actualizar la visualización y mensajes
    actualizarPila();
    tipoActualDiv.textContent = 'Tipo seleccionado: Ninguno';
    estadoMensaje.textContent = 'Pila Reiniciada.';
    estadoMensaje.className = 'estado';
}

function inicializarSegura(){
    valorInput.disabled = true;
    resetStack();
}

document.addEventListener('DOMContentLoaded', (event) => {
    inicializarSegura();

});
