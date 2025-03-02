const { Sequelize } = require("sequelize");
require("dotenv").config();

// Configurar la conexión a MySQL con Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false // Desactivar logs de consultas SQL en la terminal
});

// Verificar la conexión a la base de datos
(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conexión a la base de datos exitosa");
    } catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error);
    }
})();

module.exports = sequelize;
