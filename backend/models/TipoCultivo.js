const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TipoCultivo = sequelize.define(
  "TipoCultivo",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    cicloVida: { type: DataTypes.INTEGER, allowNull: false },
    mesSiembra: { type: DataTypes.STRING, allowNull: false },
    mesCosecha: { type: DataTypes.STRING, allowNull: false },
    riegoNecesario: { type: DataTypes.STRING, allowNull: false },
    humedadOptima: { type: DataTypes.STRING, allowNull: false },
    temperaturaOptima: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "tipocultivo", timestamps: false }
);

module.exports = TipoCultivo;
