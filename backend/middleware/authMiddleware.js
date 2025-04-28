const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No autorizado. Token no proporcionado." });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;

    console.log("Usuario autenticado:", decoded); 
    console.log("Token recibido:", token);
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado." });
  }
};

module.exports = authMiddleware;
