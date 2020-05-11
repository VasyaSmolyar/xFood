import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import send from './utils/net';
import { addItem, removeItem, getCart } from './utils/store';

const CartItem = (props) => {
    const item = props.item.item;
    const dispath = useDispatch();
    return (
        <View>
            <Text>{item.title}</Text>
            <Button title="+" onPress={() => dispath(addItem(item))} />
            <Text>{props.item.count}</Text>
            <Button title="-" onPress={() => dispath(removeItem(item))} />
        </View>
    );
}

const CartScreen = () => {
    const cart = useSelector(state => state.cart);

    return (
        <View>
            <FlatList keyExtractor={(item, index) => item.item.id.toString()} data={cart.items} extraData={cart} renderItem={(item) => 
                <CartItem item={item.item} />} 
            />
        </View>
    );
};

export default CartScreen;