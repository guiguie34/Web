let express= require("express")
let app= express()
let path = require('path')
let bodyParser = require("body-parser")
let bd = require("./models/usersDB.js")
//let VerifyToken = require('./controlers/token');

let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
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

//routes

app.get("/register",(request,response) => { //lorsuq'on get le root, on obtient index
    response.render("pages/register",{erreur:"Veuillez saisir les informations suivantes: "})
    //bd.start()
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
        const t=request.body.mailoupseudo
        const d=await bd.rankUtilisateur(t)
        const token = jwt.sign({ t,d }, vari, {
            algorithm: 'HS256',
            expiresIn: 300 //5mins
        })
        console.log('token:', token)

        // set the cookie as the token string, with a similar max age as the token
        // here, the max age is in milliseconds, so we multiply by 1000
        response.cookie('token', token, { maxAge: 300* 1000 })
        response.render("pages/home")
    }
    else {
        response.render("pages/login", {message: "Erreur ! Identifiants non valide"})
    }
})

app.listen(process.env.PORT || 8080)