import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, Text, FlatList, TouchableOpacity} from 'react-native';
import { useSelector } from 'react-redux'; 
import send from '../utils/net';

export default function ModalList(props) {
    const token = useSelector(state => state.token.value);
    const [places, setPlaces] = useState();
    let choice = 1;
    useEffect(() => {
        send('api/area/get', 'POST', {}, (json) => {
            //setPlaces(json);
            setPlaces([{id: 0, area_name: 'Москва'},{id: 1, area_name: 'Дмитров'}]);
        }, token);
    }, []);
    return (
        <Modal transparent={true} visible={props.visible}>
            <View style={styles.modalContainer}>
                <View style={styles.boxContainer}>
                    <FlatList keyExtractor={(item, index) => index.toString()} data={places} renderItem={(item) => {
                        const checked = item.item.id === choice ? <View style={styles.fillBox}></View> : null;
                        return (
                            <View style={styles.choiceContainer}>
                                <TouchableOpacity style={styles.choiceBox}>{checked}</TouchableOpacity>
                                <Text>{item.item.area_name}</Text>
                            </View>
                        );
                    }} />
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
    }
});