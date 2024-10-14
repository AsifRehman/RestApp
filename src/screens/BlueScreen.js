import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const BlueScreen = () => {
return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'lightblue' }}>
        <Text>BlueScreen</Text>
    </SafeAreaView>
)
}

export default BlueScreen