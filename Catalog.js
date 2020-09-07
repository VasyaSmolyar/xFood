import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import send from './utils/net'
import { addItem, loadCart, removeItem } from './utils/store';
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
import ModalItem from './components/ModalItem';
import minus from './files/minus.png';
import plus from './files/plus.png';
import price from './files/price.png';
import star from './files/star.png';
import timer from './files/timer.png';

function Category(props) {
    const navigation = useNavigation();
    const { cat } = props;

    const getTime = (time) => {
        const label = (time % 10) > 4 ? "минут" : "минуты";
        return time + " " + label;
    }

    const getMoney = (amount) => {
        return "от " + amount + "₽";
    }

    return (
        <TouchableOpacity style={styles.category} onPress={() => navigation.navigate('Products', {title: cat.title, id: cat.id, subs: cat.categories})}>
            <Image source={{uri: cat.poster}} resizeMode={'cover'} style={styles.catImage} imageStyle={{ borderRadius: 20}} />
            <Text style={styles.catText}>{cat.title}</Text>
            <View style={{flexDirection: 'row', paddingHorizontal: 10, paddingBottom: 10}}>
                <View style={styles.catAppend}>
                    <Image style={styles.catIcon} source={timer} resizeMode='contain'></Image>
                    <Text style={styles.catLabel}>{getTime(cat.middletime)}</Text>
                </View>
                <View style={styles.catAppend}>
                    <Image style={styles.catIcon} source={star} resizeMode='contain'></Image>
                    <Text style={styles.catLabel}>{cat.rating}</Text>
                </View>
                <View style={styles.catAppend}>
                    <Image style={styles.catIcon} source={price} resizeMode='contain'></Image>
                    <Text style={styles.catLabel}>{getMoney(cat.min_less_summ)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

function Item(props) {
    const cart = useSelector(state => state.cart);
    const item = props.item;
    if(item.item.empty !== undefined) {
        return <View style={{width: '50%', height: 10}}></View>
    }
    const inCart = cart.items.find((i) => (item.item.title === i.item.title));
    const add = inCart != undefined ? <CartBar item={item.item} value={inCart.count}/> : (
        <TouchableOpacity style={styles.phoneButton} onPress={() => props.addToCart(item.item)}>
            <Text style={styles.phoneText}>Добавить</Text>
        </TouchableOpacity>
    );

    return (
        <TouchableWithoutFeedback onPress={() => props.showItem(item.item)}>
            <View style={styles.item}>
                <View style={{alignItems: 'center'}}>
                    <Image source={{uri: item.item.image_url}} resizeMode={'contain'} style={styles.itemImage} />
                </View>
                <Text style={styles.itemPrice}>{item.item.price.toFixed(2)} ₽</Text>
                <Text numberOfLines={2}
                style={styles.itemText}>{item.item.title}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                    <Text>{item.item.flag}</Text> 
                    <Text style={styles.itemFlag}>{item.item.country}</Text>
                </View>
                {add}
            </View>
        </TouchableWithoutFeedback>
    );
}

function CartBar(props) {
    const dispath = useDispatch();
    const token = useSelector(state => state.token);

    const add = () => {
        dispath(addItem(props.item));
        send('api/cart/addtocart', 'POST', {"product.id": props.item.id, num: 1}, () => {}, token);
        send('api/cart/getcart', 'POST', {}, () => {}, token);
    }

    const remove = () => {
        dispath(removeItem(props.item));
        send('api/cart/deletefromcart', 'POST', {"product.id": props.item.id, num: 1}, () => {}, token);
    }

    return (
        <View style={styles.cartBar}>
            <TouchableOpacity style={[styles.cartButton, {backgroundColor: '#f2f3f5'}]} onPress={remove}>
                <Image source={minus} style={styles.cartImage} resizeMode={'contain'} />
            </TouchableOpacity>
            <Text style={styles.cartText}>{props.value} шт.</Text>
            <TouchableOpacity style={[styles.cartButton, {backgroundColor: '#f1c40f'}]} onPress={add}>
                <Image source={plus} style={styles.cartImage} resizeMode={'contain'} />
            </TouchableOpacity>
        </View>
    );
    
}

export function CatalogScreen({navigation}) {
    const token = useSelector(state => state.token);
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const [query, setQuery] = useState("");

    const load = (json) => {
        setLoaded(true);
        const list = json;
        setData(list);
        setFiltered(list);
    };

    const filter = (value) => {
        setQuery(value);
        const list = data.filter((item) => {
            return item.title.toLowerCase().search(value.toLowerCase()) !== -1;
        });
        setFiltered(list);    
    }

    useEffect(() => {
        if(!isLoaded) {
            send('api/restaurants/get', 'GET', {area_name: "Дмитров"}, load, token);
            //send('api/category/get', 'GET', {}, load, token);
        }
    });
    
    const restaurants = data.map((item) => {
        return (
            <Category cat={item} />
        );
    });

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <SearchBar placeholder="Поиск по ресторанам" value={query} onChangeText={filter} />
            <ScrollView style={{width: '90%'}}>
                {restaurants}
            </ScrollView>
            <NavigationBar navigation={navigation} routeName="Catalog"/>
        </View>
    );
}

export function ProductScreen({navigation}) {
    const token = useSelector(state => state.token);
    const route = useRoute();
    let { subs } = route.params;
    const dispath = useDispatch();
    const title = route.params.banner !== undefined ? route.params.banner : route.params.title;
    const spec = route.params.banner !== undefined;
    const [data, setData] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const [sub, setSub] = useState(-1);
    const [offset, setOffset] = useState(0);
    const [query, setQuery] = useState("");
    const [chosen, setChosen] = useState(null);
    const [modal, setModal] = useState(false);

    const num = 5;

    const setCart = (json) => {
        const cart = json.filter((item) => (item.id !== undefined)).map((item) => {
            return {item: {...item.product[0]}, count: item.num};
        });
        dispath(loadCart(cart));
    }

    useEffect(() => {
        send('api/cart/getcart', 'POST', {}, setCart, token);
        if (route.params.query !== undefined) {
            setQuery(route.params.query);
        }
    }, []);
    

    const upload = () => {
        setOffset(offset + num);
        setLoaded(false);
    }

    const filterQuery = (value) => {
        setOffset(0);
        setQuery(value);
        const title = "Все категории" ? "all" : title;
        let data = {title: value, offset: offset, num: num, search: query};
        if (sub !== -1) {
            data.subcategory = subs[sub];
        }
        send('api/catalog/getbycategory', 'GET', data, (json) => {
            if(json.details !== undefined) {
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
        dispath(addItem(item));
        setModal(false);
        send('api/cart/addtocart', 'GET', {"product.id": item.id, num: 1}, token);
    }

    useEffect(() => {
        if(!isLoaded) {
            const value = title === "Все категории" ? "all" : title;
            let data = {title: value, offset: offset, num: num, search: query};
            if (spec) {
                data.special_offer = true;
            }
            if (sub !== -1) {
                data.subcategory = subs[sub];
            }
            send('api/catalog/getbycategory', 'GET', data, load, token);
        }
    });

    return (
        <View style={[styles.container, {backgroundColor: '#fff'}]}>
            <StatusBar style="light" />
            <SearchBar placeholder="Поиск по категории" value={query} onChangeText={filterQuery} />
            <ModalItem item={chosen} visible={modal} onClose={() => {setModal(false)}} addInCart={addToCart} />
            <View style={{flexDirection: 'row', width: '100%'}}>
                <FlatList data={subs} renderItem={
                    (item) => {
                        const color = sub === item.index ? [styles.subButton, {backgroundColor: '#cccccc'}] : styles.subButton; 
                        return (
                            <TouchableOpacity style={color} onPress={() => {
                                setOffset(0);
                                const title = "Все категории" ? "all" : title;
                                let data = {title: title, offset: 0, num: num, search: query};
                                if (sub !== item.index) {
                                    data.subcategory = subs[item.index];
                                }
                                send('api/catalog/getbycategory', 'GET', data, (json) => {
                                    if(json.details !== undefined) {
                                        return;
                                    }
                                    setData(json);
                                }, token);
                                setSub(sub === item.index ? -1 : item.index);
                            }}>
                                <Text style={styles.subText}>{item.item}</Text>
                            </TouchableOpacity>
                        );
                    }
                } horizontal={true} style={{width: '70%'}}
                showsHorizontalScrollIndicator={false} />
                <View style={{width: '30%', alignItems: 'center'}}>
                    <TouchableOpacity style={styles.subFilter}>
                        <Text style={styles.subText}>ФИЛЬТРЫ</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList onEndReachedThreshold={0.1}
            numColumns={2} columnWrapperStyle={styles.oneRow} 
            onEndReached={upload} keyExtractor={(item, index) => item.title} data={data.length % 2 === 1 ? [...data, {empty: true}] : data} renderItem={
              (item) => <Item item={item} addToCart={addToCart} showItem={showModal} />
            }/>
            <NavigationBar navigation={navigation} routeName="Catalog"/>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f3f5',
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
        marginVertical: 10,
        paddingHorizontal: 10
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
        paddingVertical: 10
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
    }
});
