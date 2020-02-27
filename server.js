let express= require("express")
let app= express()
let path = require('path')
let bodyParser = require("body-parser")
let bd = require("./models/usersDB.js")
let tokenA = require("./controlers/authController")
let cookies = require("cookie-parser");

//let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
//let bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config({
    path: './configV/variables.env'
})
const vari = process.env.variable
//db puis models puis contro puis route puis serv

app.set("view engine","ejs") //templates

//MiddleWare
app.use(express.static(path.join(__dirname, 'public'))); //permet de récup les fichiers statiques
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookies());

//routes

app.get("/register",(request,response) => { //lorsuq'on get le root, on obtient index
    response.render("pages/register",{erreur:"Veuillez saisir les informations suivantes: "})
})

app.post("/register",async (req,response) =>{
        //console.log(req.body)
        const rep = await bd.insertUtilisateur(req.body.nom, req.body.prenom, req.body.pseudo, req.body.email, req.body.password)
        if(rep===true){
            response.render("pages/home")
        }
        else{
            response.render("pages/register",{erreur:"Erreur ! Merci de renouveller votre opération"})
        }
})

app.get("/",(request,response) => { //lorsuq'on get le root, on obtient index
    response.render("pages/home")
})

app.get("/login",(request,response) => { //lorsuq'on get le root, on obtient index
    response.render("pages/login",{message:"Veuillez saisir vos identifiants: "})
})

app.post("/login", async (request,response) => { //lorsuq'on get le root, on obtient index
    const rep= await bd.connexionUtilisateur(request.body.mailoupseudo,request.body.password)
    if(rep===true){
        const id=request.body.mailoupseudo
        const rank=await bd.rankUtilisateur(id)
        const token = await tokenA.setToken(id,rank,vari)
        response.cookie('token', token, { maxAge: 300* 1000 })
        response.render("pages/home")
    }
    else {
        response.render("pages/login", {message: "Erreur ! Identifiants non valide"})
    }
})

app.get("/profil", async (req,res) =>{
    const token = req.cookies.token
    //console.log(token)
    if (!token) {
        return res.redirect("/")
    }
    else{
        let payload= await tokenA.checkToken(token,vari)
        if(payload===false){
            res.redirect("/")
        }
        else{
            const token1 = await tokenA.refreshToken(token,vari)
            if(token1!==false){
                res.cookie('token', token1, { maxAge: 300* 1000 })
            }
            res.render("pages/profil")
        }
    }
})

app.listen(process.env.PORT || 8080)