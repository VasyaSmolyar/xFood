import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Keyboard } from 'react-native';
import { Dimensions } from 'react-native';
import send from './utils/net';
import { useSelector } from 'react-redux';
import back from './files/blackArrow.png';
import slogo from './files/slogo.png';
import write from './files/write.png';
import { s, vs, ms, mvs } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ScalableText from 'react-native-text';


function Message({item}) {
    const style = item.author === 'USER' ? styles.userContainer : styles.supportContainer;
    
    return (
        <View style={style}>
            <ScalableText style={styles.innerText}>{item.text}</ScalableText>
        </View>
    )
}

export default function ChatScreen({navigation}) {
    const token = useSelector(state => state.token);
    const [ mesList, setMesList ] = useState([]);
    const [ value, setValue ] = useState('');

    const getRefresh = () => {
        send('api/messages/get', 'POST', {offset: 0, num: 20}, (json) => {
            setMesList(json.sort((a, b) => {
                return Date.parse(a.time) - Date.parse(b.time);
            }));
        }, token);
    }

    useEffect(() => {
        getRefresh();
        let timer = setInterval(getRefresh, 1000);
        return () => clearInterval(timer);
    }, []);

    const onSend = () => {
        Keyboard.dismiss();
        send('api/message/send', 'POST', {text: value}, () => {
            getRefresh();
        }, token);
        setValue('');
    }

    const data = mesList.map((item) => {
        return <Message item={item} />
    });

    return (
        <KeyboardAwareScrollView  contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.barContainer}>
                <View style={styles.barCell}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={back} style={{width: s(35), height: vs(18)}} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <View style={styles.barCell}>
                    <Image source={slogo} style={{width: s(40), height: vs(40), marginRight: ms(20)}} resizeMode='contain' />
                    <View style={{justifyContent: 'space-around'}}>
                        <ScalableText style={styles.barText}>Поддержка xFood</ScalableText>
                        <ScalableText style={styles.barSmall}>В сети</ScalableText>
                    </View>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.contentStyle}>
                {data}
            </ScrollView>
            <View style={styles.bottomContainer}>
                <TextInput style={styles.mesText} placeholder='Сообщение...' multiline={true} 
                value={value} onChangeText={(scalabletext) => setValue(scalabletext)} />
                <TouchableOpacity onPress={onSend}>
                    <Image source={write} style={{width: s(30), height: vs(30)}} resizeMode='contain' />
                </TouchableOpacity>
            </View>
        </View>
       </KeyboardAwareScrollView>
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
        fontSize: 16,
    },
    barSmall: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 14,
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
        borderRadius: 10,
        backgroundColor: '#f8c5a3',
        alignSelf: 'flex-end',
        width: '80%'
    },
    supportContainer: {
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: '#ecedf1',
        width: '80%'
    },
    innerText: {
        fontSize: 13,
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