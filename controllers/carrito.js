const CartModel = require("../models/carrito");
const ProductModel = require("../models/producto");

const getCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ _id: req.params.id });
    res.status(200).json({ msg: "Carrito encontrado", cart, status: 200 });
  } catch (error) {
    res.status(500).json({ msg: "Hubo un error al obtener el carrito", error });
  }
};
const addProduct = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ _id: req.params.idCart });
    const prod = await ProductModel.findOne({ _id: req.params.idProd });
    const prodExistente = cart.productos.find(
      (producto) => producto._id == req.params.idProd
    );
    if (prodExistente) {
      return res
        .status(400)
        .json({ msg: "El producto ya existe en el carrito", status: 400 });
    }
    cart.productos.push(prod);
    await cart.save();
    res
      .status(200)
      .json({ msg: "Producto cargado correctamente", cart, status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Hubo un error al agregar un producto al carrito", error });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ _id: req.params.idCart });
    const prodIndex = cart.productos.findIndex(
      (prod) => prod._id == req.params.idProd
    );
    cart.productos.splice(prodIndex, 1);
    await cart.save();
    res
      .status(200)
      .json({ msg: "Producto eliminado correctamente", status: 200 });
  } catch (error) {
    res.status(500).json({ msg: "Hubo un error al borrar el producto", error });
  }
};
const emptyOneCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ _id: req.params.id });
    cart.productos = [];
    await cart.save();

    res
      .status(200)
      .json({ msg: "Carrito vaciado correctamente", cart, status: 200 });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo vaciar el carrito", error });
  }
};
const deleteCart = async (req, res) => {
  try {
    await CartModel.findByIdAndDelete({ _id: req.params.idCart });
    res
      .status(200)
      .json({ msg: "Carrito eliminado correctamente", status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Hubo un error al eliminar el carrito", error });
  }
};

module.exports = {
  getCart,
  addProduct,
  deleteCart,
  deleteProduct,
  emptyOneCart,
};
