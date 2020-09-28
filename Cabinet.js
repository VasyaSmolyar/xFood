import React, { useState, useEffect } from 'react';
import NavigationBar from './components/NavigationBar';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { delToken } from './utils/token';
import send from './utils/net';
import arrow from './files/arrow.png';
import man from './files/man.png';
import check from './files/checkbox_yellow.png';

function Header(props) {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{props.title}</Text>
        </View>
    );
}

export default function CabinetScreen({navigation}) {
    const [name, setName] = useState("Иван Иванов");
    const [phone, setPhone] = useState("+7(977)517-48-22");
    const [icon, setIcon] = useState(man);
    const token = useSelector(state => state.token);

    useEffect(() => {
        send('api/user/get', 'POST', {}, (json) => {
            setName(json.first_name + ' ' + json.last_name);
            setPhone(json.phone);
            setIcon(man);
		}, token);
    }, []);

    const MenuItem = (props) => {
        return (
            <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate(props.page)}>
                <Text style={styles.itemText}>{props.title}</Text>
                <Image source={arrow} resizeMode={'contain'} style={{width: 10, height: 20}}></Image>
            </TouchableOpacity>
        );
    }

    const onExit = () => {
        delToken();
        navigation.navigate('Welcome');
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.barContainer}>
                <Text style={styles.barText}>Личный кабинет</Text>
            </View>
            <ScrollView>
                <View style={styles.itemContainer}>
                    <View style={styles.imageBox}>
                        <View style={{overflow: "hidden"}}>
                            <Image source={icon} resizeMode="center" style={{width: 90, height: 100, marginLeft: 10}}/>
                        </View>
                    </View>
                    <View style={{justifyContent: "space-around", marginRight: 30}}>
                        <View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={styles.nameText}>{name}</Text>
                                <Image source={check} resizeMode={'contain'} style={{width: 20, height: 20}}/>
                            </View>
                            <Text style={styles.phoneText}>{phone}</Text>
                        </View>
                        <Text style={styles.dataText}>Изменить данные</Text>
                    </View>
                </View>
                <Header title="Основные" />
                <MenuItem title="Мои заказы" page="OrderList" />
                <MenuItem title="Помощь" page="Catalog" />
                <MenuItem title="Сканер акцизов" page="Catalog" />
                <Header title="Акции" />
                <MenuItem title="Купоны" page="Coupon" />
                <Header title="Другое" />
                <TouchableOpacity onPress={onExit}>
                    <View style={styles.itemContainer}>
                        <Text style={[styles.itemText, {color: '#ed3823'}]}>Выйти из аккаунта</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
            <NavigationBar navigation={navigation} routeName="Cabinet"/>
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
        padding: 5,
        paddingLeft: 30,
        paddingTop: Constants.statusBarHeight,
        borderBottomColor: '#ede9e9',
        borderBottomWidth: 1
    },
    barText: {
        fontWeight: "bold",
        fontSize: 20,
        marginTop: 20,
        marginBottom: 15
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
    },
    itemText: {
        fontSize: 16,
        fontFamily: 'Tahoma-Regular',
    },
    headerContainer: {
        backgroundColor: '#f4f3f6',
        padding: 20
    },
    headerText: {
        color: '#8d93a3',
        fontSize: 14,
        fontFamily: 'Tahoma-Regular',
    },
    nameText: {
        fontSize: 20,
        fontFamily: 'Tahoma-Regular',
        fontWeight: 'bold',
        marginRight: 10
    },
    phoneText: {
        fontSize: 14,
        fontFamily: 'Tahoma-Regular',
    },
    dataText: {
        fontSize: 16,
        fontFamily: 'Tahoma-Regular',
        color: '#ead500'
    },
    imageBox: {
        backgroundColor: '#201f1b',
        borderRadius: 100,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
});