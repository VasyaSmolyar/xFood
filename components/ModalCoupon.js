import React, { useState } from 'react';
import { View, Modal, StyleSheet, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import dollar from '../files/dollar.png'; 

export default function ModalCoupon({item, visible}) {
    if (item === null) {
        return <View></View>;
    }

    return (
        <Modal visible={visible}>
            <View style={styles.backContainer}>
                <View style={{flex:1}}></View>
                <View style={{flex:1}}></View>
                <View style={styles.container}>
                    <Image source={dollar} style={{width: 50, height: 50} }/>
                    <Text>Купон {item.code}</Text>
                    <Text>Скидка {item.discount_amount}% на доставку</Text>
                    <TouchableOpacity style={styles.couponButton}>
                        <Text style={styles.buttonText}>Копировать код</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
        flexDirection: 'row'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    codeText: {
        fontFamily: 'Tahoma-Regular',
        color: 'black',
        fontSize: 20
    },
    perText: {
        fontFamily: 'Tahoma-Regular',
        color: '#aaa',
        fontSize: 16
    },
    couponButton: {
        backgroundColor: '#f08843',
        alignItems: 'center',
        width: '100%',
        borderRadius: 15,
        paddingVertical: 10
    },
    buttonText: {
        fontFamily: 'Tahoma-Regular',
        color: 'white',
        fontSize: 16
    }
});