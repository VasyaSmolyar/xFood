import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image } from 'react-native';
import Constants from 'expo-constants';
import passport from './files/passport.png';

export default function PaymentScreen() {
    return (
        <View styles={styles.container}>
            <View style={styles.barContainer}>
                <Text style={styles.barText}>Офоромление заказа</Text>
            </View>
            <View style={{backgroundColor: 'white', flex: 1}}>
                <View style={styles.warning}>
                    <Image source={passport} style={styles.warningImage} resizeMode={'contain'} />
                    <View>
                        <Text style={styles.warningText}>Приготовьте паспорт</Text>
                        <Text style={styles.warningFull}>Курьер вправе потребовать документ, удостоверяющий личность получателя в соответствии с п. 2 ст. 16 171-ФЗ Российской федерации</Text>
                    </View>
                </View>
                <Text style={styles.header}>Данные получателя</Text>
                <View style={styles.inputWrap}>
                    <Text style={styles.inputWrapText}>Имя и фамилия</Text>
                    <TextInput style={styles.phone} />
                </View>
                <View style={styles.inputWrap}>
                    <Text style={styles.inputWrapText}>Номер телефона</Text>
                    <TextInput style={styles.phone} keyboardType='phone-pad' />
                </View>
                <Text style={styles.header}>Доставка</Text>
                <View style={styles.geoContainer}>
                    <View style={styles.geoWrap}>
                        <Text style={styles.inputWrapText}>Регион</Text>
                        <TextInput style={styles.phone} />
                    </View>
                    <View style={styles.geoWrap}>
                        <Text style={styles.inputWrapText}>Город, улица, дом</Text>
                        <TextInput style={styles.phone} />
                    </View>
                </View>
                <View style={styles.geoContainer}>
                    <View style={styles.cellWrap}>
                        <Text style={styles.inputWrapText}>Корпус</Text>
                        <TextInput style={styles.phone} />
                    </View>
                    <View style={styles.cellWrap}>
                        <Text style={styles.inputWrapText}>Квартира</Text>
                        <TextInput style={styles.phone} />
                    </View>
                    <View style={styles.cellWrap}>
                        <Text style={styles.inputWrapText}>Этаж</Text>
                        <TextInput style={styles.phone} />
                    </View>
                    <View style={styles.cellWrap}>
                        <Text style={styles.inputWrapText}>Домофон</Text>
                        <TextInput style={styles.phone} />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
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
    warning: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: 'white',
        width: '100%'
    },
    warningImage: {
        width: 75,
        height: 75,
        marginRight: 15
    },
    warningText: {
        fontFamily: 'Tahoma-Regular',
        color: '#c0392b',
        fontSize: 16,
        marginBottom: 5
    },
    warningFull: {
        width: '30%',
        fontSize: 12,
        fontFamily: 'Tahoma-Regular',
    },
    header: {
        fontWeight: "bold",
        fontSize: 20,
        fontFamily: 'Tahoma-Regular',
        padding: 15,
        backgroundColor: '#f4f4f6'
    },
    inputWrap: {
		padding: 5,
		backgroundColor: "#f2f3f5",
        marginVertical: 10,
        marginHorizontal: 20,
		borderRadius: 7,
		width: '75%',
	},
	inputWrapText: {
		fontFamily: 'Tahoma-Regular', 
		fontSize: 10,
		color: '#a7aaaf',
    },
    phone: {
		backgroundColor: '#f2f3f5', 
		fontSize: 25,
    },
    geoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    geoWrap: {
        padding: 5,
		backgroundColor: "#f2f3f5",
        marginVertical: 10,
		borderRadius: 7,
		width: '45%',
    },
    cellWrap: {
        padding: 5,
		backgroundColor: "#f2f3f5",
        marginVertical: 10,
		borderRadius: 7,
		width: '20%',
    },
});