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
const auth = require("../middleware/auth");

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
      "Mínimo de 3 caracteres"
    ).isLength({
      min: 3,
    }),
    check("descripcion", "El campo descripción está vacío").notEmpty(),
    check("categoria", "El campo categoría está vacío").notEmpty(),
    check("imagen", "El campo imágen está vacío").notEmpty(),
    check("precio", " El campo precio está vacío").notEmpty(),
  ],
  auth("admin"),
  createProduct
);
router.put(
  "/:id",
  [check("id", "Formato ID incorrecto").isMongoId()],
  auth("admin"),
  updateProduct
);
router.delete(
  "/:id",
  [check("id", "Formato ID inválido").isMongoId()],
  auth("admin"),
  deleteProduct
);

module.exports = router;
