import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert, Clipboard } from 'react-native';
import { useRoute } from '@react-navigation/native';
import NavigationBar from './components/NavigationBar';
import { StatusBar } from 'expo-status-bar';

function SectionScreen({navigation}) {
    const route = useRoute();
    let { secs } = route.params;

    const sections = secs.map((item) => {
        return (
            <TouchableOpacity style={[styles.block, {backgroundColor: item.color}]} onPress={() => {
                navigation.navigate('Products', {...route.params, section: item.title})
            }}>
                <Text style={styles.blockText}>{item.title}</Text>
                <Image source={{uri: item.image}} style={{width: 50, height: 50}} resizeMode='contain' />
            </TouchableOpacity>
        );
    });

    return (
        <View style={styles.container}>
            <View style={styles.secContainer}>
                <Text style={styles.header}>Выберите подходящий раздел заведения</Text>
                {sections}
            </View>
            <StatusBar style="dark" />
            <NavigationBar navigation={navigation} routeName="Catalog"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    header: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 70
    },
    secContainer: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        paddingHorizontal: 25,
    },
    block: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'gray',
        marginVertical: 10
    },
    blockText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 20,
        color: 'white'
    }
});

export default SectionScreen;