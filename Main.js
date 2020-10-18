import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Image, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import send from './utils/net'
import useCart from './utils/cartHook';
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
import ModalItem from './components/ModalItem';
import { Carousel } from './components/Carousel/index';
import Item from './components/Item';

export default function MainScreen({navigation}) {
    const [query, setQuery] = useState('');
    const [banners, setBanners] = useState([]);
    const [sections, setSections] = useState([]);
    const token = useSelector(state => state.token);
    const dispath = useDispatch();
    const [chosen, setChosen] = useState(null);
    const [visible, setVisible] = useState(false);
    const {cart, addItem, removeItem, loadCart} = useCart([], token);

    useEffect(() => {
        send('api/main/get', 'POST', {}, (json) => {
            setBanners(json.banners);
            setSections(json.sections);
        }, token);
    }, []);

    const banner = banners.map((banner) => {
        return {
            value: (
            <TouchableWithoutFeedback pressRetentionOffset={5}
            onPress={() => {navigation.navigate('Products', {title: "all", banner: banner.code})}}>
                <Image source={{uri: banner.image}} style={{width: '95%', height: 200, resizeMode: 'contain', borderRadius: 20}} />
            </TouchableWithoutFeedback>
            )
        }
    });

    const choiceItem = (item) => {
        setChosen(item);
        setVisible(true);
    };

    const setCart = (json) => {
        const cart = json.items.map(item => {
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
        dispath(addItem(item));
        setVisible(false);
        send('api/cart/addtocart', 'POST', {"product.id": item.id, num: 1}, () => {}, token);
    }

    const seacrhMethod = () => {
        navigation.navigate('Products', {title: "all", query: query});
    }

    const sectors = Object.keys(sections).map((key) => {
        const items = sections[key].map((item, index) => {
            return <Item item={{item: item}} cart={cart} addToCart={addToCart} removeFromCart={removeItem} 
            showItem={choiceItem} length={sections.length} index={index} />;
        });

        return (
            <View key={key}>
                <Text style={styles.header}>{key}</Text>
                <View style={styles.flat}>
                {items}
                </View>
            </View>
        );
    }); 

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <ModalItem item={chosen} visible={visible} onClose={() => {setVisible(false)}} addInCart={addToCart} />
            <SearchBar placeholder="Поиск на xFood" value={query} onChangeText={setQuery} onSubmitEditing={seacrhMethod} />
            <ScrollView style={{width: '100%'}}>
                <Carousel style="stats" itemsPerInterval={1} items={banner} />
                {sectors}
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
    },
    header: {
        fontWeight: "bold",
        fontSize: 23,
        fontFamily: 'Tahoma-Regular',
        padding: 15,
        paddingLeft: 10,
        marginTop: 10
    },
    item: {
        width: '50%',
        backgroundColor: '#fff',
        marginVertical: 10,
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
        flexDirection: 'row'
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