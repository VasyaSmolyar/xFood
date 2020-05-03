import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import send from './utils/net'

export default function CatalogScreen({navigation}) {
    const token = useSelector(state => state.token.value);
    const [data, setData] = useState({});
    const [isLoaded, setLoaded] = useState(false);
    console.log("My data: ");
    console.log(data);
    const list = data !== {} ? <Text>{JSON.stringify(data)}</Text> : null;
    const load = (json) => {
        setLoaded(true);
        setData(json);
    };
    useEffect(() => {
        if(!isLoaded) {
            send('api/category/get', 'GET', {}, load, token);
        }
    });
    return (
        <View style={styles.container}>
            <Text>Токен: {token}</Text>
            {list}
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
