const TipoCultivo = require("../models/TipoCultivo")

const obtenerTipoCultivo = async (req,res) =>{
    const tipoCultivo = await TipoCultivo.findAll();

    res.json({tipoCultivo});
}
module.exports = obtenerTipoCultivo;