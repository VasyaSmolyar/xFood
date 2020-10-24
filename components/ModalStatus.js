import React from 'react';
import { StyleSheet, View, Modal, Text, TouchableOpacity } from 'react-native';

export default function ModalPay(props) {
    const visible = true;

    return (
        <Modal visible={visible} transparent={true}>
            <View style={styles.backContainer}>
                <View style={styles.container}>
                    <Text style={styles.statusText}>Поиск курьера</Text>
                    <Text style={styles.timeText}>Доставим в 15:30</Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    backContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 25,
        paddingBottom: 40
    },
    statusText: {
        fontFamily: 'Tahoma-Regular',
        fontWeight: 'bold',
        fontSize: 16,
    },
    timeText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 16,
    }
});