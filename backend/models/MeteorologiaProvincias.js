const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Provincia = require("./Provincia");

const MeteorologiaProvincia = sequelize.define(
  "meteorologiaprovincias",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idProvincia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Provincia,
        key: "id"
      }
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    temperatura_min: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    temperatura_max: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    humedad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lluvia: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    horas_precipitacion: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    viento: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    prob_precipitacion: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    salida_sol: {
      type: DataTypes.STRING,
      allowNull: false
    },
    puesta_sol: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duracion_luz: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    duracion_sol: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  },
  {
    tableName: "meteorologiaprovincias",
    timestamps: false
  }
);



module.exports = MeteorologiaProvincia;
