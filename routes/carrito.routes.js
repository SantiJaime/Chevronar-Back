const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getCart, addProduct, deleteProduct, deleteCart, emptyOneCart } = require("../controllers/carrito");

router.get("/:id", getCart);
router.post("/:idCart/:idProd", addProduct);
router.delete("/empty/:id", auth("user"), emptyOneCart);
router.delete("/:idCart/:idProd", auth("user"), deleteProduct);
router.delete("/:idCart", auth("admin"), deleteCart);

module.exports = router;
