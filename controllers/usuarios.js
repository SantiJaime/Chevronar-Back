const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/usuario");
const { getToken, getTokenData } = require("../middleware/jwt.config");
const CartModel = require("../models/carrito");

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await UserModel.find();
    res
      .status(200)
      .json({ msg: "Usuarios encontrados", allUsers, status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "No se pudieron encontrar los usuarios", error });
  }
};
const getOneUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ msg: errors.array() });
  }
  try {
    const oneUser = await UserModel.findOne({ _id: req.params.id });
    res.status(200).json({ msg: "Usuario encontrado", oneUser, status: 200 });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo encontrar el usuario", error });
  }
};
const createUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ msg: errors.array() });
  }
  try {
    const emailExist = await UserModel.findOne({ email: req.body.email });
    if (emailExist) {
      return res
        .status(422)
        .json({ msg: "El Email ya se encuentra registrado", status: 422 });
    }

    const newUser = new UserModel(req.body);

    const { email, _id, role } = newUser;

    const token = getToken({ email, _id, role });
    if (req.body.role !== "admin") {
      const newCart = new CartModel();

      newUser.idCart = newCart._id;
      newCart.idUser = newUser._id;
      await newCart.save();
    }

    const salt = bcrypt.genSaltSync();
    newUser.pass = await bcrypt.hash(req.body.pass, salt);

    await newUser.save();

    res.status(201).json({
      msg: "Usuario creado correctamente",
      newUser,
      token,
      status: 201,
    });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo crear el usuario", error });
  }
};
const updateUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ msg: errors.array() });
  }
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json({ msg: "Usuario editado correctamente", updatedUser, status: 200 });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo editar el usuario", error });
  }
};
const deleteUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ msg: errors.array() });
  }
  try {
    const deletedUser = await UserModel.findByIdAndDelete({
      _id: req.params.id,
    });

    res.status(200).json({
      msg: "Usuario eliminado correctamente",
      deletedUser,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo eliminar el usuario", error });
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ msg: errors.array() });
  }
  try {
    const userExist = await UserModel.findOne({ email: req.body.email });
    if (!userExist) {
      return res.status(422).json({ msg: "El usuario no existe", status: 422 });
    }
    if (userExist.status !== "Verified") {
      return res
        .status(400)
        .json({ msg: "Debes verificar tu cuenta para iniciar sesión" });
    }

    const passCheck = await bcrypt.compare(req.body.pass, userExist.pass);
    if (passCheck) {
      const payload_jwt = {
        user: {
          id: userExist._id,
          email: userExist.email,
          role: userExist.role,
        },
      };
      const token = jwt.sign(payload_jwt, process.env.SECRET_KEY);
      res.status(200).json({
        msg: "Sesión iniciada correctamente",
        userExist,
        token,
        status: 200,
      });
    } else {
      res
        .status(422)
        .json({ msg: "Email y/o contraseña incorrectos", status: 422 });
    }
  } catch (error) {
    res.status(500).json({ msg: "No se pudo iniciar sesión", error });
  }
};

const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const data = await getTokenData(token);

    const { email, _id } = data.data;
    if (!data) {
      return res.status(400).json({ msg: "Error al obtener los datos" });
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(422).json({ msg: "El usuario no existe" });
    }
    if (_id == user._id) {
      user.status = "Verified";
      await user.save();

      res.redirect("https://chevronar.com/confirm");
    } else {
      res.redirect("https://chevronar.com/*");
    }
  } catch (error) {
    res.status(500).json({ msg: "Error al verificar correo", error });
  }
};
const sendMailRecoveryPass = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) return res.status(422).json({ msg: "El usuario no existe" });

    const { email, _id, role } = user;

    const token = getToken({ email, _id, role });

    res.status(201).json({
      msg: "Mensaje de recuperación de contraseña enviado correctamente",
      token,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al verificar correo", error });
  }
};

const changePass = async (req, res) => {
  try {
    const { token } = req.params;
    const data = await getTokenData(token);

    if (!data) {
      return res.status(400).json({ msg: "Error al obtener los datos" });
    }
    const { _id } = data.data;
    
    const user = await UserModel.findOne({ _id });

    if (!user) return res.status(422).json({ msg: "El usuario no existe" });

    const salt = bcrypt.genSaltSync();
    user.pass = await bcrypt.hash(req.body.pass, salt);
    await user.save();
    res.status(200).json({ msg: "Contraseña actualizada correctamente", user });
  } catch (error) {
    res.status(500).json({ msg: "Error al cambiar la contraseña", error });
  }
};
module.exports = {
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  confirmEmail,
  sendMailRecoveryPass,
  changePass,
};
