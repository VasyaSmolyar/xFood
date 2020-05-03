import React, {useState} from 'react';
import { NavigationContainer, useRoute} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';
import send from './utils/net';

const Stack = createStackNavigator();
const sample = {
	birthday: "2000-01-01",
	first_name: "Иван",
	last_name: "Петров"
};

function AuthScreen({navigation}) {
	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('Phone')}>
				<Text>Авторизация</Text>
			</TouchableOpacity>
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
		<View style={styles.container}>
			<TextInput value={value} onChange={() => setValue(event.target.value)}  style={styles.phone} keyboardType='phone-pad'></TextInput>
			<TouchableOpacity style={styles.authButton} onPress={() => press()}>
				<Text>Отправить код</Text>
			</TouchableOpacity>
		</View>
	);
}

function CodeScreen({navigation}) {
	const route = useRoute();
	const {phone, isExisting} = route.params;
	const [value, setValue] = useState('');
	const [wrong, setWrong] = useState(false);
	const navigate = json => {
		const valid = json.isValid === "true";
		const exist = isExisting === "true";
		if(!valid) {
			setWrong(true);
		} else if(!exist) {
			navigation.navigate('Register', {code: value, phone: phone});
		} else {
			navigation.navigate('Catalog');
		}
	};
	const press = () => {
		send('api/user/verify', 'POST', {phone: phone, code: value}, navigate);
	};
	const mes = <Text>Неверный код</Text>;
	let err = wrong ? mes : null;
	return (
		<View style={styles.container}>
			<TextInput value={value} onChange={() => setValue(event.target.value)} style={styles.phone} keyboardType='phone-pad'></TextInput>
			{err}
			<TouchableOpacity style={styles.authButton} onPress={() => press()}>
				<Text>Отправить код</Text>
			</TouchableOpacity>
		</View>
	);
}

function RegisterScreen({navigation}) {
	const route = useRoute();
	let { phone, code } = route.params; 
	let data = sample;
	data.phone = phone;
	data.username = phone;
	data.password = code;
	const navigate = json => {
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

export default function App() {
    return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Welcome" component={AuthScreen} />
				<Stack.Screen name="Phone" component={PhoneScreen} />
				<Stack.Screen name="Code" component={CodeScreen} />
				<Stack.Screen name="Register" component={RegisterScreen} />
			</Stack.Navigator>
	  	</NavigationContainer>
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
