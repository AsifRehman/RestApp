// TodaySales.js
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert,TouchableOpacity, BackHandler  } from 'react-native';
import api from '../api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';  // Import useNavigation

const SaleDetails = () => {
    const route = useRoute();
    const { vocNo, selectedProductName, selectedProductPrice, selectedProductId } = route.params || {};  // Get ProductId
    console.log("vocNo:", vocNo);  // Check what vocNo is being received    
    const [data, setData] = useState({ Trans: [], SCharges: 0 });
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    // const fadeAnim = useRef(new Animated.Value(0)).current;
    // const slideAnim = useRef(new Animated.Value(100)).current;

    const navigateToAllProducts = () => {
        navigation.navigate('All Products', { vocNo: vocNo });  // Pass vocNo to AllProducts
    };
    

    const fetchData = async (isRefresh=false) => {
        try {
            const response = await api.get('/sal/' + vocNo);
            let newData = response.data[0];
            console.log('New Data:', newData);
            // Update transactions with the new product name and price if provided
            if ((selectedProductName && selectedProductPrice && selectedProductId) && isRefresh == false) {
                newData.Trans.forEach(transaction => {
                    transaction.ProdName = selectedProductName;
                    transaction.ListRate = selectedProductPrice;
                    transaction.ProductId = selectedProductId;  // Update the ProductId
                    transaction.NetAmount = transaction.Qty * selectedProductPrice;
                });
            }
            setLoading(false);
            setData(newData);

        } catch (error) {
            console.log("Error", error)
            Alert.alert('Error', JSON.stringify(error));
            setLoading(false);
        }
    };

    useEffect(() => {
        // Run the calculation only if there are transactions and PType is 1 or 3
        if (data.Trans && (data.PType === 1 || data.PType === 3)) {
            const totalNetAmount = data.Trans.reduce((acc, curr) => acc + curr.NetAmount, 0);
            const serviceCharges = totalNetAmount * 0.07;
            setData(prevData => ({ ...prevData, SCharges: serviceCharges }));
        } else {
            // Set service charges to 0 if conditions are not met
            setData(prevData => ({ ...prevData, SCharges: 0 }));
        }
    }, [data.Trans, data.PType]);

    // useEffect to refetch data when vocNo or selectedProductName changes
useEffect(() => {
    fetchData();
}, [vocNo, selectedProductName, selectedProductPrice, selectedProductId]);  // Add selectedProductPrice to the dependency array

    // useEffect(() => {
        
    //    // Start animations after data is loaded
    // Animated.parallel([
    //     Animated.timing(fadeAnim, {
    //         toValue: 1,
    //         duration: 500,
    //         useNativeDriver: true,
    //     }),
    //     Animated.timing(slideAnim, {
    //         toValue: 0,
    //         duration: 500,
    //         useNativeDriver: true,
    //     }),
    // ]).start();
    // }, []);
   

    const handleDelete = (index) => {
        const updatedData = [...data.Trans];
        // Set the quantities to zero instead of marking as deleted
        updatedData[index].PQty = 0;
        updatedData[index].Qty = 0;
        updatedData[index].NetAmount = 0;
    
        // Recalculate the service charges as needed
        const totalNetAmount = updatedData.reduce((acc, curr) => acc + curr.NetAmount, 0);
        const serviceCharges = totalNetAmount * 0.07;  // Adjust this calculation as per your business logic
    
        setData({ ...data, Trans: updatedData, SCharges: serviceCharges });
    
        console.log('Updated Data after delete:', updatedData);
    };
    
    
    
    

    const handleQtyChange = (index, change) => {
        const updatedData = [...data.Trans];
        const item = updatedData[index];
        item.PQty += change;
    
        // Update Qty based on PQty and recalculate NetAmount using ListRate if it exists or Rate as fallback
        item.Qty = item.PQty;
        item.NetAmount = item.Qty * (item.ListRate || item.Rate);  // Use ListRate if available
    
        // Recalculate service charges if applicable
        const totalNetAmount = updatedData.reduce((acc, curr) => acc + curr.NetAmount, 0);
        const serviceCharges = totalNetAmount * 0.07;
        setData(prevData => ({ ...prevData, Trans: updatedData, SCharges: serviceCharges }));
    
        console.log('Updated Item:', item);
    };
    
    

    const handleSave = () => {
        const updatedTransactions = data.Trans.map(transaction => ({
            ...transaction,
            ProdName: selectedProductName || transaction.ProdName,  // Ensure the updated name is used
            Rate: selectedProductPrice || transaction.Rate,  // Ensure the updated price is used
            ProductId: selectedProductId || transaction.ProductId,  // Ensure ProductId is updated
            NetAmount: transaction.Qty * (selectedProductPrice || transaction.Rate)  // Recalculate net amount
        }));
    
        const preparedData = {
            ...data,
            Trans: updatedTransactions,
            SCharges: Math.round(data.SCharges),  // Round service charges for cleaner data handling
        };
    
        // Convert preparedData to JSON before sending
        const jsonData = JSON.stringify(preparedData);
        
        console.log('Data being sent to server (JSON):', jsonData);
    
        api.put('/sal', jsonData, {
            headers: {
                'Content-Type': 'application/json',  // Specify content type as JSON
            },
        })
        .then(response => {
            console.log('Save successful:', response.data);
            Alert.alert('Success', 'Sale details updated successfully');
            // Re-fetch data to verify updates
            fetchData(isRefresh = true);
        })
        .catch(error => {
            console.error('Error during save:', error);
            Alert.alert('Error', `Failed to save details: ${error.response ? error.response.data : 'Unknown error'}`);
        });
    };
    
    
    
    
    
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.navigate('Today Sales');  // Navigate back to TodaySales page
                return true;  // Prevent default back action
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [navigation])
    );
    
    
    


    if (loading) {
        return <ActivityIndicator size="large" style={styles.loader} />;
    }
    const onRefresh =async () => {
        // setData({ Trans: [], SCharges: 0 })
        setLoading(true);
        await fetchData(isRefresh=true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={data.Trans}
                keyExtractor={(item, index) => index.toString()}
                onRefresh={onRefresh}
                refreshing={loading}
                // style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
                ListHeaderComponent={({ item, index }) => (
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Invoice No: {data.VocNo}</Text>
                        <Text style={styles.headerText}>Date: {data.Date}</Text>
                        {/* <Text style={styles.headerText}>Table No: {data.TblNo}</Text> */}
                        <Text style={styles.headerText}>Payment Type: {data.PType}</Text>
                    </View>
                )}
                renderItem={({ item, index }) => {
                    if (item.isDeleted) {
                        return null;
                    }
                        return (
                                 
                            <View  style={styles.item}>
                        <Text onPress={navigateToAllProducts} style={styles.productName}>{item.ProdName}    (Total={item.NetAmount} PKR)</Text>
                        <View style={styles.qtyContainer}>
                            <Text
                                style={styles.qtyButton}
                                onPress={() => item.Qty > 0 && handleQtyChange(index, -1)}
                            >
                                -
                            </Text>
                            <Text style={styles.qtyText}>{item.Qty}</Text>
                            <Text
                                style={styles.qtyButton}
                                onPress={() => handleQtyChange(index, 1)}
                            >
                                +
                            </Text>
                        </View>
                        <Text style={styles.netAmount}>${item.NetAmount}</Text>
                        <Text style={styles.deleteButton} onPress={() => handleDelete(index)}>Del</Text>
                    </View>
                        
                        );
                    
                    return null;
                }}
                ListFooterComponent={({ item, index }) => {
                    const totalQty = data.Trans.reduce((sum, item) => sum + item.Qty, 0);
                    const totalNetAmount = data.Trans.reduce((sum, item) => sum + item.NetAmount, 0);
                    const serviceCharges = data.SCharges || 0;  // Ensure service charges are not null
    const grandTotal = totalNetAmount + serviceCharges;
                    return (
                        <View style={styles.footer}>
            <Text style={styles.footerText}>Total Quantity: {totalQty}</Text>
            <Text style={styles.footerText}>Total Amount: {totalNetAmount.toFixed(2)} PKR</Text>
            <Text style={styles.footerText}>Service Charges: {serviceCharges.toFixed(2)} PKR</Text>
            <Text style={styles.footerText}>Grand Total: {grandTotal} PKR</Text>
        </View>
                    );
                }}
            />
            <View style={styles.saveButtonContainer}>
                <Text
                    style={styles.saveButton}
                    onPress={() => handleSave()}
                >
                    Save
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff3d00', // Consistent red theme
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff3d00', // Red theme text
        marginBottom: 5,
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff', // White background for items
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    productName: {
        flex: 4,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff3d00', // Red theme text
        marginBottom: 5,
    },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Ensure even spacing between buttons and text
        flex: 1,
        paddingHorizontal: 10, // Add horizontal padding for better spacing
    },
    qtyButton: {
        backgroundColor: '#ff3d00',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        textAlign: 'center',
        width: 40, // Set width for uniform button size
    },
    qtyText: {
        marginHorizontal: 10,
        fontSize: 16,
        fontWeight: 'bold', // Make the text stand out
        textAlign: 'center', // Ensure the text is centered
        width: 30, // Set width for text to ensure it doesn't overflow
        color: '#ff3d00', // Red theme text

    },
    netAmount: {
        flex: 2,
        fontSize: 0,
        textAlign: 'right',
        color: '#ff3d00', // Red theme text

    },
    deleteButton: {
        flex: 1,
        color: 'red',
        textAlign: 'right',
    },
    footer: {
        padding: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        marginHorizontal: 10,
        borderRadius: 10,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    footerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff3d00', // Red theme for footer text
        marginBottom: 5,
    },
    saveButtonContainer: {
        padding: 15,
        backgroundColor: '#f5f5f5',
    },
    saveButton: {
        backgroundColor: '#ff3d00', // Red button to match theme
        color: 'white',
        padding: 15,
        textAlign: 'center',
        borderRadius: 5,
        fontWeight: 'bold',
    },
});

export default SaleDetails;