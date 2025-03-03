const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Parcela = sequelize.define("Parcela", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: "id" } },
    nombre: { type: DataTypes.STRING, allowNull: false },
    ubicacion: { type: DataTypes.STRING, allowNull: false },
    lat: { type: DataTypes.FLOAT, allowNull: true },
    lng: { type: DataTypes.FLOAT, allowNull: true },
    tamaño: { type: DataTypes.FLOAT, allowNull: false }
}, { timestamps: false });

User.hasOne(Parcela, { foreignKey: "usuariId", onDelete: "CASCADE" });
Parcela.belongsTo(User, { foreignKey: "usuarioId" });

module.exports = Parcela;
