var mongo = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

function Cad() {
    this.logs = undefined;

    this.insertarLog = function (log, callback) {
        insertar(this.logs, log, callback);
    }

    this.insertarPartida = function (partida, callback) {
        insertar(this.partidas, partida, callback);
    }

    this.insertarUsuario = function (usuario, callback) {
        insertar(this.usuarios, usuario, callback);
    }

    this.obtenerLogs = function (callback) {
        obtenerTodos(this.logs, callback);
    }

    this.obtenerUsuarios = function (callback) {
        obtenerTodos(this.usuarios, callback);
    }

    this.obtenerOCrearUsuario = function (criterio, callback) {
        obtenerOCrear(this.usuarios, criterio, callback);
    }

    this.obtenerTodos = function (coleccion, callback) {
        coleccion.find().toArray(function (error, col) {
            callback(col);
        });
    }

    function insertar(coleccion, elemento, callback) {
        coleccion.insertOne(elemento, function (err, result) {
            if (err) {
                console.log("error");
            }
            else {
                console.log("Nuevo elemento creado");
                callback(elemento);
            }
        });
    }

    this.conectar = function () {
        let cad = this;
        mongo.connect("mongodb+srv://admin:admin@cluster0.zqzreoh.mongodb.net/?retryWrites=true&w=majority", { useUnifiedTopology: true }, function (err, database) {
            if (!err) {
                console.log("Conectado a MongoDB Atlas");
                database.db("batalla").collection("logs", function (err, col) { });
                if (err) {
                    console.log("No se puede conectar");
                }
                else {
                    console.log("Tenemos la coloección de logs");
                    cad.log = col;
                }
            }
            else {
                console.log("No se puedo conectar con MongoDB Atlas");
            }
        });
    }

    function obtenerOCrear(coleccion, criterio, callback) {
        coleccion.findOneAndUpdate(criterio, { $set: criterio }, { upsert: true }, function (err, doc) {
            if (err) { throw err; }
            else {
                console.log("Updated");
                callback(doc);
            }
        });
    }

}

module.exports.Cad = Cad;