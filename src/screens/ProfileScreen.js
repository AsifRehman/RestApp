import React from 'react';
import { SafeAreaView, Text, Button, View, StyleSheet } from 'react-native';

const ProfileScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.centeredView}>
                <Text style={styles.text}>
                </Text>
                <Button
                    title="Go to Home"
                    onPress={() => navigation.navigate('Home')}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'black',
        marginBottom: 20,
    },
});

export default ProfileScreen;
