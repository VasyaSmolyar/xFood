import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import NavigationBar from './components/NavigationBar';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import send from './utils/net';
import useCart from './utils/cartHook';
import dinner from './files/dinner.png';
import pack from './files/package.png';
import pocket from './files/pocket.png';
import { s, vs, ms, mvs } from 'react-native-size-matters';
import ScalableText from 'react-native-text';
import CartHolder, { Item, duration } from './components/CartHolder';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'

export default function CartScreen({navigation}) {
    const token = useSelector(state => state.token);
    const {cart, addItem, removeItem, removeAll, loadCart} = useCart([], token);
    const [loaded, isLoaded] = useState(false);
    const [addons, setAddons] = useState([]);
    const [wares, setWares] = useState(1);
    const [other, setOther] = useState({});
    const [cartCode, setCartCode] = useState("");
    const [available, setAvailable] = useState(false);

    const update = (scalabletext) => {
        let coup = {};
        if(scalabletext) {
            coup.coupon = scalabletext;
        }
        send('api/cart/getcart', 'POST', coup, (json) => {
            const cart = json.items[0].map(item => {
                return {
                    item: item.product,
                    num: item.num
                } 
            });
            loadCart(cart);
            setAddons(json.adviced);
            setAvailable(json.order_available);
            setWares(json.tablewares);
            setOther(json);
            isLoaded(true);
        }, token);
    }

    useEffect(() => {
        update(cartCode);
    }, []);

    const getData = (callback) => {
        if(cartCode === "") {
            send('api/cart/getcart', 'POST', {}, (json) => {
                callback(json);
            }, token);
        } else {
            send('api/cart/getcart', 'POST', {coupon: cartCode}, (json) => {
                callback(json);
            }, token);
        }
    }  

    const addToCart = (item) => {
        addItem(item, () => {
            getData((json) => {
                setOther(json);
                setAvailable(json.order_available);
            });
        });
    }

    const removeToCart = (item) => {
        if(!item.activated) {
            removeAll(item, () => {
                getData((json) => {
                    setOther(json);
                    setAvailable(json.order_available);
                });
            });
        } else {
            removeItem(item, () => {
                getData((json) => {
                    setOther(json);
                    setAvailable(json.order_available);
                });
            });
        }
    }

    if(loaded && (cart.length === 0)) {
        return (
            <View style={styles.container}>
                <StatusBar style="dark" />
                <View style={{paddingHorizontal: 25}}>
                    <View style={[styles.headerContainer, {borderBottomWidth: 0}]}>
                        <ScalableText style={styles.header}>Корзина</ScalableText>
                    </View>
                </View>
                <View style={styles.emptyContainer}>
                    <Image source={pocket} style={{width: 80, height: 80}} resizeMode='contain' />
                    <ScalableText style={styles.emptyText}>Корзина пуста</ScalableText>
                </View>
                <NavigationBar navigation={navigation} routeName="Cart"/>
            </View>
        )
    }

    const cartData = cart.map((prod) => {
        const item = prod.item;

        const plus = item.activated ? (
            <TouchableOpacity style={styles.highButton} onPress={() => addToCart(item)}>
                <ScalableText style={styles.lowText}>+</ScalableText>
            </TouchableOpacity>
        ) : (
            <View style={[styles.highButton, {opacity: 0}]} onPress={() => addToCart(item)}>
                <ScalableText style={styles.lowText}>+</ScalableText>
            </View>
        );

        const tablet = item.activated ? (
            <View style={styles.infoContainer}>
                <ScalableText style={styles.titleText} numberOfLines={1}>{item.title}</ScalableText>
                <ScalableText style={styles.priceText}>{item.price} ₽</ScalableText>
            </View>
        ) : (
            <View style={styles.infoContainer}>
                <ScalableText style={[styles.titleText, {color: '#888'}]} numberOfLines={1}>{item.title}</ScalableText>
                <ScalableText style={[styles.priceText, {color: '#888'}]}>{item.price} ₽</ScalableText>
            </View>
        );

        return (
            <View style={[styles.itemContainer, { paddingVertical: 15}]}>
                <Image source={{uri: item.image_url}} style={{width: 60, height: 60, marginRight: 5, borderRadius: 20}} resizeMode='contain' />
                {tablet}
                <View style={styles.buttonContainer}> 
                    {plus}
                        <ScalableText style={styles.lowNum}>{prod.num}</ScalableText>
                    <TouchableOpacity style={styles.lowButton} onPress={() => removeToCart(item)}>
                        <ScalableText style={styles.lowText}>-</ScalableText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    });

    const included = addons.filter((item) => {
        return !cart.find((i) => {
            return item.title === i.item.title;
        });
    });

    const addData = included.map((item) => {
        return ( 
            <TouchableOpacity style={styles.addContainer} onPress={() => addToCart(item)}>
                <Image source={{uri: item.image_url}} style={{width: s(35), height: s(35), marginRight: ms(10), borderRadius: 20}} resizeMode='center' />
                <View>
                    <ScalableText style={styles.titleText}>{item.title}</ScalableText>
                    <ScalableText style={styles.priceSecond}>{item.price.toFixed(2).replace(/\.00$/,'')} ₽</ScalableText>
                </View>
            </TouchableOpacity>
        );
    })

    const block = included.length > 0 ? (
        <View style={{paddingHorizontal: 25}}>
            <ScalableText style={[styles.priceText, {fontSize: 18, marginTop: 15, marginLeft: 10}]}>К заказу</ScalableText>
            <ScrollView horizontal={true} style={styles.horContainer}>
                {addData}
            </ScrollView>
        </View>
    ) : null;

    const wareAdd = () => {
        send('api/tablewares/add', 'POST', {}, () => {
            setWares(wares + 1);
        }, token);
    }

    const wareRem = () => {
        send('api/tablewares/remove', 'POST', {}, () => {
            setWares(wares - 1);
        }, token);
    }

    const remButton = wares > 1 ? (
        <TouchableOpacity style={styles.lowButton} onPress={wareRem}>
            <ScalableText style={styles.lowText}>-</ScalableText>
        </TouchableOpacity>
    ) : (
        <View style={[styles.lowButton, {opacity: 0}]}>
            <ScalableText style={styles.lowText}>-</ScalableText>
        </View>
    );

    const newCode = (scalabletext) => {
        setCartCode(scalabletext);
        update(scalabletext);
    }

    const orderBlock = !available ? (
        <View style={other.message ? {paddingTop: 15} : {}}>
            {other.message ?
                <ScalableText style={styles.bad}>{other.message}</ScalableText> : null
            }
            <TouchableOpacity style={[styles.phoneButton, {backgroundColor: '#bec2c7'}]}>
                <ScalableText style={styles.phoneText}>Оформить заказ</ScalableText>
            </TouchableOpacity>
        </View>
    ) : (
        <View style={other.message ? {paddingTop: 15} : {}}>
            {other.message ?
                <ScalableText style={styles.bad}>{other.message}</ScalableText> : null
            }
            <TouchableOpacity style={styles.phoneButton} onPress={() => navigation.navigate('Payment', {summ: other.summ, coupon: cartCode})}>
                <ScalableText style={styles.phoneText}>Оформить заказ</ScalableText>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={{paddingHorizontal: 25}}>
                    <View style={styles.headerContainer}>
                        <ScalableText style={styles.header}>Корзина</ScalableText>
                        <ShimmerPlaceholder visible={loaded} style={{width: 250, height: 25, borderRadius: 5, marginBottom: 10, marginLeft: 5}} duration={duration}>
                            <ScalableText style={styles.secondHeader}>{cart[0] ? cart[0].item.restaurant : ''}</ScalableText>
                        </ShimmerPlaceholder>
                    </View>
                </View>
            <ScrollView style={{height: '100%'}}>
                <View style={[styles.itemContainer, {paddingHorizontal: 25}]}>
                    <Image source={dinner} style={{width: s(25), height: s(25), marginHorizontal: ms(15)}} resizeMode='contain' />
                        <View style={styles.infoContainer}>
                            <ScalableText style={styles.titleText}>Приборы</ScalableText>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.lowButton} onPress={wareAdd}>
                                <ScalableText style={styles.lowText}>+</ScalableText>
                            </TouchableOpacity>
                            <ScalableText style={styles.lowNum}>{wares}</ScalableText>
                            {remButton}
                        </View>
                </View>
                {loaded ? block : (
                    null
                )}
                <ScrollView style={styles.listContainer} contentContainerStyle={{justifyContent: 'center'}}>
                    <View style={{ borderBottomColor: '#e5e4e4', borderBottomWidth: 1 }}>
                        {loaded ? cartData : <CartHolder />}
                    </View>
                    <View style={[styles.horContainer, {flexDirection: 'row', alignItems: 'center'}]}>
                        <Image source={pack} style={{width: s(35), height: s(35), marginRight: ms(20)}} resizeMode='contain' />
                        <View style={styles.infoContainer}>
                            <ScalableText style={styles.titleText}>Доставка</ScalableText>
                            <ShimmerPlaceholder duration={duration} visible={loaded} style={{width: 80, height: 20, borderRadius: 5, marginTop: 5}}>
                                <ScalableText style={styles.priceText}>{other.delivery_cost ? other.delivery_cost.toFixed(2).replace(/\.00$/,'') : 0} ₽</ScalableText>
                            </ShimmerPlaceholder>                            
                        </View>
                    </View>
                    <View style={[styles.horContainer, {borderBottomWidth: 0}]}>
                        <ScalableText style={[styles.priceText, {fontSize: 16, marginBottom: 10}]}>Скидки и купоны</ScalableText>
                        <TextInput style={styles.codeInput} placeholder="Код купона" value={cartCode} onChangeText={(scalabletext) => newCode(scalabletext)} />
                    </View>
                </ScrollView>
                <View style={{paddingHorizontal: 25}}>
                    <View style={{paddingVertical: 20}}>
                        { !loaded && <ShimmerPlaceholder duration={duration} visible={loaded} style={{width: 200, height: 30, borderRadius: 5}}>
                        </ShimmerPlaceholder> }
                        { loaded && <ScalableText style={styles.titleText}>Общая стоимость: {other.summ ? other.summ.toFixed(2).replace(/\.00$/,'') : 0} ₽</ScalableText> }
                        {orderBlock}
                    </View>
                </View>
            </ScrollView>
            <NavigationBar navigation={navigation} routeName="Cart"/>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        justifyContent: 'space-between',
        paddingTop: 20
    },
    headerContainer: {
        width: '100%',
        borderBottomColor: '#e5e4e4',
        borderBottomWidth: 1 
    },
    header: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: Constants.statusBarHeight,
        paddingBottom: 10
    },
    secondHeader: {
        color: '#989898',
        fontFamily: 'Tahoma-Regular',
        fontSize: 14,
        marginLeft: 5,
        paddingBottom: 10
    },
    titleText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 16,
    },
    deviceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 25,
        borderBottomColor: '#e5e4e4',
        borderBottomWidth: 1 
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        width: '30%'
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lowButton: {
        height: s(35),
        width: s(35),
        justifyContent: 'center',
        backgroundColor: '#d6dbe0',
        borderRadius: 10,
        alignItems: 'center'
    },
    highButton: {
        height: s(35),
        width: s(35),
        justifyContent: 'center',
        backgroundColor: '#f18640',
        borderRadius: 10,
        alignItems: 'center'
    },
    lowText: {
        fontSize: 22,
        color: '#fff'
    },
    lowNum: {
        fontSize: 18,
        fontFamily: 'Tahoma-Regular',
        marginHorizontal: ms(15)
    },
    horContainer: {
        paddingHorizontal: 5,
        paddingVertical: 20,
        borderBottomColor: '#e5e4e4',
        borderBottomWidth: 1 
    },
    addContainer: {
        backgroundColor: '#fff',
        marginRight: 15,
        flexDirection: 'row',
        padding: 15,
        borderRadius: 10
    },
    listContainer: {
        borderBottomColor: '#e5e4e4',
        borderBottomWidth: 1,
        paddingHorizontal: 25
    },
    itemContainer: {
        paddingVertical: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    infoContainer: {
        width: '30%'
    },
    priceText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 15,
        fontWeight: 'bold'
    },
    priceSecond: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 14,
        color: '#989898',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    codeInput: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: '#e5e6e7',
        fontFamily: 'Tahoma-Regular',
        fontSize: 14,
        width: '70%',
        borderRadius: 10
    },
    phoneButton: {
		backgroundColor: '#f08741',
        paddingVertical: 15,
        marginTop: 15,
		borderRadius: 7,
		width: '100%',
		alignItems: 'center'
	},
	phoneText: {
		fontFamily: 'Tahoma-Regular', 
        fontSize: 14, 
        fontWeight: 'bold',
		color: 'white'
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        color: '#898b8e',
        fontFamily: 'Tahoma-Regular',
        fontSize: 18,
        paddingTop: 30
    },
    bad: {
        color: '#888',
        fontSize: 14,
    }
});