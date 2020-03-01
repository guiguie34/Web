let bd = require("../configV/database.js")

//bd.connect()

async function getActualite(){
    try{
        const rep= await bd.client.query("SELECT * FROM actualite;")
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

exports.getActualite = getActualite
exports.getActualite1 = getActualite1