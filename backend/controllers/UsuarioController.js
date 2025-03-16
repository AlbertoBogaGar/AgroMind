const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const Parcela = require("../models/Parcela");

exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const parcela = await Parcela.findOne({ where: { idUsuario: usuario.id } });

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
      tieneParcela: !!parcela,
    });
  } catch (error) {
    console.log("Error en login", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
