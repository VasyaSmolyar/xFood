import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import send from './utils/net'
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
import ModalItem from './components/ModalItem';
import { addItem, loadCart, removeItem } from './utils/store';
import { Carousel } from './components/Carousel/index';
import minus from './files/minus.png';
import plus from './files/plus.png';

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

function Item(props) {
    const cart = useSelector(state => state.cart);
    const item = props.item;
    if(item.empty !== undefined) {
        return <View style={{width: '50%', height: 10}}></View>
    }
    const inCart = cart.items.find((i) => (item.title === i.item.title));
    const add = inCart != undefined ? <CartBar item={item} value={inCart.count}/> : (
        <TouchableOpacity style={styles.phoneButton} onPress={() => props.addToCart(item)}>
            <Text style={styles.phoneText}>Добавить</Text>
        </TouchableOpacity>
    );

    return (
        <TouchableWithoutFeedback onPress={props.showItem}>
            <View style={styles.item}>
                <View style={{alignItems: 'center'}}>
                    <Image source={{uri: item.image_url}} resizeMode={'contain'} style={styles.itemImage} />
                </View>
                <Text style={styles.itemPrice}>{item.price} ₽</Text>
                <Text numberOfLines={2}
                style={styles.itemText}>{item.title}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                    <Text>{item.flag}</Text> 
                    <Text style={styles.itemFlag}>{item.country}</Text>
                </View>
                {add}
            </View>
        </TouchableWithoutFeedback>
    );
}

export default function MainScreen({navigation}) {
    const [query, setQuery] = useState('');
    const [banners, setBanners] = useState([]);
    const [sections, setSections] = useState([]);
    const token = useSelector(state => state.token);
    const dispath = useDispatch();
    const [chosen, setChosen] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        send('api/main/get', 'POST', {}, (json) => {
            setBanners(json.banners);
            setSections(json.sections);
        }, token);
    }, []);

    const banner = banners.map((banner) => {
        return {
            value: (
            <TouchableWithoutFeedback pressRetentionOffset={5} onPress={() => {navigation.navigate('Products', {title: "all", banner: banner.code})}}>
                <Image source={{uri: banner.image}} style={{width: '95%', height: 200, resizeMode: 'contain'}} />
            </TouchableWithoutFeedback>
            )
        }
    });

    const choiceItem = (item) => {
        setChosen(item);
        setVisible(true);
    };

    const setCart = (json) => {
        const cart = json.filter((item) => (item.id !== undefined)).map((item) => {
            return {item: {...item.product[0]}, count: item.num};
        });
        dispath(loadCart(cart));
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
        const items = sections[key].map((item) => {
            return <Item item={item} showItem={() => {choiceItem(item)}} addToCart={addToCart} />
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
            <StatusBar style="light" />
            <ModalItem item={chosen} visible={visible} onClose={() => {setVisible(false)}} addInCart={addToCart} />
            <SearchBar placeholder="Поиск на xBeer" value={query} onChangeText={setQuery} onSubmitEditing={seacrhMethod} />
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
        fontSize: 20,
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