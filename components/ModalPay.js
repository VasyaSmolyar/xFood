import React from 'react';
import { Platform, StyleSheet, View, Modal, Text, TouchableOpacity, Image } from 'react-native';
import gpay from '../files/gpay.png';
import apay from '../files/apay.webp';
import cardHand from '../files/cardHand.png';
import cardOnline from '../files/cardOnline.png';
import price from '../files/price.png';

const unzip = (slug) => {
    if(slug === 'cash') {
        return ['Наличные при получении', price, 'cash'];
    }
    if(slug === 'transfer') {
        return ['Оплата картой при получении', cardHand, 'transfer'];
    }
    if(slug === 'transfer_online') {
        return ['Оплата онлайн', cardOnline, 'transfer_online'];
    }
    /*
    if(slug === 'online') {
        return Platform.OS === 'ios' ?  ['Apple Pay', apay, 'apple'] : ['Google Pay', gpay, 'google'];
    }
    */
    return ['', null, ''];
}

function Pay({slug, onClose}) {

    const [title, src] = unzip(slug);

    if(title === '') {
        return null;
    }

    return (
        <TouchableOpacity style={styles.payContainer} onPress={() => onClose(slug)}>
            <Image source={src} style={{width: 25, height: 25}} resizeMode='contain' />
            <Text style={styles.payText}>{title}</Text>
        </TouchableOpacity>
    );
}

export default function ModalPay(props) {
    const { visible, pay_types, onClose } = props;

    const payData = pay_types.map((item) => {
        return <Pay slug={item} onClose={onClose} />
    }); 

    return (
        <Modal visible={visible} transparent={true}>
            <View style={styles.backContainer}>
                <View style={styles.container}>
                    <Text style={styles.header}>Способ оплаты</Text>
                    {payData}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 25,
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        width: '100%'
    },
    backContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    header: {
        fontFamily: 'Tahoma-Regular',
        fontWeight: 'bold',
        fontSize: 20,
        paddingBottom: 20
    },
    payContainer: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 15
    },
    payText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 16,
        paddingLeft: 20
    }
});