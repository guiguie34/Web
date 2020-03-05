const { Client } = require('pg')

const client = new Client({
    host:"ec2-54-247-125-38.eu-west-1.compute.amazonaws.com",
    port:"5432",
    user:"psnoovrrpcdwml",
    password:"250f01a4cfa6d1104915956b31a633aa547af2318a846e783716ef05983bd3dd",
    database:"dalnvihgs5vc0"
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
