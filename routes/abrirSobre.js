document.addEventListener('DOMContentLoaded', function() {
    var btnAbrirSobre = document.getElementById('btnAbrirSobre');
    if (btnAbrirSobre) {
        btnAbrirSobre.addEventListener('click', function() {
            // Redireccionar al usuario a la página del sobre
            window.location.href = '/pagina-del-sobre';
        });
    }
});
