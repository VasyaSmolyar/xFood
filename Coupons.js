import React, { useState, useEffect } from 'react';
import NavigationBar from './components/NavigationBar';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import send from './utils/net';
import { useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';

function Coupon(props) {
    const { item } = props;

    return (
        <View style={styles.couponView}>
            <Text style={styles.couponTime}>Действителен до {item.date_expire}</Text>
            <Text style={styles.couponTitle}>Скидка на доставку {item.discount_amount}%</Text>
            <Text style={styles.couponDesc}>{item.description}</Text>
            <TouchableOpacity style={styles.couponButton}>
                <Text style={styles.buttonText}>Показать акцию</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function CouponScreen({navigation}) {
    const token = useSelector(state => state.token);
    const [list, setList] = useState([]);

    useEffect(() => {
        send('api/coupons/getbyuser', 'POST', {}, (json) => {
            setList(json);
		}, token);
    }, []);

    const data = list.map((item) => {
        return <Coupon item={item} />
    });

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.barContainer}>
                <Text style={styles.barText}>Купоны</Text>
            </View>
            <ScrollView>
                {data}
            </ScrollView>
            <NavigationBar navigation={navigation} routeName="Cabinet"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fbfafa',
        width: '100%',
    },
    barContainer: {
        width: '100%',
        padding: 5,
        paddingLeft: 30,
        paddingTop: Constants.statusBarHeight,
        borderBottomColor: '#ede9e9',
        borderBottomWidth: 1
    },
    barText: {
        fontWeight: "bold",
        fontSize: 20,
        marginTop: 20,
        marginBottom: 15
    },
    couponView: {
        padding: 15,
        marginHorizontal: 25,
        marginVertical: 10,
        backgroundColor: "#fff"
    },
    couponTime: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 12,
        color: '#aaa',
        marginBottom: 5
    },
    couponTitle: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 20,
        color: '#f08843',
        marginBottom: 15
    },
    couponDesc: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 14,
        color: 'black',
        marginBottom: 15
    },
    couponButton: {
        backgroundColor: '#f08843',
        alignItems: 'center',
        width: '100%',
        borderRadius: 15,
        paddingVertical: 10
    },
    buttonText: {
        fontFamily: 'Tahoma-Regular',
        color: 'white',
        fontSize: 16
    }
});