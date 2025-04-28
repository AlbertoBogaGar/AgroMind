const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Actividad = sequelize.define("Actividad", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idCultivo: { type: DataTypes.INTEGER, allowNull: false },
  titulo: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  fechaSugerida: { type: DataTypes.DATE, allowNull: false },
  estado: { type: DataTypes.ENUM('pendiente', 'completada'), defaultValue: 'pendiente' }
}, {
  tableName: "actividad",
  timestamps: false
});

module.exports = Actividad;
