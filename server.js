let express= require("express")
let app= express()
let path = require('path')
let bodyParser = require("body-parser")
let bd = require("./database.js")
let apiRouter = require("./apiRouter").router


app.set("view engine","ejs") //templates

//MiddleWare
app.use(express.static(path.join(__dirname, 'public'))); //permet de récup les fichiers statiques
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/api/", apiRouter)

//routes
app.get("/",(request,response) => { //lorsuq'on get le root, on obtient index
    response.render("pages/index")
    //bd.start()
})

app.post("/",(req,response) =>{
    /*if(req.body.message === undefined || req.body.message === "") {
        response.sendStatus(503)
    }*/
    /*else{*/
        console.log(req.body)
        const rep= bd.insertTable(req.body.nom,req.body.prenom,req.body.DI,req.body.pseudo,req.body.mail,req.body.mdp)
        response.render("pages/header")
   // }
})

app.listen(8080)