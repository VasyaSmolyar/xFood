const backend = 'http://xfood.store:8000/';

export const version = '1.0.0';

function send(url, method, data, callback, token={}) {
    let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'App-Version': version
    };
    if (token !== {}) {
        headers['Login'] = token.login;
        headers['Times'] = token.times;
        headers['Token'] = token.token;
    }
    let forFetch = {
        method: method,
        headers: headers
    };
    if(method === 'POST') {
        forFetch.body = JSON.stringify(data);
    } else {
        url = Object.keys(data).reduce((str, param) => {
            return str + param + "=" + data[param] + "&";
        }, url + "?");
    }
    fetch(backend + url, forFetch)
    .then((response) => {
        //console.log(response.status);
        /*
        if(response.status < 200 || response.status > 300) {
            console.log(response.status);
            onError(response);
            return null;  
        }
        */
        if(response.status === 429) {
            setTimeout(() => send(url, method, data, callback, token), 1000);
            console.log("429 Error");
            return null;
        } else {
            return response.text();
        }
    })
    .then((text) => {
        if(text !== null) {
            console.log("===========SOURCE:=============\n", url , "\n", data , "\n" , text);
            const json = JSON.parse(text);
            //console.log(json);
            callback(json);
        }
    })
    .catch((error) => {
        console.log(error);
    })
}

export default send;