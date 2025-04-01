const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Provincia = require("./Provincia");

const MeteorologiaProvincia = sequelize.define(
  "meteorologiaprovincias",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idProvincia: {type: DataTypes.INTEGER,allowNull: false, references: { model: Provincia, key: "id" }},
    fecha: {type: DataTypes.DATEONLY,allowNull: false},
    temperatura_actual: { type: DataTypes.INTEGER, allowNull: false },
    temperatura_min: {type: DataTypes.INTEGER,allowNull: false},
    temperatura_max: {type: DataTypes.INTEGER,allowNull: false},
    humedad: {type: DataTypes.INTEGER,allowNull: false},
    lluvia: {type: DataTypes.INTEGER,allowNull: false},
  },
  {
    tableName: "meteorologiaprovincias",
    timestamps: false,
  }
);

// Relaciones
MeteorologiaProvincia.belongsTo(Provincia, { foreignKey: "idProvincia" });

module.exports = MeteorologiaProvincia;
