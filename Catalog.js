import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import send from './utils/net'
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
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
        return "от " + amount + " ₽";
    }

    return (
        <TouchableOpacity style={styles.category} onPress={() => navigation.navigate('Products', {
                title: cat.title, id: cat.id, subs: cat.categories, other: cat
            })}>
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

export default function RestaurantScreen({navigation}) {
    const token = useSelector(state => state.token);
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const [query, setQuery] = useState("");

    const load = (json) => {
        setLoaded(true);
        const list = json.resturants;
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
        }
    });
    
    const restaurants = data.map((item) => {
        return (
            <Category cat={item} />
        );
    });

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <SearchBar placeholder="Поиск по ресторанам" value={query} onChangeText={filter} />
            <View style={{width: '100%', paddingHorizontal: 13}}>
                <Text style={styles.header}>Рестораны</Text>
            </View>
            <ScrollView style={{width: '90%'}}>
                {restaurants}
            </ScrollView>
            <NavigationBar navigation={navigation} routeName="Catalog"/>
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
    category: {
        width: '100%',
        borderRadius: 20,
        backgroundColor: '#f2f3f5',
        marginTop: 5,
        marginBottom: 20,
        paddingBottom: 10
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
        width: 15,
        height: 15
    },
    catLabel: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 14,
        marginLeft: 10,
    },
    catAppend: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    oneRow: {
        justifyContent: 'space-around'
    },
    header: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
        paddingVertical: 10
    },
});
