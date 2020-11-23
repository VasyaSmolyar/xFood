import React, {useState, useEffect} from 'react';
import { View } from 'react-native';
//import SkeletonContent from 'react-native-skeleton-content';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export default function ProductHolder() {
    const [load, setLoad] = useState(1);

    useEffect(() => {
        setTimeout(() => setLoad(false), 5000);
    }, []);

    return (
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
                <SkeletonPlaceholder.Item marginLeft={20}>
                    <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
                    <SkeletonPlaceholder.Item
                        marginTop={6}
                        width={80}
                        height={20}
                        borderRadius={4}
                    />
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    )
}