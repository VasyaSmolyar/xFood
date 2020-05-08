import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import send from './utils/net'
import { startAsync } from 'expo/build/AR';

const CartScreen = () => {
    const cart = useSelector(state => state.cart.items);
    return (
        <View>
            <FlatList keyExtractor={(item, index) => item.item.id.toString()} data={cart} renderItem={(item) => <Text>{item.item.item.title} </Text>} />
        </View>
    );
};

export default CartScreen;