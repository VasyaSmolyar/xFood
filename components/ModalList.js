import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, Text, FlatList, TouchableOpacity} from 'react-native';
import { useSelector } from 'react-redux'; 
import send from '../utils/net';

export default function ModalList(props) {
    const token = useSelector(state => state.token);
    const [places, setPlaces] = useState([]);
    const [choice, setChoice] = useState(undefined);

    useEffect(() => {
        send('api/area/get', 'POST', {}, (json) => {
            setPlaces(json);
        }, token);
    }, []);

    const onChoice = (item) => {
        setChoice(item.id);
    };

    const onSubmit = () => {
        const item = places.find((i) => {
            return i.id === choice;
        });
        props.onChoice(item);
    }

    const button = choice !== undefined ? (
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onSubmit} style={styles.phoneButton}>
                <Text style={styles.phoneText}>Выбрать</Text>
            </TouchableOpacity>
        </View>
    ) : null;

    return (
        <Modal transparent={true} visible={props.visible}>
            <View style={styles.modalContainer}>
                <View style={styles.boxContainer}>
                    <FlatList keyExtractor={(item, index) => index.toString()} data={places} extraData={choice} renderItem={(item) => {
                        const checked = item.item.id === choice ? <View style={styles.fillBox}></View> : null;
                        return (
                            <View style={styles.choiceContainer}>
                                <TouchableOpacity style={styles.choiceBox}
                                onPress={() => onChoice(item.item)}>{checked}</TouchableOpacity>
                                <Text style={styles.boxText}>{item.item.area_name}</Text>
                            </View>
                        );
                    }} />
                    {button}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    boxContainer: {
        width: '80%',
        height: 500,
        backgroundColor: '#fff'
    },
    choiceContainer: {
        padding: 10,
        borderBottomColor: '#97999d',
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: 50,
        alignItems: "center"
    },
    choiceBox: {
        borderColor: '#97999d',
        borderWidth: 1,
        width: 20,
        height: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fillBox: {
        width: 10,
        height: 10,
        backgroundColor: "#f1c40f",
        borderRadius: 10,
    },
    boxText: {
        fontSize: 16,
        fontFamily: 'Tahoma-Regular',
    },
    phoneButton: {
		backgroundColor: '#f1c40f',
		textAlign: 'center',
		paddingVertical: 10,
		marginHorizontal: 5,
		borderRadius: 7,
		width: '75%',
		alignItems: 'center'
	},
	phoneText: {
		fontFamily: 'Tahoma-Regular', 
		fontSize: 18,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10
    }
});