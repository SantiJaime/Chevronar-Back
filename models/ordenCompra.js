const { Schema, model } = require("mongoose");

const BuyOrdenSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  products: [],
  price: {
    type: Number,
    required: true,
  },
  payMethod: {
    type: String,
    required: true,
  },
});

BuyOrdenSchema.methods.toJSON = function () {
  const { __v, ...order } = this.toObject();
  return order;
};

const BuyOrderModel = model("ordenCompra", BuyOrdenSchema);

module.exports = BuyOrderModel;
