import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import NavigationBar from './components/NavigationBar';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import send from './utils/net';
import useCart from './utils/cartHook';
import dinner from './files/dinner.png';
import pack from './files/package.png';

export default function CartScreen({navigation}) {
    const token = useSelector(state => state.token);
    const {cart, addItem, removeItem, removeAll, loadCart} = useCart([], token);
    const [addons, setAddons] = useState([]);

    useEffect(() => {
        send('api/cart/getcart', 'POST', {}, (json) => {
            const cart = json.items.map(item => {
                return {
                    item: item.product,
                    num: item.num
                } 
            });
            loadCart(cart);
            setAddons(json.adviced);
        }, token);
    }, []);

    const cartData = cart.map((prod) => {
        const item = prod.item;
        return (
            <View style={styles.itemContainer}>
                <Image source={{uri: item.image_url}} style={{width: 40, height: 40, marginRight: 5}} resizeMode='contain' />
                <View style={styles.infoContainer}>
                    <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.priceText}>{item.price} ₽</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.highButton}>
                        <Text style={styles.lowText}>+</Text>
                    </TouchableOpacity>
                        <Text style={styles.lowNum}>{prod.num}</Text>
                    <TouchableOpacity style={styles.lowButton}>
                        <Text style={styles.lowText}>-</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    });

    const addData = addons.map((item) => {
        return ( 
            <View style={styles.addContainer}>
                <Image source={{uri: item.image_url}} style={{width: 40, height: 40, marginRight: 10}} resizeMode='contain' />
                <View>
                    <Text style={styles.titleText}>{item.title}</Text>
                    <Text style={styles.priceText}>{item.price} ₽</Text>
                </View>
            </View>
        );
    })

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={{paddingHorizontal: 25}}>
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Корзина</Text>
                        <Text style={styles.secondHeader}>Макдональдс</Text>
                    </View>
                    <View style={styles.deviceContainer}>
                        <View style={styles.leftContainer}>
                            <Image source={dinner} style={{width: 40, height: 40, marginRight: 30}} resizeMode='contain' />
                            <Text style={styles.titleText}>Приборы</Text>
                        </View>
                        <View style={styles.rightContainer}>
                            <TouchableOpacity style={styles.lowButton}>
                                <Text style={styles.lowText}>+</Text>
                            </TouchableOpacity>
                            <Text style={styles.lowNum}>1</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <Text style={[styles.priceText, {fontSize: 18, marginTop: 15, marginLeft: 10}]}>К заказу</Text>
                    <ScrollView horizontal={true} style={styles.horContainer}>
                        {addData}
                    </ScrollView>
                </View>
                <ScrollView style={styles.listContainer}>
                    {cartData}
                </ScrollView>
                <View style={[styles.horContainer, {flexDirection: 'row'}]}>
                    <Image source={pack} style={{width: 40, height: 40, marginRight: 20}} resizeMode='contain' />
                    <View style={styles.infoContainer}>
                        <Text style={styles.titleText}>Доставка</Text>
                        <Text style={styles.priceText}>89 ₽</Text>
                    </View>
                </View>
                <View style={styles.horContainer}>
                    <Text style={[styles.priceText, {fontSize: 18, marginBottom: 10}]}>Скидки и купоны</Text>
                    <TextInput style={styles.codeInput} placeholder="Код купона" />
                </View>
            </View>
            <View style={[styles.horContainer, {marginHorizontal: 20}]}>
                <Text style={styles.titleText}>Общая стоимость: 666 ₽</Text>
                <TouchableOpacity style={styles.phoneButton}>
                    <Text style={styles.phoneText}>Оформить заказ</Text>
                </TouchableOpacity>
            </View>
            <NavigationBar navigation={navigation} routeName="Cart"/>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        justifyContent: 'space-between',
    },
    headerContainer: {
        width: '100%',
        borderBottomColor: '#e5e4e4',
        borderBottomWidth: 1 
    },
    header: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: Constants.statusBarHeight,
        paddingBottom: 10
    },
    secondHeader: {
        color: '#989898',
        fontFamily: 'Tahoma-Regular',
        fontSize: 16,
        marginLeft: 10,
        paddingBottom: 10
    },
    titleText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 16,
    },
    deviceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomColor: '#e5e4e4',
        borderBottomWidth: 1 
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 20
    },
    lowButton: {
        paddingVertical: 3,
        paddingHorizontal: 15,
        backgroundColor: '#d6dbe0',
        borderRadius: 10,
        alignItems: 'center'
    },
    highButton: {
        paddingVertical: 3,
        paddingHorizontal: 15,
        backgroundColor: '#f18640',
        borderRadius: 10
    },
    lowText: {
        fontSize: 24,
        color: 'white'
    },
    lowNum: {
        fontSize: 20,
        fontFamily: 'Tahoma-Regular',
        marginHorizontal: 18
    },
    horContainer: {
        paddingHorizontal: 5,
        paddingVertical: 20,
        borderBottomColor: '#e5e4e4',
        borderBottomWidth: 1 
    },
    addContainer: {
        backgroundColor: '#fff',
        marginRight: 15,
        flexDirection: 'row',
        padding: 15
    },
    listContainer: {
        borderBottomColor: '#e5e4e4',
        borderBottomWidth: 1 
    },
    itemContainer: {
        paddingVertical: 25,
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoContainer: {
        width: '30%'
    },
    priceText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 16,
        fontWeight: 'bold'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    codeInput: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#e5e6e7',
        fontFamily: 'Tahoma-Regular',
        fontSize: 16,
        width: '70%',
        borderRadius: 10
    },
    phoneButton: {
		backgroundColor: '#f08741',
        paddingVertical: 15,
        marginTop: 15,
		borderRadius: 7,
		width: '100%',
		alignItems: 'center'
	},
	phoneText: {
		fontFamily: 'Tahoma-Regular', 
        fontSize: 16, 
        fontWeight: 'bold',
		color: 'white'
	},
});