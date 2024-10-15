import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

export default function LoginScreen() {
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorLog, setErrorLog] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        fetchIpAddress();
    }, []);


    const storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);

          await AsyncStorage.setItem('token', jsonValue);
        } catch (e) {
          // saving error

        }
      };

    const fetchIpAddress = async () => {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            setIpAddress(response.data.ip);
        } catch (error) {
            console.error('Error fetching IP address:', error);
            logError('IP Fetch Error', error);
            Alert.alert('Error', 'Failed to fetch IP address. Please check your internet connection and try again.');
        }
    };

    const logError = (context, error) => {
        const errorMessage = `
    ${context}:
    Message: ${error.message}
    Stack: ${error.stack}
    Response: ${JSON.stringify(error.response?.data)}
    Status: ${error.response?.status}
    Headers: ${JSON.stringify(error.response?.headers)}
    `;
        console.error(errorMessage);
        setErrorLog(prevLog => prevLog + '\n\n' + errorMessage);
    };

    const checkNetworkStatus = async () => {
        const netInfo = await NetInfo.fetch();
        return netInfo.isConnected && netInfo.isInternetReachable;
    };

    const handleLogin = async () => {
        if (!username || !password || !companyEmail) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (!ipAddress) {
            Alert.alert('Error', 'Failed to get IP address. Please try again.');
            return;
        }

        setIsLoading(true);

        const isNetworkAvailable = await checkNetworkStatus();
        if (!isNetworkAvailable) {
            setIsLoading(false);
            Alert.alert('Network Error', 'Please check your internet connection and try again.');
            return;
        }

        // Alert.alert('API Base URL', api.defaults.baseURL);

        try{
            const response = await api.post(
                '/login/GetUserTmpCode',
                {
                    UserName: username,
                    Pwd: password,
                    CompanyEmail: companyEmail,
                    ip: ipAddress
                },
            );


            setIsLoading(false);

            if (response.data && response.data.token) {
                console.log("response data", response.data.token)
                setToken(response.data.token[0]);
                storeData(response.data.token[0]);
                navigation.navigate('HomeStack');
            } else {
                Alert.alert('Error', 'Invalid credentials or no token received');
            }
        } catch (error) {
            Alert.alert('Error', JSON.stringify(error));
            setIsLoading(false);
            logError('Login Error', error);

            // Alert.alert(`${api.defaults.baseURL}/login/GetUserTmpCode`);
            // Alert.alert(JSON.stringify(error.request));
            // console.error('Error URL:', errorUrl);
            if (error.code === 'ECONNABORTED') {
                Alert.alert('Timeout Error', 'The request took too long to complete. Please try again.');
            } else if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                Alert.alert('Server Error', `Status: ${error.response.status}\nMessage: ${error.response.data.message || 'Unknown error'}`);
            } else if (error.request) {
                // The request was made but no response was received
                Alert.alert('Network Error', 'No response received from the server. Please check your internet connection and try again.');
            } else {
                // Something happened in setting up the request that triggered an Error
                Alert.alert('Error', 'An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="Company Email"
                value={companyEmail}
                onChangeText={setCompanyEmail}
                keyboardType="email-address"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>

            <Text style={styles.ipText}>Your IP: {ipAddress || 'Fetching...'}</Text>

            {errorLog ? (
                <View style={styles.errorLogContainer}>
                    <Text style={styles.errorLogTitle}>Error Logs:</Text>
                    <ScrollView style={styles.errorLogScroll}>
                        <Text style={styles.errorLogText}>{errorLog}</Text>
                    </ScrollView>
                </View>
            ) : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ipText: {
        marginTop: 20,
        fontSize: 14,
        color: 'gray',
    },
    errorLogContainer: {
        marginTop: 20,
        width: '100%',
        maxHeight: 200,
    },
    errorLogTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    errorLogScroll: {
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    errorLogText: {
        color: '#721c24',
    },
});