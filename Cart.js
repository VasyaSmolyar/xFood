import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import send from './utils/net';
import { addItem, removeItem, loadCart } from './utils/store';

const CartItem = (props) => {
    const item = props.item.item;
    const dispath = useDispatch();
    const token = useSelector(state => state.token.value);

    const add = (item) => {
        dispath(addItem(item));
        send('api/cart/addtocart', 'POST', {"product.id": item.id, num: 1}, () => {}, token);
    }

    const remove = (item) => {
        dispath(removeItem(item));
        send('api/cart/deletefromcart', 'POST', {"product.id": item.id, num: 1}, () => {}, token);
    }

    return (
        <View>
            <Text>{item.title}</Text>
            <Button title="+" onPress={() => add(item)} />
            <Text>{props.item.count}</Text>
            <Button title="-" onPress={() => remove(item)} />
        </View>
    );
}

const CartScreen = () => {
    const cart = useSelector(state => state.cart);
    const dispath = useDispatch();
    const token = useSelector(state => state.token.value);

    const setCart = (json) => {
        const cart = json.map((item) => {
            return {item: {...item.product[0]}, count: item.num};
        });
        dispath(loadCart(cart));
    }

    useEffect(() => {
        console.log("Called by once");
        send('api/cart/getcart', 'POST', {}, setCart, token);
    }, []);

    return (
        <View>
            <FlatList keyExtractor={(item, index) => item.item.id.toString()} data={cart.items} extraData={cart} renderItem={(item) => 
                <CartItem item={item.item} />} 
            />
        </View>
    );
};

export default CartScreen;