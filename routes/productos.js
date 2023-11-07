const express = require("express");
const router = express.Router();
const {
  getProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productos");
const { check } = require("express-validator");

router.get("/", getProducts);
router.get(
  "/:id",
  [check("id", "Formato ID incorrecto").isMongoId()],
  getOneProduct
);
router.post(
  "/",
  [
    check("nombre", "El campo nombre está vacío").notEmpty(),
    check(
      "nombre",
      "Mínimo de 3 caracteres | Máximo de 50 caracteres"
    ).isLength({
      min: 3,
      max: 100,
    }),
    check("descripcion", "El campo descripción está vacío").notEmpty(),
    check("categoria", "El campo categoría está vacío").notEmpty(),
    check("imagen", "El campo imágen está vacío").notEmpty(),
    check("precio", " El campo precio está vacío").notEmpty(),
  ],
  createProduct
);
router.put(
  "/:id",
  [check("id", "Formato ID incorrecto").isMongoId()],
  updateProduct
);
router.delete(
  "/:id",
  [check("id", "Formato ID inválido").isMongoId()],
  deleteProduct
);

module.exports = router;
