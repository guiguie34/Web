let express= require("express")
let app= express()
let path = require('path')
let bodyParser = require("body-parser")
let bd = require("./config/database.js")
let apiRouter = require("./apiRouter").router


app.set("view engine","ejs") //templates

//MiddleWare
app.use(express.static(path.join(__dirname, 'public'))); //permet de récup les fichiers statiques
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/api/", apiRouter)

//routes
app.get("/",(request,response) => { //lorsuq'on get le root, on obtient index
    response.render("pages/index",{erreur:""})
    //bd.start()
})

app.post("/",async (req,response) =>{
        await bd.connect()
        console.log(req.body)
        const rep = await bd.insertUtilisateur(req.body.nom, req.body.prenom, req.body.pseudo, req.body.email, req.body.password)
        if(rep===true){
            response.render("pages/validation")
        }
        else{
            response.render("pages/index",{erreur:"Mauvaise opération"})
        }
})

app.get("/validation",(request,response) => { //lorsuq'on get le root, on obtient index
    response.render("pages/validation")
    //bd.start()
})

app.listen(8080)