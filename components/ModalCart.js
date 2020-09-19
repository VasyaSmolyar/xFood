import React from 'react';
import { StyleSheet, View, Modal, Text, TouchableOpacity} from 'react-native';

export default function ModalCart(props) {
    const { visible } = props;

    return (
        <Modal visible={visible} transparent={true}>
            <View style={styles.backContainer}>
                <View style={styles.container}>
                    <Text style={styles.text}>Нужно освободить корзину для нового заказа</Text>
                    <View style={styles.butContainer}>
                        <TouchableOpacity>
                            <Text style={styles.buttonText}>СТОП</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.buttonText}>ДАВАЙТЕ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        backgroundColor: '#fff',
    },
    backContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    butContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }, 
    text: {
        fontSize: 16,
        paddingBottom: 30
    },
    buttonText: {
        color: '#f1c40f',
        fontSize: 18,
        paddingLeft: 15
    }
});