function ClienteWS() {
    this.socket;
    //this.codigo;
    this.conectar = function () {
        this.socket = io();
        this.servidorWS();
    }
    this.crearPartida = function () {
        this.socket.emit("crearPartida", rest.nick);
    }
    this.usuarioSale = function (nick, codigo) {
        this.socket.emit("usuarioSale", rest.nick, codigo);
    }
    this.unirseAPartida = function (codigo) {
        this.socket.emit("unirseAPartida", rest.nick, codigo);
    }
    this.abandonarPartida = function () {
        this.socket.emit("abandonarPartida", rest.nick, cws.codigo);
    }
    this.colocarBarco = function (nombre, x, y) {
        this.socket.emit("colocarBarco", rest.nick, nombre, x, y);
    }
    this.barcosDesplegados = function () {
        this.socket.emit("barcosDesplegados", rest.nick);
    }
    this.disparar = function (x, y) {
        this.socket.emit("disparar", rest.nick, x, y);
    }


    this.servidorWS = function () {
        let cli = this;
        this.socket.on("partidaCreada", function (data) {
            console.log(data);
            if (data.codigo != -1) {
                console.log("Partida creada por " + rest.nick + " con codigo: " + data.codigo);
                iu.mostrarCodigo(data.codigo);
                cli.codigo = data.codigo;
            }
            else {
                console.log("No se ha podido crear partida");
                iu.mostrarModal("No se ha podido crear partida");
                iu.mostrarCrearPartida();
                rest.comprobarUsuario();
            }
        });
        this.socket.on("unidoAPartida", function (data) {
            if (data.codigo != -1) {
                console.log("Usuario " + rest.nick + " se une a la partida con codigo: " + data.codigo);
                iu.mostrarCodigo(data.codigo);
                cli.codigo = data.codigo;
            }
            else {
                console.log("No se ha podido unir a partida");
            }
        });
        this.socket.on("actualizarListaPartidas", function (lista) {
            if (!cli.codigo) {
                iu.mostrarListaDePartidasDisponibles(lista);
            }
        });
        this.socket.on("partidaAbandonada", function (data) {
            if (data.codigo != -1) {
                if (!(data.nombreA == rest.nick)) {
                    console.log("El usuario " + data.nombreA + " ha abandonado la partida" + "\n" + " Has ganado la partida");
                    iu.mostrarHome();
                    iu.mostrarModal("El usuario " + data.nombreA + " ha abandonado la partida" + "\n" + " Has ganado la partida");
                }
                else {
                    console.log("Has abandonado la partida" + "\n" + " Has perdido la partida");
                    iu.mostrarHome();
                    iu.mostrarModal("Has abandonado la partida" + "\n" + " Has perdido la partida");
                }
            }
            else {
                console.log("Has intentado abandonar la partida pero no se ha podido");
                iu.mostrarModal("Has intentado abandonar la partida pero no se ha podido");
            }

        });
        this.socket.on("partidaCancelada", function (res) {
            if (res.codigoP != -1) {
                console.log("Has terminado la partida antes de que se uniese alguien");
                iu.mostrarHome();
                iu.mostrarModal("Has terminado la partida antes de que se uniese alguien");
            }
            else {
                console.log("Has intentado abandonar la partida pero no se ha podido");
                iu.mostrarModal("Has intentado abandonar la partida pero no se ha podido");
            }
        });
        this.socket.on("usuarioSalido", function (res) {
            if (res.codigoP != -1) {
                if (!(res.jugadorS == rest.nick)) {
                    console.log("El usuario " + res.jugadorS + " se ha salido del juego a mitad de la partida" + "\n" + " Has ganado la partida");
                    iu.mostrarHome();
                    iu.mostrarModal("El usuario " + res.jugadorS + " se ha salido del juego a mitad de la partida" + "\n" + " Has ganado la partida");
                }
                else {
                    console.log("Te has salido del juego a mitad de la partida" + "\n" + " Has perdido la partida");
                    iu.mostrarHome();
                    iu.mostrarModal("Te has salido del juego a mitad de la partida" + "\n" + " Has perdido la partida");
                }
            }
            else {
                console.log("Has intentado salir de la partida pero no se ha podido");
                iu.mostrarModal("Has intentado salir de la partida pero no se ha podido");
            }
        });
        this.socket.on("aJugar", function () {
            iu.mostrarModal("Empieza a disparar!");
        });
        this.socket.on("barcoColocado", function (data) {
            console.log(data.colocado.desplegado);
            if (data.colocado.desplegado) {
                let barco = tablero.flota[data.barco];
                tablero.puedesColocarBarco(barco, data.x, data.y, barco.orientacion.nombre);
                cli.barcosDesplegados();
            }
            else {
                iu.mostrarModal("No se puede colocar barco");
            }
        });
        this.socket.on("disparo", function (res) {
            console.log(res.impacto);
            if (res.atacante == rest.nick) {
                tablero.updateCell(res.x, res.y, res.impacto, 'computer-player');
            }
            else {
                tablero.updateCell(res.x, res.y, res.impacto, 'human-player');
            }
        });
        this.socket.on("partidaTerminada", function () {
            iu.mostrarModal("La partida ha terminado");
        });
        this.socket.on("noEsTuTurno", function (data) {
            iu.mostrarModal("No puedes disparar, no es tu turno");
        });
        this.socket.on("faseDesplegando", function (data) {
            tablero.flota = data.flota;
            tablero.elementosGrid();
            tablero.mostrarFlota();
            console.log("Ya puedes desplegar la flota");
        });
        this.socket.on("finalPartida", function (res) {
            if (!(res == rest.nick)) {
                console.log("Has perdido:( "+ "\n" + "Buen intento, pero "+res+" ha ganado la partida, suerte la próxima vez");
                iu.mostrarModal("Has perdido:( "+ "\n" + "Buen intento, pero "+res+" ha ganado la partida, suerte la próxima vez");
                iu.finalPartida();
            }
            else {
                console.log("VICTORIAA!!! " + "\n" + " Has ganado la partida!!");
                iu.mostrarModal("VICTORIAA!!! " + "\n" + " Has ganado la partida!!");
                iu.finalPartida();
            }
        });
    }
}