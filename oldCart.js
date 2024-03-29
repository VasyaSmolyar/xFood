import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import send from './utils/net';
import { addItem, removeItem, loadCart, removeAllItem, setPrice } from './utils/store';
import NavigationBar from './components/NavigationBar';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import trash from './files/trash.png';
import up from './files/up.png';
import down from './files/down.png';

const CartItem = (props) => {
    let item = props.item.product;
    console.log("=======ITEM======");
    console.log(item);
    if (item === undefined) // Костыль
        return <View></View>;
    item.count = props.item.num;
    const dispath = useDispatch();
    const token = useSelector(state => state.token);

    const getPrice = () => {
        send('api/cart/getcart', 'POST', {}, (json) => {
            dispath(setPrice(json.products_cost, json.delivery_cost));
        }, token);
    }

    const add = (item) => {
        dispath(addItem(item));
        send('api/cart/addtocart', 'POST', {"product.id": item.id, num: 1}, () => {
            console.log("ADD ITEM ID:" + item.id);
        }, token);
        getPrice();
    }

    const remove = (item) => {
        dispath(removeItem(item));
        send('api/cart/deletefromcart', 'POST', {"product.id": item.id, num: 1}, () => {
            console.log("REMOVE ITEM ID:" + item.id);
        }, token);
        getPrice();
    }

    const removeAll = (item) => {
        dispath(removeAllItem(item));
        send('api/cart/deletefromcart', 'POST', {"product.id": item.id, num: item.count}, () => {
            console.log("ALL ITEM ID:" + item.id);
        }, token);
        getPrice();
    }

    return (
        <View>
            <View style={styles.firstLine}>
                <View></View>
                <Image source={{uri: item.image_url}} resizeMode={'contain'} style={styles.image} />
                <View>
                    <Text style={styles.itemPrice}>{item.price.toFixed(2)}₽</Text>
                    <View style={{justifyContent: 'space-between', flex: 1}} >
                        <Text style={styles.itemText}>{item.title}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                            <Text>{item.flag}</Text> 
                            <Text style={styles.itemFlag}>{item.country}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.secondLine}> 
                <TouchableWithoutFeedback onPress={() => removeAll(item)}>
                    <Image source={trash} style={styles.trash} resizeMode={'contain'} />
                </TouchableWithoutFeedback>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.itemPrice}>{item.count} шт.</Text>
                    <View style={{width: 25, height: 30, justifyContent: 'space-around'}}>
                        <TouchableOpacity onPress={() => add(item)}>
                            <Image source={up} style={styles.arrow} resizeMode={'contain'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => remove(item)}>
                            <Image source={down} style={styles.arrow} resizeMode={'contain'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const CartScreen = () => {
    const cart = useSelector(state => state.cart);
    const prices = useSelector(state => state.prices);
    const dispath = useDispatch();
    const token = useSelector(state => state.token);
    const navigation = useNavigation();

    const setCart = (json) => {
        dispath(loadCart(json.items));
        dispath(setPrice(json.products_cost, json.delivery_cost));
    }

    useEffect(() => {
        send('api/cart/getcart', 'POST', {}, setCart, token);
    }, []);

    const round = (x) => {
        return Math.ceil((Number(x))*100) / 100;
    }

    const list = cart.items.map((item) => {
        return (
            <CartItem item={item} />
        );
    });

    return (
        <View style={{flex: 1}}>
            <StatusBar style="dark" />
            <View style={styles.barContainer}>
                <Text style={styles.barText}>Корзина</Text>
            </View>
            <ScrollView>
                {list}
            </ScrollView>
            <View style={styles.bill}>
                <View>
                    <Text style={styles.text}>Стоимость товаров</Text>
                    <Text style={styles.text}>Стоимость доставки</Text>
                    <Text style={styles.textBold}>Общая стоимость</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBold}>{round(prices.price)}₽</Text>
                    <Text style={styles.textBold}>{round(prices.delivery)}₽</Text>
                    <Text style={styles.textBold}>{round(prices.price) + round(prices.delivery)}₽</Text>
                </View>
            </View>
            <View style={{alignItems: "center", width: '100%', marginBottom: 20}}>
                <TouchableOpacity style={styles.phoneButton} onPress={() => {navigation.navigate('Payment')}}>
                    <Text style={styles.phoneText}>Оформить заказ</Text>
                </TouchableOpacity>
            </View>
            <NavigationBar navigation={navigation} routeName="Cart"/>
        </View>
    );
};

const styles = StyleSheet.create({
    barContainer: {
        width: '100%',
        paddingLeft: 30,
        paddingTop: Constants.statusBarHeight,
    },
    barText: {
        fontWeight: "bold",
        fontSize: 20,
        marginTop: 20,
        marginBottom: 15
    },
    firstLine: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: "#fff",
        paddingVertical: 10
    },
    secondLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: "#fff",
        padding: 10,
        marginTop: 2,
        marginBottom: 10
    },
    image: {
        width: 120,
        height: 120,
    },
    trash: {
        height: 30,
        width: 30
    },
    arrow: {
        width: 20,
        height: 10
    },
    itemText: {
        fontSize: 14,
        marginVertical: 5,
        maxWidth: '50%'
    },
    itemFlag: {
        color: '#97999d',
        fontSize: 12,
        fontFamily: 'Tahoma-Regular',
        marginLeft: 5
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingRight: 10
    },
    text: {
        fontSize: 14,
        fontFamily: 'Tahoma-Regular',
        paddingVertical: 5
    },
    textBold: {
        fontSize: 14,
        fontFamily: 'Tahoma-Regular',
        paddingVertical: 5,
        fontWeight: 'bold',
    },
    bill: { 
        justifyContent: 'space-between', 
        flexDirection: 'row', 
        padding: 10
    },
    phoneButton: {
		backgroundColor: '#f08741',
		textAlign: 'center',
		paddingVertical: 10,
		marginHorizontal: 5,
		borderRadius: 7,
		width: '75%',
		alignItems: 'center'
	},
	phoneText: {
		fontFamily: 'Tahoma-Regular', 
        fontSize: 18,
        color: 'white'
	},
});

export default CartScreen;