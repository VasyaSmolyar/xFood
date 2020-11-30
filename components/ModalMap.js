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

export default function ModalMap(props) {

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
    const [start, setStart] = useState(null);
    const [block, setBlock] = useState(false);
    const [avaiable, setAvailable] = useState(false);
    const [street, setAddr] = useState('');
    const token = useSelector(state => state.token);

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
            send('api/area/check', 'POST', addr, (json) => {
                serialize(addr);
                if(json === true) {
                    setAvailable(true);
                }
            }, token);
        });
    }

    const choiceLocate = (reg) => {
        setRegion(null);
        if(block === false) {
            setBlock(true);
            setTimeout(inProgress, 1000, reg);
        }
    }

    const serialize = (addr) => {
        send('api/geocode/reverse', 'GET', {lat: addr.lat, lon: addr.lon}, (json) => {
            if(json.street && json.house) {
                setAddr(json.street + ', ' + json.house);
                setLocation(json);
            } else if(json.street) {
                setAddr(json.street);
                setLocation(json);
            } else if(json.house) {
                setAddr(json.house);
                setLocation(json);
            } else {
                setAddr('');
                setLocation(undefined);
            }
        }, token);
    }

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
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

            }
        })();
    }, []);

    const sbutton = avaiable ? (
        <TouchableOpacity style={styles.geoButton} onPress={() => props.locate(location, find)}>
            <Text style={styles.geoText}>Продолжить оформление</Text>
        </TouchableOpacity>
    ) : (
        <TouchableOpacity style={[styles.geoButton, {backgroundColor: '#aaaaaa'}]} onPress={() => {}} activeOpacity={1}>
            <Text style={styles.geoText}>Доставка невозможна</Text>
        </TouchableOpacity>
    );

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
        <Modal visible={props.visible}>
            <View style={styles.container}>
                <View style={{flex: 3}}>
                    <MapView style={{flex: 1}} region={region} 
                    onRegionChange={(reg) => choiceLocate(reg)} showsUserLocation></MapView>
                        <Image source={place} style={{position: "absolute", width: 40, height: 60, top: screenHeight, left: screenWidth}} resizeMode={'contain'} />
                        <TouchableOpacity style={{position: "absolute", backgroundColor: '#fff', width: 50, height: 50, alignItems: 'center', 
                        justifyContent: 'center', borderRadius: 100, margin: 20}} onPress={() => props.close()}>
                            <Image source={x} style={{width: 20, height: 20}} resizeMode={'contain'} />
                        </TouchableOpacity>
                </View>
                <View style={styles.uiContainer}>
                    <Text style={styles.header}>Выбор места доставки</Text>
                    <View style={styles.pathContainer}>
                        <View style={styles.geoWrap}>
                            <Text style={styles.inputWrapText}>Адрес</Text>
                            <Text style={styles.phone}>{street}</Text>
                        </View>
                        <TouchableOpacity style={styles.imageContainer} onPress={getPlace}>
                            <Image source={path} resizeMode={'contain'} style={styles.geoImage} />
                        </TouchableOpacity>
                    </View>
                    {sbutton}
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