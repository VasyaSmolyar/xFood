import React, { useState, useEffect } from 'react';
import NavigationBar from './components/NavigationBar';
import send from './utils/net';
import { useSelector } from 'react-redux';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import repeat from './files/repeat.png';

function OrderItem(props) {
    return (
        <View>
            <View>
                <Text></Text>
                <Text></Text>
            </View>
            <Text></Text>
        </View>
    );
}

function Order(props) {
    const item = props.item;

    const getData = (str) => {
        const date = Date.parse(str);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return date.toLocaleString("ru", options);
    }

    const getColor = (status) => {
        switch(status) {
            default:
                return '#bec1c5'
        }
    }

    const pad = (num) => {
        const size = String(num).length;
        return ('0000000000000' + num).substr(-size);
    }
    
    return (
        <View style={styles.orderContainer}>
            <View style={styles.orderTop}>
                <View>
                    <Text style={styles.orderTitle}>Заказ {getData(item.date)}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.orderCost}>{pad(item.id)}</Text>
                        <View style={styles.orderDel}></View>
                        <Text style={styles.orderCost}>{item.summ + item.delivery_summ} ₽</Text>
                    </View>
                </View>
                <View>
                    <View style={[styles.orderStatus, {backgroundColor: getColor(item.status)}]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.buttons}>
                <TouchableOpacity style={styles.orderButton}>
                    <Text style={styles.buttonText}>Подробнее</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.repeatButton}>
                    <Image source={repeat} style={{width: 25, height: 25}} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function OrderListScreen({navigation}) {
    const token = useSelector(state => state.token);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        send('api/order/get', 'POST', {status: 'ALL'}, (json) => {
            setOrders(json);
        }, token);
    }, []);

    const data = orders.map((item, id) => {
        return (
            <Order key={id} item={item} />
        )
    });

    return (
        <View style={styles.container}>
            <View style={styles.barContainer}>
                <Text style={styles.barText}>Личный кабинет</Text>
            </View>
            <ScrollView>
                {data}
            </ScrollView>
            <NavigationBar navigation={navigation} routeName="OrderList" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f3f6',
        width: '100%'
    },
    barContainer: {
        width: '100%',
        backgroundColor: 'black',
        padding: 5,
        marginTop: Constants.statusBarHeight,
        alignItems: 'center'
    },
    barText: {
        color: "#f1c40f",
        fontWeight: "bold",
        fontSize: 16,
        marginVertical: 20
    },
    orderContainer: {
        backgroundColor: '#fff',
        borderColor: 10,
        padding: 15,
        paddingHorizontal: 20,
        margin: 10,
        marginBottom: 5,
        borderRadius: 15
    },
    orderTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    orderTitle: {
        fontFamily: 'Tahoma-Regular',
        fontWeight: 'bold',
        fontSize: 18
    },
    orderCost: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 12,
        color: '#979ca2'
    },
    orderDel: {
        width: 6,
        height: 6,
        backgroundColor: '#979ca2',
        borderRadius: 10,
        marginHorizontal: 5
    },
    orderStatus: {
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    statusText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 12,
        color: 'white',
        textTransform: 'uppercase'
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    orderButton: {
        borderRadius: 5,
        width: '80%',
        alignItems: "center",
        backgroundColor: '#f1c40f',
        paddingVertical: 10,
        justifyContent: "center"
    },
    repeatButton: {
        borderRadius: 5,
        width: '15%',
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: '#f1c40f',
    },
    buttonText: {
        fontFamily: 'Tahoma-Regular',
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white'
    }
});