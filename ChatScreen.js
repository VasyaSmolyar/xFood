import React from 'react';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import oback from './files/oback.png';
import slogo from './files/slogo.png';
import write from './files/write.png';

function Message({item}) {
    const style = item.author === 'USER' ? styles.userContainer : styles.supportContainer;
    
    return (
        <View style={style}>
            <Text style={styles.innerText}>{item.text}</Text>
        </View>
    )
}

export default function ChatScreen({navigation}) {

    const mesList = [
        {
            text: `Здравствуйте! Сегодня 08.09.2020 мой 
            заказ 00029987 был доставлен с 
            опозданием в 30 минут. И ещё в ресторане 
            забыли положить соус.`,
            author: 'USER'
        },
        {
            text: `Здравствуйте! Сегодня 08.09.2020 мой 
            заказ 00029987 был доставлен с 
            опозданием в 30 минут. И ещё в ресторане 
            забыли положить соус.`,
            author: 'SUPPORT'
        }
    ];

    const data = mesList.map((item) => {
        return <Message item={item} />
    });

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.barContainer}>
                <View style={styles.barCell}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={oback} style={{width: 50, height: 25}} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <View style={styles.barCell}>
                    <Image source={slogo} style={{width: 50, height: 50, marginRight: 20}} resizeMode='contain' />
                    <View style={{justifyContent: 'space-around'}}>
                        <Text style={styles.barText}>Поддержка xFood</Text>
                        <Text style={styles.barSmall}>В сети</Text>
                    </View>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.contentStyle}>
                {data}
            </ScrollView>
            <View style={styles.bottomContainer}>
                <TextInput style={styles.mesText} placeholder='Сообщение...' multiline={true} />
                <TouchableOpacity>
                    <Image source={write} style={{width: 40, height: 40}} resizeMode='contain' />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        height: '100%'
    },
    barContainer: {
        backgroundColor: '#fff',
        padding: 5,
        paddingLeft: 25,
        paddingTop: Constants.statusBarHeight + 20,
        flexDirection: 'row',
        borderBottomColor: '#f2f3f5',
        borderBottomWidth: 1,
        paddingVertical: 20
    },
    barCell: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 30,
        flexDirection: 'row'
    },
    barText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 18,
    },
    barSmall: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 16,
        color: '#b6b6b6',
    },
    mesText: {
        fontSize: 16,
        fontFamily: 'Tahoma-Regular',
        width: '70%'
    },
    contentStyle: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 25,
        paddingBottom: 15
    },    
    userContainer: {
        marginVertical: 10,
        borderRadius: 20,
        backgroundColor: '#f8c5a3',
        alignSelf: 'flex-end',
        width: '80%'
    },
    supportContainer: {
        marginVertical: 10,
        borderRadius: 20,
        backgroundColor: '#ecedf1',
        width: '80%'
    },
    innerText: {
        fontSize: 14,
        fontFamily: 'Tahoma-Regular',
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderTopColor: '#f2f3f5',
        borderTopWidth: 1,
    }
});