import React, { useState, useEffect } from 'react';
import MapView, {AnimatedRegion, Animated} from 'react-native-maps';
import { StyleSheet, View, Modal, Text, Image, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import path from '../files/ypath.png';
import place from '../files/place.png';
import x from '../files/x.png';

export default function ModalList(props) {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [region, setRegion] = useState(null);

    const choiceLocate = (reg) => {
        region.setValue(reg);
        const loc = {latitude: reg.latitude, longitude: reg.longitude};
        (async () => {
            if(reg === null) {
                return null;
            }
            return await Location.reverseGeocodeAsync(loc);
        })().then((res) => {
            setLocation(res);
        });
        
    }

    const serialize = () => {
        if(errorMsg !== null) {
            return <Text style={{color: 'red'}}>{errorMsg}</Text>;
        }
        if(location === null || location === undefined) {
            return '';
        }
        const loc = location[0];
        const arr = [loc.region, loc.city, loc.street, loc.name];
        return arr.join(', ');
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

            setRegion( new AnimatedRegion({ 
                latitude: location.coords.latitude, 
                longitude: location.coords.longitude, 
                latitudeDelta: 0.0022, 
                longitudeDelta: 0.0021 
            }));
        })();
    }, []);

    return (
        <Modal visible={props.visible}>
            <View style={styles.container}>
                <View style={{flex: 3}}>
                    <Animated style={{flex: 1}} region={region} 
                    onRegionChange={(reg) => choiceLocate(reg)} showsUserLocation></Animated>
                    <View style={{top: 0, left: 0, right: 0, bottom: 0, position: "absolute", alignItems: 'center', justifyContent: 'center'}}>
                        <Image source={place} style={{width: 40, height: 60}} resizeMode={'contain'} />
                    </View> 
                    <View style={{top: 0, left: 0, right: 0, bottom: 0, position: "absolute"}}>
                        <TouchableOpacity style={{backgroundColor: '#fff', width: 50, height: 50, alignItems: 'center', 
                        justifyContent: 'center', borderRadius: 100, margin: 20}} onPress={() => props.close()}>
                            <Image source={x} style={{width: 20, height: 20}} resizeMode={'contain'} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.uiContainer}>
                    <Text style={styles.header}>Выбор места доставки</Text>
                    <View style={styles.pathContainer}>
                        <View style={styles.geoWrap}>
                            <Text style={styles.inputWrapText}>Адрес</Text>
                            <Text style={styles.phone}>{serialize()}</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image source={path} resizeMode={'contain'} style={styles.geoImage} />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.geoButton} onPress={() => props.locate(location)}>
                        <Text style={styles.geoText}>Продолжить оформление</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    uiContainer : {
        flex: 1,
        padding: 10,
        justifyContent: 'space-around',
    },
    header: {
        fontSize: 20,
        fontFamily: 'Tahoma-Regular',
        fontWeight: '700',
        paddingLeft: 5 
    },
    pathContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        marginLeft: 5
    },
    geoWrap: {
		padding: 5,
		backgroundColor: "#f2f3f5",
        marginTop: 10,
		borderRadius: 7,
		width: '88%',
	},
	inputWrapText: {
		fontFamily: 'Tahoma-Regular', 
		fontSize: 10,
        color: '#a7aaaf',
        fontWeight: "700" 
    },
    phone: {
		backgroundColor: '#f2f3f5', 
        fontSize: 12,
        fontWeight: "700" 
    },
    geoImage: {
        width: 30,
        height: 30
    },
    imageContainer: {
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    geoButton: {
		backgroundColor: '#f1c40f',
		paddingVertical: 10,
		marginHorizontal: 5,
		borderRadius: 7,
		width: '95%',
		alignItems: 'center'
	},
	geoText: {
		fontFamily: 'Tahoma-Regular', 
		fontSize: 18, 
        color: 'white',
        fontWeight: "700" 
    },
});