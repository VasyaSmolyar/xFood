import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback, Text} from 'react-native';
import shop from '../files/gray4.png';
import backet from '../files/gray3.png';
import catalog from '../files/gray1.png';
import male from '../files/gray2.png';
import yshop from '../files/2_yellow.png';
import ycatalog from '../files/4_yellow.png';
import ybacket from '../files/3_yellow.png';
import ymale from '../files/4_yellow.png';

export default function SearchBar(props) {
    const navigation = props.navigation;
    return (
        <View style={styles.barContainer}>
            <TouchableWithoutFeedback onPress={() => {navigation.navigate('Catalog')}}>
                <View style={styles.touch}>
                    <Image source={shop}  style={styles.image} />
                    <Text style={styles.text}>Главная</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => {navigation.navigate('Catalog')}}>
                <View style={styles.touch}>
                    <Image source={props.routeName === 'Catalog' ? ycatalog : catalog}  style={styles.image} />
                    <Text style={props.routeName === 'Catalog' ? styles.ytext : styles.text}>Каталог</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => {navigation.navigate('Cart')}}>
                <View style={styles.touch}>
                    <Image source={props.routeName === 'Cart' ? ybacket : backet}  style={styles.image} />
                    <Text style={props.routeName === 'Cart' ? styles.ytext : styles.text}>Корзина</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => {navigation.navigate('Catalog')}}>
                <View style={styles.touch}>
                    <Image source={male}  style={styles.image} />
                    <Text style={styles.text}>Кабинет</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    barContainer: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: 'black',
        padding: 10,
        paddingBottom: 20,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    touch: {
        justifyContent: 'center'
    },
    image: {
        width: 50,
        height: 50
    },
    text: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 10,
        color: '#989898',
        marginTop: 5,
        textAlign: 'center'
    },
    ytext: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 10,
        color: '#f1c40f',
        marginTop: 5,
        textAlign: 'center'
    }
});