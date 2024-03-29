import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import send from './utils/net';
import useCart from './utils/cartHook';
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
import ModalCart from './components/ModalCart';
import ModalItem from './components/ModalItem';
import Item from './components/Item';
import approve from './files/toolApprove.png';
import star from './files/toolStar.png';
import { ScaledSheet,  scale, verticalScale, moderateScale } from 'react-native-size-matters';
import ScalableText from 'react-native-text';
import { ScrollView } from 'react-native-gesture-handler';
import ProductHolder from './components/ProductHolder';

export default function ProductScreen({navigation}) {
    const token = useSelector(state => state.token);
    const route = useRoute();
    let { subs } = route.params;
    subs = ["Популярное", ...subs];
    const title = route.params.banner !== undefined ? route.params.banner : route.params.title;
    const section = route.params.section !== undefined ? route.params.section : "";
    const spec = route.params.banner !== undefined;
    const other = route.params.other;
    const [data, setData] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const [sub, setSub] = useState(0);
    const [offset, setOffset] = useState(0);
    const [query, setQuery] = useState("");
    const [chosen, setChosen] = useState(null);
    const [modal, setModal] = useState(false);
    const [reset, setReset] = useState(false);
    const {cart, addItem, removeItem, loadCart} = useCart([], token);

    const num = 5;

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom;
    };

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
        if (route.params.query !== undefined) {
            setQuery(route.params.query);
        }
        setLoaded(false);
    }, []);
    

    const upload = () => {
        console.log("UPLOAD");
        if(isLoaded) {
            setOffset(offset + num);
            setLoaded(false);
        }
    }

    const filterQuery = (value) => {
        setOffset(0);
        setQuery(value);
        setLoaded(true);
        const ret = sub === 0 ? "all" : subs[sub];
        let data = {title: ret, offset: 0, num: num, search: value};
        if (spec) {
            data.special_offer = true;
            data.title = title;
            if(data.length === 0 )
                    data.offset = 0;
        } else {
            data.restaurant_id = route.params.id;
        }
        if(section) {
            data.section = section;
        }
        send('api/catalog/getbycategory', 'GET', data, (json) => {
            if(json.details !== undefined) {
                setData([]);
                return;
            }
            setData(json);
        }, token);
    }

    const load = (json) => {
        setLoaded(true);
        if(json.details !== undefined) {
            return;
        }
        setData([...data,...json]);
    };

    const showModal = (item) => {
        setChosen(item);
        setModal(true);
    }

    const addToCart = (item) => {
        send('api/cart/check', 'POST', {resturant_id: route.params.id}, (ret) => {
            if(ret[2] === false) {
                setChosen(item);
                setReset(true);
                return;
            }
            setModal(false);
            setReset(false);
            addItem(item);
        }, token);
    }

    const onReset = (item) => {
        setModal(false);
        setReset(false);
        addItem(item);
    }

    useEffect(() => {
        if(!isLoaded) {
            const value = sub === 0 ? "all" : subs[sub];
            let data = {title: value, offset: offset, num: num, search: query};
            if (spec) {
                data.special_offer = true;
                data.title = title;
                if(data.length === 0 )
                    data.offset = 0;
            } else {
                data.restaurant_id = route.params.id;
            }
            if(section) {
                data.section = section;
            }
            console.log(data);
            send('api/catalog/getbycategory', 'GET', data, load, token);
        }
        return () => {
        }
    });

    const getMoney = (amount) => {
        return "от " + amount + "₽";
    }

    const getDeliv = (min, max) => {
        let price;
        if (max == min) {
            price = max;
        } else {
            price = min + "-" + max;
        }
        return 'Доставка ' + price + " ₽";
    }

    const about = other !== null ? (
        <View style={styles.toolView}>
            <View style={styles.tool}>
                <Image style={styles.toolImage} resizeMode={'contain'} source={star}></Image>
                <View style={styles.toolSpace}></View>
                <ScalableText style={styles.toolText}>{other.rating}</ScalableText>
            </View>
            <View style={styles.tool}>
                <Image style={styles.toolImage} resizeMode={'contain'} source={approve}></Image>
                <View style={styles.toolSpace}></View>
                <ScalableText style={styles.toolText}>Проверено xFood</ScalableText>
            </View>
            <View style={styles.tool}>
                <ScalableText style={styles.toolText}>{getDeliv(other.min_odd, other.odd)}</ScalableText>
            </View>
            <View style={styles.tool}>
                <ScalableText style={styles.toolText}>{getMoney(other.min_summ)}</ScalableText>
            </View>
        </View>
    ) : null;

    const horizontal = !spec ? (
        <View style={{flexDirection: 'row', width: '100%'}}>
            <FlatList data={subs} renderItem={
                    (item) => {
                        const color = sub === item.index ? [styles.subButton, {backgroundColor: '#cccccc'}] : styles.subButton; 
                        return (
                            <TouchableOpacity style={color} onPress={() => {
                                setOffset(0);
                                setSub(item.index);
                                setData([]);
                                setLoaded(false);
                            }}>
                                <ScalableText style={styles.subScalableText}>{item.item}</ScalableText>
                            </TouchableOpacity>
                        );
                    }
                } horizontal={true} style={{width: '70%'}}
                showsHorizontalScrollIndicator={false} />
        </View>
    ) : null;

    /* if(( isLoaded || data.length === 0 || true ) === false) {
        return (
            <View style={styles.container}>
                <StatusBar style="dark" />
                <SearchBar placeholder="Поиск по категории" value={query} onChangeText={filterQuery} />
                <ProductHolder />
                <NavigationBar navigation={navigation} routeName="Catalog"/>
            </View>
        )
    */

    const flat = isLoaded || offset !== 0 ? (
        <FlatList 
            numColumns={2} columnWrapperStyle={styles.oneRow}
            keyExtractor={(item, index) => index.toString()} 
            data={data.length % 2 === 1 ? [...data, {empty: true}, {empty: true}, {empty: true}] : [...data, {empty: true}, {empty: true}]} 
            renderItem={
              ({ item, index, sep }) => {
                return <Item item={{item: item}} cart={cart} addToCart={addToCart} removeFromCart={removeItem} 
                showItem={showModal} length={data.length} index={index} />;
              }
            }  />
    ) : <ProductHolder />

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <SearchBar placeholder="Поиск по категории" value={query} onChangeText={filterQuery} />
            <ModalItem item={chosen} visible={modal} onClose={() => {setModal(false)}} addInCart={addToCart} setItem={showModal} />
            <ModalCart item={chosen} visible={reset} onClose={() => {setReset(false)}} addInCart={onReset} />
            { /* <ModalStatus /> */ }
            <View style={{width: '100%', paddingHorizontal: 20}}>
                <ScalableText style={styles.header}>{title}</ScalableText>
            </View>
            <ScrollView onScroll={({nativeEvent}) => {
                if (isCloseToBottom(nativeEvent)) {
                    upload();
                }
            }} scrollEventThrottle={400}>
            {about}
            {horizontal}
            {flat}
            </ScrollView>
            <NavigationBar navigation={navigation} routeName="Catalog"/>
        </View>
    );

}

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'space-between'
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
        width: '120s',
        height: '120vs',
        marginBottom: 5,
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
        width: scale(20),
        height: verticalScale(20)
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
    cartScalableText: {
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
        marginTop: moderateScale(10),
        marginLeft: moderateScale(20),
        borderRadius: 25,
        backgroundColor: '#f2f3f5',
        flexDirection: 'row',
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(20),
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
        width: scale(25),
        height: verticalScale(25)
    }
});
