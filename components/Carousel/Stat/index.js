import React from 'react'
import { View, Text } from 'react-native'
import { styles } from './styles'

export const Stat = (props) => {

  const { label, value } = props;

  return (
    <View style={styles.stat}>
        {value}
      <View style={styles.statHold}>
        <Text style={{ ...styles.statLabel }}>
          {label}
        </Text>
      </View>
    </View>
  );
}

export default Stat;