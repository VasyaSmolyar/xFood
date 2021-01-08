import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert, Clipboard } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import ScalableText from 'react-native-text';
import send from './utils/net'
import { readLocate, writeLocate } from './utils/locate';
import NavigationBar from './components/NavigationBar';
import ModalStatus from './components/ModalStatus';
import ModalFind from './components/ModalFind';
import ModalRest from './components/ModalRest';
import SearchBar from './components/SearchBar';
import price from './files/price.png';
import star from './files/star.png';
import timer from './files/timer.png';
import noloc from './files/noloc.png';
import pen from './files/pen.png';
import { s, vs, ms, mvs } from 'react-native-size-matters';
import { duration } from './components/ProductHolder';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { Dimensions } from 'react-native';
import { registerForPushNotificationsAsync } from './components/Notifications';

import { setPush } from './utils/store';

const windowWidth = Dimensions.get('window').width;

function Place({addr, setPlace}) {
    return (
        <TouchableOpacity style={styles.placeContainer} onPress={setPlace}>
            <Text style={styles.placeText}>{addr}</Text>
            <Image source={pen} style={{width: s(15), height: vs(15)}} resizeMode='contain' />
        </TouchableOpacity>
    );
}

function Category(props) {
    const navigation = useNavigation();
    const { cat, show } = props;

    const getTime = (time) => {
        const label = (time % 10) > 4 ? "минут" : "минуты";
        return time + " " + label;
    }

    const getMoney = (amount) => {
        return "от " + amount + " ₽";
    }

    const onCons = () => {
        if(cat.sections.length !== 0) {
            navigation.navigate('Sections', {
                title: cat.title, id: cat.id, subs: cat.categories, other: cat, secs: cat.sections
            });
        } else {
            navigation.navigate('Products', {
                title: cat.title, id: cat.id, subs: cat.categories, other: cat
            });
        }
    }

    return (
        <TouchableOpacity style={styles.category} onPress={onCons}>
            { !cat.works &&
                <TouchableOpacity style={styles.banner} onPress={show} />
            }
            <Image source={{uri: cat.poster}} resizeMode={'cover'} style={styles.catImage} imageStyle={{ borderRadius: 20}} />
            <Text style={styles.catText}>{cat.title}</Text>
            <View style={{flexDirection: 'row', paddingHorizontal: 10, paddingBottom: 10}}>
                <View style={styles.catAppend}>
                    <Image style={styles.catIcon} source={timer} resizeMode='contain'></Image>
                    <Text style={styles.catLabel}>{getTime(cat.middletime)}</Text>
                </View>
                <View style={styles.catAppend}>
                    <Image style={styles.catIcon} source={star} resizeMode='contain'></Image>
                    <Text style={styles.catLabel}>{cat.rating}</Text>
                </View>
                <View style={styles.catAppend}>
                    <Image style={styles.catIcon} source={price} resizeMode='contain'></Image>
                    <Text style={styles.catLabel}>{getMoney(cat.min_summ)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default function RestaurantScreen({navigation}) {
    const token = useSelector(state => state.token);
    const push = useSelector(state => state.push);
    const dispath = useDispatch();

    const [data, setData] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const [query, setQuery] = useState("");
    const [found, setFound] = useState(false);
    const [city, setCity] = useState("");
    const [rest, setRest] = useState(null);

    const load = (json) => {
        console.log(json);
        if(json.details === undefined) {
            setData(json);
        }
        setLoaded(true);
    };

    const filter = (value) => {
        setQuery(value);
    }

    useEffect(() => {
        if(push.token === "") {
            registerForPushNotificationsAsync().then((pt) => {
                console.log("PT: ", pt);
                send('api/notifications/setpushtoken', 'POST', {token: pt}, () => {
                    dispath(setPush(pt));
                }, token);
            });
        }
        readLocate().then((val) => {
            console.log(val);
            if(val) {
                setCity(val);
                console.log(token);
                send('api/restaurants/get', 'GET', {area_name: val}, load, token);
            } else {
                console.log("FOUND");
                setFound(true);
            }
        });
    }, []);

    const setLocale = (location) => {
        writeLocate(location);
        setCity(location);
        send('api/restaurants/get', 'GET', {area_name: location}, load, token);
        setFound(false);
    }
    
    const status = !found ? <ModalStatus /> : null;

    if(isLoaded && (data.length === 0)) {
        return (
            <View style={styles.container}>
                <StatusBar style="dark" />
                <ModalFind locate={setLocale} visible={found} />   
                <SearchBar placeholder="Поиск по ресторанам" value={query} onChangeText={filter} />
                <Place addr={city} setPlace={() => setFound(true)}/>
                <View style={styles.emptyContainer}>
                    <Image source={noloc} style={{width: s(70), height: s(70)}} resizeMode='contain' />
                    <ScalableText style={styles.emptyText}>Пока что в вашем городе нет партнёров xFood</ScalableText>
                </View>
                <NavigationBar navigation={navigation} routeName="Catalog"/>
            </View>
        )
    }

    const restaurants = Object.keys(data).map((key) => {
        
        const filtered = data[key].filter((item) => {
            return item.title.toLowerCase().search(query.toLowerCase()) !== -1;
        });

        const items = filtered.map((item) => {
            return (
                <Category cat={item} show={() => setRest(item)} />
            );
        });

        if (filtered.length === 0) {
            return null;
        }

        return (
            <View>
                <Text style={styles.header}>{key}</Text>
                {items}
            </View>
        );

    });

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            {status}
            <ModalFind locate={setLocale} visible={found} />
            <ModalRest rest={rest} onClose={() => setRest(null)} />            
            <SearchBar placeholder="Поиск по ресторанам" value={query} onChangeText={filter} />
            <Place addr={city} setPlace={() => setFound(true)}/>
            <ScrollView style={{width: '90%'}}>
                {isLoaded ? restaurants : (
                    <View>
                        <ShimmerPlaceholder style={{width: 250, height: 40, borderRadius: 5, marginVertical: 20}} duration={duration}></ShimmerPlaceholder>
                        <View style={{alignItems: 'center'}}>
                            <ShimmerPlaceholder duration={duration} width={windowWidth * 0.95} height={200} shimmerStyle={{borderRadius: 20, marginBottom: 30}}></ShimmerPlaceholder>
                            <ShimmerPlaceholder duration={duration} width={windowWidth * 0.95} height={200} shimmerStyle={{borderRadius: 20, marginBottom: 30}}></ShimmerPlaceholder>
                        </View>
                    </View>
                )}
            </ScrollView>
            <NavigationBar navigation={navigation} routeName="Catalog"/>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
	},
    category: {
        width: '100%',
        borderRadius: 20,
        backgroundColor: '#f2f3f5',
        marginTop: 5,
        marginBottom: 20,
        paddingBottom: 10,
        overflow: 'hidden'
    },
    catImage: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    catText: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        paddingVertical: 10
    },
    catList: {
        width: '100%'
    },
    catIcon: {
        width: 15,
        height: 15
    },
    catLabel: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 14,
        marginLeft: 10,
    },
    catAppend: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    oneRow: {
        justifyContent: 'space-around'
    },
    header: {
        fontFamily: 'Tahoma-Regular',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
        paddingVertical: 10
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        color: '#898b8e',
        fontFamily: 'Tahoma-Regular',
        fontSize: 14,
        width: s(170),
        paddingTop: 30,
        textAlign: 'center'
    },
    placeContainer: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 15,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e4e4'
    },
    placeText: {
        color: '#a1a1a1',
        fontFamily: 'Tahoma-Regular',
        fontSize: 14,
    },
    banner: {
        position: 'absolute',
        width: '100%',
        height: '110%',
        borderRadius: 20,
        backgroundColor: 'black',
        opacity: 0.5,
        zIndex: 4,
        paddingBottom: 20,
    }
});
