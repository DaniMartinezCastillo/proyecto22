function Juego() {
	this.partidas = {};
	this.usuarios = {}; //array asociativo

	this.agregarUsuario = function (nick) {
		let res={nick:-1};
		if (!this.usuarios[nick]) {
			this.usuarios[nick] = new Usuario(nick, this);
			res={nick:nick};
			console.log("Nuevo usuario: "+nick);
		}
		return res;
	}
	this.eliminarUsuario = function (nick) {
		delete this.usuarios[nick]
	}
	this.jugadorCrearPartida = function (nick) {
		let usr = this.usuarios[nick]; //juego.obtenerUsuario(nick)
		let res={codigo:-1};
		if (usr) {
			let codigo=usr.crearPartida();
			//let codigo=this.crearPartida(usr); //igual pero sin pasar por el usuario
			res={"codigo":codigo};
		}
		return res;
	}
	this.crearPartida = function (usr) {
		let codigo = Date.now();
		this.partidas[codigo] = new Partida(codigo, usr);
		console.log("Usuario "+usr.nick+" ha creado la partida "+codigo);
		return codigo;
	}
	this.jugadorSeUneAPartida = function (nick, codigo) {
		let usr = this.usuarios[nick];
		let res={"codigo":-1};
		if (usr) {
			//let valor=usr.unirseAPartida(codigo); //esto es lo mismo pero pasando por el usuario
			let valor=this.unirseAPartida(codigo,usr);
			res={"codigo":valor};
		}
		return res;
	}
	this.unirseAPartida = function (codigo, usr) {
		let res=-1;
		if (this.partidas[codigo]) {
			res = this.partidas[codigo].agregarJugador(usr);
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
		//devolver solo las partidas sin completar
		let lista = [];
		for (let key in this.partidas) {
			if (this.partidas[key].hayHueco()) {
				lista.push({ "codigo": key, "owner": this.partidas[key].owner.nick });
			}
		}
		return lista;
	}
}

function Usuario(nick, juego) {
	this.nick = nick;
	this.juego = juego;
	this.crearPartida = function () {
		return this.juego.crearPartida(this)	//usuario tiene que pasarse a si mismo por eso usamos this
	}
	this.unirseAPartida = function (codigo) {
		this.juego.unirseAPartida(codigo, this); //igual que arriba
	}
}

function Partida(codigo, usr) {
	this.codigo = codigo;
	this.owner = usr;
	this.jugadores = [];
	this.fase = "inicial"; //new Inicial()
	this.maxJugadores=2;
	this.agregarJugador = function (usr) {
		let res=this.codigo;
		if (this.hayHueco()) {
			this.jugadores.push(usr);
			console.log("El usuario "+usr.nick+" se ha unido a la partida "+this.codigo);
			this.comprobarFase();
		}
		else {
			res=-1;
			console.log("El usuario "+usr.nick+" NO se ha podido unir a la partida "+this.codigo+" porque está COMPLETA");
		}
		return res;
	}
	this.comprobarFase=function(){
		if (!this.hayHueco()){
			this.fase="jugando";
		}
	}
	this.hayHueco = function (){
		return (this.jugadores.length<this.maxJugadores)
	}
	this.agregarJugador(this.owner);
}

module.exports.Juego = Juego;