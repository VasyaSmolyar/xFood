import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import ModalList from './components/ModalList';
import ModalMap from './components/ModalMap';
import send from './utils/net';
import passport from './files/passport.png';
import path from './files/path.png';

export default function PaymentScreen({navigation}) {
    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const [login, setLogin] = useState(user.user);
    const [phone, setPhone] = useState(user.phone);
    const [modal, setModal] = useState(false);
    const [map, setMap] = useState(false);
    const [coords, setCoords] = useState(null);
    const [region, setRegion] = useState("");
    const [street, setStreet] = useState("");
    const [streetName, setStreetName] = useState("");
    const [payType, setPayType] = useState("cash");
    const [house, setHouse] = useState("");
    const [apartament, setApartament] = useState("");
    const [corpus, setCorpus] = useState("");
    const [stage, setStage] = useState("");
    const [doorphone, setDoorphone] = useState("");

    const choiceRegion = (name) => {
        setRegion(name);
        setModal(false);
    };

    const choiceLocate = (location, geo) => {
        setMap(false);
        if(location === null || location === undefined) {
            return;
        }
        setCoords({lat: geo.latitude, lon: geo.longitude});
        const loc = location[0];
        setRegion(loc.city);
        const tmp = loc.name.split(", ");
        console.log(tmp);
        const name = tmp.length > 1 ? tmp[1] : loc.name;
        setHouse(name);
        if(loc.street === null) {
            setStreet(loc.name);
            setStreetName("");
        } else {
            setStreet(loc.street + ', ' + name);
            setStreetName(loc.street);
        }
    }

    const getValue = (val) => {
        return val !== "" ? val : "-";
    }

    const makeOrder = () => {
        let data = coords;
        data.pay_type = payType;
        data.street = getValue(streetName);
        data.house = getValue(house);
        data.apartment = getValue(apartament);
        data.corpus = getValue(corpus);
        data.stage = getValue(stage);
        data.doorphone = getValue(doorphone);
        console.log(data);
        send('api/order/createorder', 'POST', data, (json) => {
            if (json["order.id"] !== undefined) {
                navigation.navigate('Cabinet');
            }
        }, token);
    }

    return (
        <View styles={styles.container}>
            <StatusBar style="light" />
            <View style={styles.barContainer}>
                <Text style={styles.barText}>Оформление заказа</Text>
            </View>
            <ScrollView style={{backgroundColor: 'white'}}>
                <ModalList visible={modal} onChoice={(item) => choiceRegion(item.area_name)} onExit={() => setModal(false)} />
                <ModalMap visible={map} close={() => setMap(false)} locate={choiceLocate} />
                <View style={styles.warning}>
                    <Image source={passport} style={styles.warningImage} resizeMode={'contain'} />
                    <View>
                        <Text style={styles.warningText}>Приготовьте паспорт</Text>
                        <Text style={styles.warningFull}>Курьер вправе потребовать документ, удостоверяющий личность получателя в соответствии с п. 2 ст. 16 171-ФЗ Российской федерации</Text>
                    </View>
                </View>
                <Text style={styles.header}>Данные получателя</Text>
                <View style={styles.inputWrap}>
                    <Text style={styles.inputWrapText}>Имя и фамилия</Text>
                    <TextInput value={login} style={styles.phone} onChangeText={(text) => setLogin(text)} />
                </View>
                <View style={[styles.inputWrap, {width: '50%'}]}>
                    <Text style={styles.inputWrapText}>Номер телефона</Text>
                    <TextInput value={'+7' + phone} onChangeText={(text) => setPhone(text.slice(2))} maxLength = {12} 
					style={styles.phone} keyboardType='phone-pad' />
                </View>
                <Text style={styles.header}>Доставка</Text>
                <View style={styles.geoContainer}>
                    <View style={styles.geoWrap}>
                        <Text style={styles.inputWrapText}>Регион</Text>
                        <TextInput value={region} style={styles.phone} onFocus={() => {setModal(true)}} />
                    </View>
                    <View style={styles.geoWrap}>
                        <Text style={styles.inputWrapText}>Город, улица, дом</Text>
                        <TextInput value={street} style={styles.phone} />
                    </View>
                </View>
                <View style={styles.geoContainer}>
                    <View style={styles.cellWrap}>
                        <Text style={styles.inputWrapText}>Корпус</Text>
                        <TextInput value={corpus} onChangeText={setCorpus} style={styles.phone} />
                    </View>
                    <View style={styles.cellWrap}>
                        <Text style={styles.inputWrapText}>Квартира</Text>
                        <TextInput value={apartament} onChangeText={setApartament} style={styles.phone} />
                    </View>
                    <View style={styles.cellWrap}>
                        <Text style={styles.inputWrapText}>Этаж</Text>
                        <TextInput value={stage} onChangeText={setStage} style={styles.phone} />
                    </View>
                    <View style={styles.cellWrap}>
                        <Text style={styles.inputWrapText}>Домофон</Text>
                        <TextInput value={doorphone} onChangeText={setDoorphone} style={styles.phone} />
                    </View>
                </View>
                <View style={{alignItems: 'center', width: '100%'}}>
                    <TouchableOpacity style={styles.geoButton} onPress={() => setMap(true)}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.geoText}>Выбрать на карте</Text>
                            <Image source={path} resizeMode={'contain'} style={styles.geoImage} />
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={styles.header}>Оплата</Text>
                <TouchableOpacity style={payType === "cash" ? styles.selectedContainer : styles.paymentContainer} 
                onPress={() => setPayType("cash")}>
                    <Text style={styles.paymentHeader}>Наличными</Text>
                    <Text style={styles.paymentText}>Приготовьте нужную сумму</Text>
                </TouchableOpacity>
                <TouchableOpacity style={payType === "transfer" ? styles.selectedContainer : styles.paymentContainer} 
                onPress={() => setPayType("transfer")}>
                    <Text style={styles.paymentHeader}>Картой</Text>
                    <Text style={styles.paymentText}>Приготовьте нужную сумму</Text>
                </TouchableOpacity>
                <View style={{alignItems: 'center', width: '100%', marginTop: 30}}>
                    <TouchableOpacity style={[styles.geoButton, {paddingVertical: 15}]} onPress={makeOrder}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.geoText}>Оформить заказ</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{height: 150}}>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    barContainer: {
        width: '100%',
        backgroundColor: 'black',
        padding: 5,
        paddingTop: Constants.statusBarHeight,
        alignItems: 'center'
    },
    barText: {
        color: "#f1c40f",
        fontWeight: "bold",
        fontSize: 16,
        marginVertical: 20
    },
    warning: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: 'white',
        width: '100%'
    },
    warningImage: {
        width: 75,
        height: 75,
        marginRight: 15
    },
    warningText: {
        fontFamily: 'Tahoma-Regular',
        color: '#c0392b',
        fontSize: 16,
        marginBottom: 5
    },
    warningFull: {
        width: '30%',
        fontSize: 12,
        fontFamily: 'Tahoma-Regular',
    },
    header: {
        fontWeight: "bold",
        fontSize: 20,
        fontFamily: 'Tahoma-Regular',
        padding: 15,
        paddingLeft: 10,
        backgroundColor: '#f4f4f6',
        marginTop: 10
    },
    inputWrap: {
		padding: 5,
		backgroundColor: "#f2f3f5",
        marginTop: 10,
        marginHorizontal: 10,
		borderRadius: 7,
		width: '45%',
	},
	inputWrapText: {
		fontFamily: 'Tahoma-Regular', 
		fontSize: 10,
		color: '#a7aaaf',
    },
    phone: {
		backgroundColor: '#f2f3f5', 
		fontSize: 20,
    },
    geoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    geoWrap: {
        padding: 5,
		backgroundColor: "#f2f3f5",
        marginTop: 10,
		borderRadius: 7,
		width: '45%',
    },
    cellWrap: {
        padding: 5,
		backgroundColor: "#f2f3f5",
        marginVertical: 10,
		borderRadius: 7,
		width: '20%',
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
		color: 'white'
    },
    geoImage: {
        width: 30,
        height: 30,
        marginLeft: 20
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    paymentContainer: {
        borderColor: "#efefef",
        borderRadius: 8,
        borderWidth: 1,
        padding: 10,
        paddingLeft: 20,
        margin: 10,
        marginBottom: 0
    },
    selectedContainer: {
        borderColor: "#f1c40f",
        borderRadius: 8,
        borderWidth: 1,
        padding: 10,
        paddingLeft: 20,
        margin: 10,
        marginBottom: 0
    },
    paymentHeader: {
        fontFamily: 'Tahoma-Regular', 
        fontSize: 18,
        marginBottom: 5 
    },
    paymentText: {
        fontFamily: 'Tahoma-Regular', 
		fontSize: 14, 
        color: '#8b95a1'
    }
});