import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import send from './utils/net';
import useCart from './utils/cartHook';
import dinner from './files/dinner.png';

export default function CartScreen({navigation}) {
    const token = useSelector(state => state.token);
    const {cart, addItem, removeItem, removeAll, loadCart} = useCart([], token);

    useEffect(() => {
        send('api/cart/getcart', 'POST', {}, () => {
            const cart = json.items;
            loadCart(cart);
        }, token);
    }, []);

    const cartData = cart.map((item) => {
        return (
            <View>
                <Image source={{uri: item.image_url}} />
                <View>
                    <Text>{item.title}</Text>
                    <Text>{item.price} ₽</Text>
                </View>
                <View>
                    <TouchableOpacity>
                        <Text>+</Text>
                    </TouchableOpacity>
                    <Text>1</Text>
                    <TouchableOpacity>
                        <Text>-</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    });

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Корзина</Text>
                    <Text style={styles.secondHeader}>Макдональдс</Text>
                </View>
                <View style={styles.deviceContainer}>
                    <View style={styles.leftContainer}>
                        <Image source={dinner} style={{width: 50, height: 50}} resizeMode='contain' />
                        <Text stytle={styles.titleText}>Приборы</Text>
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
                <Text>К заказу</Text>
                <ScrollView>

                </ScrollView>
            </View>
            <ScrollView>
                {cartData}
            </ScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    headerContainer: {
        width: '100%', 
    },
    header: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
        paddingVertical: 10
    },
    secondHeader: {
        color: '#989898',
        fontFamily: 'Tahoma-Regular',
        fontSize: 18,
        marginLeft: 10,
        paddingBottom: 5
    },
    titleText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 16,
    },
    deviceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 20
    },
    lowButton: {
        padding: 20,
        backgroundColor: '#d6dbe0',
        borderRadius: 15
    },
    lowText: {
        fontWeight: 'bold',
        fontSize: 26,
    },
    lowNum: {
        fontSize: 27,
        fontFamily: 'Tahoma-Regular',
        marginLeft: 15
    }
});