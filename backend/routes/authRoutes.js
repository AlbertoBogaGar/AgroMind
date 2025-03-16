const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/UsuarioController");
const Usuario = require("../models/Usuario");
const Parcela = require("../models/Parcela");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", register);
router.post("/login", async(req,res)=>{
    try{
        const{email,password} = req.body;
        const usuario = await Usuario.findOne({where: {email}});

        if(!usuario || !(await bcrypt.compare(password, usuario.password))){
            return res.status(401).json({message: "Credenciales incorrectas"});
        }

        const parcela = await Parcela.findOne({where: {idUsuario: usuario.id}});

        const token = jwt.sign({id:usuario.id}, process.env.JWT_SECRET,{expiresIn: "24h"});


        res.json({
            token,
            usuario:{id: usuario.id, nombre:usuario.nombre, email: usuario.email},
            tieneParcela: !!parcela
        });

    }catch(error){
        console.log("Error en login", error);
        res.status(500).json({message: "Error en el servidor"});

    
}});

module.exports = router;
