const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Parcela = require("./Parcela");

const Alerta = sequelize.define(
  "alerta",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idParcela: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Parcela,
        key: "id",
      },
    },
    tipo: {
      type: DataTypes.ENUM("grave", "media", "leve"),
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "alerta",
    timestamps: false,
  }
);

module.exports = Alerta;
