const { Client } = require('pg')
const dotenv = require('dotenv').config({
    path: './configV/log.env'
})


const client = new Client({ //je vous invite à essayer ;)
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
