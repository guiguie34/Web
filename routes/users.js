let express= require("express")
let router = express.Router();



/*let app= express()
let path = require('path')
let bodyParser = require("body-parser")
let bd = require("../models/usersDB.js")

app.use(express.static(path.join(__dirname, 'public'))); //permet de récup les fichiers statiques
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set("view engine","ejs") //templates

router.use(function timeLog(req, res, next) {
    next();
});

router.get('/login', function(req, response) {
    response.render("pages/login",{message:"Veuillez saisir vos identifiants: "})
});

router.post('/login', async function(request,response){

    const rep= await bd.connexionUtilisateur(request.body.mailoupseudo,request.body.password)
    if(rep===true){
        response.render("pages/home")
    }
    else{
        response.render("pages/login",{message:"Erreur ! Identifiants non valide"})
    }
});
// define the about route
router.get('/register', function(req, response) {
    response.render("pages/register",{erreur:"Veuillez saisir les informations suivantes: "})
});

router.post('/register', async function(req, response) {
    const rep = await bd.insertUtilisateur(req.body.nom, req.body.prenom, req.body.pseudo, req.body.email, req.body.password)
    if(rep===true){
        response.render("pages/home")
    }
    else{
        response.render("pages/register",{erreur:"Erreur ! Merci de renouveller votre opération"})
    }
});*/