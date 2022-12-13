function ControlWeb(){
	this.comprobarCookie=function(){
		if ($.cookie("nick")){
			rest.nick=$.cookie("nick");
			rest.comprobarUsuario();
			//cws.conectar();
			this.mostrarHome();
		}
		else{
			this.mostrarAgregarUsuario();
		}
	}
	this.mostrarAgregarUsuario=function(){
		let cadena= '<div class="row" id="mAU">';//'<form class="form-row needs-validation"  id="mAJ">';
		cadena=cadena+'<div class="col"><h2>Juego Batalla naval</h2></div>';
		cadena=cadena+'<div class="row">';
		cadena=cadena+'<div class="col">';
        cadena=cadena+'<input type="text" class="form-control mb-2 mr-sm-2" id="usr" placeholder="Introduce tu nick (max 6 letras)" required></div>';
        cadena=cadena+'<div class="col">';
        cadena=cadena+'<button id="btnAU" class="btn btn-primary mb-2 mr-sm-2">Iniciar sesión</button>';
        cadena=cadena+'<a href="/auth/google" class="btn btn-primary mb-2 mr-sm-2">Accede con Google</a>';
        cadena=cadena+'</div></div>'; //' </form>';
        cadena=cadena+'<div id="nota"></div></div></div>';

		$("#agregarUsuario").append(cadena);      

		$("#btnAU").on("click",function(e){
			if ($('#usr').val() === '' || $('#usr').val().length>6) {
			    e.preventDefault();
			    $('#nota').append('Nick inválido');
			}
			else{
				var nick=$('#usr').val();
				$("#mAU").remove();
				$("#aviso").remove();
				rest.agregarUsuario(nick);
			}
		})
	}
	this.mostrarHome=function(){
		$('#mH').remove();
		$('#gc').remove();
		let cadena="<div class='row' id='mH'>";
		cadena=cadena+'<div class="col"><h2>Batalla naval</h2></div>';
		cadena=cadena+"<div><h3> Bienvenido "+rest.nick+"     "+"</h3></div>";
		cadena = cadena + '<div style="margin-bottom:15px" id="codigo"></div>'
        cadena = cadena + '<button id="btnS" class="btn btn-primary mb-2 mr-sm-2">Salir</button>';
		cadena=cadena+"</div>";
		$('#agregarUsuario').append(cadena);
		this.mostrarCrearPartida();
		rest.obtenerListaPartidasDisponibles();
		$("#btnS").on("click",function(e){		
			$("#mCP").remove();
			$('#mLP').remove();
			$('#mH').remove();
			$('#gc').remove();
			rest.usuarioSale();
		});
	}
	this.mostrarCrearPartida=function(){
		$('#mCP').remove();
		let cadena= '<div class="row" id="mCP">';//'<form class="form-row needs-validation"  id="mAJ">';
        cadena=cadena+'<div class="col">';
        cadena=cadena+'<button id="btnCP" class="btn btn-primary mb-2 mr-sm-2">Crear partida</button>';
        cadena=cadena+'</div>';
        cadena=cadena+'</div>';
        $('#crearPartida').append(cadena);
        $("#btnCP").on("click",function(e){		
			$("#mCP").remove();
			$('#mLP').remove();
			//rest.crearPartida();
			cws.crearPartida();
		});
	}
	this.mostrarAbandonarPartida = function(){
        $('#mAbP').remove();
        let cadena = '<div class="row" id="mAbP">';
        cadena = cadena + '<div style="margin-top:15px" class="col">';
        cadena = cadena + '<button id="btnAbP" class="btn btn-primary mb-2 mr-sm-2">Abandonar Partida</button>';
        cadena = cadena + '</div>';
        cadena = cadena + '</div>';
        $('#codigo').append(cadena);
        $("#btnAbP").on("click", function (e) {
            cws.abandonarPartida();
        });
    }
	this.mostrarCodigo=function(codigo){
		let cadena="Código de la partida: "+codigo;
		$('#codigo').append(cadena);
		iu.mostrarAbandonarPartida();
	}
	this.mostrarListaDePartidas=function(lista){
		$('#mLP').remove();
		let cadena="<div id='mLP'>";		
		cadena=cadena+'<ul class="list-group">';
		for(i=0;i<lista.length;i++){
		  cadena = cadena+'<li class="list-group-item">'+lista[i].codigo+' propietario: '+lista[i].owner+'</li>';
		}
		cadena=cadena+"</ul>";
		cadena=cadena+"</div>";
		$('#listaPartidas').append(cadena);
	}
	this.mostrarListaDePartidasDisponibles=function(lista){
		$('#mLP').remove();
		let cadena="<div class='row' id='mLP'>";
		cadena=cadena+"<div class='col'>";
		cadena=cadena+"<h3>Lista de partidas disponibles</h3>";
		cadena=cadena+'<ul class="list-group">';
		for(i=0;i<lista.length;i++){
		  cadena = cadena+'<li class="list-group-item"><a href="#" value="'+lista[i].codigo+'"> Nick propietario: '+lista[i].owner+'</a></li>';
		}
		cadena=cadena+"</ul>";
		cadena=cadena+"</div></div>"
		$('#listaPartidas').append(cadena);

		$("#btnAP").on("click", function (e) { //este es el boton que hemos quitado por los WS
            $('#mLP').remove();
            rest.obtenerListaPartidasDisponibles();
        });

		$(".list-group a").click(function(){
	        codigo=$(this).attr("value");
   	        console.log(codigo);
	        if (codigo){
	            $('#mLP').remove();
	            $('#mCP').remove();
	            //rest.unirseAPartida(codigo);
	            cws.unirseAPartida(codigo);
	        }
	    });
	}
	this.finalPartida = function(){
		$('#mH').remove();
        cws.codigo = undefined;
		$('#gc').remove();
		tablero = new Tablero(10);
		this.mostrarHome();
	}
	this.mostrarModal=function(msg){
		$('#mM').remove();
		var cadena="<p id='mM'>"+msg+"</p>";
		$('#contenidoModal').append(cadena);
		$('#miModal').modal("show");
	}
}