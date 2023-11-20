const cors = require("cors");
const morgan = require("morgan");
const express = require("express");

class Server {
  constructor() {
    this.app = express();
    this.middleware()
    this.routes()
  }
  middleware(){
    this.app.use(express.json())
    this.app.use(morgan("dev"))
    this.app.use(cors())
  }
  routes(){
    this.app.use("/carrito", require("../routes/carrito.routes"))
    this.app.use("/productos", require("../routes/productos.routes"))
    this.app.use("/usuarios", require("../routes/usuarios.routes"))
    this.app.use("/ordenes-compra", require("../routes/ordenes.routes"))
  }
  listen() {
    this.app.listen(process.env.PORT, () => {
      console.log("Servidor en línea");
    });
  }
}

module.exports = Server