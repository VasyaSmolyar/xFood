import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import send from './utils/net';
import { addItem, removeItem, loadCart, removeAllItem, setPrice } from './utils/store';
import NavigationBar from './components/NavigationBar';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import trash from './files/trash.png';
import up from './files/up.png';
import down from './files/down.png';

const CartItem = (props) => {
    let item = props.item.item;
    item.count = props.item.count;
    const dispath = useDispatch();
    const token = useSelector(state => state.token);

    const getPrice = () => {
        send('api/cart/getcart', 'POST', {}, (json) => {
            const other = json.reverse()[0];
            dispath(setPrice(other.products_cost, other.delivery_cost));
        }, token);
    }

    const add = (item) => {
        dispath(addItem(item));
        send('api/cart/addtocart', 'POST', {"product.id": item.id, num: 1}, () => {}, token);
        getPrice();
    }

    const remove = (item) => {
        dispath(removeItem(item));
        send('api/cart/deletefromcart', 'POST', {"product.id": item.id, num: 1}, () => {}, token);
        getPrice();
    }

    const removeAll = (item) => {
        dispath(removeAllItem(item));
        send('api/cart/deletefromcart', 'POST', {"product.id": item.id, num: item.count}, () => {}, token);
        getPrice();
    }

    return (
        <View>
            <View style={styles.firstLine}>
                <View></View>
                <Image source={{uri: item.image_url}} resizeMode={'contain'} style={styles.image} />
                <View>
                    <Text style={styles.itemPrice}>{item.price}₽</Text>
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
                <TouchableWithoutFeedback onPress={() => {removeAll(item)}}>
                    <Image source={trash} style={styles.trash} resizeMode={'contain'} />
                </TouchableWithoutFeedback>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.itemPrice}>{props.item.count} шт.</Text>
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
        const cart = json.filter((item) => (item.id !== undefined)).map((item) => {
            return {item: {...item.product[0]}, count: item.num};
        });
        dispath(loadCart(cart));
        const other = json.reverse()[0];
        dispath(setPrice(other.products_cost, other.delivery_cost));
    }

    useEffect(() => {
        send('api/cart/getcart', 'POST', {}, setCart, token);
    }, []);

    return (
        <View style={{flex: 1}}>
            <View style={styles.barContainer}>
                <Text style={styles.barText}>Корзина</Text>
            </View>
            <FlatList keyExtractor={(item, index) => item.item.id.toString()} data={cart.items} extraData={cart} renderItem={(item) => 
                <CartItem item={item.item} />} 
            />
            <View style={styles.bill}>
                <View>
                    <Text style={styles.text}>Стоимость товаров</Text>
                    <Text style={styles.text}>Стоимость доставки</Text>
                    <Text style={styles.textBold}>Общая стоимость</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.textBold}>{prices.price}₽</Text>
                    <Text style={styles.textBold}>{prices.delivery}₽</Text>
                    <Text style={styles.textBold}>{prices.price + prices.delivery}₽</Text>
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
        backgroundColor: 'black',
        padding: 5,
        marginBottom: 10,
        marginTop: Constants.statusBarHeight,
        alignItems: 'center'
    },
    barText: {
        color: "#f1c40f",
        fontWeight: "bold",
        fontSize: 16,
        marginVertical: 20
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
		backgroundColor: '#f1c40f',
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
	},
});

export default CartScreen;