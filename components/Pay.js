import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import Tinkoff from 'react-tinkoff-pay';
import send from '../utils/net';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function Pay({navigation}) {
    const [url, setUrl] = useState("");
    const token = useSelector(state => state.token);

    const route = useRoute();
    const order_id = route.params.order_id;
    const summ = route.params.summ;
    console.log("Ssuum: ", summ);

    useEffect(() => {
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
    }, []);

    const onSuccess = (event) => {
        console.log(event.nativeEvent.data);
        if(event.nativeEvent.data === true)
            navigation.navigate('Catalog');
    };

    return (
        <View style={{flex: 1}}>
            <WebView source={{uri: url, headers: {
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
            onMessage={onSuccess} />
        </View>
    )
}