const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Usuario = require("./Usuario");
const Provincia = require("./Provincia")

const Parcela = sequelize.define("parcela", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idUsuario: { type: DataTypes.INTEGER, allowNull: false, references: { model: Usuario, key: "id" } },
    idProvincia: { type: DataTypes.INTEGER, allowNull: false, references: { model: Provincia, key: "id" } },
    latitud: { type: DataTypes.FLOAT, allowNull: true },
    longitud: { type: DataTypes.FLOAT, allowNull: true },
    tamaño: { type: DataTypes.FLOAT, allowNull: false }
}, {tableName:"parcela", timestamps: false });

Usuario.hasOne(Parcela, { foreignKey: "idUsuario", onDelete: "CASCADE" });
Parcela.belongsTo(Usuario, { foreignKey: "idUsuario" });
Parcela.belongsTo(Provincia, { foreignKey: "idProvincia" });

module.exports = Parcela;
