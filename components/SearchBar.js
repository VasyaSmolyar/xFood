import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Image, TouchableWithoutFeedback} from 'react-native';
import Constants from 'expo-constants';
import search from '../files/search.png';
import scanner from '../files/scanner.png';

export default function SearchBar({...props}) {
    return (
        <View style={styles.barContainer}>
            <View style={styles.inputContainer}>
                <Image source={search}  style={{width: 25, height: 25}} />
                <TextInput style={styles.input} {...props} />
                <TouchableWithoutFeedback>
                    <Image source={scanner}  style={{width: 30, height: 25}} />
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    barContainer: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 5,
        marginBottom: 10,
        paddingTop: Constants.statusBarHeight + 2,
        alignItems: 'center'
    },
    inputContainer: {
        width: '95%',
        backgroundColor: '#f2f3f5',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 5
    },
    input: {
        flex: 1,
        padding: 5,
        fontFamily: 'Tahoma-Regular',
        fontSize: 16
    }
});