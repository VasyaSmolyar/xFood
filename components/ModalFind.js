import React, { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View, Modal, Text, Image, TouchableOpacity} from 'react-native';
import { useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import * as Location from 'expo-location';
import send from '../utils/net';
import path from '../files/ypath.png';
import place from '../files/place.png';
import x from '../files/x.png';

const screenWidth = Math.round((Dimensions.get('window').width - 40) / 2);
const screenHeight = Math.round((Dimensions.get('window').height - 160) / 2);

export default function ModalList({locate, visible}) {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [region, setRegion] = useState({ 
        latitude: 56.74, 
        longitude: 37.17, 
        latitudeDelta: 1, 
        longitudeDelta: 1 
    });
    const [find, setFind] = useState({ 
        latitude: 56.74, 
        longitude: 37.17, 
        latitudeDelta: 1, 
        longitudeDelta: 1 
    });
    const [block, setBlock] = useState(false);
    const [name, setName] = useState('');
    const [avaiable, setAvailable] = useState(false);
    const token = useSelector(state => state.token);
    const [start, setStart] = useState(null);
    const [stat, setStatus] = useState(false);

    const inProgress = (reg) => {
        setBlock(false);
        setAvailable(false);
        (async () => {
            if(reg === null) {
                return null;
            }
            const loc = {latitude: reg.latitude, longitude: reg.longitude};
            setFind(reg);
            return await Location.reverseGeocodeAsync(loc);
        })().then((res) => {
            setLocation(res);
            const addr = {lat: reg.latitude, lon: reg.longitude};
            serialize(addr);
        });
    }

    const choiceLocate = (reg) => {
        setRegion(null);
        if(block === false) {
            setBlock(true);
            setTimeout(inProgress, 1000, reg);
        }
    }

    const serialize = (data) => {
        /*
        if(errorMsg !== null) {
            return <Text style={{color: 'red'}}>{errorMsg}</Text>;
        }
        if(location === null || location === undefined || location[0] === undefined) {
            return '';
        }
        const loc = location[0];
        return loc.city;
        {lat: reg.latitude, lon: reg.longitude}
        */
        send('api/area/get', 'POST', data, (res) => {
            console.log(res);
            if(res.area_name)
                setName(res.area_name);
        }, token);

    }

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            setStatus(true);
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
            } else {
                let location = await Location.getCurrentPositionAsync({});

                let result = await Location.reverseGeocodeAsync(location.coords);
                setLocation(result);

                setRegion({ 
                    latitude: location.coords.latitude, 
                    longitude: location.coords.longitude, 
                    latitudeDelta: 0.0022, 
                    longitudeDelta: 0.0021 
                });

                setFind({ 
                    latitude: location.coords.latitude, 
                    longitude: location.coords.longitude, 
                    latitudeDelta: 0.0022, 
                    longitudeDelta: 0.0021 
                });

                setStart({ 
                    latitude: location.coords.latitude, 
                    longitude: location.coords.longitude, 
                    latitudeDelta: 0.0022, 
                    longitudeDelta: 0.0021 
                });

                serialize({lat: location.coords.latitude, lon: location.coords.longitude});
            }
        })();
    }, []);

    const setLocale = () => {
        setRegion(start);
        setFind(start);
    }

    const getPlace = () => {
        if(start === null) {
            Location.requestPermissionsAsync().then(({status}) => {
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                } else {
                    setLocale();
                }
            }); 
        } else {
            setLocale();
        }
    }

    return (
        <Modal visible={visible && stat}>
            <View style={styles.container}>
                <View style={{flex: 3}}>
                    <MapView style={{flex: 1}} region={region} 
                    onRegionChange={(reg) => choiceLocate(reg)} showsUserLocation></MapView>
                    <Image source={place} style={{position: "absolute", width: 40, height: 60, top: screenHeight, left: screenWidth}} resizeMode={'contain'} />
                </View>
                <View style={styles.uiContainer}>
                    <Text style={styles.header}>Моё местоположение</Text>
                    <View style={styles.pathContainer}>
                        <View style={styles.geoWrap}>
                            <Text style={styles.inputWrapText}>Адрес</Text>
                            <Text style={styles.phone}>{name}</Text>
                        </View>
                        <TouchableOpacity style={styles.imageContainer} onPress={getPlace}>
                            <Image source={path} resizeMode={'contain'} style={styles.geoImage} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.geoButton} onPress={() => locate(name)}>
                        <Text style={styles.geoText}>Продолжить</Text>
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
		fontSize: 12,
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
		backgroundColor: '#f08741',
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