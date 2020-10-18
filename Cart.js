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
    const code = useSelector(state => state.code);
    const {cart, addItem, removeItem, removeAll, loadCart} = useCart([], token);
    const [addons, setAddons] = useState([]);
    const [wares, setWares] = useState(1);
    const [other, setOther] = useState({});
    const [cartCode, setCartCode] = useState(code.code);

    const update = (text) => {
        send('api/cart/getcart', 'POST', {coupon: text}, (json) => {
            const cart = json.items.map(item => {
                return {
                    item: item.product,
                    num: item.num
                } 
            });
            loadCart(cart);
            setAddons(json.adviced);
            setWares(json.tablewares);
            setOther(json);
        }, token);
    }

    useEffect(() => {
        update(code.code);
    }, []);

    const cartData = cart.map((prod) => {
        const item = prod.item;
        return (
            <View style={styles.itemContainer}>
                <Image source={{uri: item.image_url}} style={{width: 60, height: 60, marginRight: 5}} resizeMode='contain' />
                <View style={styles.infoContainer}>
                    <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.priceText}>{item.price} ₽</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.highButton} onPress={() => addItem(item)}>
                        <Text style={styles.lowText}>+</Text>
                    </TouchableOpacity>
                        <Text style={styles.lowNum}>{prod.num}</Text>
                    <TouchableOpacity style={styles.lowButton} onPress={() => removeItem(item)}>
                        <Text style={styles.lowText}>-</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    });

    const included = addons.filter((item) => {
        return !cart.find((i) => {
            return item.title === i.item.title;
        });
    });

    const addData = included.map((item) => {
        return ( 
            <TouchableOpacity style={styles.addContainer} onPress={() => addItem(item)}>
                <Image source={{uri: item.image_url}} style={{width: 40, height: 40, marginRight: 10}} resizeMode='contain' />
                <View>
                    <Text style={styles.titleText}>{item.title}</Text>
                    <Text style={styles.priceSecond}>{item.price.toFixed(2).replace(/\.00$/,'')} ₽</Text>
                </View>
            </TouchableOpacity>
        );
    })

    const block = included.length > 0 ? (
        <View>
            <Text style={[styles.priceText, {fontSize: 18, marginTop: 15, marginLeft: 10}]}>К заказу</Text>
            <ScrollView horizontal={true} style={styles.horContainer}>
                {addData}
            </ScrollView>
        </View>
    ) : null;

    const wareAdd = () => {
        send('api/tablewares/add', 'POST', {}, () => {
            setWares(wares + 1);
        }, token);
    }

    const wareRem = () => {
        send('api/tablewares/remove', 'POST', {}, () => {
            setWares(wares - 1);
        }, token);
    }

    const remButton = wares > 1 ? (
        <TouchableOpacity style={styles.lowButton} onPress={wareRem}>
            <Text style={styles.lowText}>-</Text>
        </TouchableOpacity>
    ) : (
        <View style={[styles.lowButton, {opacity: 0}]}>
            <Text style={styles.lowText}>-</Text>
        </View>
    );

    const newCode = (text) => {
        setCartCode(text);
        update(text);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={{height: '100%'}}>
                <View style={{paddingHorizontal: 25}}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Корзина</Text>
                        <Text style={styles.secondHeader}>Макдональдс</Text>
                    </View>
                    <View style={styles.deviceContainer}>
                        <View style={styles.leftContainer}>
                            <Image source={dinner} style={{width: 30, height: 30, marginRight: 30}} resizeMode='contain' />
                            <Text style={styles.titleText}>Приборы</Text>
                        </View>
                        <View style={styles.rightContainer}>
                            <TouchableOpacity style={styles.lowButton} onPress={wareAdd}>
                                <Text style={styles.lowText}>+</Text>
                            </TouchableOpacity>
                            <Text style={styles.lowNum}>{wares}</Text>
                            {remButton}
                        </View>
                    </View>
                {block}
                </View>
                <ScrollView style={styles.listContainer} contentContainerStyle={{justifyContent: 'center'}}>
                    {cartData}
                </ScrollView>
                <View style={{paddingHorizontal: 25}}>
                    <View style={[styles.horContainer, {flexDirection: 'row'}]}>
                        <Image source={pack} style={{width: 40, height: 40, marginRight: 20}} resizeMode='contain' />
                        <View style={styles.infoContainer}>
                            <Text style={styles.titleText}>Доставка</Text>
                            <Text style={styles.priceText}>{other.delivery_cost ? other.delivery_cost.toFixed(2).replace(/\.00$/,'') : 0} ₽</Text>
                        </View>
                    </View>
                    <View style={styles.horContainer}>
                        <Text style={[styles.priceText, {fontSize: 18, marginBottom: 10}]}>Скидки и купоны</Text>
                        <TextInput style={styles.codeInput} placeholder="Код купона" value={cartCode} onChangeText={(text) => newCode(text)} />
                    </View>
                    <View style={{paddingVertical: 20}}>
                        <Text style={styles.titleText}>Общая стоимость: {other.delivery_cost ? other.summ.toFixed(2).replace(/\.00$/,'') : 0} ₽</Text>
                        <TouchableOpacity style={styles.phoneButton} onPress={() => navigation.navigate('Payment')}>
                            <Text style={styles.phoneText}>Оформить заказ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <NavigationBar navigation={navigation} routeName="Cart"/>
            </View>
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
        paddingLeft: 10,
        width: '30%'
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        padding: 15,
        borderRadius: 10
    },
    listContainer: {
        borderBottomColor: '#e5e4e4',
        borderBottomWidth: 1,
        paddingHorizontal: 25
    },
    itemContainer: {
        paddingVertical: 25,
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
    priceSecond: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 16,
        color: '#989898',
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