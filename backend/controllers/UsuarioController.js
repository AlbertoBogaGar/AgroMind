const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

// REGISTRO DE USUARIO
exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
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

// LOGIN DE USUARIO
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res
        .status(400)
        .json({ message: "Usuario no encontrado en base de datos" });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ message: "Login exitoso", token });
  } catch (error) {
    console.error("Error detallado:", error);
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};
