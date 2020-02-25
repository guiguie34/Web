const { Client } = require('pg')
const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'azerty34',
    database: 'Web2'
})

async function connect(){
    try{
        await client.connect()
    }
    catch (e) {
        console.error(`erreur ${e}`)

    }
}

async  function readUtilisateur(){

    try{
        const results = await client.query("select * from utilisateur;")
        return results.rows;
    }
    catch (e) {
        return []
    }

}

async  function searchUtilisateur(id){

    try{
        const results = await client.query("select * from utilisateur where mailutilisateur = $1;",[id])
        return results.rows;
    }
    catch (e) {
        return []
    }

}

async  function searchUtilisateur2(id){

    try{
        const results = await client.query("select * from utilisateur where pseudoutilisateur = $1;",[id])
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
                    await client.query("INSERT INTO utilisateur (nomutilisateur,prenomutilisateur,dateinscriptionutilisateur,pseudoutilisateur,mailutilisateur,mdputilisateur) VALUES($1,$2,DATE(NOW()),$3,$4,$5);", [a, b, c, d, e])
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
            await client.query("delete from utilisateur where mailutilisateur= $1;",[id])
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
                await client.query("update utilisateur set rankutilisateur= $1 where pseudoutilisateur=$2;",[val,id])
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
async  function connexionUtilisateur(id,mdp){

    try{
        const results = await client.query("select * from utilisateur where mailutilisateur = $1 AND mdputilisateur= $2;",[id,mdp])
        const results1 = await client.query("select * from utilisateur where pseudoutilisateur = $1 AND mdputilisateur= $2;",[id,mdp])
        console.log(results.rows)
        console.log(results1.rows)
        if(results.rows[0] !== undefined || results1.rows[0] !== undefined){
            return true
        }
        else{
            return false
        }
    }
    catch (e) {
        return []
    }

}

exports.connect = connect

exports.readUtilisateur = readUtilisateur
exports.searchUtilisateur= searchUtilisateur
exports.searchUtilisateur2= searchUtilisateur2
exports.insertUtilisateur = insertUtilisateur
exports.deleteUtilisateur = deleteUtilisateur
exports.graderUtilisateur = graderUtilisateur
exports.connexionUtilisateur = connexionUtilisateur