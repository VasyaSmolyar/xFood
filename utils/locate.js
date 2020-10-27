import * as SecureStore from 'expo-secure-store';

export async function readLocate() {
    const locate = await SecureStore.getItemAsync("locate");
    return locate;
}

export function writeLocate(locate) {
    SecureStore.setItemAsync("locate", locate);
}