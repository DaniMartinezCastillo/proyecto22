# Proyecto 22
Proyecto de la asignatura "Procesos de Ingeniería Software", curso 22-23.
Escuela Superior de Ingeniería Informática de Albacete - Universidad de Castilla-La Mancha.

## Descripción
Este repositorio contiene la arquitectura base de una solución software estilo SaaS (Software as a Service) de una aplicación genérica que implementa la siguiente funcionalidad:
- Los usuario inician sesión con nick (no hay clave) o con su cuenta de google. El nick es único.
- Los usuarios pueden crear partida (sin nombre). Las partidas son de 2 usuarios. El sistema asigna un código a la partida.
- Los usuarios pueden unirse a partidas disponibles (las que tienen sólo un jugador).
- Los usuarios pueden abandonar la partida. Si lo hacen la partida finalizará.
- Los usuarios pueden salir del sistema (cerrar sesión). Si lo hacen en medio de una partida, esta finalizará.
- Una vez que la partida esté llena, los dos usuarios podrán desplegar todos los barcos. Cuando todos los barcos de los dos jugadores estén desplegados se iniciará la partida.
- Si se dispara sobre agua se cambiará de turno.
- Si se dispara sobre un barco el jugador podrá volver a disparar. Si dispara sobre todas las casillas sobre las que está colocado un barco este se hundirá. Si un jugador hunde todos los barcos del rival ganará la partida y esta finalizará.

## URL
https://proyecto22-3ru5xmyj3a-no.a.run.app