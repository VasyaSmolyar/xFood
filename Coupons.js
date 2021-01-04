import React, { useState, useEffect } from 'react';
import NavigationBar from './components/NavigationBar';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, Clipboard } from 'react-native';
import send from './utils/net';
import ModalCoupon from './components/ModalCoupon';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import arrow from './files/blackArrow.png';
import percent from './files/percent.png';
import { s, vs, ms, mvs } from 'react-native-size-matters';
import Toast, {DURATION} from 'react-native-easy-toast';

function Coupon({item, onPress}) {
    return (
        <View style={styles.couponView}>
            <Text style={styles.couponTime}>Действителен до {item.date_expire}</Text>
            <Text style={styles.couponTitle}>{item.title}</Text>
            <Text style={styles.couponDesc}>{item.description}</Text>
            <TouchableOpacity style={styles.couponButton} onPress={onPress}>
                <Text style={styles.buttonText}>Показать акцию</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function CouponScreen({navigation}) {
    const token = useSelector(state => state.token);
    const route = useRoute();
    const coupon = (route.params !== undefined) && (route.params.coupon !== undefined) ? route.params.coupon : null;
    let toast = null;

    const [list, setList] = useState([]);
    const [modal, setModal] = useState(coupon !== null);
    const [chosen, setChosen] = useState(coupon);

    useEffect(() => {
        send('api/coupons/getbyuser', 'POST', {}, (json) => {
            setList(json);
		}, token);
    }, []);

    const choose = (item) => {
        setModal(true);
        setChosen(item);
    };

    const load = (text) => {
        setModal(false);
        console.log(text);
        Clipboard.setString(text);
        toast.show('Скопировано!');
    }

    const data = list.map((item) => {
        return <Coupon item={item} onPress={() => choose(item)} key={item.coupon} />
    });

    let block = (
        <ScrollView>
            {data}
        </ScrollView>
    );

    if(list.length === 0) {
        block = ( 
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                <Image source={percent} style={{width: 75, height: 75, marginBottom: 20}} resizeMode='contain' />
                <Text style={styles.noText}>У вас нет купонов</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Toast ref={(t) => toast = t}/>
            <StatusBar style="dark" />
            <ModalCoupon visible={modal} item={chosen} onClose={load}/>
            <View style={styles.barContainer}>
                <View style={styles.barCell}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={arrow} style={{width: s(35), height: vs(18)}} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <View style={styles.barCell}>
                    <Text style={styles.barText}>Купоны</Text>
                </View>
            </View>
            {block}
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
        paddingVertical: 15
    },
    buttonText: {
        fontFamily: 'Tahoma-Regular',
        color: 'white',
        fontSize: 16
    },
    noText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 18,
        color: '#898b8e',
        textAlign: 'center'
    }
});