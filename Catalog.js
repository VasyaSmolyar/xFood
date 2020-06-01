import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Button, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import send from './utils/net'
import { addItem } from './utils/store';
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';

function Category(props) {
    const navigation = useNavigation();
    if(props.empty !== undefined) {
        return <View style={{width: '45%', height: 10}}></View>
    }
    return (
        <TouchableOpacity style={styles.category} onPress={() => navigation.navigate('Products', {title: props.title, subs: props.subs})}>
            <Text style={styles.catText}>{props.title}</Text>
            <Image source={{uri: props.image}} resizeMode={'contain'} style={styles.catImage} />
        </TouchableOpacity>
    )
}

function Item(props) {
    const item = props.item;
    if(item.item.empty !== undefined) {
        return <View style={{width: '50%', height: 10}}></View>
    }
    return (
        <View style={styles.item}>
            <View style={{alignItems: 'center'}}>
                <Image source={{uri: item.item.image_url}} resizeMode={'contain'} style={styles.itemImage} />
            </View>
            <Text style={styles.itemPrice}>{item.item.price}₽</Text>
            <Text numberOfLines={2}
            style={styles.itemText}>{item.item.title}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <Text>{item.item.flag}</Text> 
                <Text style={styles.itemFlag}>{item.item.country}</Text>
            </View>
            <TouchableOpacity style={styles.phoneButton} onPress={() => props.addToCart(item.item)}>
                <Text style={styles.phoneText}>Добавить</Text>
            </TouchableOpacity>
        </View>
    );
}

function CartBar() {
    const cart = useSelector(state => state.cart);
    const dispath = useDispatch();
    const token = useSelector(state => state.token.value);

    const setCart = (json) => {
        const cart = json.map((item) => {
            return {item: {...item.product[0]}, count: item.num};
        });
        dispath(loadCart(cart));
    }

    useEffect(() => {
        send('api/cart/getcart', 'POST', {}, setCart, token);
    }, []);

    return (
        <View>
            
        </View>
    );
    
}

export function CatalogScreen({navigation}) {
    const token = useSelector(state => state.token.value);
    const [data, setData] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const load = (json) => {
        setLoaded(true);
        const list = json.map((item) => {
            return {
                key: item.id,
                title: item.title,
                poster_url: item.poster_url,
                subcategories: item.subcategories
            };
        });
        setData(list);
    };

    useEffect(() => {
        if(!isLoaded) {
            send('api/category/get', 'GET', {}, load, token);
        }
    });

    return (
        <View style={styles.container}>
            <SearchBar placeholder={"Поиск по категориям"} />
            <FlatList numColumns={2} columnWrapperStyle={styles.oneRow}
            keyExtractor={(item, index) => item.key.toString()} 
            data={data.length % 2 === 1 ? [...data, {empty: true}] : data}
            contentContainerStyle={styles.catList} renderItem={(item) => 
            <Category title={item.item.title} image={item.item.poster_url} empty={item.empty} subs={item.item.subcategories} />}/>
            <NavigationBar navigation={navigation} />
        </View>
    );
}

export function ProductScreen({navigation}) {
    const token = useSelector(state => state.token.value);
    const route = useRoute();
    let { subs } = route.params;
    const dispath = useDispatch();
    const { title } = route.params;
    const [data, setData] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const [offset, setOffset] = useState(0);
    const num = 5;

    const upload = () => {
        setOffset(offset + num);
        setLoaded(false);
    }

    const load = (json) => {
        setLoaded(true);
        if(json.details !== undefined) {
            return;
        }
        setData([...data,...json]);
    };

    const addToCart = (item) => {
        dispath(addItem(item));
        send('api/cart/addtocart', 'POST', {"product.id": item.id, num: 1}, () => {}, token);
        navigation.navigate('Cart');
    }

    useEffect(() => {
        if(!isLoaded) {
            const value = title === "Все категории" ? "all" : title;
            send('api/catalog/getbycategory', 'GET', {title: value, offset: offset, num: num}, load, token);
        }
    });

    return (
        <View style={[styles.container, {backgroundColor: '#fff'}]}>
            <SearchBar placeholder={"Поиск по категории"} />
            <View style={{flexDirection: 'row', width: '100%'}}>
                <FlatList data={subs} renderItem={
                    (item) => (
                    <TouchableOpacity style={styles.subButton}>
                        <Text style={styles.subText}>{item.item}</Text>
                    </TouchableOpacity>
                    )
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
            onEndReached={upload} keyExtractor={(item, index) => item.title} data={data.length % 2 === 1 ? [...data, {empty: true}] : data}  renderItem={
              (item) => <Item item={item} addToCart={addToCart} />
            }/>
            <NavigationBar navigation={navigation} />
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        width: '45%',
        backgroundColor: '#fff',
        marginVertical: 5
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
        width: 70,
        height: 70
    },
    catText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 14,
        maxWidth: 65,
        marginLeft: 10
    },
    catList: {
        width: '100%'
    },
    oneRow: {
        justifyContent: 'space-around'
    },
    phoneButton: {
		backgroundColor: '#f1c40f',
		textAlign: 'center',
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
        backgroundColor: "#f2f3f5",
        borderRadius: 5
    },
    subText: {
        fontFamily: 'Tahoma-Regular', 
		fontSize: 14, 
    },
    subFilter: {
        padding: 10,
    }
});
