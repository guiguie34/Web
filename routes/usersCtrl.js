let bcrypt = require("bcrypt")
let jwt = require("jsonwebtoken")
let bd = require("../config/database.js")
//let models = require("../models")
//routes
module.exports = {
    register: function (req,res) {
        var pseudo = req.body.pseudo
        var password = req.body.password
        var nom = req.body.nom
        var prenom = req.body.prenom
        var email = req.body.email

        if(pseudo == null || password ==null || nom ==null || prenom ==null || email==null){
            return res.status(400).json({"error":"missing"})
        }





    },
    login: function (req,res) {
        var mailoupseudo = req.body.mailoupseudo
        var password = req.body.password
    }
}