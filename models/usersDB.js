let bd = require("../configV/database.js")
const bcrypt = require("bcryptjs")

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
                            await bcrypt.hash(e, salt, async  function(err, hash) {
                                if (err) {
                                    throw err
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
    catch (e) {
        return false
    }

}

async  function deleteUtilisateur(id){
    try{
        await bd.client.query("delete from utilisateur where mailutilisateur= $1;",[id])
        return true
    }
    catch (e) {
        return false

    }
}

async function graderUtilisateur(id,val){//on change les droits en indiquant le pseudo
    try{
        const lecture = await searchUtilisateur2(id)
        if(lecture[0]!==undefined) {
            if(val===0 || val ===1 || val ===2){
                await bd.client.query("update utilisateur set rankutilisateur= $1 where pseudoutilisateur=$2;",[val,id])
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

exports.readUtilisateur = readUtilisateur
exports.searchUtilisateur= searchUtilisateur
exports.searchUtilisateur2= searchUtilisateur2
exports.insertUtilisateur = insertUtilisateur
exports.deleteUtilisateur = deleteUtilisateur
exports.graderUtilisateur = graderUtilisateur
exports.rankUtilisateur = rankUtilisateur
exports.connexionUtilisateur = connexionUtilisateur
