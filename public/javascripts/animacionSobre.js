// Generar números aleatorios entre un rango específico
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

document.addEventListener('DOMContentLoaded', function() {
    var envelope = document.getElementById('envelope');
    var lightsContainer = document.querySelector('.lights-container');
    var hasClicked = false;

    // Función para iniciar la animación de vibración
    function startVibration() {
        envelope.style.animation = 'vibrate 0.1s infinite alternate';
    }

    // Función para desaparecer el sobre después de la vibración
    function hideEnvelope() {
        envelope.style.animation = 'enlargeAndDisappear 1s forwards';
        lightsContainer.style.animation = 'fadeLights 1s forwards'; // Desvanecer las luces
        setTimeout(fadeConfetti, 1000); // Retraso de 1000 milisegundos (1 segundo) para el desvanecimiento del confeti
        // Llama a mostrarAlertas después de que la animación haya terminado
        setTimeout(function() {
            trasAnimacion();
        }, 1000); // Espera 2 segundos (1000ms de desaparición + 1000ms de confeti)
        
    }

    // Función para crear confeti
    function createConfetti() {
        for (let i = 0; i < 100; i++) {
            var confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * window.innerWidth + 'px'; // Cambiado
            confetti.style.animationDelay = Math.random() * 2 + 's'; // Retardo aleatorio para cada confeti
            document.body.appendChild(confetti); // Cambiado
        }
    } 
    
    // Función para desvanecer el confeti
    function fadeConfetti() {
        var confetti = document.querySelectorAll('.confetti');
        confetti.forEach(function(confetto) {
            confetto.style.animation = 'fadeConfetti 1s forwards';
        });
    }

    // Agregar evento de clic a la imagen del sobre
    envelope.addEventListener('click', function() {
        if (!hasClicked) {
            // Mostrar luces
            var lights = document.querySelectorAll('.light');
            lights.forEach(function(light) {
                // Generar posiciones aleatorias para cada luz
                var randomLeft = getRandomNumber(0, window.innerWidth) + 'px';
                var randomTop = getRandomNumber(0, window.innerHeight) + 'px';
                light.style.display = 'block';
                light.style.left = randomLeft;
                light.style.top = randomTop;
            });

            // Iniciar la vibración
            startVibration();

            // Comienza la animación del confeti
            createConfetti();

            // Después de un breve retraso, ocultar el sobre y desvanecer las luces
            setTimeout(hideEnvelope, 3000); // 3000ms es la duración de la vibración

            // Marcar que se ha hecho clic
            hasClicked = true;
        }
    });
    
    function trasAnimacion() {
        var nombresCromos = JSON.parse(localStorage.getItem('nombresCromos'));
        if (nombresCromos && nombresCromos.length > 0) {
            mostrarAlertas(nombresCromos);
        } else {
            window.location.href = '/tienda';
        }
    }
    
    function mostrarAlertas(nombresCromos) {
        var index = 0;

        function mostrarSiguienteAlerta() {
            if (index < nombresCromos.length) {
                alert("¡Felicidades! Has obtenido el cromo '" + nombresCromos[index] + "'");
                index++;
                
                mostrarSiguienteAlerta();
            } else {
                window.location.href = '/tienda';
            }
        }
        // Comienza a mostrar los alertas
        mostrarSiguienteAlerta();
    }
});