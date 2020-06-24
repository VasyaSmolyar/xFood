import React, { useState } from 'react';
import NavigationBar from './components/NavigationBar';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
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

    const MenuItem = (props) => {
        return (
            <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate(props.page)}>
                <Text style={styles.itemText}>{props.title}</Text>
                <Image source={arrow} resizeMode={'contain'} style={{width: 10, height: 20}}></Image>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
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
                    <View style={{justifyContent: "space-around"}}>
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
                <MenuItem title="Купоны" page="Catalog" />
                <Header title="Другое" />
                <View style={styles.itemContainer}>
                    <TouchableOpacity>
                        <Text style={[styles.itemText, {color: '#ed3823'}]}>Выйти из аккаунта</Text>
                    </TouchableOpacity>
                </View>
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
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    } 
});