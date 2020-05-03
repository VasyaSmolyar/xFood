const backend = 'http://127.0.0.1:8000/';

function send(url, method, data, callback) {
    fetch(backend + url, {
        method: method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
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