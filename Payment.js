import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import ModalList from './components/ModalList';
import ModalMap from './components/ModalMap';
import send from './utils/net';
import arrow from './files/blackArrow.png';
import path from './files/path.png';
import payCash from './files/payCash.png';

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
    const [comment, setComment] = useState("");

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
            <StatusBar style="dark" />
            <View style={styles.barContainer}>
                <View style={styles.barCell}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={arrow} style={{width: 50, height: 25}} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <View style={styles.barCell}>
                    <Text style={styles.barText}>Оформление заказа</Text>
                </View>
            </View>
            <ScrollView style={{backgroundColor: 'white'}}>
                <ModalList visible={modal} onChoice={(item) => choiceRegion(item.area_name)} onExit={() => setModal(false)} />
                <ModalMap visible={map} close={() => setMap(false)} locate={choiceLocate} />
                <View style={styles.blockConatiner}> 
                    <Text style={styles.header}>Доставка</Text>
                    <View style={styles.geoContainer}>
                        <View style={[styles.geoWrap, {width: '40%'}]}>
                            <Text style={styles.inputWrapText}>Город</Text>
                            <TextInput value={region} style={styles.phone} onFocus={() => {setModal(true)}} />
                        </View>
                        <View style={[styles.geoWrap, {width: '52%'}]}>
                            <Text style={styles.inputWrapText}>Улица, дом</Text>
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
                    <View style={styles.geoContainer}>
                        <View style={[styles.geoWrap, {width: '100%'}]}>
                            <Text style={styles.inputWrapText}>Комментарий</Text>
                            <TextInput value={comment} onChangeText={setComment} style={styles.phone} />
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
                </View>
                <View style={styles.blockConatiner}>
                    <View style={styles.methodLine}>
                        <Text style={styles.header}>Способ оплаты</Text>
                        <TouchableOpacity style={styles.methodButton}>
                            <Text style={styles.textButton}>Изменить</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.methodFull}>
                        <Image source={payCash}  style={{width: 25, height: 25}} resizeMode='contain' />
                        <Text style={styles.methodText}>Наличными при получении</Text>
                    </View>
                </View>
                <View style={[styles.blockConatiner, {borderBottomWidth: 0}]}>
                    <Text style={[styles.header, {marginBottom: 12}]}>Данные получателя</Text>
                    <View style={styles.inputWrap}>
                        <Text style={styles.inputWrapText}>Имя</Text>
                        <TextInput value={login} style={styles.phone} onChangeText={(text) => setLogin(text)} />
                    </View>
                    <View style={[styles.inputWrap, {width: '60%'}]}>
                        <Text style={styles.inputWrapText}>Номер телефона</Text>
                        <TextInput value={'+7' + phone} onChangeText={(text) => setPhone(text.slice(2))} maxLength = {12} 
                        style={styles.phone} keyboardType='phone-pad' />
                    </View>
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
        backgroundColor: '#fff',
        padding: 5,
        paddingLeft: 25,
        paddingTop: Constants.statusBarHeight,
        flexDirection: 'row',
        borderBottomColor: '#f2f3f5',
        borderBottomWidth: 3
    },
    barCell: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 30
    },
    barText: {
        fontWeight: "bold",
        fontSize: 20,
        marginVertical: 20
    },
    blockConatiner: {
        borderBottomColor: '#f2f3f5',
        borderBottomWidth: 3,
        paddingBottom: 20,
        paddingHorizontal: 25
    },
    header: {
        fontSize: 20,
        fontFamily: 'Tahoma-Regular',
        paddingTop: 22,
        paddingBottom: 8
    },
    inputWrap: {
		padding: 5,
		backgroundColor: "#f2f3f5",
        marginBottom: 20,
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
        justifyContent: 'space-between'
    },
    geoWrap: {
        padding: 5,
		backgroundColor: "#f2f3f5",
        marginTop: 10,
        borderRadius: 7,
        marginBottom: 20
    },
    cellWrap: {
        padding: 5,
		backgroundColor: "#f2f3f5",
        marginBottom: 10,
		borderRadius: 7,
		width: '20%',
    },
    geoButton: {
		backgroundColor: '#f08741',
		paddingVertical: 20,
		marginHorizontal: 5,
		borderRadius: 15,
		width: '100%',
		alignItems: 'center'
	},
	geoText: {
		fontFamily: 'Tahoma-Regular', 
        fontSize: 16,
        fontWeight: 'bold', 
		color: 'white'
    },
    geoImage: {
        width: 20,
        height: 20,
        marginLeft: 20
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    methodLine: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
       marginBottom: 20
    },
    methodButton: {
        backgroundColor: '#f08741',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 22,
        marginBottom: 8
    },
    textButton: {
        fontFamily: 'Tahoma-Regular', 
        fontSize: 14,
        color: '#fff'
    },
    methodFull: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25
    },
    methodText: {
        fontFamily: 'Tahoma-Regular', 
        fontSize: 15,
        marginLeft: 15
    }
});