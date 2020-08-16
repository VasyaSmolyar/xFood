import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, FlatList, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import send from './utils/net'
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
import { Carousel } from './components/Carousel/index';

export default function MainScreen({navigation}) {
    const [query, setQuery] = useState('');
    const [banners, setBanners] = useState([]);
    const [bid, setBid] = useState(0);
    const [sections, setSections] = useState([]);
    const token = useSelector(state => state.token);

    useEffect(() => {
        send('api/main/get', 'POST', {}, (json) => {
            setBanners(json.banners);
            setSections(json.sections);
        }, token);
    }, []);

    const banner = banners.map((banner, index) => {
        return {
            value: (
            <TouchableWithoutFeedback>
                <Image source={{uri: banner.image}} style={{width: '95%', height: 200, resizeMode: 'contain'}} />
            </TouchableWithoutFeedback>
            )
        }
    });

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <SearchBar placeholder="Поиск на xBeer" value={query} onChangeText={setQuery} />
            <View style={{width: '100%'}}>
                <Carousel style="stats" itemsPerInterval={1} items={banner} />
                <Text style={styles.header}>Рекомендуемые</Text>
                <Text style={styles.header}>Популярные товары</Text>
            </View>
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
    }
});