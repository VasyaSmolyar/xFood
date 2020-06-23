import React, { useState } from 'react';
import NavigationBar from './components/NavigationBar';
import useNavigation from '@react-navigation/native';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import arrow from './files/arrow.png';
import man from './files/man.png';
import check from './files/checkbox_yellow.png';

function MenuItem(props) {
    return (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{props.title}</Text>
            <TouchableOpacity>
                <Image source={arrow} resizeMode={'contain'} style={{width: 10, height: 20}}></Image>
            </TouchableOpacity>
        </View>
    );
}

function Header(props) {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{props.title}</Text>
        </View>
    );
}

export default function CabinetScreen() {
    const [name, setName] = useState("Иван Иванов");
    const [phone, setPhone] = useState("+7(977)517-48-22");
    const [icon, setIcon] = useState(man);
    return (
        <View style={styles.container}>
            <View style={styles.barContainer}>
                <Text style={styles.barText}>Личный кабинет</Text>
            </View>
            <ScrollView>
                <View style={styles.itemContainer}>
                    <View style={styles.imageBox}>
                        <Image source={icon} resizeMode={'contain'} style={{width: 60, height: 60}}/>
                    </View>
                    <View style={{justifyContent: "space-around"}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.nameText}>{name}</Text>
                            <Image source={check} resizeMode={'contain'} style={{width: 20, height: 20}}/>
                        </View>
                        <Text style={styles.phoneText}>{phone}</Text>
                        <Text style={styles.dataText}>Изменить данные</Text>
                    </View>
                </View>
                <Header title="Основные" />
                <MenuItem title="Мои заказы" page="" />
                <MenuItem title="Помощь" page="" />
                <MenuItem title="Сканер акцизов" page="" />
                <Header title="Акции" />
                <MenuItem title="Купоны" page="" />
                <Header title="Другое" />
                <View style={styles.itemContainer}>
                    <TouchableOpacity>
                        <Text style={[styles.itemText, {color: '#ed3823'}]}>Выйти из аккаунта</Text>
                    </TouchableOpacity>
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
        marginTop: Constants.statusBarHeight,
        alignItems: 'center'
    },
    barText: {
        color: "#f1c40f",
        fontWeight: "bold",
        fontSize: 16,
        marginVertical: 20
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
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    } 
});