import React, { useEffect, useState } from 'react';
import { View, Dimensions, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import Tinkoff from 'react-tinkoff-pay';
import cancel from '../files/payCancel.png';
import send from '../utils/net';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function Pay({navigation}) {
    const [url, setUrl] = useState("");
    const token = useSelector(state => state.token);
    const [imp, setImp] = useState(null);

    const route = useRoute();
    const order_id = route.params.order_id;
    const summ = route.params.summ;
    console.log("Ssuum: ", summ);

    const makePay = () => {
        send('api/user/get', 'POST', {}, (json) => {
            Tinkoff.Link({	
                terminalkey: '1602852170629DEMO',
                language: 'ru',
                amount: summ.toString(),
                order: order_id.toString(),
                description: '',
                name: json.first_name,
                email: json.email,
                phone: json.phone,
                frame: 'true'
            }, link => {
                console.log(link); // => https://securepay.tinkoff.ru/xo7L8v
                setUrl(link);
            });
		}, token);
    }

    const Fail = () => {
        return (
            <View style={styles.container}>
                <Image source={cancel} style={{width: 100, height: 100}} resizeMode='contain' />
                <Text style={styles.payText}>Оплата не успешна</Text>
                <TouchableOpacity style={styles.payBut} onPress={makePay}>
                    <Text style={styles.butText}>Попробовать снова</Text>
                </TouchableOpacity>
            </View>
        )
    }

    useEffect(() => {
        setImp(null);
        makePay();
    }, []);

    const onSuccess = (event) => {
        console.log(event.nativeEvent.data);
        if(event.nativeEvent.data === "true") {
            navigation.navigate('Catalog');
        } else {
            setImp(<Fail />);
        }
    };

    return (
        <View style={{flex: 1}}>
            {imp ? imp : <WebView source={{uri: url, headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                "Accept-Encoding": 'gzip, deflate, br',
                "Accept-Language": 'ru-RU,ru;q=0.9',
                'Connection': 'keep-alive',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1'
            }}}
            sharedCookiesEnabled={true} 
            userAgent='Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19'
            style={{ width: width, height: height, marginTop: Constants.statusBarHeight }} 
            onMessage={onSuccess} /> }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    payText: {
        marginBottom: 30,
        marginTop: 20,
        fontFamily: 'Tahoma-Regular',
        fontSize: 25,
        textAlign: 'center'
    },
    payBut: {
        backgroundColor: '#f08741',
		paddingVertical: 10,
		marginHorizontal: 5,
		borderRadius: 7,
		width: '75%',
		alignItems: 'center'
    },
    butText: {
        fontFamily: 'Tahoma-Regular', 
		fontSize: 20, 
		color: 'white'
    }
});