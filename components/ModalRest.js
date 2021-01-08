import React from 'react';
import { StyleSheet, View, Modal, Text, TouchableOpacity, Image } from 'react-native';
import cook from '../files/cook.png'; 

export default function ModalRest({rest, onClose}) {
    
    if(!rest) {
        return <View></View>
    }
    
    return (
        <Modal visible={true} transparent={true}>
            <View style={styles.backContainer}>
                <View style={styles.container}>
                    { /* <Image source={cook} style={{width: 70, height: 70, marginBottom: 20}} resizeMode={'contain'} /> */ }
                    <Text style={styles.header}>{rest.message}</Text>
                    <View style={styles.butContainer}>
                        <TouchableOpacity onPress={onClose} style={styles.backButton}>
                            <Text style={styles.backButtonText}>Ок</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 25,
        paddingVertical: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderRadius: 15
    },
    backContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    butContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    }, 
    text: {
        fontSize: 14,
        fontFamily: 'Tahoma-Regular', 
        paddingBottom: 30,
        textAlign: 'center'
    },
    goButtonText: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Tahoma-Regular',
    },
    backButtonText: {
        fontSize: 14,
        color: 'black',
        fontFamily: 'Tahoma-Regular',
    },
    header: {
        fontSize: 20,
        fontFamily: 'Tahoma-Regular',
        paddingBottom: 20,
        textAlign: 'center'
    },
    goButton: {
        backgroundColor: '#f08741',
        borderRadius: 10,
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 15,
        marginRight: 20
    },
    backButton: {
        backgroundColor: '#f3f4f6',
        borderRadius: 10,
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 15
    }
});