const { Client } = require('pg')
const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'azerty34', //je vous invite à essayer ;)
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


exports.connect = connect
exports.client= client
