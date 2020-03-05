const { Client } = require('pg')
const dotenv = require('dotenv').config({
    path: './log.env'
})
const client = new Client({
    host: process.env.hostt,
    port: process.env.portt,
    user: process.env.userr,
    password: process.env.passwordd,
    database: process.env.databasee
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
