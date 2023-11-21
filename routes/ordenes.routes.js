const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const {
  getOrders,
  createOrder,
  deleteOrder,
} = require("../controllers/ordenCompra");

router.get("/", auth(["user", "admin"]), getOrders);
router.post(
  "/",
  auth("user"),
  [
    check("email", "El campo email está vacío").notEmpty(),
    check("email", "Formato email inválido").isEmail(),
    check("name", "El campo nombre está vacío").notEmpty(),
    check("products", "El campo productos está vacío").notEmpty(),
    check("payMethod", "El campo método de pago está vacío").notEmpty(),
    check("price", " El campo precio final está vacío").notEmpty(),
  ],
  createOrder
);
router.delete(
  "/:id",
  auth(["user", "admin"]),
  [check("id", "Formato ID incorrecto").isMongoId()],
  deleteOrder
);

module.exports = router;
