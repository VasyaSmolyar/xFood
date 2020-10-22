import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import { useSelector } from 'react-redux';
import checkbox from '../files/checkbox_yellow.png';  
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
                <Text style={styles.phoneText}>Подтвердить выбор</Text>
            </TouchableOpacity>
        </View>
    ) : null;

    return (
        <Modal transparent={true} visible={props.visible}>
            <View style={styles.modalContainer}>
                <View style={styles.boxContainer}>
                    <View style={styles.headerContainer}>
                        <View style={styles.headerCell}></View>
                        <View style={styles.headerCell}>
                            <Text style={styles.header}>Выбор города</Text>
                        </View>
                        <View style={styles.headerCell}>
                            <TouchableOpacity onPress={props.onExit}>
                                <Text style={styles.close}>Закрыть</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <FlatList keyExtractor={(item, index) => index.toString()} data={places} extraData={choice} renderItem={(item) => {
                        const checked = item.item.id === choice ? <Image source={checkbox} style={styles.fillBox} /> : null;
                        return (
                            <TouchableOpacity style={styles.choiceContainer} onPress={() => onChoice(item.item)}>
                                <View style={styles.choiceBox}>{checked}</View>
                                <Text style={styles.boxText}>{item.item.area_name}</Text>
                            </TouchableOpacity>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    headerContainer: {
        flexDirection: 'row',
        paddingVertical: 20,
        borderBottomWidth: 2,
        borderBottomColor: "#f4f4f4" 
    },
    headerCell: {
        flex: 1,
        alignItems: 'center'
    },
    header: {
        fontFamily: 'Tahoma-Regular', 
        fontWeight: 'bold',
        fontSize: 16
    },
    close: {
        fontFamily: 'Tahoma-Regular', 
        fontSize: 16,
        color: '#f08741'
    },
    boxContainer: {
        flex: 1,
        width: '100%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    choiceContainer: {
        padding: 10,
        borderBottomColor: '#f4f4f4',
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: 50,
        alignItems: "center"
    },
    choiceBox: {
        width: 20,
        height: 20,
        backgroundColor: "#fff",
        marginRight: 10
    },
    fillBox: {
        width: 20,
        height: 20
    },
    boxText: {
        fontSize: 16,
        fontFamily: 'Tahoma-Regular',
    },
    phoneButton: {
		backgroundColor: '#f08741',
		textAlign: 'center',
		paddingVertical: 10,
		marginHorizontal: 5,
		borderRadius: 7,
		width: '95%',
		alignItems: 'center'
	},
	phoneText: {
		fontFamily: 'Tahoma-Regular', 
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff'
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10
    }
});