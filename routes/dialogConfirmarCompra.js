// Archivo app.js o cualquier otro archivo JavaScript donde manejes la lógica del lado del cliente

document.addEventListener('DOMContentLoaded', function () {

    // Selecciona todos los botones de clase "btn-comprar"
    const botonesComprar = document.querySelectorAll('.btn-comprar');

    // Agrega un evento click a cada botón
    botonesComprar.forEach(function (boton) {

        boton.addEventListener('click', function () {
            // Obtén la URL de dialogoConfirmarCompra.ejs
            const url = '/views/dialogConfirmarCompra.ejs'; // Asegúrate de que esta ruta sea correcta

            // Abre una nueva ventana o pestaña con la URL especificada
            window.open(url, '_blank');
        });
    });
});
