import React, { useState } from 'react';
import { View, Modal, StyleSheet, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import dollar from '../files/dollar.png'; 

export default function ModalCoupon({item, visible, onClose}) {
    if (item === null) {
        return <View></View>;
    }

    return (
        <Modal visible={visible} transparent={true}>
            <View style={styles.backContainer}>
                <View style={{flex:1}}></View>
                <View style={{flex:1}}></View>
                <View style={styles.container}>
                    <Image source={dollar} style={{width: 70, height: 70, marginBottom: 15}} resizeMode={'contain'}/>
                    <View style={{alignItems: 'center', paddingTop: 15}}>
                        <Text style={styles.codeText}>Купон {item.code}</Text>
                        <Text style={styles.perText}>{item.title}</Text>
                    </View>
                    <TouchableOpacity style={styles.couponButton} onPress={() => onClose(item.code)}>
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
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 15,
        paddingTop: 30,
        borderRadius: 15
    },
    codeText: {
        fontFamily: 'Tahoma-Regular',
        color: 'black',
        fontSize: 20,
        marginBottom: 10
    },
    perText: {
        fontFamily: 'Tahoma-Regular',
        color: '#aaa',
        fontSize: 15,
        marginBottom: 10
    },
    couponButton: {
        backgroundColor: '#f08843',
        alignItems: 'center',
        width: '85%',
        borderRadius: 15,
        paddingVertical: 15
    },
    buttonText: {
        fontFamily: 'Tahoma-Regular',
        color: 'white',
        fontSize: 16
    }
});