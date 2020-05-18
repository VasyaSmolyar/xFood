import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Button, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import send from './utils/net'
import { addItem } from './utils/store';

function Category(props) {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={styles.category} onPress={() => navigation.navigate('Products', {title: props.title})}>
            <Text style={styles.catText}>{props.title}</Text>
            <Image source={{uri: props.image}} resizeMode={'contain'} style={styles.catImage} />
        </TouchableOpacity>
    )
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
            <Category title="Все категории"/>
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
    const num = 3;

    const upload = () => {
        setOffset(offset + num);
        setLoaded(false);
    }

    const load = (json) => {
        setLoaded(true);
        if(load.details !== undefined) {
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
        <View>
            <FlatList style={styles.item} onEndReachedThreshold={0.05} 
            onEndReached={upload} keyExtractor={(item, index) => item.title} data={data}  renderItem={
              (item) => (
                    <View>
                        <Text>{item.item.title}</Text>
                        <Button title="Добавить" onPress={() => addToCart(item.item)} />
                    </View>
                )
            }/>
        </View>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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
        justifyContent: 'space-around',
        width: '40%'
    },
    catImage: {
        width: 75,
        height: 75
    },
    catText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 16,
        marginRight: 5,
        maxWidth: 100
    },
    catList: {
        
    },
    oneRow: {
        flex: 1,
        justifyContent: "space-around"
    } 
});
