import React from 'react';
import { NavigationContainer, useRoute} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';

const Stack = createStackNavigator();
const backend = 'http://127.0.0.1:8000/';
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

class PhoneScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: ''
		}
		this.onChange = this.onChange.bind(this);
		this.send = this.send.bind(this);
	}

	render() {
		return (
			<View style={styles.container}>
				<TextInput value={this.state.value} onChange={this.onChange}  style={styles.phone} keyboardType='phone-pad'></TextInput>
				<TouchableOpacity style={styles.authButton} onPress={this.send}>
					<Text>Отправить код</Text>
				</TouchableOpacity>
			</View>
		);
	}

	onChange(event) {
		let text = event.target.value;
		this.setState({
			value: text
		});
	}

	send() {
		fetch(backend + 'api/user/auth', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				phone: this.state.value,
			})
		})
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			console.log(json);
			const { navigation } = this.props;
			navigation.navigate('Code', {phone: this.state.value, isExisting: json.isExisting});
		})
		.catch((error) => {
		  	console.error(error);
		})
	}
}

class CodeScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			wrong: false,
		}
		this.onChange = this.onChange.bind(this);
		this.send = this.send.bind(this);
	}

	render() {
		let mes = <Text>Неверный код</Text>;
		let err = this.state.wrong ? mes : null;
		return (
			<View style={styles.container}>
				<TextInput value={this.state.value} onChange={this.onChange}  style={styles.phone} keyboardType='phone-pad'></TextInput>
				{err}
				<TouchableOpacity style={styles.authButton} onPress={this.send}>
					<Text>Отправить код</Text>
				</TouchableOpacity>
			</View>
		);
	}

	onChange(event) {
		let text = event.target.value;
		this.setState({
			value: text
		});
	}

	send() {
		const { route, navigation } = this.props;
		let { phone, isExisting } = route.params; 
		console.log(phone);
		fetch(backend + 'api/user/verify', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				phone: phone,
				code: this.state.value
			})
		})
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			console.log(json);
			let valid = json.isValid === "true";
			let exist = isExisting === "true";
			if(!valid) {
				this.setState({
					wrong: true
				});
			} else if(!exist) {
				navigation.navigate('Register', {code: this.state.value, phone: phone});
			} else {
				navigation.navigate('Catalog');
			}
		})
		.catch((error) => {
		  	console.error(error);
		})
	}
}

class RegisterScreen extends React.Component {
	constructor(props) {
		super(props);
		this.send = this.send.bind(this);
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity style={styles.authButton} onPress={this.send}>
					<Text>Подтвердить возраст</Text>
				</TouchableOpacity>
			</View>
		);
	}

	send() {
		const { route, navigation } = this.props;
		let { phone, code } = route.params; 
		let data = sample;
		data.phone = phone;
		data.username = phone;
		data.password = code;
		data.code = code;
		console.log(data);
		fetch(backend + 'api/user/create', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		})
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			console.log(json);
			navigation.navigate('Catalog');
		})
		.catch((error) => {
		  	console.error(error);
		})
	}
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
