let bd = require("../configV/database.js")

async function getCommentaire(id){
    try{
        const rep = await bd.client.query("SELECT * FROM commentaire where idactualite=$1",[id])
        return rep.rows
    }
    catch (e) {
        return e
    }
}

async function getCommentaire2(id){
    try{
        const rep = await bd.client.query("SELECT * FROM commentaire where idutilisateur=$1",[id])
        return rep.rows
    }
    catch (e) {
        throw e
    }
}

async function addCommentaire(idU,idA,contenu){
    try{
        if(contenu !== undefined && contenu !== "" && idU !== undefined && idU !== "" && idA !== undefined && idA !== "" ) {
            await bd.client.query("INSERT INTO commentaire(idactualite,idutilisateur,contenucommentaire,datecommentaire) VALUES($1,$2,$3,NOW());", [idA, idU, contenu])
        }
    }
    catch (e) {
        throw e
    }
}

exports.getCommentaire = getCommentaire
exports.getCommentaire2 = getCommentaire2
exports.addCommentaire = addCommentaire