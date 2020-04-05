import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';

const Stack = createStackNavigator();

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

	}
}

export default function App() {
    return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Welcome" component={AuthScreen} />
				<Stack.Screen name="Phone" component={PhoneScreen} />
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
