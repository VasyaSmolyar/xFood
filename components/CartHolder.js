import React from 'react';
import { View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'

export const duration = 2000;

export const Item = () => (
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 20}}>
        <ShimmerPlaceholder style={{width: 60, height: 60, marginRight: 5, borderRadius: 20}} duration={duration} />
        <ShimmerPlaceholder style={{width: 100, height: 30, borderRadius: 5}} duration={duration} />
        <ShimmerPlaceholder style={{width: 40, height: 40, marginRight: 5, borderRadius: 5}} duration={duration} />
        <ShimmerPlaceholder style={{width: 30, height: 30, marginRight: 5, borderRadius: 5}} duration={duration} />
        <ShimmerPlaceholder style={{width: 40, height: 40, marginRight: 5, borderRadius: 5}} duration={duration} />
    </View>
)

export default function() {
    return (
        <View>
            <Item />
            <Item />
            <Item />
            <Item />
        </View>
    );
}