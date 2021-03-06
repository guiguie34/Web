let bd = require("../configV/database.js")
const bcrypt = require("bcryptjs")
let tok = require("../controlers/authController")
let com=require("./commentaireDB")
bd.connect()

async  function readUtilisateur(){

    try{
        const results = await bd.client.query("select * from utilisateur;")
        return results.rows;
    }
    catch (e) {
        return []
    }

}

async  function searchUtilisateur(id){

    try{
        const results = await bd.client.query("select * from utilisateur where mailutilisateur = $1;",[id])
        return results.rows;
    }
    catch (e) {
        return []
    }

}

async  function searchUtilisateur2(id){

    try{
        const results = await bd.client.query("select * from utilisateur where pseudoutilisateur = $1;",[id])
        return results.rows;
    }
    catch (e) {
        return []
    }

}


async  function searchUtilisateur3(id){

    try{
        const results = await bd.client.query("select idutilisateur from utilisateur where mailutilisateur = $1;",[id])
        if(results.rows !==undefined) {
            return results.rows[0].idutilisateur;
        }
        else{
            return false
        }
    }
    catch (e) {
        return []
    }

}

async  function searchUtilisateur4(id){

    try{
        const results = await bd.client.query("select * from utilisateur where idutilisateur = $1;",[id])
        return results.rows;
    }
    catch (e) {
        return []
    }

}

async function insertUtilisateur(a,b,c,d,e) {
    try{
        if(a===null || a==="" || b==null || b==="" || c==null || c==="" || d===null || d==="" || e===null || e==="" ){
            return false
        }
        else {
            const lecture = await searchUtilisateur(d)
            const lecture1 = await searchUtilisateur2(c)
            if(lecture[0]===undefined) {
                if(lecture1[0]===undefined) {
                    const saltRounds = 10

                    await bcrypt.genSalt(saltRounds, async function (err, salt) {
                        if (err) {
                            throw err
                        } else {
                            await bcrypt.hash(e, salt, async  function(er, hash) {
                                if (er) {
                                    throw er
                                } else {
                                    await bd.client.query("INSERT INTO utilisateur (nomutilisateur,prenomutilisateur,dateinscriptionutilisateur,pseudoutilisateur,mailutilisateur,mdputilisateur) VALUES($1,$2,DATE(NOW()),$3,$4,$5);", [a, b, c, d, hash])
                                }
                            })
                        }
                    })
                    return true
                }
                else{
                    return false
                }
            }
            else {
                return false
            }
        }
    }
    catch (erre) {
        return false
    }

}

async  function deleteUtilisateur(id,res){ //version user
    try{
        await bd.client.query("delete from utilisateur where mailutilisateur= $1;",[id])
        await tok.deleteToken(res)
        return true
    }
    catch (e) {
        return false

    }
}

async  function deleteUtilisateur2(id){ //version admin
    try{
        await com.deleteCommentaire2(id)
        await bd.client.query("delete from utilisateur where idutilisateur= $1;",[id])
        return true
    }
    catch (e) {
        return false

    }
}

async  function deleteUtilisateur3(id,res){ //version user profil
    try{
        await com.deleteCommentaire2(id)
        await bd.client.query("delete from utilisateur where idutilisateur= $1;",[id])
        await tok.deleteToken(res)
        return true
    }
    catch (e) {
        return false

    }
}

async function graderUtilisateur(id,val){//on change les droits en indiquant le pseudo
    try{
        const lecture = await searchUtilisateur4(id)
        if(lecture[0]!==undefined) {
            if(val===0 || val ===1 || val ===2){
                await bd.client.query("update utilisateur set rankutilisateur= $1 where idutilisateur=$2;",[val,id])
                return  true
            }
            else{
                return false
            }
        }
        else{
            return false
        }
    }
    catch (e) {
        return false

    }
}

async function rankUtilisateur(id){
    try{
        const results = await bd.client.query("select rankutilisateur from utilisateur where pseudoutilisateur= $1;",[id])
        const results1 = await bd.client.query("select rankutilisateur from utilisateur where mailutilisateur= $1;",[id])
        if(results.rows[0] !== undefined ){ //par pseudo
            return results.rows[0].rankutilisateur
        }
        else if(results1.rows[0] !==undefined){ //par mail
            return results1.rows[0].rankutilisateur
        }
    }
    catch (e) {
        return []
    }
}
async  function connexionUtilisateur(id,mdp){
    try{
        //const results = await bd.client.query("select * from utilisateur where mailutilisateur = $1 AND mdputilisateur= $2;",[id,mdp])
        //const results1 = await bd.client.query("select * from utilisateur where pseudoutilisateur = $1 AND mdputilisateur= $2;",[id,mdp])
        const results = await bd.client.query("select mdputilisateur from utilisateur where pseudoutilisateur= $1;",[id])
        const results1 = await bd.client.query("select mdputilisateur from utilisateur where mailutilisateur= $1;",[id])
        if(results.rows[0] !== undefined ){ //par pseudo
            return await bcrypt.compare(mdp, results.rows[0].mdputilisateur)
        }
        else if(results1.rows[0] !==undefined){ //par mail
            return await bcrypt.compare(mdp, results1.rows[0].mdputilisateur)
        }
        else{
            return false
        }
    }
    catch (e) {
        return []
    }

}

async function getMail(id){
    let rep = await bd.client.query("select mailutilisateur from utilisateur where pseudoutilisateur=$1;",[id])
    if(rep.rows[0] ===undefined){
        return await id
    }
    else{
        return await  rep.rows[0].mailutilisateur
    }
}
async function upDateUtilisateur(a,b,c,d,e,token,key,res){

    // nom prenom pseudo mail mdp
    //delete tok puis recreer
    try {
        let payload = await tok.checkToken(token, key)
        if (payload !== false) {

            if (a !== undefined && a !== "") {
                await bd.client.query("update utilisateur set nomutilisateur=$1 where mailutilisateur=$2;", [a, payload.id])

            }
            if (b !== undefined && b !== "") {
                await bd.client.query("update utilisateur set prenomutilisateur=$1 where mailutilisateur=$2;", [b, payload.id])
            }
            if (c !== undefined && c !== "") {
                await bd.client.query("update utilisateur set pseudoutilisateur=$1 where mailutilisateur=$2;", [c, payload.id])
            }
            if (d !== undefined && d !== "") {
                const saltRounds = 10

                await bcrypt.genSalt(saltRounds, async function (err, salt) {
                    if (err) {
                        throw err
                    } else {
                        await bcrypt.hash(d, salt, async function (er, hash) {
                            if (er) {
                                throw er
                            } else {
                                await bd.client.query(" update utilisateur set mdputilisateur=$1 where mailutilisateur=$2;",[hash,payload.id])
                            }
                        })
                    }
                })
            }
            if (e !== undefined && e !== "") {
                await bd.client.query("update utilisateur set mailutilisateur=$1 where mailutilisateur=$2;", [e, payload.id])
                const del = await tok.deleteToken(res)
                if (del !== false) {
                    let token2 = await tok.setToken(e, payload.rank, key)
                    if(token2!==false){
                        return token2
                    }
                }
            }

        }
    }
    catch (erre) {
        return false
    }
}

async function getPseudo(id) {
    try {
        let rep = await bd.client.query("select pseudoutilisateur from utilisateur where mailutilisateur=$1;", [id])
        return rep.rows[0].pseudoutilisateur
    }
    catch (e) {
        throw e
    }
}
async function getPseudo2(id) {
    try {
        let rep = await bd.client.query("select pseudoutilisateur from utilisateur where idutilisateur=$1;", [id])
        return rep.rows[0].pseudoutilisateur
    }
    catch (e) {
        throw e
    }
}
async function updateUtilisateur2(id,pseudo,rank){
    try{
        if(id===undefined || id==="" || pseudo===undefined ||pseudo===""){
            return false
        }
        else{
            await bd.client.query("UPDATE utilisateur set pseudoutilisateur=$1 where idutilisateur=$2",[pseudo,id])
            if(rank===2 || rank===1 || rank ===0){
                await graderUtilisateur(id,rank)
            }
            else{
                return false
            }
        }
    }
    catch (e) {
        return false
    }
}

exports.readUtilisateur = readUtilisateur
exports.searchUtilisateur= searchUtilisateur
exports.searchUtilisateur2= searchUtilisateur2
exports.searchUtilisateur3= searchUtilisateur3
exports.searchUtilisateur4= searchUtilisateur4
exports.insertUtilisateur = insertUtilisateur
exports.deleteUtilisateur = deleteUtilisateur
exports.deleteUtilisateur2 = deleteUtilisateur2
exports.deleteUtilisateur3 = deleteUtilisateur3
exports.graderUtilisateur = graderUtilisateur
exports.rankUtilisateur = rankUtilisateur
exports.connexionUtilisateur = connexionUtilisateur
exports.updateUtilisateur = upDateUtilisateur
exports.updateUtilisateur2 = updateUtilisateur2
exports.getMail= getMail
exports.getPseudo = getPseudo
exports.getPseudo2 = getPseudo2