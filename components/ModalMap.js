import React, { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View, Modal, Text } from 'react-native';
import * as Location from 'expo-location';

export default function ModalList(props) {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [region, setRegion] = useState(null);

    const choiceLocate = (region) => {
        setRegion(null);
        const loc = {latitude: region.latitude, longitude: region.longitude};
        (async () => {
            if(region === null) {
                return null;
            }
            return await Location.reverseGeocodeAsync(loc);
        })().then((res) => {
            setLocation(res);
        });
        
    }

    useEffect(() => {
        (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
        }

        let location = await Location.getCurrentPositionAsync({});

        let result = await Location.reverseGeocodeAsync(location.coords);
        setLocation(result);

        setRegion({ 
            latitude: location.coords.latitude, 
            longitude: location.coords.longitude, 
            latitudeDelta: 0.0022, 
            longitudeDelta: 0.0021 
        });
        

        })();
    }, []);

    return (
        <Modal visible={props.visible}>
            <View style={styles.container}>
            <View style={{flex: 1}}>
                <Text>Ошибка: {errorMsg}</Text>
                <Text>Локация: {JSON.stringify(location)}</Text>
            </View>
                <MapView style={{flex: 5}} region={region} onRegionChange={(region) => choiceLocate(region)}
                showsUserLocation>
                </MapView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
});