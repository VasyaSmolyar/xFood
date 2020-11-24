import React from 'react';
import { View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export const duration = 2000;

export default function() {
    const Item = ({style}) => (
        <View style={[{width: windowWidth / 100 * 45}, {...style}]} >
            <ShimmerPlaceholder duration={duration} width={120} height={120} shimmerStyle={{marginTop: 10, marginBottom: 10, borderRadius: 10}}></ShimmerPlaceholder>
            <ShimmerPlaceholder duration={duration} width={50} height={20} shimmerStyle={{marginBottom: 10, borderRadius: 5}}></ShimmerPlaceholder>
            <ShimmerPlaceholder duration={duration} width={120} height={40} shimmerStyle={{marginBottom: 20, borderRadius: 5}}></ShimmerPlaceholder>
            <ShimmerPlaceholder duration={duration} width={120} height={30} shimmerStyle={{marginBottom: 20, borderRadius: 5}}></ShimmerPlaceholder>
        </View>
    );

    return (
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View >
                <Item style={{borderRightWidth: 1, borderRightColor: '#ede9e9', borderBottomColor: '#ede9e9', borderBottomWidth: 1}} />
                <Item style={{borderRightWidth: 1, borderRightColor: '#ede9e9'}} />
            </View>
            <View> 
                <Item style={{paddingLeft: 10, borderBottomColor: '#ede9e9', borderBottomWidth: 1}} />
                <Item style={{paddingLeft: 10}} />
            </View>
        </View>
    )
}