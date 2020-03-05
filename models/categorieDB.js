let bd = require("../configV/database.js")

async function getCategorie(){
    try{
        const rep = await bd.client.query("SELECT * from categorie;")
        return rep.rows
    }
    catch (e) {
        throw e
    }
}

async function getCategorie2(id){
    try{
        if(id !== undefined && id!== "") {
            const rep = await bd.client.query("SELECT * from categorie where idcategorie =$1;", [id])
            return rep.rows
        }
    }
    catch (e) {
        throw e
    }
}
async function getCategorie3(id){
    try{
        if(id !== undefined && id!== "") {
            const rep = await bd.client.query("SELECT * from categorie where libellecategorie =$1;", [id])
            return rep.rows
        }
    }
    catch (e) {
        throw e
    }
}
exports.getCategorie = getCategorie
exports.getCategorie2 = getCategorie2
exports.getCategorie3 = getCategorie3