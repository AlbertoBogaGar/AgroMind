require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database"); 
const authRoutes = require("./routes/authRoutes");
const parcelaRoutes = require("./routes/parcelaRoutes");
const cultivoRoutes = require("./routes/cultivoRoutes");
const tipoCultivoRoutes = require("./routes/tipoCultivoRoutes");
const weatherRoutes = require("./routes/weatherRoutes");




const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/parcela", parcelaRoutes);
app.use("/api/cultivo", cultivoRoutes);
app.use("/api/tipoCultivo", tipoCultivoRoutes);
app.use("/api/weather", weatherRoutes);


app.get("/", (req, res) => {
    res.send("API AgroMind funcionando ");
});

sequelize.authenticate()
    .then(() => console.log("Conexión a la base de datos exitosa"))
    .catch(err => console.error(" Error al conectar a la base de datos:", err));

sequelize.sync({ force: false }) 
    .then(() => console.log("Tablas sincronizadas con éxito"))
    .catch(err => console.error("Error al sincronizar tablas:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
