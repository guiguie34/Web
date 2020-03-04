let bd = require("../configV/database.js")
let com = require("./commentaireDB")
let appartenir = require("./appartenirDB")
//bd.connect()

async function editActualite(contenu,titre,id) {
    try {
        if(contenu===undefined || contenu==="" || titre===undefined || titre==="" || id===undefined || id===""){
            return false
        }
        else {
            let titre2 = titre.replace(" ", "")
            const rep = await bd.client.query("UPDATE actualite SET contenuactualite=$1,titreactualite=$2,titreurlactualite=$3 WHERE idactualite=$4;",[contenu,titre,titre2,id])
        }
    }
    catch (e) {
        return false
    }
}

async function addActualite(contenu,titre,id) {
    try {
        if(contenu===undefined || contenu==="" || titre===undefined || titre==="" || id===undefined || id===""){
            return false
        }
        else {
            let titre2 = titre.replace(" ", "")
            const rep = await bd.client.query("INSERT INTO actualite(dateactualite,idutilisateur,contenuactualite,titreactualite,titreurlactualite) VALUES(NOW(),$1,$2,$3,$4);",[id,contenu,titre,titre2])
            const rep1= await bd.client.query("SELECT idactualite FROM actualite ORDER BY idactualite DESC LIMIT 1")
            return rep1.rows[0]
        }
    }
    catch (e) {
        return false
    }
}

async function getActualite(){
    try{
        const rep= await bd.client.query("SELECT * FROM actualite;")
        return rep.rows

    }
    catch (e) {
        throw e
    }
}
async function getActualiteDesc(){
    try{
        const rep= await bd.client.query("SELECT * FROM actualite ORDER BY idactualite DESC;")
        return rep.rows

    }
    catch (e) {
        throw e
    }
}


async function getActualite1(id){
    try{
        const rep = await bd.client.query("SELECT * FROM actualite WHERE titreurlactualite=$1",[id])
        if(rep.rows[0]===undefined){
            return false
        }
        else{
            return rep.rows[0]
        }
    }
    catch (e) {
        return false
    }
}

async function getActualite2(id){
    try{
        const rep = await bd.client.query("SELECT * FROM actualite WHERE idactualite=$1",[id])
        if(rep.rows[0]===undefined){
            return false
        }
        else{
            return rep.rows[0]
        }
    }
    catch (e) {
        return false
    }
}

async function deleteActualite(id){
    try {
        if(id===undefined || id===""){
            return false
        }
        else {
            await com.deleteCommentaire(id)
            await appartenir.deleteAppartenir(id)

            const rep = await bd.client.query("DELETE FROM actualite where idactualite=$1;",[id])
        }
    }
    catch (e) {
        return false
    }
}

async function libelleActualite(id){
    try{
        const rep = await bd.client.query("select libellecategorie from categorie INNER JOIN appartenir on appartenir.idcategorie=categorie.idcategorie INNER JOIN actualite on appartenir.idactualite=actualite.idactualite where actualite.idactualite=$1;",[id])
        return rep.rows
    }
    catch (e) {
        throw e
    }
}
async function nbActualite(){
    try{
        const rep = await bd.client.query("select count(*) from actualite;")
        return rep.rows[0]
    }
    catch (e) {
        throw e
    }
}
//supprimer

exports.getActualite = getActualite
exports.getActualiteDesc = getActualiteDesc
exports.getActualite1 = getActualite1
exports.getActualite2 = getActualite2
exports.editActualite = editActualite
exports.addActualite = addActualite
exports.deleteActualite = deleteActualite
exports.libelleActualite = libelleActualite
exports.nbActualite = nbActualite