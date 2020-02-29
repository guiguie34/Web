var request = require("request");

var options = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v2/leagueTable/525',
    headers: {
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
        'x-rapidapi-key': '7bf03bad33msh48309ae2dc1dc8cp116206jsnf53ba058e420'
    }
};

var bod= false
request(options, async function (error, response, body) {
    if (error) throw new Error(error);
    bod=body
});

async function getClassement(){
    return bod
}

exports.getClassement=getClassement