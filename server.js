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

app.get("/register",async (request,response) => { //lorsuq'on get le root, on obtient index
    const barre = request.cookies.token
    const co= await tokenA.checkToken(barre,vari)
    response.render("pages/register",{erreur:"Veuillez saisir les informations suivantes: ",co})
})

app.post("/register",async (req,response) =>{
    const barre = req.cookies.token
    const co= await tokenA.checkToken(barre,vari)
    const rep = await bd.insertUtilisateur(req.body.nom, req.body.prenom, req.body.pseudo, req.body.email, req.body.password)
    if(rep===true){
        response.redirect("/")
    }
    else{
        response.render("pages/register",{erreur:"Erreur ! Merci de renouveller votre opération",co})
    }
})

app.get("/", async (request,response) => { //lorsuq'on get le root, on obtient index
    const barre = request.cookies.token
    const co= await tokenA.checkToken(barre,vari)
    response.render("pages/home",{co})
})

app.get("/login", async (request,response) => { //lorsuq'on get le root, on obtient index
    const barre = request.cookies.token
    const co= await tokenA.checkToken(barre,vari)
    response.render("pages/login",{message:"Veuillez saisir vos identifiants: ",co})
})

app.post("/login", async (request,response) => { //lorsuq'on get le root, on obtient index
    const barre = request.cookies.token
    const co= await tokenA.checkToken(barre,vari)
    const rep= await bd.connexionUtilisateur(request.body.mailoupseudo,request.body.password)
    if(rep===true){
        const id=request.body.mailoupseudo
        const rank=await bd.rankUtilisateur(id)
        const token = await tokenA.setToken(id,rank,vari)
        response.cookie('token', token, { maxAge: 300* 1000 })
        response.redirect("/")
    }
    else {
        response.render("pages/login", {message: "Erreur ! Identifiants non valide",co})
    }
})

app.get("/profil", async (req,res) =>{
    const barre = req.cookies.token
    const co= await tokenA.checkToken(barre,vari)
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
            res.render("pages/profil",{co})
        }
    }
})

app.listen(process.env.PORT || 8080)