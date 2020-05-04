import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import send from './utils/net'

function Category(props) {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.navigate('Products', {id: props.catId})}>
            <Text>{props.title}</Text>
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
                title: item.title 
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
            <Category catId={0} title="Все категории"/>
            <FlatList keyExtractor={(item, index) => item.key.toString()} data={data} renderItem={(item) => <Category catId={item.item.key} title={item.item.title}/>}/>
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
	}
});

export function ProductScreen(props) {
    return <View>
        <Text>Products here</Text>
    </View>
}