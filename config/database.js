const { Client } = require('pg')
const client = new Client({ //je vous invite à essayer ;)
    host: process.env.host1,
    port: process.env.port1,
    user: process.env.user1,
    password: process.env.password1,
    database: process.env.database1
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
