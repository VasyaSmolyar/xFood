import AsyncStorage from '@react-native-async-storage/async-storage';

export async function readLocate() {
    const locate = await AsyncStorage.getItem("@locate");
    return locate;
}

export function writeLocate(locate) {
    AsyncStorage.setItem("@locate", locate);
}