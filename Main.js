import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Image, ScrollView, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import send from './utils/net'
import useCart from './utils/cartHook';
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
import ModalItem from './components/ModalItem';
import ModalCart from './components/ModalCart';
import { Carousel } from './components/Carousel/index';
import { readLocate } from './utils/locate';
import Item from './components/Item';
import ProductHolder, { duration } from './components/ProductHolder';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function MainScreen({navigation}) {
    const [query, setQuery] = useState('');
    const [banners, setBanners] = useState([]);
    const [sections, setSections] = useState([]);
    //const [filtered, setFiltered] = useState([]);
    const token = useSelector(state => state.token);
    const [chosen, setChosen] = useState(null);
    const [visible, setVisible] = useState(false);
    const [reset, setReset] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const {cart, addItem, removeItem, loadCart} = useCart([], token);

    useEffect(() => {
        readLocate().then((val) => {
            send('api/main/get', 'POST', {area: val}, (json) => {
                setBanners(json.banners);
                setSections(json.sections);
                //setFiltered(json.sections);
                setLoaded(true);
            }, token);
        });
    }, []);

    const banner = banners.map((banner) => {
        return {
            value: (
            <TouchableWithoutFeedback style={{width: '95%', height: 200, borderRadius: 20}} pressRetentionOffset={5}
            onPress={() => onBanner(banner)}>
                <Image source={{uri: banner.image}} style={{width: '95%', height: 200, resizeMode: 'contain', borderRadius: 20, overflow: 'hidden'}} />
            </TouchableWithoutFeedback>
            )
        }
    });

    const filter = (value) => {
        setQuery(value);
        /*
        const list = Object.keys(sections).map((data) => {
            return sections[data].filter((item) => {
                return item.title.toLowerCase().search(value.toLowerCase()) !== -1;
            });
        })
        setFiltered(list); 
        */
    }

    const choiceItem = (item) => {
        setChosen(item);
        setVisible(true);
    };

    const onBanner = (banner) => {
        console.log("BANNER");
        console.log(banner);
        if(banner.products.length === 1) {
            choiceItem(banner.products[0]);
        } else if(banner.coupon) {
            navigation.replace('Coupon', {coupon: banner.coupon});
        } else if(banner.products.length > 1) {
            navigation.replace('Products', {banner: banner.code, subs: [], other: null });
        }
    }

    const setCart = (json) => {
        const cart = json.items[0].map(item => {
            return {
                item: item.product,
                num: item.num
            } 
        });
        loadCart(cart);
    }

    useEffect(() => {
        send('api/cart/getcart', 'POST', {}, setCart, token);
    }, []);

    const addToCart = (item) => {
        send('api/cart/check', 'POST', {resturant_id: item.restaurant_id}, (ret) => {
            if(ret[2] === false) {
                setChosen(item);
                setReset(true);
                return;
            }
            setVisible(false);
            setReset(false);
            addItem(item);
            send('api/cart/getcart', 'POST', {}, setCart, token);
        }, token);
    }

    const onReset = (item) => {
        setVisible(false);
        setReset(false);
        addItem(item);
        send('api/cart/getcart', 'POST', {}, setCart, token);
    }
    /*
    const seacrhMethod = () => {
        navigation.navigate('Products', {title: "all", query: query});
    }
    */

    const sectors = Object.keys(sections).map((key) => {
        /*
        const items = sections[key].map((item, index) => {
            return (
                <View style={{width: '40%'}}>
                    <Item item={{item: item}} cart={cart} addToCart={addToCart} removeFromCart={removeItem} 
                    showItem={choiceItem} length={sections[key].length} index={index} />
                </View>
            );
        });
        */

        const filtered = sections[key].filter((item) => {
            return item.title.toLowerCase().search(query.toLowerCase()) !== -1;
        });

        return (
            <View key={key}>
                <Text style={styles.header}>{key}</Text>
                <FlatList onEndReachedThreshold={0.1}
                    numColumns={2} columnWrapperStyle={styles.oneRow}
                    keyExtractor={(item, index) => index.toString()} 
                    data={filtered.length % 2 === 1 ? [...filtered, {empty: true}, {empty: true}, {empty: true}] : [...filtered, {empty: true}, {empty: true}]} 
                    renderItem={
                    ({ item, index, sep }) => {
                        return <Item item={{item: item}} cart={cart} addToCart={addToCart} removeFromCart={removeItem} 
                        showItem={choiceItem} length={filtered.length} index={index} />;
                    }
                }  />
            </View>
        );
    });

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <ModalItem item={chosen} visible={visible} onClose={() => {setVisible(false)}} addInCart={addToCart} setItem={setChosen} />
            <ModalCart item={chosen} visible={reset} onClose={() => {setReset(false)}} addInCart={onReset} />
            <SearchBar placeholder="Поиск на xFood" value={query} onChangeText={filter} /* onSubmitEditing={seacrhMethod} */ />
            <ScrollView style={{width: '100%'}}>
                {isLoaded ? <Carousel style="stats" itemsPerInterval={1} items={banner} /> : (
                    <View style={{alignItems: 'center'}}>
                        <ShimmerPlaceholder duration={duration} width={windowWidth * 0.95} height={200} shimmerStyle={{borderRadius: 20, marginBottom: 30}}></ShimmerPlaceholder>
                    </View>
                    
                )}
                <View style={{marginTop: -25}}>
                    {isLoaded ? sectors : (
                        <View>
                            <ShimmerPlaceholder style={{width: 250, height: 35, borderRadius: 5, marginVertical: 20, marginLeft: 20}} duration={duration}>
                            </ShimmerPlaceholder>
                            <ProductHolder />
                        </View>
                    )}
                </View>
            </ScrollView>
            <NavigationBar navigation={navigation} routeName="Main"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20
    },
    header: {
        fontWeight: "bold",
        fontSize: 23,
        fontFamily: 'Tahoma-Regular',
        padding: 15,
        paddingLeft: 10,
        marginTop: 5
    },
    item: {
        width: '50%',
        backgroundColor: '#fff',
        marginBottom: 10,
        paddingHorizontal: 10
    },
    itemText: {
        fontFamily: 'Tahoma-Regular',
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
        fontWeight: 'bold',
        fontFamily: 'Tahoma-Regular',
    },
    itemImage: {
        width: 120,
        height: 120,
        marginBottom: 5,
    },
    phoneButton: {
		backgroundColor: '#f1c40f',
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
    flat: {
        flex: 1
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
    }
});