import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import send from '../utils/net';
import { useSelector } from 'react-redux';
import ScalableText from 'react-native-text';
import { useNavigation } from '@react-navigation/native';
import { s, vs, ms, mvs } from 'react-native-size-matters';


export default function ModalStatus() {
    const [order, setOrder] = useState(null);
    const token = useSelector(state => state.token);
    const navigation = useNavigation();

    let statusText = null;

    const check = () => {
        send('api/order/get', 'POST', {status: 'ALL'}, (json) => {
            const orders = json.filter((order) => {
                return  [ 'COOKING', 'TORESTAURANT', 'PERFORMING', 'FINDING', 'WAITCOUR', 'WAITREST' ].indexOf(order.status) !== -1;
            });
            if(orders.length !== 0) {
                setOrder(orders[0]);
            } else {
                setOrder(null);
            }
        }, token);
    }

    useEffect(() => {
        check();
        const timer = setInterval(check, 1000);
        return () => clearInterval(timer);
    }, []);

    if(order === null) {
        return <View></View>;
    }

    if (order.cooking_t) {
        statusText = <ScalableText style={styles.timeText}>{'Приготовим в ' + order.cooking_t}</ScalableText>;
    } else if(order.delivery_time) {
        statusText = <ScalableText style={styles.timeText}>{'Доставим в ' + order.delivery_time}</ScalableText>;
    } else {
        statusText = <ScalableText style={styles.timeText}> </ScalableText>;
    }

    return (
        <View style={styles.backContainer}>
            <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('OrderList', {order: order})}>
                <ScalableText style={styles.statusText}>{order.status_ru}</ScalableText>
                {statusText}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: ms(15),
        borderRadius: 15,
        backgroundColor: '#323131',
    },
    backContainer: {
        position: 'absolute',
        bottom: 0,
        zIndex: 10,
        width: '100%',
        paddingHorizontal: ms(10),
        marginBottom: ms(80),
    },
    statusText: {
        fontFamily: 'Tahoma-Regular',
        fontWeight: 'bold',
        fontSize: 14,
        color: '#fff'
    },
    timeText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 14,
        color: '#fff'
    }
});