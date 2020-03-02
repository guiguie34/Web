let express= require("express")
let app= express()
let path = require('path')
let bodyParser = require("body-parser")
let bd = require("./models/usersDB.js")
let tokenA = require("./controlers/authController")
let cookies = require("cookie-parser");
let football =require("./configV/football")
let actu = require("./models/actualiteDB")
let moment = require("moment")
let methodOverride = require('method-override');

//let fs = require("fs")

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
app.use(methodOverride('_method',{ methods: ['POST', 'GET'] }));

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
        const id2=await bd.getMail(id)
        console.log(id2)
        const rank=await bd.rankUtilisateur(id)
        const token = await tokenA.setToken(id2,rank,vari)
        response.cookie('token', token, { maxAge: 600* 1000 })
        response.redirect("/")
    }
    else {
        response.render("pages/login", {message: "Erreur ! Identifiants non valide",co})
    }
})

app.get("/profil", async (req,res) =>{

    const token = req.cookies.token
    let co= await tokenA.checkToken(token,vari)
    //console.log(token)
    if (!token) {
        return res.redirect("/")
    }
    else{
        if(co===false){
            res.redirect("/")
        }
        else{
            let pseudo1=co.id
            let pseudo= await bd.getPseudo(pseudo1)
            const token1 = await tokenA.refreshToken(token,vari)
            if(token1!==false){
                res.cookie('token', token1, { maxAge: 600* 1000 })
            }
            const user=await bd.searchUtilisateur3(co.id)
            res.render("pages/profil",{co,pseudo,user})
        }
    }
})

app.get("/profil/modif", async (req,res) =>{

    const token = req.cookies.token
    let co= await tokenA.checkToken(token,vari)

    //console.log(token)
    if (!token) {
        return res.redirect("/")
    }
    else{
        if(co===false){
            res.redirect("/")
        }
        else{
            const token1 = await tokenA.refreshToken(token,vari)
            if(token1!==false){
                res.cookie('token', token1, { maxAge: 600* 1000 })
            }
            res.render("pages/modif",{co})

        }
    }
})

app.post("/profil/modif", async (req,res) =>{

    const token = req.cookies.token
    let co= await tokenA.checkToken(token,vari)

    //console.log(token)
    if (!token) {
        return res.redirect("/")
    }
    else {
        if (co === false) {
            res.redirect("/")
        } else {
            const rep = await bd.updateUtilisateur(req.body.nom, req.body.prenom, req.body.pseudo, req.body.password, req.body.email, token, vari, res)
            if (rep === false) {
                res.redirect("/")
            }
            if (rep === undefined) { //l'email ne change pas donc pas nv token
                res.redirect("/profil")
            } else { //l'email à changé donc nv token
                res.cookie('token', rep, {maxAge: 600 * 1000})
                res.redirect("/profil")
            }
        }
    }
})

app.get("/profil/adminActu", async (req,res) =>{
    const token = req.cookies.token
    let co= await tokenA.checkToken(token,vari)

    //console.log(token)
    if (!token) {
        res.redirect("/")
    }
    else{
        if(co===false){
            res.redirect("/")
        }
        else{
            if(co.rank < 1){
                res.redirect("/")
            }
            else {
                const token1 = await tokenA.refreshToken(token, vari)
                if (token1 !== false) {
                    res.cookie('token', token1, {maxAge: 600 * 1000})
                }
                let actua= await actu.getActualite()
                res.render("pages/admin", {co,actua})
            }
        }
    }
})

app.get("/profil/adminActu/edit/:id", async(req,res) => {
    const token = req.cookies.token
    let co= await tokenA.checkToken(token,vari)

    //console.log(token)
    if (!token) {
        res.redirect("/")
    }
    else{
        if(co===false){
            res.redirect("/")
        }
        else{
            if(co.rank <1){
                res.redirect("/")
            }
            else {
                const token1 = await tokenA.refreshToken(token, vari)
                if (token1 !== false) {
                    res.cookie('token', token1, {maxAge: 600 * 1000})
                }
                let actua= await actu.getActualite2(req.params.id)
                res.render("pages/adminactuedit", {co,actua})
            }
        }
    }

})

app.post("/profil/adminActu/edit/:id", async(req,res) => {

    const token = req.cookies.token
    let co = await tokenA.checkToken(token, vari)
    if(!token){
        res.redirect("/")
    }
    if(co ===false){
        res.redirect("/")
    }
    if(co.rank<1){
        res.redirect("/")
    }
    else {
        //let idUser = await bd.searchUtilisateur3(co.id)
        let rep= await actu.editActualite(req.body.contenuactualite,req.body.titreactualite,req.params.id)
        if(rep===false){
            res.redirect("/profil/adminActu")
        }
        else{
            res.redirect("/profil")
        }
    }
})

app.delete("/profil/adminActu/delete/:id", async(req,res) => {

    const token = req.cookies.token
    let co = await tokenA.checkToken(token, vari)
    if(!token){
        res.redirect("/")
    }
    if(co ===false){
        res.redirect("/")
    }
    if(co.rank<1){
        res.redirect("/")
    }
    else {
        //let idUser = await bd.searchUtilisateur3(co.id)
        let rep= await actu.deleteActualite(req.params.id)
        if(rep===false){
            res.redirect("/profil/adminActu")
        }
        else{
            res.redirect("/profil")
        }
    }
})

app.get("/profil/adminActu/create", async (req,res)=>{
    const token = req.cookies.token
    let co= await tokenA.checkToken(token,vari)

    //console.log(token)
    if (!token) {
        res.redirect("/")
    }
    else{
        if(co===false){
            res.redirect("/")
        }
        else{
            if(co.rank < 2){
                res.redirect("/")
            }
            else {
                const token1 = await tokenA.refreshToken(token, vari)
                if (token1 !== false) {
                    res.cookie('token', token1, {maxAge: 600 * 1000})
                }
                res.render("pages/adminactucreate", {co})
            }
        }
    }
})

app.post("/profil/adminActu/create", async(req,res) => {

    const token = req.cookies.token
    let co = await tokenA.checkToken(token, vari)
    if(!token){
        res.redirect("/")
    }
    if(co ===false){
        res.redirect("/")
    }
    if(co.rank<1){
        res.redirect("/")
    }
    else {
        let idUser = await bd.searchUtilisateur3(co.id)
        let rep= await actu.addActualite(req.body.contenuactualite,req.body.titreactualite,idUser)
        if(rep===false){
            res.redirect("/profil/adminActu")
        }
        else{
            res.redirect("/profil")
        }
    }
})

app.get("/profil/adminUser", async (req,res)=>{
    const token = req.cookies.token
    let co= await tokenA.checkToken(token,vari)

    //console.log(token)
    if (!token) {
        res.redirect("/")
    }
    else{
        if(co===false){
            res.redirect("/")
        }
        else{
            if(co.rank < 2){
                res.redirect("/")
            }
            else {
                const token1 = await tokenA.refreshToken(token, vari)
                if (token1 !== false) {
                    res.cookie('token', token1, {maxAge: 600 * 1000})
                }
                let user= await bd.readUtilisateur()
                res.render("pages/adminUser", {co,user})
            }
        }
    }

})

app.get("/profil/adminUser/edit/:id", async(req,res) => {
    const token = req.cookies.token
    let co= await tokenA.checkToken(token,vari)

    //console.log(token)
    if (!token) {
        res.redirect("/")
    }
    else{
        if(co===false){
            res.redirect("/")
        }
        else{
            if(co.rank <2){
                res.redirect("/")
            }
            else {
                const token1 = await tokenA.refreshToken(token, vari)
                if (token1 !== false) {
                    res.cookie('token', token1, {maxAge: 600 * 1000})
                }
                let user= await bd.searchUtilisateur4(req.params.id)
                res.render("pages/adminUserEdit", {co,user})
            }
        }
    }

})
app.post("/profil/adminUser/edit/:id", async(req,res) => {

    const token = req.cookies.token
    let co = await tokenA.checkToken(token, vari)
    if(!token){
        res.redirect("/")
    }
    if(co ===false){
        res.redirect("/")
    }
    if(co.rank<2){
        res.redirect("/")
    }
    else {
        //let idUser = await bd.searchUtilisateur3(co.id)
        let rep= await bd.updateUtilisateur2(req.params.id,req.body.pseudoutilisateur,parseInt(req.body.rankutilisateur))
        if(rep===false){
            res.redirect("/profil/adminUser")
        }
        else{
            res.redirect("/profil")
        }
    }
})

app.delete("/profil/adminUser/delete/:id", async(req,res) => {

    const token = req.cookies.token
    let co = await tokenA.checkToken(token, vari)
    if(!token){
        res.redirect("/")
    }
    if(co ===false){
        res.redirect("/")
    }
    if(co.rank<2){
        res.redirect("/")
    }
    else {
        //let idUser = await bd.searchUtilisateur3(co.id)
        let rep= await bd.deleteUtilisateur2(req.params.id)
        if(rep===false){
            res.redirect("/profil/adminUser")
        }
        else{
            res.redirect("/profil")
        }
    }
})

app.delete("/profil/delete/:id", async(req,res) => {

    const token = req.cookies.token
    let co = await tokenA.checkToken(token, vari)
    if(!token){
        res.redirect("/")
    }
    if(co ===false){
        res.redirect("/")
    }
    else {
        let idUser = await bd.searchUtilisateur3(co.id) //retrouve l'id à partir du token
        let rep= await bd.deleteUtilisateur3(idUser,res) //detele l'user à partir de l'id et delete le token
        if(rep===false){
            res.redirect("/profil")
        }
        else{
            res.redirect("/")
        }
    }
})

app.get("/disconnect", async (req,res) =>{
    const token = req.cookies.token
    if (!token) {
        return res.redirect("/")
    }
    await tokenA.deleteToken(res)
    res.redirect("/")

})




app.get("/classement", async(req,res) =>{
    //let football =require("./configV/football")
    const token = req.cookies.token
    const co= await tokenA.checkToken(token,vari)
    let body= await football.getClassement()

    const token1 = await tokenA.refreshToken(token,vari)
    if(token1!==false){
        res.cookie('token', token1, { maxAge: 600* 1000 })
    }
    res.render("pages/classement",{co,body})

})

app.get("/actualites", async (req,res)=>{
    const token = req.cookies.token //on va chercher le token dans les cookies
    const co= await tokenA.checkToken(token,vari) //on recupère la validité du token
    const token1 = await tokenA.refreshToken(token,vari) //on rafraichi le token si necessaire
    if(token1!==false){
        res.cookie('token', token1, { maxAge: 600* 1000 }) //on met le  nouveau token dans les cookies
    }
    let actualite = await actu.getActualite()
    res.render("pages/actualite",{co,actualite}) //on affiche la page
})

app.get("/actualites/:id", async(req,res) =>{
    const token = req.cookies.token //on va chercher le token dans les cookies
    const co= await tokenA.checkToken(token,vari) //on recupère la validité du token
    const token1 = await tokenA.refreshToken(token,vari) //on rafraichi le token si necessaire
    if(token1!==false){
        res.cookie('token', token1, { maxAge: 600* 1000 }) //on met le  nouveau token dans les cookies
    }
    let actualite= await actu.getActualite1(req.params.id)
    if(actualite === false){
        res.redirect("/")
    }
    else{
        res.render("pages/actualiteVrai",{co,actualite,moment})
    }
})

app.listen(process.env.PORT || 8080)