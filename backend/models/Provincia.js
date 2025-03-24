const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Usuario = require("./Usuario");

const Parcela = sequelize.define("provincia", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: false });

Usuario.hasOne(Parcela, { foreignKey: "idUsuario", onDelete: "CASCADE" });
Parcela.belongsTo(Usuario, { foreignKey: "idUsuario" });

module.exports = Parcela;
