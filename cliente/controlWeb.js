function ControlWeb(){
    this.mostrarAgregarUsuario = function () {
        var cadena = '<div class="row" id="mAU">';//'<form class="form-row needs-validation"  id="mAJ">';
        cadena = cadena + '<div class="row"><h2>El juego indefinido</h2></div>';
        cadena = cadena + '<div class="row">';
        cadena = cadena + '<div class="col">'
        cadena = cadena + '<input type="text" class="form-control mb-2 mr-sm-2" id="usr" placeholder="Introduce tu nick (max 6 letras)" required></div>';
        cadena = cadena + '<div class="col">';
        cadena = cadena + '<button id="btnAU" class="btn btn-primary mb-2 mr-sm-2">Iniciar sesión</button>';
        //cadena=cadena+'<a href="/auth/google" class="btn btn-primary mb-2 mr-sm-2">Accede con Google</a>';
        cadena = cadena + '</div>'; //' </form>';
        cadena = cadena + '<div id="nota"></div></div>';

        $("#agregarUsuario").append(cadena);//sirven comillas simples y dobles //busca atributo id con ese nombre
        //si pone . en lugar de  # busca la clase con ese nombre
        //$("#nota").append("<div id='aviso' style='text-align:right'>Inicia sesión con Google para jugar</div>");    

        $("#btnAU").on("click", function (e) {
            if ($('#usr').val() === '' || $('#usr').val().length > 6) { //coge el valor, comprueba que no esté vacío y que el tamaño es mayor de 6
                e.preventDefault();
                $('#nota').append('Nick inválido');
            }
            else {
                var nick = $('#usr').val();
                $("#mAU").remove();
                $("#aviso").remove();
                rest.agregarUsuario(nick);
            }
        })
    }
}



