import React from 'react';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import arrow from './files/blackArrow.png';
import xFood from './files/xFood.png';

export default function AboutScreen({navigation}) {
    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.barContainer}>
                <View style={styles.barCell}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={arrow} style={{width: 50, height: 25}} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <View style={styles.barCell}>
                    <Text style={styles.barText}>Оформление заказа</Text>
                </View>
            </View>
            <View style={styles.aboutContainer}>
                <Image source={xFood} style={{width: 300, height: 100, marginBottom: 10}} resizeMode='contain' />
                <Text style={styles.textAbout}>Агрегатор доставки еды из ресторанов</Text>
                <Text style={styles.textAbout}>Версия приложения: 0.1</Text>
                <Text style={styles.textLow}>В приложении использованы материалы ресурса icons8.ru</Text>
            </View>
            <View style={styles.aboutContainer}>
                <Text style={styles.textAbout}>© 2020 ИП Смоляр Василий Сергеевич</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between'
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
    aboutContainer: {
        alignItems: 'center'
    },
    textAbout: {
        fontSize: 16,
        fontFamily: 'Tahoma-Regular',
        marginBottom: 20
    },
    textLow: {
        fontSize: 11,
        fontFamily: 'Tahoma-Regular',
    },
    
});