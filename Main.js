import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import send from './utils/net'
import { addItem } from './utils/store';
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
import ModalItem from './components/ModalItem';
import { Carousel } from './components/Carousel/index';

function Item(props) {
    const item = props.item;
    if(item.empty !== undefined) {
        return <View style={{width: '50%', height: 10}}></View>
    }

    return (
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
            <TouchableOpacity style={styles.phoneButton} onPress={() => props.addToCart(item)}>
                <Text style={styles.phoneText}>Добавить</Text>
            </TouchableOpacity>
        </View>
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
            <TouchableWithoutFeedback>
                <Image source={{uri: banner.image}} style={{width: '95%', height: 200, resizeMode: 'contain'}} />
            </TouchableWithoutFeedback>
            )
        }
    });

    const choiceItem = (item) => {
        setChosen(item);
        setVisible(true);
    };

    const addInCart = (item) => {
        dispath(addItem(item));
        send('api/cart/addtocart', 'POST', {"product.id": item.id, num: 1}, () => {}, token);
        setVisible(false);
        navigation.navigate('Products', {title: "all"});
    }

    const seacrhMethod = () => {
        navigation.navigate('Products', {title: "all", query: query});
    }

    const sectors = Object.keys(sections).map((key) => {
        const items = sections[key].map((item) => {
            return <Item item={item} addToCart={() => {choiceItem(item)}}/>
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
            <ModalItem item={chosen} visible={visible} onClose={() => {setVisible(false)}} addInCart={addInCart} />
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
    }
});