const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const Parcela = require("../models/Parcela");

const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    
    if (!nombre || nombre.trim().length < 2) {
      return res.status(400).json({ message: "El nombre debe tener al menos 2 caracteres" });
    }

  
    const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,24}$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "El email no es válido" });
    }

   
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const parcela = await Parcela.findOne({ where: { idUsuario: usuario.id } });

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: "5h",
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

const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ["id", "nombre", "email"],
    });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, email } = req.body;
    const usuario = await Usuario.findByPk(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    usuario.nombre = nombre || usuario.nombre;
    usuario.email = email || usuario.email;

    await usuario.save();

    res.json({ message: "Perfil actualizado correctamente", usuario });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports ={actualizarPerfil,obtenerPerfil,login,register}