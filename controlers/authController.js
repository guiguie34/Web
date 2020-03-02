let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens



async function setToken(id,rank,key){
    try {
        const token = await jwt.sign({id, rank}, key, {
            algorithm: 'HS256',
            expiresIn: 600 //5mins
        })
        console.log('token:', token)
        return token
    }
    catch (e) {
        return false
    }

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
    try {
        const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
        var payload = await checkToken(token, key)
        if (payload.exp - nowUnixSeconds < 60) {
            return await setToken(payload.id, payload.rank, key)
        } else {
            return false

        }
    }
    catch (e) {
        return false
    }
}

async function deleteToken(res){
    try {
        res.clearCookie("token")
    }
    catch (e) {
        return false
    }
}
//clearCookie

exports.setToken = setToken
exports.checkToken = checkToken
exports.refreshToken = refreshToken
exports.deleteToken = deleteToken