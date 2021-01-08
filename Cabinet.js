import React, { useState, useEffect } from 'react';
import NavigationBar from './components/NavigationBar';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import ModalUser from './components/ModalUser';
import { delToken } from './utils/token';
import { CommonActions } from '@react-navigation/native';
import send from './utils/net';
import arrow from './files/arrow.png';
import man from './files/man.png';
import check from './files/checkbox_yellow.png';
import { setPush } from './utils/store';

function Header(props) {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{props.title}</Text>
        </View>
    );
}

export default function CabinetScreen({navigation}) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [icon, setIcon] = useState(man);
    const [modal, setModal] = useState(false);
    const token = useSelector(state => state.token);
    const dispath = useDispatch();

    const setUser = () => {
        send('api/user/get', 'POST', {}, (json) => {
            setName(json.first_name);
            setPhone(json.phone);
            setIcon(man);
		}, token);
    }

    useEffect(() => {
        setUser();
    }, []);

    const onFinal = () => {
        setUser();
        setModal(false);
    }

    const MenuItem = (props) => {
        return (
            <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate(props.page)}>
                <Text style={styles.itemText}>{props.title}</Text>
                <Image source={arrow} resizeMode={'contain'} style={{width: 10, height: 20}}></Image>
            </TouchableOpacity>
        );
    }

    const onExit = () => {
        delToken().then(() => {
            dispath(setPush(""));
            navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'Welcome' },
                    ],
                })
            );
        });
        //navigation.navigate('Welcome');
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <ModalUser visible={modal} onExit={onFinal} />
            <View style={styles.barContainer}>
                <Text style={styles.barText}>Личный кабинет</Text>
            </View>
            <ScrollView>
                <View style={{flexDirection: 'row', padding: 20}}>
                    <View style={styles.imageBox}>
                        <View style={{overflow: "hidden"}}>
                            <Image source={icon} resizeMode="center" style={{width: 100, height: 100}}/>
                        </View>
                    </View>
                    <View style={{paddingLeft: 30, justifyContent: 'space-around'}}>
                        <View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={styles.nameText}>{name}</Text>
                                <Image source={check} resizeMode={'contain'} style={{width: 20, height: 20}}/>
                            </View>
                            <Text style={styles.phoneText}>{phone}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setModal(true)}>
                            <Text style={styles.dataText}>Изменить данные</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Header title="Основные" />
                <MenuItem title="Мои заказы" page="OrderList" />
                <MenuItem title="Помощь" page="Chat" />
                <Header title="Акции" />
                <MenuItem title="Купоны" page="Coupon" />
                <Header title="Другое" />
                <MenuItem title="О приложении" page="About" />
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
        color: '#f08741',
    },
    imageBox: {
        backgroundColor: '#201f1b',
        borderRadius: 100,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
});