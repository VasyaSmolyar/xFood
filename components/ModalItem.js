import React from 'react';
import { StyleSheet, View, Modal, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import x from '../files/x.png';

export default function ModalItem(props) {
    const { visible, item, onClose, addInCart } = props;

    if (item === null) {
        return <View></View>
    }

    const flag = item.country !== "Русская кухня" ? (
        <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
            <Text>{item.flag}</Text> 
            <Text style={styles.itemFlag}>{item.country}</Text>
        </View>
    ) : <View style={{height: 30}}></View>;

    return (
        <Modal visible={visible}>
            <View style={styles.backContainer}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Image source={x} style={{width: 30, height: 30}} resizeMode={'contain'} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <View style={{alignItems: 'center'}}>
                            <Image source={{uri: item.image_url}} resizeMode={'contain'} style={styles.itemImage} />
                        </View>
                        <View style={{paddingHorizontal: 30}}>
                            <Text style={styles.itemPrice}>{item.price.toFixed(2)} ₽</Text>
                            <Text style={styles.itemCompany}>{item.restaurant}</Text>
                            <Text style={styles.itemText}>{item.title}</Text>
                            {flag}
                            <Text style={styles.itemDesc}>{item.description}</Text>
                        </View>
                    </ScrollView>
                    <View style={styles.phoneWidth}>
                    <TouchableOpacity style={styles.phoneButton} onPress={() => {addInCart(item)}}>
                        <Text style={styles.phoneText}>Добавить в корзину</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },
    backContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 25,
        paddingHorizontal: 25
    },
    itemImage: {
        width: 200,
        height: 200,
        marginBottom: 5,
    },
    itemPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 5
    },
    itemCompany: {
        fontSize: 18,
        color: '#f1c40f',
    },
    itemText: {
        fontSize: 20,
        marginVertical: 5,
        fontWeight: 'bold',
        fontFamily: 'Tahoma-Regular'
    },
    itemFlag: {
        color: '#97999d',
        fontSize: 13,
        fontFamily: 'Tahoma-Regular',
        marginLeft: 5
    },
    itemDesc: {
        fontSize: 16,
        fontWeight: "400",
        fontFamily: 'Tahoma-Regular'
    },
    phoneButton: {
		backgroundColor: '#f08741',
		paddingVertical: 12,
		paddingHorizontal: 10,
		borderRadius: 10,
        alignItems: 'center',
        width: '85%'
	},
	phoneText: {
		fontFamily: 'Tahoma-Regular', 
		fontSize: 18, 
        color: 'white',
        fontWeight: 'bold'
    }, 
    phoneWidth: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 20
    }
});