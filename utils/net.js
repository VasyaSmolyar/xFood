const backend = 'http://194.67.92.163:8000/';

function send(url, method, data, callback, token={}, onError=(() => {})) {
    let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
        if(response.status < 200 || response.status > 300) {
            onError(response);
            return null;  
        }
        return response.text();
    })
    .then((text) => {
        if(text !== null) {
            console.log(text);
            const json = JSON.parse(text);
            console.log(json);
            callback(json);
        }
    })
    .catch((error) => {
        console.error(error);
    })
}

export default send;