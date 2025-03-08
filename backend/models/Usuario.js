const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Usuario = sequelize.define("usuario", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
}, { 
    timestamps: false,
    freezeTableName: true 
});

module.exports = Usuario;
