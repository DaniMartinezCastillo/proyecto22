describe("Player", function() {
  var miJuego;
  var usr1,usr2,usr3;

  beforeEach(function() {
    miJuego=new Juego();
    miJuego.agregarUsuario("pepe");
    miJuego.agregarUsuario("luis");
    usr1=miJuego.usuarios["pepe"];
    usr2=miJuego.usuarios["luis"];
  });

  it("inicialmente", function() {
    let lista=miJuego.obtenerPartidas();
    expect(lista.length).toEqual(0);
    expect(usr1.nick).toEqual("pepe");
    expect(usr2.nick).toEqual("luis");
  });

  it("crear partida", function() {
    let codigo=usr1.crearPartida();
    expect(miJuego.partidas[codigo]).toBeDefined();
    let partida=miJuego.partidas[codigo];
    expect(partida.owner.nick).toEqual(usr1.nick);
    expect(partida.jugadores[0].nick).toEqual(usr1.nick);
    expect(partida.codigo).toEqual(codigo);
  });

  it("agregar jugador", function() {
    miJuego.unirseAPartida(codigo,usr2);
    expect(partida.jugadores.length).toEqual(2);
    expect(partida.jugadores[1].nick).toEqual(usr2.nick);
  });

  it("unirse a partida", function() {
    miJuego.agregarUsuario("pepa");
    usr3=miJuego.usuarios["pepa"];
    expect(usr3.nick).toEqual("pepa");

    let codigo2=usr3.crearPartida();
    expect(miJuego.partidas[codigo2]).toBeDefined();
    let partida2=miJuego.partidas[codigo2];
    expect(partida2.owner.nick).toEqual(usr3.nick);
    expect(partida2.jugadores[0].nick).toEqual(usr3.nick);
    expect(partida2.codigo2).toEqual(codigo2);

    let lista=miJuego.obtenerPartidas();
    expect(lista.length).toEqual(2);

    usr2.unirseAPartida(codigo2);
    expect(partida2.jugadores.length).toEqual(2);
    expect(partida2.jugadores[1].nick).toEqual(usr2.nick);
  });

  xit("el usuario luis se une a la partida", function() { //xit es para comentar la prueba
    
  });

  xit("obtener partida", function() {

  });

  


});
