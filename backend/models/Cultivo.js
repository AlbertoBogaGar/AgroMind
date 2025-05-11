const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const TipoCultivo = require("./TipoCultivo");
const Parcela = require("./Parcela");

const Cultivo = sequelize.define(
  "Cultivo",
  {
    idTipoCultivo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: TipoCultivo, key: "id" },
    },
    idParcela: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Parcela, key: "id" },
    },
    fechaSiembra: { type: DataTypes.DATEONLY, allowNull: false },
    fechaRecoleccion: { type: DataTypes.DATEONLY, allowNull: true },
    estado: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "cultivo", timestamps: false }
);

module.exports = Cultivo;
