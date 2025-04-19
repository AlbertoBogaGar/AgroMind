const Usuario = require('./Usuario');
const Parcela = require('./Parcela');
const Provincia = require('./Provincia');
const Cultivo = require('./Cultivo');
const TipoCultivo = require('./TipoCultivo');
const Meteorologia = require('./MeteorologiaProvincias');
const Recomendaciones = require('./Recomendaciones');

// Usuario tiene una Parcela
Usuario.hasOne(Parcela, { foreignKey: 'idUsuario' });
Parcela.belongsTo(Usuario, { foreignKey: 'idUsuario' });

// Parcela pertenece a Provincia
Parcela.belongsTo(Provincia, { foreignKey: 'idProvincia' });
Provincia.hasMany(Parcela, { foreignKey: 'idProvincia' });

// Parcela tiene muchos Cultivos
Parcela.hasMany(Cultivo, { foreignKey: 'idParcela' });
Cultivo.belongsTo(Parcela, { foreignKey: 'idParcela' });

// Cultivo tiene un Tipo
TipoCultivo.hasMany(Cultivo, { foreignKey: 'idTipoCultivo' });
Cultivo.belongsTo(TipoCultivo, { foreignKey: 'idTipoCultivo', as: 'tipoCultivo' });

// Cultivo tiene muchas recomendaciones
Cultivo.hasMany(Recomendaciones, { foreignKey: 'idCultivo' });
Recomendaciones.belongsTo(Cultivo, { foreignKey: 'idCultivo' });

// Recomendaciones pertenece a un usuario
Usuario.hasMany(Recomendaciones, { foreignKey: 'idUsuario' });
Recomendaciones.belongsTo(Usuario, { foreignKey: 'idUsuario' });
