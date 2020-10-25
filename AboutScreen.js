import React from 'react';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import arrow from './files/blackArrow.png';
import xFood from './files/xFood.png';
import { s, vs, ms, mvs } from 'react-native-size-matters';
import ScalableText from 'react-native-text';

export default function AboutScreen({navigation}) {
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
                    <ScalableText style={styles.barText}>О приложении</ScalableText>
                </View>
            </View>
            <View style={styles.aboutContainer}>
                <Image source={xFood} style={{width: s(300), height: vs(100), marginBottom: 10}} resizeMode='contain' />
                <ScalableText style={styles.textAbout}>Агрегатор доставки еды из ресторанов</ScalableText>
                <ScalableText style={styles.textAbout}>Версия приложения: 0.1</ScalableText>
                <ScalableText style={styles.textLow}>В приложении использованы материалы ресурса icons8.ru</ScalableText>
            </View>
            <View style={styles.aboutContainer}>
                <ScalableText style={styles.textAbout}>© 2020 ИП Смоляр Василий Сергеевич</ScalableText>
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
        fontSize: 18,
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