const { Client } = require('pg')
const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'azerty34',
    database: 'Web2'
})


async function start() {
    await connect()
    const lecture = await readTable()
    console.log(lecture)

}
async function connect(){
    try{
        await client.connect()
    }
    catch (e) {
        console.error(`erreur ${e}`)

    }
}
async  function readTable(){

    try{
        const results = await client.query("select * from utilisateur;")
        return results.rows;
    }
    catch (e) {
        return []
    }

}

async  function searchTable(id){

    try{
        const results = await client.query("select * from utilisateur where mailutilisateur = $1;",[id])
        return results.rows;
    }
    catch (e) {
        return []
    }

}

async  function searchTable2(id){

    try{
        const results = await client.query("select * from utilisateur where pseudoutilisateur = $1;",[id])
        return results.rows;
    }
    catch (e) {
        return []
    }

}

async function insertTable(a,b,c,d,e) {
    try{
        if(a===null || a==="" || b==null || b==="" || c==null || c==="" || d===null || d==="" || e===null || e==="" ){
            return false
        }
        else {
            const lecture = await searchTable(d)
            const lecture1 = await searchTable2(c)
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

async  function deleteTable(id){
    try{
        await client.query("delete from utilisateur where idutilisateur= $1;",[id])
        return true
    }
    catch (e) {
        return false

    }
}

exports.start =start
exports.connect = connect
exports.readTable = readTable
exports.insertTable = insertTable
exports.deleteTable = deleteTable
