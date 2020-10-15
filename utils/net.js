const backend = 'http://xfood.store/';

function send(url, method, data, callback, token={}) {
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
        //console.log(response.status);
        /*
        if(response.status < 200 || response.status > 300) {
            console.log(response.status);
            onError(response);
            return null;  
        }
        */
        return response.text();
    })
    .then((text) => {
        //if(text !== null) {
            console.log("===========SOURCE:=============\n", text);
            const json = JSON.parse(text);
            console.log(json);
            callback(json);
        //}
    })
    .catch((error) => {
        console.log(error);
    })
}

export default send;