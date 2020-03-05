const { Client } = require('pg')
const dotenv = require('dotenv').config({
    path: './configV/log.env'
})
const client = new Client({
    host:process.env.hostt1,
    port:process.env.portt1,
    user:process.env.userr1,
    password:process.env.passwordd1,
    database:process.env.databasee1
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
