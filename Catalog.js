import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Button, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import send from './utils/net'
import { addItem } from './utils/store';
import SearchBar from './components/SearchBar';

function Category(props) {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={styles.category} onPress={() => navigation.navigate('Products', {title: props.title})}>
            <Text style={styles.catText}>{props.title}</Text>
            <Image source={{uri: props.image}} resizeMode={'contain'} style={styles.catImage} />
        </TouchableOpacity>
    )
}

function Item(props) {
    const item = props.item;
    if(item.item.empty !== undefined) {
        return <View style={{width: '40%', height: 10}}></View>
    }
    return (
        <View style={styles.item}>
            <Image source={{uri: item.item.image_url}} resizeMode={'contain'} style={styles.itemImage} />
            <Text style={styles.itemPrice}>{item.item.price}₽</Text>
            <Text numberOfLines={3} ellipsizeMode='head'
            style={styles.itemText}>{item.item.title}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                <Text>{item.item.flag}</Text> 
                <Text style={styles.itemFlag}>{item.item.country}</Text>
            </View>
            <TouchableOpacity style={styles.phoneButton} onPress={() => props.addToCart(item.item)}>
                <Text style={styles.phoneText}>Добавить в корзину</Text>
            </TouchableOpacity>
        </View>
    );
}

export function CatalogScreen(props) {
    const token = useSelector(state => state.token.value);
    const [data, setData] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const load = (json) => {
        setLoaded(true);
        const list = json.map((item) => {
            return {
                key: item.id,
                title: item.title,
                poster_url: item.poster_url 
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
            {/*
            <Category title="Все категории"/>
            */}
            <SearchBar placeholder={"Поиск по категориям"} />
            <FlatList numColumns={2} columnWrapperStyle={styles.oneRow}
            keyExtractor={(item, index) => item.key.toString()} data={data} 
            contentContainerStyle={styles.catList} renderItem={(item) => 
            <Category title={item.item.title} image={item.item.poster_url} />}/>
        </View>
    );
}

export function ProductScreen({navigation}) {
    const token = useSelector(state => state.token.value);
    const route = useRoute();
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
            <View>

            </View>
            <FlatList onEndReachedThreshold={0.1}
            numColumns={2} columnWrapperStyle={styles.oneRow} 
            onEndReached={upload} keyExtractor={(item, index) => item.title} data={data.length % 2 === 1 ? [...data, {empty: true}] : data}  renderItem={
              (item) => <Item item={item} addToCart={addToCart} />
            }/>
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
        width: 140,
        backgroundColor: '#fff',
        marginHorizontal: 10,
        marginVertical: 5
    },
    item: {
        width: '40%',
        backgroundColor: '#fff',
        marginVertical: 10
    },
    itemText: {
        fontSize: 14,
        marginVertical: 5
    },
    itemFlag: {
        color: '#97999d',
        fontSize: 12,
        fontFamily: 'Tahoma-Regular',
        marginLeft: 10
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
        width: 55,
        height: 55
    },
    catText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 14,
        maxWidth: 55
    },
    catList: {
        
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
		alignItems: 'center'
	},
	phoneText: {
		fontFamily: 'Tahoma-Regular', 
		fontSize: 10, 
		color: 'white'
	}, 
});
