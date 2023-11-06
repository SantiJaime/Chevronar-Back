const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    default: 1,
  },
  descripcion: {
    type: String,
    required: true,
  },
  imagen: {
    type: String,
    required: true,
  },
});

ProductSchema.methods.toJSON = function () {
  const { __v, ...product } = this.toObject();
  return product;
};

const ProductModel = model("productos", ProductSchema);

module.exports = ProductModel;
