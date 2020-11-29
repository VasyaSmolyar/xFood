import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView,  Keyboard } from 'react-native';
import { useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import ModalList from './components/ModalList';
import ModalMap from './components/ModalMap';
import ModalPay from './components/ModalPay';
import send from './utils/net';
import { useRoute } from '@react-navigation/native';
import arrow from './files/blackArrow.png';
import path from './files/path.png';
import price from './files/price.png';
// ----------------------------------
import gpay from './files/gpay.png';
import apay from './files/apay.webp';
import cardHand from './files/cardHand.png';
import cardOnline from './files/cardOnline.png';

import google from './files/google.png';
import buttonCard from './files/buttonCard.png';
import apple from './files/apple.png';

import { s, vs, ms, mvs } from 'react-native-size-matters';

const unzip = (slug) => {
    if(slug === 'cash') {
        return ['Наличные при получении', price, 'cash'];
    }
    if(slug === 'transfer') {
        return ['Оплата картой при получении', cardHand, 'transfer'];
    }
    if(slug === 'transfer_online') {
        return ['Оплата онлайн', cardOnline, 'transfer_online'];
    }
    /*
    if(slug === 'online') {
        return Platform.OS === 'ios' ?  ['Apple Pay', apay, 'apple'] : ['Google Pay', gpay, 'google'];
    } */
    return ['', null, ''];
}

const getButton = (slug, makeOrder) => {
    if(slug === 'transfer_online') {
        return (
            <TouchableOpacity style={[styles.geoButton, {paddingVertical: 15}]} onPress={makeOrder}>
                <View style={styles.buttonContainer}>
                    <Image source={buttonCard} style={{width: 25, height: 25, marginRight: 10}} resizeMode='contain' />
                    <Text style={styles.geoText}>Перейти к оплате</Text>
                </View>
            </TouchableOpacity>
        );
    }
    if(slug === 'online') {
        if(Platform.OS === 'ios') {
            return (
                <TouchableOpacity style={[styles.geoButton, {paddingVertical: 15, backgroundColor: '#000'}]} onPress={makeOrder}>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.geoText}>Оплатить с </Text>
                        <Image source={apple} style={{width: 50, height: 25, marginLeft: 10, marginBottom: -5}} resizeMode='contain' />
                    </View>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity style={[styles.geoButton, {paddingVertical: 15, backgroundColor: '#000'}]} onPress={makeOrder}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.geoText}>Оплатить с </Text>
                    <Image source={google} style={{width: 50, height: 25, marginLeft: 10, marginBottom: -5}} resizeMode='contain' />
                </View>
            </TouchableOpacity>
        );
    }
    return (
        <TouchableOpacity style={[styles.geoButton, {paddingVertical: 15}]} onPress={makeOrder}>
            <View style={styles.buttonContainer}>
                <Text style={styles.geoText}>Заказать</Text>
            </View>
        </TouchableOpacity>
    );
}

export default function PaymentScreen({navigation}) {
    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const route = useRoute();
    const summ = route.params.summ;

    const [login, setLogin] = useState(user.user);
    const [phone, setPhone] = useState(user.phone.slice(2));

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

    const [payModal, setPayModal] = useState(false);
    const [payList, setPayList] = useState([]);

    const [title, src, retSlug] = unzip(payType);

    const choiceRegion = (name) => {
        setRegion(name);
        setModal(false);
        Keyboard.dismiss(); 
    };

    const choiceLocate = (location, geo) => {
        setMap(false);
        setCoords({lat: geo.latitude, lon: geo.longitude});
        if(location === null || location === undefined) {
            return;
        }
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
        if(data === null) {
            return;
        }
        data.pay_type = retSlug;
        data.street = getValue(streetName);
        data.house = getValue(house);
        data.apartment = getValue(apartament);
        data.corpus = getValue(corpus);
        data.stage = getValue(stage);
        data.doorphone = getValue(doorphone);
        data.comment = comment;
        console.log(data);
        send('api/order/createorder', 'POST', data, (json) => {
            if (json["order.id"] !== undefined) {
                if(payType === 'transfer_online') {
                //navigation.navigate('Catalog');
                    navigation.navigate('Pay', {order_id: json["order.id"], summ: summ});
                } else {
                    navigation.navigate('Catalog');
                }
            }
        }, token);
    }

    const onSelect = (val) => {
        setPayModal(false);
        setPayType(val);
    };

    const onSelectStart = () => {
        if(payList.length > 0)
            setPayModal(true);
    }

    useEffect(() => {
        send('api/cart/getcart', 'POST', {}, (json) => {
            const pays = json.pay_types;
            if (pays)
                if(json.pay_types.some((item) => item === 'online')) {
                    setPayList([...pays, 'transfer_online']);
                } else {
                    setPayList(pays);
                }
        }, token);
    },[]);

    return (
        <View styles={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.barContainer}>
                <View style={styles.barCell}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={arrow} style={{width: s(35), height: vs(18)}} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <View style={styles.barCell}>
                    <Text style={styles.barText}>Оформление заказа</Text>
                </View>
            </View>
            <ScrollView style={{backgroundColor: 'white'}}>
                <ModalList visible={modal} onChoice={(item) => choiceRegion(item.area_name)} onExit={() => setModal(false)} />
                <ModalMap visible={map} close={() => setMap(false)} locate={choiceLocate} />
                <ModalPay visible={payModal} onClose={(val) => onSelect(val)} pay_types={payList} />
                <View style={styles.blockConatiner}> 
                    <Text style={styles.header}>Доставка</Text>
                    <View style={styles.geoContainer}>
                        <TouchableOpacity style={[styles.geoWrap, {width: '40%'}]} onPress={() => {setModal(true)}}>
                            <Text style={styles.inputWrapText}>Город</Text>
                            <TextInput value={region} style={styles.phone} editable={false} />
                        </TouchableOpacity>
                        <View style={[styles.geoWrap, {width: '32%'}]}>
                            <Text style={styles.inputWrapText}>Улица</Text>
                            <TextInput value={streetName} style={styles.phone} onChangeText={setStreetName} />
                        </View>
                        <View style={[styles.geoWrap, {width: '22%'}]}>
                            <Text style={styles.inputWrapText}>Дом</Text>
                            <TextInput value={house} style={styles.phone} onChangeText={setHouse} />
                        </View>
                    </View>
                    <View style={styles.geoContainer}>
                        <View style={styles.cellWrap}>
                            <Text style={styles.inputWrapText}>Корпус</Text>
                            <TextInput value={corpus} onChangeText={setCorpus} style={styles.phone} />
                        </View>
                        <View style={styles.cellWrap}>
                            <Text style={styles.inputWrapText} numberOfLines={1}>Квартира</Text>
                            <TextInput value={apartament} onChangeText={setApartament} style={styles.phone} />
                        </View>
                        <View style={styles.cellWrap}>
                            <Text style={styles.inputWrapText}>Этаж</Text>
                            <TextInput value={stage} onChangeText={setStage} style={styles.phone} />
                        </View>
                        <View style={styles.cellWrap}>
                            <Text style={styles.inputWrapText} numberOfLines={1}>Домофон</Text>
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
                        <TouchableOpacity style={styles.methodButton} onPress={onSelectStart}>
                            <Text style={styles.textButton}>Изменить</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.methodFull}>
                        <Image source={src}  style={{width: 25, height: 25}} resizeMode='contain' />
                        <Text style={styles.methodText}>{title}</Text>
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
                    {getButton(payType, makeOrder)}
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
		fontSize: 12,
		color: '#a7aaaf',
    },
    phone: {
		backgroundColor: '#f2f3f5', 
		fontSize: 18,
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
		borderRadius: 5,
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
        alignItems: 'center',
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
    },
    methodText: {
        fontFamily: 'Tahoma-Regular', 
        fontSize: 15,
        marginLeft: 15
    }
});