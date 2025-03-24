const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No autorizado. Token no proporcionado." });
  }

  try {
    // Verificar el token y extraer los datos
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Guardar el usuario en req.usuario

    console.log("Usuario autenticado:", decoded); // Verifica si el id se obtiene correctamente
    console.log("Token recibido:", token);
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado." });
  }
};

module.exports = authMiddleware;
