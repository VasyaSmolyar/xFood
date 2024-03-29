import React, { useState, useEffect } from 'react';
import NavigationBar from './components/NavigationBar';
import send from './utils/net';
import { useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ModalOrder from './components/Order';
import repeat from './files/repeat.png';
import arrow from './files/blackArrow.png';
import { s, vs, ms, mvs } from 'react-native-size-matters';

function OrderItem({item, num}) {
    return (
        <View style={styles.productString}>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.productText} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.productNum}>x{num}</Text>
            </View>
            <Text style={styles.productPrice}>{item.price} ₽</Text>
        </View>
    );
}

function Order({item, onChoice}) {
    const getColor = (str) => {
        const status = str.trim().toUpperCase();
        switch(status) {
            case "FINDING":
                return '#00c761'
            case "PERFORMING":
                return '#fc9e15'
            case "DONE":
                return '#bec2c7'
            case "CANCELED":
                return '#ee361d'
            default:
                return '#bec2c7'
        }
    }

    const pad = (num) => {
        const size = String(num).length;
        return '0000000000000'.substr(size) + num;
    }

    const data = item.products[0].map((line, id) => {
        return (
            <OrderItem key={id} item={line.product} num={line.num} />
        )
    });
    
    return (
        <View style={styles.orderContainer}>
            <View style={styles.orderTop}>
                <View>
                    <Text style={styles.orderTitle}>Заказ {item.date}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.orderCost}>{pad(item.id)}</Text>
                        <View style={styles.orderDel}></View>
                        <Text style={styles.orderCost}>{(item.summ + item.delivery_summ).toFixed(2)} ₽</Text>
                    </View>
                </View>
                <View>
                    <View style={[styles.orderStatus, {backgroundColor: getColor(item.status)}]}>
                        <Text style={styles.statusText}>{item.status_ru}</Text>
                    </View>
                </View>
            </View>
            <ScrollView style={{paddingBottom: 5}}>
                {data}
            </ScrollView>
            <View style={styles.buttons}>
                <TouchableOpacity style={styles.orderButton} onPress={() => onChoice(item)}>
                    <Text style={styles.buttonText}>Подробнее</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function OrderListScreen({navigation}) {
    const token = useSelector(state => state.token);
    const [orders, setOrders] = useState([]);
    const [current, setCurrent] = useState(null);
    const route = useRoute();

    useEffect(() => {
        send('api/order/get', 'POST', {status: 'ALL'}, (json) => {
            setOrders(json);
        }, token);
        if(route.params !== undefined && route.params.order !== undefined) {
            setCurrent(route.params.order);
        }
    }, []);

    const data = orders.map((item, id) => {
        return (
            <Order key={id} item={item} onChoice={setCurrent} />
        )
    });

    const toChat = () => {
        setCurrent(null);
        navigation.navigate("Chat")
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.barContainer}>
                <View style={styles.barCell}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={arrow} style={{width: s(35), height: vs(18)}} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <View style={styles.barCell}>
                    <Text style={styles.barText}>Мои заказы</Text>
                </View>
                <View style={styles.barCell}>
                </View>
            </View>
            <ModalOrder visible={current !== null} item={current} onExit={() => setCurrent(null)} onChat={toChat} />
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
        backgroundColor: '#fff',
        padding: 5,
        paddingLeft: 25,
        paddingTop: Constants.statusBarHeight,
        flexDirection: 'row',
        borderBottomColor: '#f2f3f5',
        borderBottomWidth: 3
    },
    barCell: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 30
    },
    barText: {
        fontWeight: "bold",
        fontSize: 20,
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
        fontSize: 15,
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
        width: '100%',
        alignItems: "center",
        backgroundColor: '#f08741',
        paddingVertical: 10,
        justifyContent: "center"
    },
    repeatButton: {
        borderRadius: 5,
        width: '15%',
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: '#f08741',
    },
    buttonText: {
        fontFamily: 'Tahoma-Regular',
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white'
    },
    productString: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 5
    },
    productText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 14,
        width: '75%',
        marginRight: 10,
    },
    productPrice: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 13,
    },
    productNum: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 12,
        color: '#bec1c5'
    }
});