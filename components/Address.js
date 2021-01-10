import React, { useState, useRef } from 'react';
import { StyleSheet, View, Modal, Text, ScrollView, TouchableOpacity, TextInput, Image} from 'react-native';
import SearchBar from '../components/SearchBar';
import { useSelector } from 'react-redux';
import send from '../utils/net';

export default function Address({visible, onExit, onSubmit}) {
    const token = useSelector(state => state.token);
    const [places, setPlaces] = useState([]);
    const ref = useRef();
    const [q, setQ] = useState("");

    const onForward = (text) => {
        setQ(text);
        send('api/geocode/forward', 'GET', {q: text}, (json) => {
            setPlaces(json);
        }, token);
    };

    const onShow = () => {
        if(ref.current)
            ref.current.focus();
    }

    const list = places.map((item) => {
        return (
            <TouchableOpacity style={styles.choiceContainer} onPress={() => onSubmit(item)} key={item.title}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.cityText}>{item.city}</Text>
            </TouchableOpacity>
        );
    });

    return (
        <Modal transparent={true} visible={visible} onShow={onShow} >
            <View style={styles.modalContainer}>
                <View style={styles.boxContainer}>
                    <View style={styles.headerContainer}>
                        <View style={styles.headerCell}></View>
                        <View style={styles.headerCell}>
                            <Text style={styles.header}>Выбор адреса</Text>
                        </View>
                        <View style={styles.headerCell}>
                            <TouchableOpacity onPress={onExit}>
                                <Text style={styles.close}>Закрыть</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <SearchBar value={q} onChangeText={(text) => onForward(text)} autoFocus={true} ref={ref} />
                    <ScrollView>
                        {list}
                    </ScrollView>
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
    },
    choiceContainer: {
        paddingHorizontal: 25,
        paddingVertical: 10
    },
    titleText: {
        fontFamily: 'Tahoma-Regular', 
        fontSize: 18,
    },
    cityText: {
        fontFamily: 'Tahoma-Regular', 
        fontSize: 16,
        color: '#888'
    },
    inputText: {
        backgroundColor: '#f2f3f5',
        paddingHorizontal: 25,
        paddingVertical: 10,
        fontFamily: 'Tahoma-Regular', 
        fontSize: 16,
        color: 'black'
    }
});