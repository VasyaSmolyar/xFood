const backend = 'http://127.0.0.1:8000/';

function send(url, method, data, callback, token='') {
    let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    if (token !== '') {
        headers['Authorization'] = token;
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
        return response.json();
    })
    .then((json) => {
        console.log(json);
        callback(json);
    })
    .catch((error) => {
        console.error(error);
    })
}

export default send;