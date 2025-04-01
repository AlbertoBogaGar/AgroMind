const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Provincia = sequelize.define("provincia", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    idAemet:{type:DataTypes.INTEGER,allowNull:false},
}, { tableName:'provincia',timestamps: false });



module.exports = Provincia;
