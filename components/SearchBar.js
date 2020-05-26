import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Image, TouchableWithoutFeedback} from 'react-native';
import search from '../files/search.png';
import scanner from '../files/scanner.png';

export default function SearchBar(props) {
    return (
        <View style={styles.barContainer}>
            <View style={styles.inputContainer}>
                <Image source={search}  style={{width: 20, height: 20}} />
                <TextInput style={styles.input} placeholder={props.placeholder} />
                <TouchableWithoutFeedback>
                    <Image source={scanner}  style={{width: 25, height: 22}} />
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    barContainer: {
        width: '100%',
        backgroundColor: 'black',
        padding: 5,
        marginBottom: 10,
        paddingTop: 25,
        alignItems: 'center'
    },
    inputContainer: {
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    input: {
        flex: 1,
        padding: 5,
        fontFamily: 'Tahoma-Regular',
        fontSize: 16
    }
});