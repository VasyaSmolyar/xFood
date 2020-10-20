import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import minus from '../files/minus.png';
import plus from '../files/plus.png';

export default function Item(props) {
    const { cart, item, addToCart, removeFromCart } = props;
    if(item.item.empty !== undefined) {
        return <View style={{width: '50%', height: 30}}></View>
    }

    const inCart = cart.find((i) => {
        if (i.item === undefined)
            return undefined;
        return item.item.title === i.item.title;
    });

    const add = inCart != undefined ? <CartBar item={item.item} value={inCart.num} addToCart={addToCart} removeFromCart={removeFromCart} /> : (
        <TouchableOpacity style={styles.phoneButton} onPress={() => addToCart(item.item)}>
            <Text style={styles.phoneText}>Добавить</Text>
        </TouchableOpacity>
    );

    const flag = item.item.country !== "Русская кухня" ? (
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
            <Text>{item.item.flag}</Text> 
            <Text style={styles.itemFlag}>{item.item.country}</Text>
        </View>
    ) : <View style={{height: 30}}></View>;

    let border = {};

    if (props.index % 2 == 1) {
        border.borderLeftWidth = 1;
        border.borderLeftColor = '#eee';
    }
    
    if (props.length - props.index > 2) {
        border.borderBottomWidth = 1;
        border.borderBottomColor = '#eee';
    }

    return (
        <TouchableWithoutFeedback onPress={() => props.showItem(item.item)}>
            <View style={[styles.item, border]}>
                <View style={{alignItems: 'center'}}>
                    <Image source={{uri: item.item.image_url}} resizeMode='cover' style={styles.itemImage} />
                </View>
                <Text style={styles.itemPrice}>{item.item.price.toFixed(2).replace(/\.00$/,'')} ₽</Text>
                <Text numberOfLines={2}
                style={styles.itemText}>{item.item.title}</Text>
                {flag}
                {add}
            </View>
        </TouchableWithoutFeedback>
    );
}

function CartBar(props) {
    //const token = useSelector(state => state.token);

    const add = () => {
        props.addToCart(props.item); 
        /*
        send('api/cart/addtocart', 'POST', {"product.id": props.item.id, num: 1}, () => {}, token);
        send('api/cart/getcart', 'POST', {}, () => {}, token);
        */
    }

    const remove = () => {
        props.removeFromCart(props.item);
        /*
        send('api/cart/deletefromcart', 'POST', {"product.id": props.item.id, num: 1}, () => {}, token);
        */
    }

    return (
        <View style={styles.cartBar}>
            <TouchableOpacity style={[styles.cartButton, {backgroundColor: '#f2f3f5'}]} onPress={remove}>
                <Image source={minus} style={styles.cartImage} resizeMode={'contain'} />
            </TouchableOpacity>
            <Text style={styles.cartText}>{props.value} шт.</Text>
            <TouchableOpacity style={[styles.cartButton, {backgroundColor: '#f08741'}]} onPress={add}>
                <Image source={plus} style={styles.cartImage} resizeMode={'contain'} />
            </TouchableOpacity>
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'space-between',
	},
	authButton: {
		alignItems: "center",
		backgroundColor: "#DDDDDD",
		padding: 10
	},
	phone: {
		height: 40, 
		borderColor: 'gray', 
		borderWidth: 1
    },
    category: {
        width: '100%',
        borderRadius: 20,
        backgroundColor: '#fff',
        marginVertical: 5,
        paddingBottom: 10
    },
    item: {
        width: '50%',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    itemText: {
        fontSize: 14,
        marginVertical: 5
    },
    itemFlag: {
        color: '#97999d',
        fontSize: 12,
        fontFamily: 'Tahoma-Regular',
        marginLeft: 5
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    itemImage: {
        width: 120,
        height: 120,
        marginBottom: 5,
        borderRadius: 20
    },
    catImage: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    catText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        paddingVertical: 5
    },
    catList: {
        width: '100%'
    },
    catIcon: {
        width: 20,
        height: 20
    },
    catLabel: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 14,
        marginLeft: 10,
    },
    catAppend: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        justifyContent: 'center'
    },
    oneRow: {
        justifyContent: 'space-around'
    },
    phoneButton: {
		backgroundColor: '#f08741',
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 5,
        alignItems: 'center',
        width: '70%'
	},
	phoneText: {
		fontFamily: 'Tahoma-Regular', 
		fontSize: 14, 
		color: 'white'
    }, 
    subButton: {
        padding: 10,
        marginHorizontal: 10,
        marginBottom: 10,
        backgroundColor: "#f2f3f5",
        borderRadius: 5
    },
    subText: {
        fontFamily: 'Tahoma-Regular', 
		fontSize: 14, 
    },
    subFilter: {
        padding: 10,
    },
    cartBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    cartImage: {
        width: 15,
        height: 15
    },
    cartButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    cartText: {
        fontFamily: 'Tahoma-Regular', 
		fontSize: 16, 
    },
    header: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 24,
        fontWeight: 'bold',
        paddingVertical: 10
    },
    toolView: {
        flexDirection: 'row',
        paddingBottom: 20,
        maxWidth: '100%',
        flexWrap: 'wrap',
        borderBottomColor: '#ede9e9',
        borderBottomWidth: 1,
        marginBottom: 20
    },
    tool: {
        marginTop: 10,
        marginLeft: 20,
        borderRadius: 25,
        backgroundColor: '#f2f3f5',
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    toolSpace: {
        width: 10,
        height: 1
    },
    toolText: {
        fontFamily: 'Tahoma-Regular', 
        fontSize: 16
    },
    toolImage: {
        width: 30,
        height: 30,
    }
});
