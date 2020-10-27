import React, { useState, useEffect } from 'react';
import { NavigationContainer, useRoute} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Keyboard, View, TouchableOpacity, TextInput } from 'react-native';
import ScalableText from 'react-native-text';
import { createStore, combineReducers } from 'redux';
import { Provider, useDispatch } from 'react-redux';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { StatusBar } from 'expo-status-bar';
import send from './utils/net';
import { readToken, writeToken } from './utils/token';
import { tokenReducer, setToken, setUser, cartReducer, priceReducer, userReducer, codeReducer } from './utils/store';
import RestaurantScreen from './Catalog';
import ProductScreen from './Product';
import CartScreen from './Cart';
import PaymentScreen from './Payment';
import CabinetScreen from './Cabinet';
import CouponScreen from './Coupons';
import OrderListScreen from './OrderList';
import MainScreen from './Main';
import AboutScreen from './AboutScreen';
import ChatScreen from './ChatScreen';
import Welcome from './Welcome';
import RegisterScreen from './Register';
import { s, vs, ms, mvs } from 'react-native-size-matters';

const Stack = createStackNavigator();

function AuthScreen({navigation}) {

	const dispath = useDispatch();

	useEffect(async () => {
		const myToken = await readToken();
		console.log(myToken);
		send('api/user/get', 'POST', {}, (json) => {
			if(json.detail !== undefined) {
				return;
			}
			dispath(setUser(json.first_name, json.phone));
			send('api/user/reauth', 'POST', {}, (res) => {
				dispath(setToken(res.login, res.times, res.token));
				navigation.navigate('Catalog');
			}, myToken);
		}, myToken);
	}, []);

	return (
			<Welcome navigation={navigation} />
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
			<StatusBar style="dark" />
			<View style={{flex: 1, backgroundColor: 'white'}}>
			</View>
			<View style={{flex: 4, backgroundColor: 'white', alignItems: 'center', width: '100%'}}>
				<ScalableText style={styles.header} >Регистрация или вход</ScalableText>
				<View style={styles.inputWrap}>
					<ScalableText  style={styles.inputWrapText}>Номер телефона</ScalableText>
					<TextInput value={'+7' + value} onChangeText={(scalabletext) => setValue(scalabletext.slice(2))} maxLength = {12} 
					style={styles.phone} keyboardType='phone-pad' />
				</View>
				<TouchableOpacity style={styles.phoneButton} onPress={() => press()}>
					<ScalableText style={styles.phoneText}>Отправить код</ScalableText >
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
		if(!valid) {
			setWrong(true);
		} else {
			writeToken(json);
			//dispath(setUser(sample.first_name, phone));
			if(isExisting === "true") {
				dispath(setToken(json.login, json.times, json.token));
				readToken().then((myToken) => {
					send('api/user/get', 'POST', {}, (json) => {
						if(json.detail !== undefined) {
							return;
						}
						dispath(setUser(json.first_name, json.phone));
						navigation.navigate('Catalog');
					}, myToken);
				});
			} else {
				navigation.navigate('Register', {code: value, phone: "+7" + phone});
			}
		}
	};

	const press = () => {
		Keyboard.dismiss();
		send('api/user/verify', 'POST', {phone: "+7" + phone, code: value}, navigate);
	};

	const mes = <ScalableText style={styles.error}>Неверный код</ScalableText>;
	let err = wrong ? mes : null;
	return (
		<View style={styles.backContainer}>
			<StatusBar style="dark" />
			<View style={{flex: 1, backgroundColor: 'white'}}>
			</View>
			<View style={{flex: 4, backgroundColor: 'white', alignItems: 'center', width: '100%'}}>
			<ScalableText style={styles.header}>Ввод кода</ScalableText>
			<TextInput value={value} onChangeText={(scalabletext) => setValue(scalabletext)} style={[styles.inputWrap, styles.phone, {textAlign: 'center'}]} keyboardType='phone-pad' />
			{err}
			<TouchableOpacity style={styles.phoneButton} onPress={() => press()}>
				<ScalableText style={styles.phoneText}>Отправить код</ScalableText>
			</TouchableOpacity>
			</View>
		</View>
	);
}

/*
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
		writeToken(json);
		dispath(setToken(json.login, json.times, json.token));
		dispath(setUser(sample.first_name + ' ' + sample.last_name, phone));
		navigation.navigate('Catalog');
	};

	const press = () => {
		send('api/user/create', 'POST', data, navigate);
	};

	return (
		<View style={styles.backContainer}>
			<StatusBar style="dark" />
			<View style={{height: '10%', width: '100%'}}>
			</View>
			<View style={{height: '30%', width: '100%', alignItems: 'center', backgroundColor: 'white', alignItems: 'center'}}>
				<ScalableText style={styles.header}>Регистрация или вход</ScalableText>
				<ScalableText style={{marginHorizontal: 15, textAlign: "center", fontFamily: 'Tahoma-Regular'}}>Минздрав предупреждает: употребление алкогольной продукции несовершеннолетними вредит здоровью</ScalableText>
			</View>
			<View style={{height: '15%', width: '100%'}}>
			</View>
			<View style={{height: '30%', width: '100%',alignItems: 'center', backgroundColor: 'white', alignItems: 'center'}}>
				<TouchableOpacity style={[styles.confirmButtom, {backgroundColor: '#08a652'}]} onPress={() => press()}>
					<ScalableText style={styles.phoneText}>Войти по Сбербанк ID</ScalableText>
				</TouchableOpacity>
				<View style={styles.orContainer}>
					<View style={styles.orView}></View>
					<ScalableText style={styles.orText}>или</ScalableText>
					<View style={styles.orView}></View>
				</View>
				<TouchableOpacity style={[styles.confirmButtom, {backgroundColor: '#0063ad'}]} onPress={() => press()}>
					<ScalableText style={styles.phoneText}>Войти через ЕСИА</ScalableText>
				</TouchableOpacity>
			</View>
		</View>
	);
}
*/

let customFonts = {
	'Tahoma-Regular': require('./assets/fonts/SFProDisplay-Regular.ttf'),
};

const rootReducer = combineReducers({
	token: tokenReducer,
	cart: cartReducer,
	prices: priceReducer,
	user: userReducer,
	code: codeReducer
});

const store = createStore(rootReducer);

function AppFunc() {
    return (
		<Provider store={store}>
			<NavigationContainer>
				<Stack.Navigator screenOptions={{headerShown: false, animationEnabled: false}}>
					<Stack.Screen name="Welcome" component={AuthScreen} />
					<Stack.Screen name="Phone" component={PhoneScreen} />
					<Stack.Screen name="Code" component={CodeScreen} />
					<Stack.Screen name="Register" component={RegisterScreen} />
					<Stack.Screen name="Catalog" component={RestaurantScreen} />
					<Stack.Screen name="Products" component={ProductScreen} />
					<Stack.Screen name="Cart" component={CartScreen} />
					<Stack.Screen name="Payment" component={PaymentScreen} />
					<Stack.Screen name="Cabinet" component={CabinetScreen} />
					<Stack.Screen name="OrderList" component={OrderListScreen} />
					<Stack.Screen name="Main" component={MainScreen} />
					<Stack.Screen name="Coupon" component={CouponScreen} />
					<Stack.Screen name="About" component={AboutScreen} />
					<Stack.Screen name="Chat" component={ChatScreen} />
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
	scalabletext: {
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
		backgroundColor: '#f08741',
		paddingVertical: 10,
		marginHorizontal: 5,
		borderRadius: 7,
		width: '75%',
		alignItems: 'center'
	},
	phoneText: {
		fontFamily: 'Tahoma-Regular', 
		fontSize: 16, 
		color: 'white'
	},
	confirmButtom: {
		backgroundColor: '#f08741',
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
		fontSize: 12,
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
