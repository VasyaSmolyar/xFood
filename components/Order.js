import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Modal} from 'react-native';
import * as Linking from 'expo-linking';
import cancel from '../files/xorder.png';
import sec from '../files/sec.png';
import tele from '../files/tele.png';
import chat from '../files/chat.png';
import { s, vs, ms, mvs } from 'react-native-size-matters';
import ScalableText from 'react-native-text';


function OrderItem({item, num}) {
    return (
        <View style={styles.productItem}>
            <Image source={{uri: item.image_url}} style={{ width: s(60), height: vs(60), borderRadius: 20 }} resizeMode='center' />
            <View style={{marginLeft: 15}}>
                <Text style={styles.productText} numberOfLines={1}>{num} x {item.title}</Text>
                <View style={styles.priceContainer}>
                    <ScalableText style={styles.priceText}>{item.price.toFixed(2).replace(/\.00$/,'')} ₽</ScalableText>
                </View>
            </View>
        </View>
    );
}

export default function ModalOrder({item, visible, onExit, onChat}) {
    if(item === null) {
        return <Modal visible={false}></Modal>
    }

    const pad = (num) => {
        const size = String(num).length;
        return '0000000000000'.substr(size) + num;
    }

    const data = item.products[0].map((line, id) => {
        return (
            <OrderItem key={id} item={line.product} num={line.num} />
        )
    });

    const stage = item.delivery_time !== null ? (
        <View style={styles.infoContainer}>
            <View style={styles.statusContainer}>
                <Image source={sec} style={{width: 20, height: 20}} resizeMode='contain'/>
                <Text style={styles.statusText}>{item.status_ru}</Text>
            </View>
            <Text style={styles.timeHours}>{item.delivery_time}</Text>
            <Text style={styles.timeText}>Примерное время доставки</Text>
            <TouchableOpacity style={styles.phoneButton} onPress={() => Linking.openURL('tel:' + item.courier_phone)}>
                <Image source={tele} style={{width: 30, height: 30}} resizeMode='contain' />
                <Text style={styles.phoneText}>Связаться с курьером</Text>
            </TouchableOpacity>
        </View>
    ) : null;

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
                                <Image source={cancel} style={{width: s(20), height: vs(20)}} resizeMode='contain' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView style={{backgroundColor: '#fff'}}>
                        {stage}
                        <View style={styles.productContainer}>
                            <Text style={styles.restaurant}>{item.products[0].length !== 0 ? item.products[0][0].product.restaurant : ''}</Text>
                            {data}
                        </View>
                        <View style={[styles.productContainer, {borderBottomWidth: 0, paddingTop: 0}]}>
                            <Text style={[styles.restaurant, {marginBottom: 10}]}>Помощь</Text>
                            <Text style={styles.answerText}>Ответим в течение 20 минут</Text>
                            <TouchableOpacity style={styles.phoneButton} onPress={onChat}>
                                <Image source={chat} style={{width: 30, height: 30}} resizeMode='contain'/>
                                <Text style={styles.phoneText}>Перейти в чат</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingTop: 50
    },
    boxContainer: {
        flex: 1,
        width: '100%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        paddingVertical: 20,
        borderBottomWidth: 2,
        borderBottomColor: "#f4f4f4",
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    headerCell: {
        flex: 1,
        alignItems: 'center'
    },
    header: {
        fontFamily: 'Tahoma-Regular', 
        fontWeight: 'bold',
        fontSize: 18
    },
    infoContainer: {
        alignItems: 'center',
        borderBottomColor: '#f4f2f2',
        borderBottomWidth: 1,
        paddingVertical: 20,
        paddingHorizontal: 25
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 30
    },
    statusText: {
        fontFamily: 'Tahoma-Regular', 
        fontSize: 16,
        marginLeft: 15
    },
    timeHours: {
        fontFamily: 'Tahoma-Regular',
        fontWeight: 'bold', 
        fontSize: 30,
        paddingBottom: 15
    },
    timeText: {
        color: '#7f7f7f',
        fontFamily: 'Tahoma-Regular', 
        fontSize: 16,
        paddingBottom: 20
    },
    phoneButton: {
        backgroundColor: '#f2f3f5',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 15
    },
    phoneText: {
        color: '#505050',
        fontFamily: 'Tahoma-Regular',
        fontWeight: 'bold',  
        fontSize: 15,
        marginLeft: 15
    },
    productContainer: {
        paddingVertical: 20,
        paddingHorizontal: 25
    },
    restaurant: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 20
    },
    productItem: {
        flexDirection: 'row',
        marginBottom: ms(20)
    },
    productTitle: {
        fontFamily: 'Tahoma-Regular', 
        fontSize: 16,
    },
    productText: {
        fontFamily: 'Tahoma-Regular', 
        fontSize: 16,
        paddingBottom: 15
    },
    priceContainer: {
        paddingVertical: 5,
        backgroundColor: '#000',
        borderRadius: 20,
        width: s(70),
        alignItems: 'center'
    },
    priceText: {
        fontFamily: 'Tahoma-Regular', 
        fontSize: 15,
        color: '#fff'
    },
    answerText: {
        fontFamily: 'Tahoma-Regular', 
        fontSize: 14,
        paddingBottom: 20,
    }
});