require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database"); // Importar la base de datos
const authRoutes = require("./routes/authRoutes");


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("API AgroMind funcionando 🚀");
});

// Conectar a la base de datos y sincronizar las tablas
sequelize.authenticate()
    .then(() => console.log("✅ Conexión a la base de datos exitosa"))
    .catch(err => console.error("❌ Error al conectar a la base de datos:", err));

sequelize.sync({ force: false }) // Usa "force: true" solo si quieres borrar y recrear las tablas
    .then(() => console.log("✅ Tablas sincronizadas con éxito"))
    .catch(err => console.error("❌ Error al sincronizar tablas:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
