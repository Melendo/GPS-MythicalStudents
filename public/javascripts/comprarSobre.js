$(document).ready(function() {

    $(".buy").on('click', function() {
        var id = $(this).data('id');
        
        $.ajax({
            url: "/comprarSobre/" + id,
            type: "POST",
            data: { },
            success: function(response) {
                if (response.success) {
                    alert(response.mensaje);
                    window.location.href = 'tienda';
                }
                else {
                    alert(response.mensaje);
                }
            },
            error: function(error) {
                console.error("Error al realizar el proceso de compra de sobre:", error);
            }
        });
    })

});
