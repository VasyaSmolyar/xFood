import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Modal} from 'react-native';
import cancel from '../files/xorder.png';
import time from '../files/time.png';
import moto from '../files/moto.png';
import money from '../files/money.png';

function Product({item}) {
    return (
        <View style={styles.firstLine}>
            <Image source={{uri: item.image_url}} resizeMode={'contain'} style={styles.image} />
            <View>
                <Text style={styles.itemPrice}>{item.price}₽</Text>
                <View style={{justifyContent: 'space-between', flex: 1}} >
                    <Text style={styles.itemText}>{item.title}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                        <Text>{item.flag}</Text> 
                        <Text style={styles.itemFlag}>{item.country}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

function Key({title, pic, value}) {
    const img = pic !== null ? <Image source={pic} style={{width: 20, height: 20}} resizeMode='contain' /> : null;

    return (
        <View style={{paddingHorizontal: 20}}>
            <View style={{flexDirection: 'row', marginBottom: 10, alignItems: 'center'}}>
                {img}
                <Text style={styles.keyText}>{title}</Text>
            </View>
            <Text style={styles.valueText}>{value}</Text>
        </View>
    );
}

export default function ModalOrder({item, visible, onExit}) {
    const pad = (num) => {
        const size = String(num).length;
        return '0000000000000'.substr(size) + num;
    }

    if(item === null) {
        return <Modal visible={false}></Modal>
    }

    const data = item.products.map((product, id) => {
        return <Product key={id} item={product} />
    });

    return (
        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.boxContainer}>
                    <View style={styles.headerContainer}>
                        <View style={styles.headerCell}></View>
                        <View style={[styles.headerCell, {flex: 3}]}>
                            <Text style={styles.header}>Заказ {pad(item.id)}</Text>
                        </View>
                        <View style={styles.headerCell}>
                            <TouchableOpacity onPress={onExit}>
                                <Image source={cancel} style={{width: 20, height: 20}} resizeMode='contain' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{marginBottom: 30, marginTop: 10}}>
                        <Key title="Дата и время оформления заказа" value={item.date} pic={time} />
                        <Key title="Способ оплаты" value={item.pay_type} pic={money} />
                        <Key title="Адрес доставки" value={item.adress} pic={moto} />
                        <Key title="Осталось ждать примерно" value={item.before_delivery} pic={null} />
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity style={styles.orderButton}>
                            <Text style={styles.buttonText}>Связаться с курьером</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.header, {marginTop: 30, paddingHorizontal: 20}]}>Заказанные товары</Text>
                    <ScrollView>
                        {data}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}           

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'black',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    headerContainer: {
        flexDirection: 'row',
        paddingVertical: 20,
        borderBottomWidth: 2,
        borderBottomColor: "#f4f4f4" 
    },
    headerCell: {
        flex: 1,
        alignItems: 'center'
    },
    header: {
        fontFamily: 'Tahoma-Regular', 
        fontWeight: 'bold',
        fontSize: 16
    },
    boxContainer: {
        flex: 1,
        width: '100%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#fff',
    },
    keyText: {
        fontSize: 14,
        fontFamily: 'Tahoma-Regular', 
        color: '#b6b6b7',
        marginLeft: 10
    },
    valueText: {
        fontSize: 16,
        fontFamily: 'Tahoma-Regular',
        marginBottom: 15 
    },
    orderButton: {
        borderRadius: 5,
        width: '80%',
        alignItems: "center",
        backgroundColor: '#f1c40f',
        paddingVertical: 10,
        justifyContent: "center"
    },
    buttonText: {
        fontFamily: 'Tahoma-Regular',
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white'
    },
    header: {
        fontFamily: 'Tahoma-Regular',
        fontWeight: 'bold',
        fontSize: 18,
    },
    image: {
        width: 120,
        height: 120,
    },
    firstLine: {
        flexDirection: 'row',
        backgroundColor: "#fff",
        paddingVertical: 10
    },
    itemText: {
        fontSize: 14,
        marginVertical: 5,
        maxWidth: '80%'
    },
    itemFlag: {
        color: '#97999d',
        fontSize: 12,
        fontFamily: 'Tahoma-Regular',
        marginLeft: 5
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingRight: 10
    },
});