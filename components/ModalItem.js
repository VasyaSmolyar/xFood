import React from 'react';
import { StyleSheet, View, Modal, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import x from '../files/x.png';
import { s, vs, ms, mvs } from 'react-native-size-matters';

function Index({name, value, free}) {
    const add = free === undefined ? " г" : "";

    return (
        <View style={styles.indexContainer}>
            <Text style={styles.indexName}>{value !== null ? value + add : "-"}</Text>
            <Text style={styles.indexValue}>{name}</Text>
        </View>
    )
}

export default function ModalItem(props) {
    const { visible, item, onClose, addInCart } = props;

    if (item === null) {
        return <View></View>
    }

    /*
    const flag = item.country !== "Русская кухня" ? (
        <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
            <Text>{item.flag}</Text> 
            <Text style={styles.itemFlag}>{item.country}</Text>
        </View>
    ) : <View style={{height: 30}}></View>;
    */

    return (
        <Modal visible={visible}>
            <View style={styles.backContainer}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Image source={x} style={{width: s(30), height: vs(30)}} resizeMode={'contain'} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <View style={{alignItems: 'center'}}>
                            <Image source={{uri: item.image_url}} resizeMode={'contain'} style={styles.itemImage} />
                        </View>
                        <View style={{paddingHorizontal: 35}}>
                            <Text style={styles.itemCompany}>{item.restaurant}</Text>
                            <View style={styles.titleContainer}>
                                <Text style={styles.itemText}>{item.title}</Text>
                                <View style={styles.priceContainer}>
                                    <Text style={styles.itemPrice}>{item.price.toFixed(2).replace(/\.00$/,'')} ₽</Text>
                                </View>
                            </View>
                            {/*
                            {flag}
                            */}
                            <Text style={styles.itemDesc}>{item.description}</Text>
                            <ScrollView horizontal={true} style={styles.flatContainer}>
                                <Index name="вес" value={item.weight} />
                                <Index name="ккал" value={item.nutritional_value} free={true} />
                                <Index name="сахар" value={item.sugar} />
                                <Index name="белки" value={item.proteins} />
                                <Index name="жиры" value={item.fats} />
                                <Index name="углеводы" value={item.carbohydrates} />
                                <Index name="клетчатка" value={item.cellulose} />
                            </ScrollView>
                            <Text style={styles.itemInner}>Состав: {item.structure}</Text>
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
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 40
    },
    priceContainer: {
        paddingHorizontal: 17,
        paddingVertical: 5,
        backgroundColor: '#000',
        justifyContent: 'center',
        borderRadius: 20
    },
    itemImage: {
        width: s(200),
        height: vs(200),
        marginBottom: 15,
        borderRadius: 20
    },
    itemPrice: {
        fontSize: 20,
        color: '#fff'
    },
    itemCompany: {
        fontSize: 18,
        color: '#f1c40f',
    },
    itemText: {
        fontSize: 20,
        marginVertical: 5,
        width: '60%',
        fontFamily: 'Tahoma-Regular'
    },
    itemFlag: {
        color: '#97999d',
        fontSize: 13,
        fontFamily: 'Tahoma-Regular',
        marginLeft: 5
    },
    itemDesc: {
        fontSize: 15,
        color: '#666',
        fontFamily: 'Tahoma-Regular'
    },
    flatContainer: {
        borderTopColor: '#f3f1f1',
        borderTopWidth: 1,
        borderBottomColor: '#f3f1f1',
        borderBottomWidth: 1,
        marginVertical: 30,
        paddingVertical: 5
    },
    itemInner: {
        color: '#979797',
        fontSize: 15,
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
    },
    indexContainer: {
        paddingVertical: 5,
        paddingHorizontal: 12,
        alignItems: 'center'
    },
    indexName: {
        fontFamily: 'Tahoma-Regular', 
        fontSize: 18,
    },
    indexValue: {
        fontFamily: 'Tahoma-Regular', 
        fontSize: 11,
    }
});