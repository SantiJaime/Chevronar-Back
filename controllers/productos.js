const { validationResult } = require("express-validator");
const ProductModel = require("../models/producto");

const getProducts = async (req, res) => {
  try {
    const allProds = await ProductModel.find();
    res.status(200).json({ msg: "Productos encontrados", allProds });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo encontrar los productos", error });
  }
};

const getOneProduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ msg: errors.array() });
  }
  try {
    const oneProd = await ProductModel.findOne({ _id: req.params.id });
    res.status(200).json({ msg: "Producto encontrado", oneProd, status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Hubo un error al obtener el producto", error });
  }
};

const createProduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ msg: errors.array() });
  }
  try {
    const newProd = new ProductModel(req.body);
    await newProd.save();
    res
      .status(201)
      .json({ msg: "Producto creado correctamente", newProd, status: 201 });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo crear el producto", error });
  }
};

const updateProduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ msg: errors.array() });
  }
  try {
    const editedProd = await ProductModel.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json({ msg: "Producto editado correctamente", editedProd, status: 200 });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo editar el producto", error });
  }
};

const deleteProduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ msg: errors.array() });
  }
  try {
    await ProductModel.findByIdAndDelete({ _id: req.params.id });
    res
      .status(200)
      .json({ msg: "Producto eliminado correctamente", status: 200 });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo eliminar el producto", error });
  }
};

module.exports = {
  getProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
