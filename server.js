let express= require("express")
let app= express()
let path = require('path')
let bodyParser = require("body-parser")
let bd = require("./models/usersDB.js")
let tokenA = require("./controlers/authController")
let cookies = require("cookie-parser");
let football =require("./configV/football")
let football1 =require("./configV/football1")
let football2 =require("./configV/football2")
let actu = require("./models/actualiteDB")
let commentaire = require("./models/commentaireDB")
let categ = require("./models/categorieDB")
let appartenir = require("./models/appartenirDB")
let moment = require("moment")
let methodOverride = require('method-override');
let nl2br  = require('nl2br');


const dotenv = require('dotenv').config({
    path: './configV/log.env'
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
    response.render("pages/register",{co})
})

app.post("/register",async (req,response) =>{
    const barre = req.cookies.token
    const co= await tokenA.checkToken(barre,vari)
    const rep = await bd.insertUtilisateur(req.body.nom, req.body.prenom, req.body.pseudo, req.body.email, req.body.password)
    response.render("pages/register",{co,rep})
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
        response.cookie('token', token, { maxAge: 600* 1000, httpOnly: true})
        response.redirect("/")
    }
    else {
        response.render("pages/login", {rep,co})
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
                res.cookie('token', token1, { maxAge: 600* 1000, httpOnly: true })
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
                res.cookie('token', token1, { maxAge: 600* 1000, httpOnly: true })
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
                res.cookie('token', rep, {maxAge: 600* 1000, httpOnly: true})
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
                    res.cookie('token', token1, {maxAge: 600* 1000, httpOnly: true})
                }
                let actua= await actu.getActualiteDesc()
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
                    res.cookie('token', token1, {maxAge: 600* 1000, httpOnly: true})
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
                const catego = await categ.getCategorie()
                if (token1 !== false) {
                    res.cookie('token', token1, {maxAge: 600* 1000, httpOnly: true})
                }
                res.render("pages/adminactucreate", {co,catego})
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
        let rep= await actu.addActualite(req.body.contenuactualite,req.body.titreactualite,idUser) //on ajoute l'actu et on récup son id

        if(rep===false){
            res.redirect("/profil/adminActu")
        }
        else{
            for(let i in req.body.libellecategorie){ //pour toutes les catégories
                if(req.body.libellecategorie[i] && (typeof req.body.libellecategorie === "string")){ //si elles sont cochées
                    console.log(req.body.libellecategorie)
                    let rep1=await categ.getCategorie3(req.body.libellecategorie) //on récup la catégorie qui correspon au libellé
                    let rep2=rep1[0].idcategorie //puis l'id
                    await appartenir.setAppartenir(rep.idactualite,rep2)
                    break
                } //un coché un mot, deux coché un tab
                if(req.body.libellecategorie[i] && (typeof req.body.libellecategorie === "object")){ //si elles sont cochées
                    let rep1=await categ.getCategorie3(req.body.libellecategorie[i]) //on récup la catégorie qui correspon au libellé
                    let rep2=rep1[0].idcategorie //puis l'id
                    await appartenir.setAppartenir(rep.idactualite,rep2)
                } //un coché un mot, deux coché un tab


            }
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
                    res.cookie('token', token1, {maxAge: 600* 1000, httpOnly: true})
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
                    res.cookie('token', token1, {maxAge: 600* 1000, httpOnly: true})
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
        res.cookie('token', token1, { maxAge: 600* 1000, httpOnly: true })
    }
    res.render("pages/classement",{co,body})

})

app.get("/actualites", async (req,res)=>{
    const token = req.cookies.token //on va chercher le token dans les cookies
    const co= await tokenA.checkToken(token,vari) //on recupère la validité du token
    const token1 = await tokenA.refreshToken(token,vari) //on rafraichi le token si necessaire
    if(token1!==false){
        res.cookie('token', token1, { maxAge: 600* 1000, httpOnly: true}) //on met le  nouveau token dans les cookies
    }
    let actualite = await actu.getActualiteDesc()
    let appart= await appartenir.getAppartenir3()
    let nbActu= await actu.nbActualite()
    nbActu=nbActu.count
    var tab = new Array(parseInt(nbActu));
    for (let i = 0; i < tab.length; i++) {
        let nb=await appartenir.nbAppartenir(actualite[i].idactualite)
        tab[i] = new Array(nb);
    }

    for (let i = 0; i < tab.length; i++) {
        for(let j=0;j<tab[i].length;j++){
            tab[i][j]=await actu.libelleActualite(actualite[i].idactualite)
        }
    }

    res.render("pages/actualite",{co,actualite,appart,tab,moment}) //on affiche la page
})

app.get("/actualites/:id", async(req,res) =>{
    const token = req.cookies.token //on va chercher le token dans les cookies
    const co= await tokenA.checkToken(token,vari) //on recupère la validité du token
    const token1 = await tokenA.refreshToken(token,vari) //on rafraichi le token si necessaire
    const idActu = await actu.getActualite1(req.params.id)
    const idActu1=idActu.idactualite
    const com = await commentaire.getCommentaire(idActu1)
    if(token1!==false){
        res.cookie('token', token1, { maxAge: 600* 1000, httpOnly: true }) //on met le  nouveau token dans les cookies
    }
    let actualite= await actu.getActualite1(req.params.id)
    if(actualite === false){
        res.redirect("/")
    }
    else{
        //const pseudo = await bd.getPseudo()
        let auteur = []
        for(let i in com){ //on recupere les idutilisateur de ceux ayant posté un commentaire sur l'actualite donnée
            auteur.unshift(com[i].idutilisateur) //on ajoute ces id
        }
        let auteur1 = []
        for(let i in auteur){
            auteur1.unshift(await bd.getPseudo2(auteur[i])) //on obtient les pseudo à partir des id
        }
        res.render("pages/actualiteVrai",{co,actualite,moment,com,nl2br,auteur1}) //barre,actualité,date,commentaire,format commentaire,auteur des commentaires
    }
})

app.post("/actualites/:id", async(req,res) =>{
    const token = req.cookies.token
    let co = await tokenA.checkToken(token, vari)
    if(!token){
        res.redirect("/")
    }
    if(co ===false){
        res.redirect("/")
    }
    else {
        let idUser = await bd.searchUtilisateur3(co.id)
        let idActu = await actu.getActualite1(req.params.id)
        let idActu1=idActu.idactualite
        await commentaire.addCommentaire(idUser,idActu1,req.body.contenucommentaire)
        res.redirect("/actualites/"+req.params.id)
    }
})

app.get("/stats", async (req,res) =>{
    const token = req.cookies.token //on va chercher le token dans les cookies
    const co= await tokenA.checkToken(token,vari) //on recupère la validité du token
    const token1 = await tokenA.refreshToken(token,vari) //on rafraichi le token si necessaire
    if(token1!==false){
        res.cookie('token', token1, { maxAge: 600* 1000, httpOnly: true }) //on met le  nouveau token dans les cookies
    }
    else{
        let stats2 = await football1.getStatsEquipe()
        let stats= JSON.parse(stats2)
        res.render("pages/stats",{co,stats})
    }
})

app.get("/joueurs", async (req,res) => {
    const token = req.cookies.token //on va chercher le token dans les cookies
    const co= await tokenA.checkToken(token,vari) //on recupère la validité du token
    const token1 = await tokenA.refreshToken(token,vari) //on rafraichi le token si necessaire
    if(token1!==false){
        res.cookie('token', token1, { maxAge: 600* 1000, httpOnly: true }) //on met le  nouveau token dans les cookies
    }
    else{
        let player2 = await football2.allPlayers()
        let player= JSON.parse(player2)
        res.render("pages/joueurs",{co,player})
    }
})
app.use(function(req, res){
    res.status(404).redirect("/");
});
app.listen(process.env.PORT || 8080)