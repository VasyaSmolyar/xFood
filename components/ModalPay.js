import React from 'react';
import { StyleSheet, View, Modal, Text, TouchableOpacity, Image } from 'react-native';

export default function ModalPay(props) {
    const { visible, onClose } = props;

    return (
        <Modal visible={visible} transparent={true}>
            <View style={styles.backContainer}>
                <View style={styles.container}>
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
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
});