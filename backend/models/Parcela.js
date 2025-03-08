const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Usuario = require("./Usuario");

const Parcela = sequelize.define("parcela", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idUsuario: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: "id" } },
    nombre: { type: DataTypes.STRING, allowNull: false },
    ubicacion: { type: DataTypes.STRING, allowNull: false },
    latitud: { type: DataTypes.FLOAT, allowNull: true },
    longitud: { type: DataTypes.FLOAT, allowNull: true },
    tamaño: { type: DataTypes.FLOAT, allowNull: false }
}, { timestamps: false });

Usuario.hasOne(Parcela, { foreignKey: "idUsuario", onDelete: "CASCADE" });
Parcela.belongsTo(Usuario, { foreignKey: "idUsuario" });

module.exports = Parcela;
