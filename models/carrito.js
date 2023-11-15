const { Schema, model } = require("mongoose");

const CartSchema = new Schema({
  idUser: {
    type: String,
  },
  productos: []
});

CartSchema.methods.toJSON = function () {
  const { __v, ...cart } = this.toObject();
  return cart;
};

const CartModel = model("carrito", CartSchema);

module.exports = CartModel;
