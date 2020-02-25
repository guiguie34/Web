let express= require("express")
let app= express()
let path = require('path')
let bodyParser = require("body-parser")
let bd = require("./models/usersDB.js")
let apiRouter = require("./apiRouter").router
//db puis models puis contro puis route puis serv

app.set("view engine","ejs") //templates

//MiddleWare
app.use(express.static(path.join(__dirname, 'public'))); //permet de récup les fichiers statiques
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/api/", apiRouter)

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
    //bd.start()
})

app.get("/login",(request,response) => { //lorsuq'on get le root, on obtient index
    response.render("pages/login",{message:"Veuillez saisir vos identifiants: "})
    //bd.start()
})

app.post("/login", async (request,response) => { //lorsuq'on get le root, on obtient index
    const rep= await bd.connexionUtilisateur(request.body.mailoupseudo,request.body.password)
    if(rep===true){
        response.render("pages/home")
    }
    else{
        response.render("pages/login",{message:"Erreur ! Identifiants non valide"})
    }
    //bd.start()
})

app.listen(8080)