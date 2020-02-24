let bcrypt = require("bcrypt")
let jwt = require("jsonwebtoken")
let bd = require("../database.js")
//routes
module.exports = {
    register: function (req,res) {
        var username = req.body.username
        var password = req.body.password
        var nom = req.body.nom
        var prenom = req.body.prenom
        var DN = req.body.DN
        var mail = req.body.mail

        if(username == null || password ==null || nom ==null || prenom ==null || DN==null || mail==null){
            return res.status(400).json({"error":"missing"})
        }



    },
    login: function (req,res) {
        var username = req.body.username
        var password = req.body.password
    }
}