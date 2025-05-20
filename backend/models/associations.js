const Usuario = require('./Usuario');
const Parcela = require('./Parcela');
const Provincia = require('./Provincia');
const Cultivo = require('./Cultivo');
const TipoCultivo = require('./TipoCultivo');
const Meteorologia = require('./MeteorologiaProvincias');
const Recomendaciones = require('./Recomendaciones');
const Actividad = require('./Actividad');


Usuario.hasOne(Parcela, { foreignKey: 'idUsuario' });
Parcela.belongsTo(Usuario, { foreignKey: 'idUsuario' });


Parcela.belongsTo(Provincia, { foreignKey: 'idProvincia' });
Provincia.hasMany(Parcela, { foreignKey: 'idProvincia' });


Parcela.hasMany(Cultivo, { foreignKey: 'idParcela' });
Cultivo.belongsTo(Parcela, { foreignKey: 'idParcela' });


TipoCultivo.hasMany(Cultivo, { foreignKey: 'idTipoCultivo' });
Cultivo.belongsTo(TipoCultivo, { foreignKey: 'idTipoCultivo', as: 'tipoCultivo' });


Cultivo.hasMany(Recomendaciones, { foreignKey: 'idCultivo' });
Recomendaciones.belongsTo(Cultivo, { foreignKey: 'idCultivo' });


Usuario.hasMany(Recomendaciones, { foreignKey: 'idUsuario' });
Recomendaciones.belongsTo(Usuario, { foreignKey: 'idUsuario' });

Actividad.belongsTo(Cultivo, { foreignKey: 'idCultivo' });
Cultivo.hasMany(Actividad, { foreignKey: 'idCultivo' });
