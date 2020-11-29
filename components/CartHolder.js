import React from 'react';
import { View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'

export const duration = 2000;

export const Item = () => (
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 20}}>
        <ShimmerPlaceholder style={{width: 50, height: 50, marginRight: 5, borderRadius: 20}} duration={duration} />
        <ShimmerPlaceholder style={{width: 80, height: 30, borderRadius: 5}} duration={duration} />
        <ShimmerPlaceholder style={{width: 30, height: 30, marginRight: 5, borderRadius: 5}} duration={duration} />
        <ShimmerPlaceholder style={{width: 20, height: 20, marginRight: 5, borderRadius: 5}} duration={duration} />
        <ShimmerPlaceholder style={{width: 30, height: 30, marginRight: 5, borderRadius: 5}} duration={duration} />
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