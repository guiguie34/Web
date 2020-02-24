const { Client } = require('pg')
const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'azerty34',
    database: 'Web2'
})

start()

async function start() {
    await connect()
    const lecture = await readTable()
    console.log(lecture)

    const successCreate = await insertTable("guillaume","chebib","1999-12-03","guiguie34","guillame@","mdp")
    console.log(`Creating was ${successCreate}`)
    const successDelete= await deleteTable(1)
    console.log(`Deleting was ${successDelete}`)

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

async function insertTable(a,b,c,d,e,f) {
    try{
        await client.query("INSERT INTO utilisateur (nomutilisateur,prenomutilisateur,dateinscriptionutilisateur,pseudoutilisateur,mailutilisateur,mdputilisateur) VALUES($1,$2,$3,$4,$5,$6);",[a,b,c,d,e,f])
        return true
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
