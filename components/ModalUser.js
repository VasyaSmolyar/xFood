import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal, TextInput} from 'react-native';
import cancel from '../files/xorder.png';
import { s, vs, ms, mvs } from 'react-native-size-matters';
import { useSelector, useDispatch } from 'react-redux';
import send from '../utils/net';
import { setUser } from '../utils/store';



export default function ModalUser({visible, onExit}) {
    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const dispath = useDispatch();

    const [name, setName] = useState(user.user);
    const [phone, _] = useState(user.phone.slice(2));
    const [email, setEmail] = useState("");

    const onUpdate = () => {
        let data = {
            first_name: name
        };
        if(email !== "") {
            data.email = email;
        }
        send('api/user/change', 'POST', data, () => {
            dispath(setUser(name, '+7' + phone));
            onExit();
        }, token);
    }

    return (
        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.boxContainer}>
                    <View style={styles.headerContainer}>
                        <View style={styles.headerCell}></View>
                        <View style={[styles.headerCell, {flex: 3}]}>
                            <Text style={styles.header}>Изменение данных</Text>
                        </View>
                        <View style={styles.headerCell}>
                            <TouchableOpacity onPress={onExit}>
                                <Image source={cancel} style={{width: s(20), height: vs(20)}} resizeMode='contain' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{backgroundColor: '#fff', paddingHorizontal: 25}}>
                        <View style={styles.geoWrap}>
                            <Text style={styles.inputWrapText}>Имя</Text>
                            <TextInput value={name} style={styles.phone} onChangeText={(text) => setName(text)} />
                        </View>
                        <View style={styles.geoWrap}>
                            <Text style={styles.inputWrapText}>Номер телефона</Text>
                            <TextInput value={'+7' + phone} onChangeText={() => {}} maxLength = {12} 
                            style={styles.phone} keyboardType='phone-pad' />
                        </View>
                        <View style={styles.geoWrap}>
                            <Text style={styles.inputWrapText}>Электронная почта</Text>
                            <TextInput value={email} style={styles.phone} onChangeText={(text) => setEmail(text)} />
                        </View>
                    </View>
                    <View style={{paddingHorizontal: 25}}>
                    <TouchableOpacity style={[styles.geoButton, {paddingVertical: 15}]} onPress={onUpdate}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.geoText}>Сохранить изменения</Text>
                        </View>
                    </TouchableOpacity>
                    </View>
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
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: 50
    },
    boxContainer: {
        flex: 1,
        width: '100%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        paddingVertical: 20,
        borderBottomWidth: 2,
        borderBottomColor: "#f4f4f4",
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    headerCell: {
        flex: 1,
        alignItems: 'center'
    },
    header: {
        fontFamily: 'Tahoma-Regular', 
        fontWeight: 'bold',
        fontSize: 18
    },
    geoWrap: {
        padding: 5,
		backgroundColor: "#f2f3f5",
        marginTop: 10,
        borderRadius: 7,
        marginBottom: 20
    },
    inputWrap: {
		padding: 5,
		backgroundColor: "#f2f3f5",
        marginBottom: 20,
		borderRadius: 7,
		width: '45%',
	},
	inputWrapText: {
		fontFamily: 'Tahoma-Regular', 
		fontSize: 10,
		color: '#a7aaaf',
    },
    phone: {
		backgroundColor: '#f2f3f5', 
		fontSize: 18,
    },
    geoButton: {
		backgroundColor: '#f08741',
		paddingVertical: 20,
		marginHorizontal: 5,
		borderRadius: 15,
		width: '100%',
		alignItems: 'center'
	},
	geoText: {
		fontFamily: 'Tahoma-Regular', 
        fontSize: 16,
        fontWeight: 'bold', 
		color: 'white'
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
});