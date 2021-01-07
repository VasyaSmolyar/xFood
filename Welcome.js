import React from 'react';
import background from './files/background.png';
import logo from './files/logo.png';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image } from 'react-native';
import Constants from 'expo-constants';

export default function Welcome({navigation}) {

    return (
		<View style={styles.container}>
			<StatusBar style="auto" />
			<ImageBackground source={background} style={styles.backContainer}>
				<View style={styles.opac}>
				</View>
                <View style={styles.first}>
                    <Image source={logo} style={{width: 50, height: 50, resizeMode: 'contain'}}/>
                </View>
                <View style={styles.second}>
                    <View style={{padding: 25}}>
                        <View style={{paddingRight: 30}}>
                            <Text style={[styles.labelText, {fontSize: 24}]}>Быстро и недорого доставляем еду из кафе</Text>
                        </View>
                        <View style={styles.labelContainer}>
                            <View style={styles.label}>
                                <Text style={styles.labelText}>от 0 ₽</Text>
                            </View> 
                            <View style={styles.label}>
                                <Text style={styles.labelText}>от 40 мин.</Text>
                            </View> 
                        </View>
                    </View>
                    <View style={{width: '100%', paddingHorizontal: 25}} >
                        <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('Phone')}>
                            <Text style={styles.text}>Продолжить</Text>
                        </TouchableOpacity>
                    </View>
                </View>
			</ImageBackground>
		</View>
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
        backgroundColor: 'white',
        paddingTop: Constants.statusBarHeight
    },
    opac: {
		position: 'absolute',
		top: 0,
  		bottom: 0,
  		left: 0,
  		right: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    first: {
        flex: 1,
        paddingTop: 10,
        padding: 25,
        width: '100%',
        alignItems: 'flex-start'
    },
    second: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-around'
    },
    labelContainer: {
        flexDirection: 'row',
        paddingTop: 15,
    },
    label: {
        padding: 10,
        backgroundColor: "#f08843",
        marginRight: 15,
        borderRadius: 10
    },
    labelText: {
        fontFamily: 'Tahoma-Regular', 
        fontSize: 18,
        fontWeight: 'bold', 
		color: 'white'
    },
    authButton: {
		alignItems: "center",
		backgroundColor: "#fff",
		width: '100%',
		padding: 10,
		borderRadius: 10,
	},
	text: {
		fontFamily: 'Tahoma-Regular',
        fontSize: 20,
        fontWeight: 'bold'
	},
});