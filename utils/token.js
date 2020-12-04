import AsyncStorage from '@react-native-async-storage/async-storage';

export async function readToken() {
    const login = await AsyncStorage.getItem("@login");
    const times = await AsyncStorage.getItem("@times");
    const token = await AsyncStorage.getItem("@token");
    console.log("LOGIN RED");
    console.log(token);
    return {
        login: login,
        times: times,
        token: token
    }
}

export async function writeToken(token) {
    await AsyncStorage.setItem("@login", token.login);
    await AsyncStorage.setItem("@times", token.times);
    await AsyncStorage.setItem("@token", token.token);
}

export async function delToken() {
    await AsyncStorage.removeItem("@login");
    await AsyncStorage.removeItem("@times");
    await AsyncStorage.removeItem("@token");
}