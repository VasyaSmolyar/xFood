import React, { useState, useEffect } from 'react';
import NavigationBar from './components/NavigationBar';
import Constants from 'expo-constants';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';

export default function CouponScreen({navigation}) {
    const token = useSelector(state => state.token);
    const [list, setList] = useState([]);

    useEffect(() => {
        send('api/coupons/get', 'POST', {}, (json) => {
            setList(json);
		}, token);
    }, []);


    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.barContainer}>
                <Text style={styles.barText}>Купоны</Text>
            </View>
            <ScrollView>

            </ScrollView>
            <NavigationBar navigation={navigation} routeName="Cabinet"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    barContainer: {
        width: '100%',
        padding: 5,
        paddingLeft: 30,
        paddingTop: Constants.statusBarHeight,
        borderBottomColor: '#ede9e9',
        borderBottomWidth: 1
    },
    barText: {
        fontWeight: "bold",
        fontSize: 20,
        marginTop: 20,
        marginBottom: 15
    },
});