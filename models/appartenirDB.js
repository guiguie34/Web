let bd = require("../configV/database.js")

async function getAppartenir(id){

    try{
        if(id !==undefined && id !==""){
            const rep= await bd.client.query("SELECT * from appartenir where idactualite=$1;",[id])
            return rep.rows
        }
    }
    catch (e) {
        throw e
    }
}

async function getAppartenir2(id){

    try{
        if(id !==undefined && id !==""){
            const rep= await bd.client.query("SELECT * from appartenir where idcategorie=$1;",[id])
            return rep.rows
        }
    }
    catch (e) {
        throw e
    }
}

async function setAppartenir(id,categ){

    try{
        if(id !==undefined && id !=="" && categ !==undefined && categ !=="" ){
            await bd.client.query("INSERT INTO appartenir(idcategorie,idactualite) VALUES($1,$2);",[categ,id])
        }
    }
    catch (e) {
        throw e
    }
}

async function deleteAppartenir(id){

    try{
        if(id !==undefined && id !=="" ){
            await bd.client.query("DELETE FROM appartenir WHERE idactualite=$1;",[id])
        }
    }
    catch (e) {
        throw e
    }
}

exports.getAppartenir = getAppartenir
exports.getAppartenir2 = getAppartenir2
exports.setAppartenir = setAppartenir
exports.deleteAppartenir = deleteAppartenir