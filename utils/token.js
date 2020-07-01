import * as SecureStore from 'expo-secure-store';

export async function readToken() {
    const login = await SecureStore.getItemAsync("login");
    const times = await SecureStore.getItemAsync("times");
    const token = await SecureStore.getItemAsync("token");
    return {
        login: login,
        times: times,
        token: token
    }
}

export function writeToken(token) {
    SecureStore.setItemAsync("login", token.login);
    SecureStore.setItemAsync("times", token.times);
    SecureStore.setItemAsync("token", token.token);
}

export function delToken() {
    writeToken({
        login: "",
        times: "",
        token: ""
    });
}