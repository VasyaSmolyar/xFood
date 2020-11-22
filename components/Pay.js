import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import Tinkoff from 'react-tinkoff-pay';
import * as WebBrowser from 'expo-web-browser';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function Pay() {
    const [url, setUrl] = useState("");
    /*
    useEffect(() => {
        fetch('https://securepay.tinkoff.ru/v2/Init', {
            method: 'POST',
            body: JSON.stringify({
                Amount: 20000,
                Description: "",
                Frame: true,
                OrderId: 1001,
                TerminalKey: 1602852170629,
                DATA: {
                    connection_type: "Widget2.0",
                    Email: "name@site.ru",
                    Phone: "+72378329793",
                    Name: "Iban"
                },
                Language:"ru"
            })
        }).then((res) => {
            console.log(res.bodyUsed);
            res.json((json) => {
                setUrl(json.PaymentURL);
            }).catch((err) => {
                // handle error for example
                console.error(err);
            });;
        }).catch((err) => {
            // handle error for example
            console.error(err);
          });;
    }, []);
    */

    useEffect(() => {
        Tinkoff.Link({	
            terminalkey: '1602852170629',
            language: 'ru',
            amount: '200',
            order: '1488228',
            description: '',
            name: 'Георгий Алексеевич',
            email: 'JsusDev@yandex.ru',
            phone: '79055594564' ,
            frame: 'true'
        }, link => {
            console.log(link); // => https://securepay.tinkoff.ru/xo7L8v
            setUrl(link);
            //WebBrowser.openBrowserAsync(link);
        });
    }, []);

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
            style={{ width: width, height: height, marginTop: Constants.statusBarHeight }} />
        </View>
    )
}