import React from 'react';
import { NavigationContainer, useRoute} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';

const Stack = createStackNavigator();
const backend = 'http://127.0.0.1:8000/';

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
			navigation.navigate('Code', {phone: this.state.value});
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
		const { route, navigation } = this.props;
		let { phone } = route.params; 
		console.log(phone);
		fetch(backend + 'api/user/verify', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				phone: phone,
				code: this.state.code
			})
		})
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			console.log(json)
			  
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
