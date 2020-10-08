import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import send from './utils/net';
import useCart from './utils/cartHook';

export default function CartScreen({navigation}) {
    const token = useSelector(state => state.token);
    const {cart, addItem, removeItem, removeAll, loadCart} = useCart([], token);

    useEffect(() => {
        send('api/cart/getcart', 'POST', {}, () => {
            const cart = json.items.map((item) => {
                return {item: {...item.product}, count: item.num};
            });
            loadCart(cart);
        }, token);
    }, []);

    const cartData = cart.map((item) => {
        return (
            <View>
                <Image />
                <View>
                    <Text></Text>
                    <Text></Text>
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
        <View>
            <View>
                <View>
                    <Text>Корзина</Text>
                    <Text>Макдональдс</Text>
                </View>
                <View>
                    <View>
                        <Image />
                        <Text>Приборы</Text>
                    </View>
                    <View>
                        <TouchableOpacity>
                            <Text>+</Text>
                        </TouchableOpacity>
                        <Text>1</Text>
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

});