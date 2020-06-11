import React, { useState } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View, Modal } from 'react-native';

export default function ModalList(props) {

/*
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [region, setRegion] = useState(null);

    useEffect(() => {
        (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(JSON.stringify(location));

        setRegion({ 
            mapRegion: { 
                latitude: location.coords.latitude, 
                longitude: location.coords.longitude, 
                latitudeDelta: 0.0922, 
                longitudeDelta: 0.0421 
            }
        });

        })();
    }, []);
*/
    return (
        <Modal visible={props.visible}>
            <View style={styles.container}>
                <MapView style={{width: 100, height: 100}} />
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