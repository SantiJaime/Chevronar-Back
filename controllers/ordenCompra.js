const BuyOrderModel = require("../models/ordenCompra");
const { validationResult } = require("express-validator");

const getOrders = async (req, res) => {
  try {
    const allOrders = await BuyOrderModel.find();
    res
      .status(200)
      .json({ msg: "Órdenes de compra encontradas", allOrders, status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "No se pudo encontrar las órdenes de compra", error });
  }
};

const getOneUserOrders = async (req, res) => {
  try {
    const oneUserOrders = await BuyOrderModel.find({ email: req.params.email });
    res
      .status(200)
      .json({
        msg: "Órdenes de compra encontradas",
        oneUserOrders,
        status: 200,
      });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "No se pudo encontrar las órdenes de compra", error });
  }
};

const createOrder = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ msg: errors.array() });
  }
  try {
    const newOrder = new BuyOrderModel(req.body);
    await newOrder.save();
    res.status(201).json({
      msg: "Orden de compra creada correctamente",
      newOrder,
      status: 201,
    });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo crear la órden de compra", error });
  }
};

const deleteOrder = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ msg: errors.array() });
  }
  try {
    await BuyOrderModel.findByIdAndDelete({ _id: req.params.id });
    res
      .status(200)
      .json({ msg: "Orden de compra eliminada correctamente", status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "No se pudo eliminar la órden de compra", error });
  }
};

module.exports = {
  getOrders,
  getOneUserOrders,
  createOrder,
  deleteOrder,
};
