let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens



async function setToken(id,rank,key){

    const token = await jwt.sign({ id,rank }, key, {
        algorithm: 'HS256',
        expiresIn: 300 //5mins
    })
    console.log('token:', token)
    return token


}

async function checkToken(token,key){
    try {
        return jwt.verify(token, key)
    }
    catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return false
        }
        return false
    }
}

async function refreshToken(token,key){

    const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
    var payload= await checkToken(token,key)
    if (payload.exp - nowUnixSeconds > 30) {
        return false
    }
    else{
        return await setToken(payload.id, payload.rank, key)
    }
}

exports.setToken = setToken
exports.checkToken = checkToken
exports.refreshToken = refreshToken