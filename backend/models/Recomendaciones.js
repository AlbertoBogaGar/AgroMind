const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Cultivo = require("./Cultivo"); // Asegúrate de tener este modelo definido

const Recomendaciones = sequelize.define(
  "recomendaciones",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idCultivo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cultivo,
        key: "id",
      },
    },
    fechaGeneracion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("Grave", "Media", "Leve"),
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "recomendaciones",
    timestamps: false,
  }
);

// Relaciones
Recomendaciones.belongsTo(Cultivo, { foreignKey: "idCultivo" });

module.exports = Recomendaciones;
