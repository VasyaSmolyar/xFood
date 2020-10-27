import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, Keyboard} from 'react-native';
import cancel from './files/xorder.png';
import { s, vs, ms, mvs } from 'react-native-size-matters';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import send from './utils/net';
import { writeToken } from './utils/token';
import { setToken, setUser } from './utils/store';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

export default function RegisterScreen({navigation}) {
    const route = useRoute();
    const [ name, setName ] = useState("");

	let { phone, code } = route.params; 
	const dispath = useDispatch();
	let data = {};
	data.phone = phone;
	//data.username = phone;
	data.password = code;
	data.code = code;

	const navigate = (json) => {
        dispath(setToken(json.login, json.times, json.token));
		dispath(setUser(name, phone));
		navigation.navigate('Catalog');
	};

	const press = (text) => {
        if(text !== "") {
            data.first_name = name;
        }
        Keyboard.dismiss();
        console.log(data);
		send('api/user/create', 'POST', data, navigate);
    };
    
    const onExit = () => {
        press('');
        //navigation.navigate('Catalog');
    }

    return (
		<View style={styles.container}>
			<StatusBar style="auto" />
            <View style={styles.boxContainer}>
                    <View>
                        <View style={styles.headerContainer}>
                            <View style={styles.headerCell}></View>
                            <View style={[styles.headerCell, {flex: 3}]}>
                                <Text style={styles.header}>Регистрация</Text>
                            </View>
                            <View style={styles.headerCell}>
                                <TouchableOpacity onPress={onExit}>
                                    <Image source={cancel} style={{width: s(20), height: vs(20)}} resizeMode='contain' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{backgroundColor: '#fff', paddingHorizontal: 25}}>
                            <View style={styles.geoWrap}>
                                <Text style={styles.inputWrapText}>Имя</Text>
                                <TextInput value={name} style={styles.phone} onChangeText={(text) => setName(text)} />
                            </View>
                        </View>
                    </View>
                    <View style={{paddingHorizontal: 25}}>
                    <TouchableOpacity style={[styles.geoButton, {paddingVertical: 15}]} onPress={() => press(name)}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.geoText}>Сохранить изменения</Text>
                        </View>
                    </TouchableOpacity>
                    </View>
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    boxContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        paddingTop: Constants.statusBarHeight
    },
    headerContainer: {
        flexDirection: 'row',
        paddingVertical: 20,
        borderBottomWidth: 2,
        borderBottomColor: "#f4f4f4",
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    headerCell: {
        flex: 1,
        alignItems: 'center'
    },
    header: {
        fontFamily: 'Tahoma-Regular', 
        fontWeight: 'bold',
        fontSize: 18
    },
    geoWrap: {
        padding: 5,
		backgroundColor: "#f2f3f5",
        marginTop: 10,
        borderRadius: 7,
        marginBottom: 10
    },
    inputWrap: {
		padding: 5,
		backgroundColor: "#f2f3f5",
        marginBottom: 20,
		borderRadius: 7,
		width: '45%',
	},
	inputWrapText: {
		fontFamily: 'Tahoma-Regular', 
		fontSize: 12,
		color: '#a7aaaf',
    },
    phone: {
		backgroundColor: '#f2f3f5', 
		fontSize: 18,
    },
    geoButton: {
		backgroundColor: '#f08741',
        paddingVertical: 20,
        marginBottom: 15,
		marginHorizontal: 5,
		borderRadius: 15,
		width: '100%',
		alignItems: 'center'
	},
	geoText: {
		fontFamily: 'Tahoma-Regular', 
        fontSize: 16,
        fontWeight: 'bold', 
		color: 'white'
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
});
