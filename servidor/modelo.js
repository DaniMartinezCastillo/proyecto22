let cad = require('./cad.js');

function Juego(test) {
	this.partidas = {};
	this.usuarios = {}; //array asociativo
	this.cad = new cad.Cad();
	this.test = test;

	this.agregarUsuario = function (nick) {
		let res = { "nick": -1 };
		if (!this.usuarios[nick]) {
			this.usuarios[nick] = new Usuario(nick, this);
			this.insertarLog({ "operacion": "inicioSesion", "usuario": nick, "fecha": Date() }, function () {
				console.log("Registro de log(iniciar sesion) insertado");
			});
			res = { "nick": nick };
			console.log("Nuevo usuario: " + nick);
		}
		return res;
	}
	this.eliminarUsuario = function (nick) {
		delete this.usuarios[nick];
	}
	this.usuarioSale = function (nick) {
		if (this.usuarios[nick]) {
			codigo = this.finalizarPartida(nick);
			this.eliminarUsuario(nick);
			this.insertarLog({ "operacion": "finSesion", "usuario": nick, "fecha": Date() }, function () {
				console.log("Registro de log(salir) insertado");
			});
			if (codigo) {
				return codigo;
			}
		}
	}
	this.jugadorCreaPartida = function (nick) {
		let usr = this.usuarios[nick];
		let res = { codigo: -1 };
		if (usr) {
			let codigo = usr.crearPartida();
			res = { codigo: codigo };
		}
		return res;
	}
	this.jugadorSeUneAPartida = function (nick, codigo) {
		let usr = this.usuarios[nick];
		let res = { "codigo": -1 };
		if (usr) {
			let valor = usr.unirseAPartida(codigo);
			res = { "codigo": valor };
		}
		return res;
	}
	this.obtenerUsuario = function (nick) {
		return this.usuarios[nick];
	}
	this.obtenerUsuarios = function () {
		let lista = [];
		for (let key in this.usuarios) {
			lista.push({ "nick": this.usuarios[key].nick, "user": key });
		}
		return lista;
	}
	this.crearPartida = function (usr) {
		let codigo = Date.now();
		console.log("Usuario " + usr.nick + " crea partida " + codigo);
		this.insertarLog({ "operacion": "crearPartida", "propietario": usr.nick, "codigo": codigo, "fecha": Date() }, function () {
			console.log("Registro de log(crear partida) insertado");
		});
		this.partidas[codigo] = new Partida(codigo, usr);
		return codigo;
	}
	this.unirseAPartida = function (codigo, usr) {
		let res = -1;
		if (this.partidas[codigo]) {
			res = this.partidas[codigo].agregarJugador(usr);
			this.insertarLog({ "operacion": "unirsePartida", "usuario": usr.nick, "codigoPartida": codigo, "fecha": Date() }, function () {
				console.log("Registro de log(unirse a partida) insertado");
			});
		}
		else {
			console.log("La partida no existe");
		}
		return res;
	}
	this.obtenerPartidas = function () {
		let lista = [];
		for (let key in this.partidas) {
			lista.push({ "codigo": key, "owner": this.partidas[key].owner.nick });
		}
		return lista;
	}
	this.obtenerPartidasDisponibles = function () {
		let lista = [];
		for (let key in this.partidas) {
			if (this.partidas[key].fase.nombre == "inicial") {
				lista.push({ "codigo": key, "owner": this.partidas[key].owner.nick, "fase": this.partidas[key].fase.nombre });
			}
		}
		return lista;
	}
	this.finalizarPartida = function (nick) {
		console.log("Entro a finalizar la partida");
		for (let key in this.partidas) {
			if ((this.partidas[key].fase.nombre == "inicial" || this.partidas[key].fase.nombre == "desplegando") && this.partidas[key].estoy(nick)) {
				this.partidas[key].fase = new Final();
				return this.partidas[key].codigo;
			}
		}
	}
	this.obtenerPartida = function (codigo) {
		return this.partidas[codigo];
	}
	this.insertarLog = function (log, callback) {
		if (!this.test) {
			this.cad.insertarLog(log, callback);
		}
	}
	this.obtenerLogs = function (callback) {
		this.cad.obtenerLogs(callback);
	}
	if (!this.test) {
		this.cad.conectar(function (db) {
			console.log("concectado a Atlas");
		});
	}
}

function Usuario(nick, juego) {
	this.nick = nick;
	this.juego = juego;
	this.tableroPropio;
	this.tableroRival;
	this.partida;
	this.flota = {};
	this.crearPartida = function () {
		return this.juego.crearPartida(this);
	}
	this.unirseAPartida = function (codigo) {
		return this.juego.unirseAPartida(codigo, this);
	}
	this.inicializarTableros = function (dim) {
		this.tableroPropio = new Tablero(dim);
		this.tableroRival = new Tablero(dim);
	}
	this.inicializarFlota = function () {
		this.flota["Submarino (1)"] = new Barco("Submarino (1)", 1, new Horizontal());
		this.flota["Destructor Horizontal(2)"] = new Barco("Destructor Horizontal(2)", 2, new Horizontal());
		this.flota["Destructor Vertical(2)"] = new Barco("Destructor Vertical(2)", 2, new Vertical());
		this.flota["Crucero Horizontal(3)"] = new Barco("Crucero Horizontal(3)", 3, new Horizontal());
		this.flota["Crucero Vertical(3)"] = new Barco("Crucero Vertical(3)", 3, new Vertical());
		this.flota["Acorazado Horizontal(4)"] = new Barco("Acorazado Horizontal(4)", 4, new Horizontal());
		this.flota["Acorazado Vertical(4)"] = new Barco("Acorazado Vertical(4)", 4, new Vertical());
	}
	this.colocarBarco = function (nombre, x, y) {
		if (this.partida.fase.nombre == "desplegando") {
			let barco = this.flota[nombre];
			this.tableroPropio.colocarBarco(barco, x, y);
			console.log("El usuario ", this.nick, " coloca el barco ", barco.nombre, " en la posicion ", x, y);
			return barco;
		}
	}
	this.comprobarLimites = function (tam, x) {
		return this.tableroPropio.comprobarLimites(tam, x);
	}
	this.todosDesplegados = function () {
		for (var key in this.flota) {
			if (!this.flota[key].desplegado) {
				return false;
			}
		}
		return true;
	}
	this.barcosDesplegados = function () {
		this.partida.barcosDesplegados();
	}
	this.disparar = function (x, y) {
		return this.partida.disparar(this.nick, x, y);
	}
	this.meDisparan = function (x, y) {
		return this.tableroPropio.meDisparan(x, y);
	}
	this.obtenerEstado = function (x, y) {
		return this.tableroPropio.obtenerEstado(x, y);
	}
	this.marcarEstado = function (estado, x, y) {
		this.tableroRival.marcarEstado(estado, x, y);
		if (estado == "agua") {
			this.partida.cambiarTurno(this.nick);
		}
	}
	this.flotaHundida = function () {
		for (var key in this.flota) {
			if (this.flota[key].estado != "hundido") {
				return false;
			}
		}
		return true;
	}
	this.obtenerFlota = function () {
		return this.flota;
	}
	this.obtenerBarcoDesplegado = function (nombre, x) {
		for (let key in this.flota) {
			if (this.flota[key].nombre == nombre) {
				if (this.comprobarLimites(this.flota[key].tam, x)) {
					return this.flota[key];
				} else {
					return false;
				}
			}
		}
		return undefined;
	}
	this.logAbandonarPartida = function (jugador, codigo) {
		this.juego.insertarLog({ "operacion": "abandonarPartida", "usuario": jugador.nick, "codigo": codigo, "fecha": Date() }, function () {
			console.log("Registro de log(abandonar) insertado");
		});
	}
	this.logFinalizarPartida = function (perdedor, ganador, codigo) {
		this.juego.insertarLog({ "operacion": "finalizarPartida", "perdedor": perdedor, "ganador": ganador, "codigo": codigo, "fecha": Date() }, function () {
			console.log("Registro de log(finalizarPartida) insertado");
		});
	}
}

function Partida(codigo, usr) {
	this.codigo = codigo;
	this.owner = usr;
	this.jugadores = [];
	this.fase = new Inicial();
	this.maxJugadores = 2;
	this.turno;
	this.agregarJugador = function (usr) {
		let res = this.codigo;
		if (this.hayHueco()) {
			this.jugadores.push(usr);
			console.log("El usuario " + usr.nick + " se une a la partida " + this.codigo);
			usr.partida = this;
			usr.inicializarTableros(10);
			usr.inicializarFlota();
			this.comprobarFase();
		}
		else {
			res = -1;
			console.log("La partida está completa");
		}
		return res;
	}
	this.comprobarFase = function () {
		if (!this.hayHueco()) {
			this.fase = new Desplegando();
		}
	}
	this.hayHueco = function () {
		return (this.jugadores.length < this.maxJugadores);
	}
	this.estoy = function (nick) {
		for (i = 0; i < this.jugadores.length; i++) {
			if (this.jugadores[i].nick == nick) {
				return true;
			}
		}
		return false;
	}
	this.esInicial = function () {
		return this.fase.nombre == "inicial";
	}
	this.esJugando = function () {
		return this.fase.nombre == "jugando";
	}
	this.esDesplegando = function () {
		return this.fase.nombre == "desplegando";
	}
	this.esFinal = function () {
		return this.fase.nombre == "final";
	}
	this.flotasDesplegadas = function () {
		for (i = 0; i < this.jugadores.length; i++) {
			if (!this.jugadores[i].todosDesplegados()) {
				return false;
			}
		}
		return true;
	}
	this.barcosDesplegados = function () {
		if (this.flotasDesplegadas()) {
			this.fase = new Jugando();
			this.asignarTurnoInicial();
		}
	}
	this.asignarTurnoInicial = function () {
		this.turno = this.jugadores[0];
	}
	this.cambiarTurno = function (nick) {
		this.turno = this.obtenerRival(nick);
	}
	this.obtenerTurno = function () {
		return this.turno;
	}
	this.obtenerRival = function (nick) {
		let rival;
		for (i = 0; i < this.jugadores.length; i++) {
			if (this.jugadores[i].nick != nick) {
				rival = this.jugadores[i];
			}
		}
		return rival;
	}
	this.obtenerJugador = function (nick) {
		let jugador;
		for (i = 0; i < this.jugadores.length; i++) {
			if (this.jugadores[i].nick == nick) {
				jugador = this.jugadores[i];
			}
		}
		return jugador;
	}
	this.disparar = function (nick, x, y) {
		let atacante = this.obtenerJugador(nick);
		if (this.turno.nick == atacante.nick) {
			let atacado = this.obtenerRival(nick);
			let estado = atacado.meDisparan(x, y);
			console.log(estado);
			atacante.marcarEstado(estado, x, y);
			this.comprobarFin(atacado);
			console.log(atacante.nick + ' dispara a ' + atacado.nick + ' en casillas ' + x, y);
			return estado;
		}
		else {
			console.log("No es tu turno");
		}
	}
	this.comprobarFin = function (jugador) {
		if (jugador.flotaHundida()) {
			this.fase = new Final();
			console.log("Fin de la partida");
			console.log("Gandor: " + this.turno.nick);
			jugador.logFinalizarPartida(jugador.nick, this.turno.nick, this.codigo);
		}
	}
	this.abandonarPartida = function (jugador) {
		if (jugador) {
			rival = this.obtenerRival(jugador.nick);
			this.fase = new Final();
			console.log("Fin de la partida");
			console.log("Ha abandonado el jugador " + jugador.nick);
			if (rival) {
				console.log("Ganador: " + rival.nick);
			}
			jugador.logAbandonarPartida(jugador, this.codigo);
		}
	}
	this.agregarJugador(this.owner);
}

function Tablero(size) {
	this.size = size; //filas=columnas=size
	this.casillas;
	this.crearTablero = function (tam) {
		this.casillas = new Array(tam);
		for (x = 0; x < tam; x++) {
			this.casillas[x] = new Array(tam);
			for (y = 0; y < tam; y++) {
				this.casillas[x][y] = new Casilla(x, y);
			}
		}
	}
	this.colocarBarco = function (barco, x, y) {
		barco.colocar(this, x, y);
	}
	this.comprobarLimites = function (tam, num) {
		if (num + tam > this.size) {
			console.log('excede los limites');
			return false;
		}
		else {
			return true;
		}
	}
	this.meDisparan = function (x, y) {
		return this.casillas[x][y].contiene.meDisparan(this, x, y);
	}
	this.obtenerEstado = function (x, y) {
		return this.casillas[x][y].obtenerEstado();
	}
	this.marcarEstado = function (estado, x, y) {
		this.casillas[x][y].estado = estado;
	}
	this.ponerAgua = function (x, y) {
		this.casillas[x][y].contiene = new Agua();
	}
	this.crearTablero(size);
}

function Casilla(x, y) {
	this.x = x;
	this.y = y;
	this.contiene = new Agua();
	this.estado = "agua";
	this.obtenerEstado = function (){
		return this.contiene.obtenerEstado();
	}
}

function Barco(nombre, tam, orientacion) {
	this.nombre = nombre;
	this.tam = tam;
	this.orientacion = orientacion;
	this.desplegado = false;
	this.estado = "intacto";
	this.disparos = 0;
	this.x;
	this.y;
	this.esAgua = function () {
		return false;
	}
	this.meDisparan = function (tablero, x, y) {
		this.estado = "tocado";
		this.disparos++;
		tablero.marcarEstado(this.estado, x, y);
		tablero.ponerAgua(x,y);
		console.log("Tocado");
		if (this.comprobar(tablero)) {
			this.estado = "hundido";
			tablero.marcarEstado(this.estado, x, y);
			console.log("Hundido");
		}
		return this.estado;
	}
	this.posicion = function (x, y) {
		this.x = x;
		this.y = y;
	}
	this.colocar = function (tablero, x, y) {
		this.orientacion.colocarBarco(this, tablero, x, y);
	}
	this.obtenerEstado = function () {
		return this.estado;
	}
	this.comprobar = function (tablero) {
		return this.orientacion.comprobarCasillas(this, tablero);
	}
}

function Horizontal() {
	this.nombre = "horizontal";
	this.colocarBarco = function (barco, tablero, x, y) {
		if (tablero.comprobarLimites(barco.tam, x)) {
			if (this.casillasLibres(tablero.casillas, x, y, barco.tam)) {
				for (let i = x; i < barco.tam + x; i++) {
					tablero.casillas[i][y].contiene = barco;
					tablero.marcarEstado("intacto", i, y);
					console.log('Barco ', barco.nombre, ' colocado en ', i, y);
				}
				barco.posicion(x, y);
				barco.desplegado = true;
			}
		}
	}
	this.casillasLibres = function (casillas, x, y, tam) {
		for (i = x; i < tam + x; i++) {
			if (!casillas[i][y].contiene.esAgua()) {
				return false;
			}
		}
		return true;
	}
	this.comprobarCasillas = function (barco, tablero) {
		for (i = barco.x; i < barco.tam + barco.x; i++) {
			if (tablero.casillas[i][barco.y].estado == "intacto") {
				return false;
			}
		}
		return true;
	}
	this.esHorizontal = function(){
		return true;
	}
	this.esVertical = function(){
		return false;
	}
}

function Vertical() {
	this.nombre = "vertical"
	this.colocarBarco = function (barco, tablero, x, y) {
		if (tablero.comprobarLimites(barco.tam, y)) {
			if (this.casillasLibres(tablero.casillas, x, y, barco.tam)) {
				for (let i = y; i < barco.tam + y; i++) {
					tablero.casillas[x][i].contiene = barco;
					tablero.marcarEstado("intacto", x, i);
					console.log('Barco ', barco.nombre, ' colocado en ', x, i);
				}
				barco.posicion(x, y);
				barco.desplegado = true;
			}
		}
	}
	this.casillasLibres = function (casillas, x, y, tam) {
		for (i = y; i < tam + y; i++) {
			if (!casillas[x][i].contiene.esAgua()) {
				return false;
			}
		}
		return true;
	}
	this.comprobarCasillas = function (barco, tablero) {
		for (i = barco.y; i < barco.tam + barco.y; i++) {
			if (tablero.casillas[barco.x][i].estado == "intacto") {
				return false;
			}
		}
		return true;
	}
	this.esHorizontal = function(){
		return false;
	}
	this.esVertical = function(){
		return true;
	}
}

function Agua() {
	this.nombre = "agua";
	this.estado = "agua";
	this.esAgua = function () {
		return true;
	}
	this.meDisparan = function (tablero, x, y) {
		return this.obtenerEstado();
	}
	this.obtenerEstado = function () {
		return this.estado;
	}
}

function Inicial() {
	this.nombre = "inicial";
}

function Desplegando() {
	this.nombre = "desplegando";
}

function Final() {
	this.nombre = "final";
}

function Jugando() {
	this.nombre = "jugando";
}

module.exports.Juego = Juego;