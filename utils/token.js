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

export async function writeToken(token) {
    await SecureStore.setItemAsync("login", token.login);
    await SecureStore.setItemAsync("times", token.times);
    await SecureStore.setItemAsync("token", token.token);
}

export async function delToken() {
    await SecureStore.deleteItemAsync("login");
    await SecureStore.deleteItemAsync("times");
    await SecureStore.deleteItemAsync("token");
}