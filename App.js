import React, {useState} from 'react';
import { NavigationContainer, useRoute} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground, Image } from 'react-native';
import { createStore, combineReducers } from 'redux';
import { Provider, useDispatch } from 'react-redux';
import * as Font from 'expo-font';
import { useFonts } from '@use-expo/font';
import { AppLoading } from 'expo';
import send from './utils/net';
import { tokenReducer, setToken, cartReducer } from './utils/store';
import { CatalogScreen, ProductScreen } from './Catalog';
import CartScreen from './Cart';
import background from './files/background.png';
import logo from './files/logo.png';
import tahoma from './files/tahoma.ttf';

const Stack = createStackNavigator();
const sample = {
	birthday: "2000-01-01",
	first_name: "Иван",
	last_name: "Петров"
};

function AuthScreen({navigation}) {
	return (
		<View style={styles.container}>
			<ImageBackground source={background} style={styles.backContainer}>
				<View style={styles.opac}>
				</View>
				<Image source={logo} style={{width: '50%', height: '15%', resizeMode: 'contain'}}/>
				<TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('Phone')}>
					<Text style={styles.text}>Авторизация</Text>
				</TouchableOpacity>
			</ImageBackground>
		</View>
		);
	}

function PhoneScreen({navigation}) {
	const [value, setValue] = useState('');
	const navigate = json => {
		navigation.navigate('Code', {phone: value, isExisting: json.isExisting});
	};
	const press = () => {
		send('api/user/auth', 'POST', {phone: value}, navigate);
	};

	return (
		<View style={styles.backContainer}>
			<View style={{flex: 1, backgroundColor: 'white'}}>
			</View>
			<View style={{flex: 4, backgroundColor: 'white', alignItems: 'center'}}>
				<Text style={styles.header} >Регистрация или вход</Text>
				<TextInput value={value} onChange={() => setValue(event.target.value)} maxLength = {10} style={styles.phone} keyboardType='phone-pad' />
				<TouchableOpacity style={styles.phoneButton} onPress={() => press()}>
					<Text style={styles.phoneText} >Отправить код</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

function CodeScreen({navigation}) {
	const route = useRoute();
	const {phone, isExisting} = route.params;
	const [value, setValue] = useState('');
	const [wrong, setWrong] = useState(false);
	const dispath = useDispatch();
	const navigate = json => {
		const valid = json.isValid === "true";
		const exist = isExisting === "true";
		if(!valid) {
			setWrong(true);
		} else if(!exist) {
			navigation.navigate('Register', {code: value, phone: phone});
		} else {
			navigation.navigate('Catalog');
			dispath(setToken(json.token));
		}
	};
	const press = () => {
		send('api/user/verify', 'POST', {phone: phone, code: value}, navigate);
	};
	const mes = <Text>Неверный код</Text>;
	let err = wrong ? mes : null;
	return (
		<View style={styles.container}>
			<View style={{flex: 1}}>
			</View>
			<View style={{flex: 3}}>
				<TextInput value={value} onChange={() => setValue(event.target.value)} style={styles.phone} keyboardType='phone-pad'></TextInput>
				{err}
				<TouchableOpacity style={styles.authButton} onPress={() => press()}>
					<Text style={{fontFamily: 'Tahoma-Regular'}}>Отправить код</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

function RegisterScreen({navigation}) {
	const route = useRoute();
	let { phone, code } = route.params; 
	const dispath = useDispatch();
	let data = sample;
	data.phone = phone;
	data.username = phone;
	data.password = code;
	data.code = code;
	const navigate = json => {
		dispath(setToken(json.token));
		navigation.navigate('Catalog');
	};
	const press = () => {
		send('api/user/create', 'POST', data, navigate);
	};
	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.authButton} onPress={() => press()}>
				<Text>Подтвердить возраст</Text>
			</TouchableOpacity>
		</View>
	);
}

const rootReducer = combineReducers({
	token: tokenReducer,
	cart: cartReducer
});

const store = createStore(rootReducer);

export default function App() {
	//const [fontLoad, setFondLoad] = useState(false);
	const fontLoad = useFonts({
		'Tahoma-Regular': tahoma
	});

	if(!fontLoad) {
		return <AppLoading />
	}

    return (
		<Provider store={store}>
			<NavigationContainer>
				<Stack.Navigator screenOptions={{headerShown: false}}>
					<Stack.Screen name="Welcome" component={AuthScreen} />
					<Stack.Screen name="Phone" component={PhoneScreen} />
					<Stack.Screen name="Code" component={CodeScreen} />
					<Stack.Screen name="Register" component={RegisterScreen} />
					<Stack.Screen name="Catalog" component={CatalogScreen} />
					<Stack.Screen name="Products" component={ProductScreen} />
					<Stack.Screen name="Cart" component={CartScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>  
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
	},
	backContainer: {
		flex: 1,
        alignItems: 'center',
		justifyContent: 'space-around',
		backgroundColor: 'white'
	},
	phoneContainer: {
		flex: 1,
		alignItems: 'center'
	},
	authButton: {
		alignItems: "center",
		backgroundColor: "#fff",
		width: '75%',
		padding: 10,
		borderRadius: 5,
	},
	phone: {
		width: '75%',
		backgroundColor: '#f2f3f5', 
		padding: 5,
		marginBottom: 30,
		fontSize: 25,
		borderRadius: 7
	},
	text: {
		fontFamily: 'Tahoma-Regular',
		fontSize: 20
	},
	opac: {
		position: 'absolute',
		top: 0,
  		bottom: 0,
  		left: 0,
  		right: 0,
		backgroundColor: 'rgba(52, 52, 52, 0.5)'
	},
	header: {
		fontFamily: 'Tahoma-Regular',
		fontSize: 30,
		marginBottom: 40
	},
	phoneButton: {
		backgroundColor: '#f1c40f',
		textAlign: 'center',
		paddingVertical: 10,
		marginHorizontal: 5,
		borderRadius: 7,
		width: '75%',
		
	},
	phoneText: {
		fontFamily: 'Tahoma-Regular', 
		fontSize: 18, 
		color: 'white'
	}
});
