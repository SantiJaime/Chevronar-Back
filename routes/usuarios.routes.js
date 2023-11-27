const express = require("express");
const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  loginUser,
  confirmEmail,
  getOneUser,
  sendMailRecoveryPass,
  changePass,
} = require("../controllers/usuarios");
const auth = require("../middleware/auth");
const router = express.Router();
const { check } = require("express-validator");

router.get("/", auth("admin"), getAllUsers);
router.get("/:id", auth(["user", "admin"]), getOneUser);
router.get("/confirm/:token", confirmEmail);
router.post(
  "/",
  [
    check("name", "Campo nombre vacío").notEmpty(),
    check("email", "Campo correo electrónico vacío").notEmpty(),
    check("email", "Formato de correo electrónico inválido").isEmail(),
    check("pass", "Campo contraseña vacío").notEmpty(),
    check("pass", "Formato inválido. Min de 8 caracteres").isLength({ min: 8 }),
  ],
  createUser
);
router.post("/login", loginUser);
router.post("/sendMailRecoveryPass", sendMailRecoveryPass);
router.put(
  "/recoveryPass/:token",
  [check("pass", "Campo contraseña obligatorio").notEmpty()],
  changePass
);
router.put(
  "/:id",
  [check("id", "Formato ID inválido").isMongoId()],
  auth(["user", "admin"]),
  updateUser
);

router.delete(
  "/:id",
  [check("id", "Formato ID inválido").isMongoId()],
  auth("admin"),
  deleteUser
);

module.exports = router;
