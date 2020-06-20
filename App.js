import React, {useState} from 'react';
import { NavigationContainer, useRoute} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground, Image } from 'react-native';
import { createStore, combineReducers } from 'redux';
import { Provider, useDispatch } from 'react-redux';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import send from './utils/net';
import { tokenReducer, setToken, setUser, cartReducer, priceReducer, userReducer } from './utils/store';
import { CatalogScreen, ProductScreen } from './Catalog';
import CartScreen from './Cart';
import PaymentScreen from './Payment';
import CabinetScreen from './Cabinet';
import background from './files/background.png';
import logo from './files/logo.png';

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
		send('api/user/auth', 'POST', {phone: "+7" + value}, navigate);
	};

	return (
		<View style={styles.backContainer}>
			<View style={{flex: 1, backgroundColor: 'white'}}>
			</View>
			<View style={{flex: 4, backgroundColor: 'white', alignItems: 'center', width: '100%'}}>
				<Text style={styles.header} >Регистрация или вход</Text>
				<View style={styles.inputWrap}>
					<Text style={styles.inputWrapText}>Номер телефона</Text>
					<TextInput value={'+7' + value} onChangeText={(text) => setValue(text.slice(2))} maxLength = {12} 
					style={styles.phone} keyboardType='phone-pad' />
				</View>
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
			navigation.navigate('Register', {code: value, phone: "+7" + phone});
		} else {
			dispath(setToken(json.login, json.times, json.token));
			dispath(setUser(sample.first_name + ' ' + sample.last_name, phone));
			navigation.navigate('Catalog');
		}
	};
	const press = () => {
		send('api/user/verify', 'POST', {phone: "+7" + phone, code: value}, navigate);
	};
	const mes = <Text style={styles.error}>Неверный код</Text>;
	let err = wrong ? mes : null;
	return (
		<View style={styles.backContainer}>
			<View style={{flex: 1, backgroundColor: 'white'}}>
			</View>
			<View style={{flex: 4, backgroundColor: 'white', alignItems: 'center', width: '100%'}}>
			<Text style={styles.header}>Ввод кода</Text>
				<TextInput value={value} onChangeText={(text) => setValue(text)} style={[styles.inputWrap, styles.phone, {textAlign: 'center'}]} keyboardType='phone-pad' />
				{err}
				<TouchableOpacity style={styles.phoneButton} onPress={() => press()}>
					<Text style={styles.phoneText}>Отправить код</Text>
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
		dispath(setToken(json.login, json.times, json.token));
		dispath(setUser(sample.first_name + ' ' + sample.last_name, phone));
		navigation.navigate('Catalog');
	};
	const press = () => {
		send('api/user/create', 'POST', data, navigate);
	};
	return (
		<View style={styles.backContainer}>
			<View style={{height: '10%', width: '100%'}}>
			</View>
			<View style={{height: '30%', width: '100%', alignItems: 'center', backgroundColor: 'white', alignItems: 'center'}}>
				<Text style={styles.header}>Регистрация или вход</Text>
				<Text style={{marginHorizontal: 15, textAlign: "center", fontFamily: 'Tahoma-Regular'}}>Минздрав предупреждает: употребление алкогольной продукции несовершеннолетними вредит здоровью</Text>
			</View>
			<View style={{height: '15%', width: '100%'}}>
			</View>
			<View style={{height: '30%', width: '100%',alignItems: 'center', backgroundColor: 'white', alignItems: 'center'}}>
				<TouchableOpacity style={[styles.confirmButtom, {backgroundColor: '#08a652'}]} onPress={() => press()}>
					<Text style={styles.phoneText}>Войти по Сбербанк ID</Text>
				</TouchableOpacity>
				<View style={styles.orContainer}>
					<View style={styles.orView}></View>
					<Text style={styles.orText}>или</Text>
					<View style={styles.orView}></View>
				</View>
				<TouchableOpacity style={[styles.confirmButtom, {backgroundColor: '#0063ad'}]} onPress={() => press()}>
					<Text style={styles.phoneText}>Войти через ЕСИА</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

let customFonts = {
	'Tahoma-Regular': require('./assets/fonts/tahoma.ttf'),
};

const rootReducer = combineReducers({
	token: tokenReducer,
	cart: cartReducer,
	prices: priceReducer,
	user: userReducer
});

const store = createStore(rootReducer);

function AppFunc() {
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
					<Stack.Screen name="Payment" component={PaymentScreen} />
					<Stack.Screen name="Cabinet" component={CabinetScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>  
    );
}

export default class App extends React.Component {
	state = {
	  fontsLoaded: false,
	};
  
	async _loadFontsAsync() {
	  await Font.loadAsync(customFonts);
	  this.setState({ fontsLoaded: true });
	}
  
	componentDidMount() {
	  this._loadFontsAsync();
	}
  
	render() {
	  if (this.state.fontsLoaded) {
		return (
		  <AppFunc />
		);
	  } else {
		return <AppLoading />;
	  }
	}
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
		backgroundColor: '#f2f3f5', 
		fontSize: 25,
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
		paddingVertical: 10,
		marginHorizontal: 5,
		borderRadius: 7,
		width: '75%',
		alignItems: 'center'
	},
	phoneText: {
		fontFamily: 'Tahoma-Regular', 
		fontSize: 18, 
		color: 'white'
	},
	confirmButtom: {
		backgroundColor: '#f1c40f',
		alignItems: 'center',
		paddingVertical: 10,
		marginHorizontal: 5,
		borderRadius: 7,
		width: '90%',
		marginBottom: 10
	},
	inputWrap: {
		padding: 5,
		backgroundColor: "#f2f3f5",
		marginBottom: 30,
		borderRadius: 7,
		width: '75%',
	},
	inputWrapText: {
		fontFamily: 'Tahoma-Regular', 
		fontSize: 10,
		color: '#a7aaaf',
		textAlignVertical: 'center'
	},
	orText : {
		fontFamily: 'Tahoma-Regular', 
		fontSize: 14,
		color: '#a7aaaf',
		textAlignVertical: 'center'
	},
	orView: {
		height: 2,
		width: '37%',
		backgroundColor: '#a7aaaf',
		marginHorizontal: 5
	},
	orContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 10,
		width: '100%',
		color: '#a7aaaf',
		marginBottom: 10,
	},
	error : {
		fontFamily: 'Tahoma-Regular', 
		fontSize: 14,
		color: 'red',
		textAlignVertical: 'center',
		marginTop: -20,
		paddingBottom: 10
	},
});
